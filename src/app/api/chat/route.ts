import { streamText, generateObject } from 'ai';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase/server';
import { calculatorTool } from '@/tools/calculator-tool';
import { wikipediaTool } from '@/tools/wikipedia-tool';

export const maxDuration = 30;
import { google } from '@ai-sdk/google';

import  {modelFamilies as modelMap } from '@/components/ModelSelector/modelData';



// Gemini helper with Zod schema
async function generateTitleAndTags(messages: any[]): Promise<{ title?: string; tags: string[] }> {
  const context = messages.slice(0, 2).map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
  const prompt = `Given the following conversation, generate a concise chat title and 3-5 relevant tags.`;
  const schema = z.object({
    title: z.string(),
    tags: z.array(z.string()),
  });
  try {
    const { object } = await generateObject({
      model: google('gemini-2.0-flash'),
      schema,
      prompt: `${prompt}\n\n${context}`,
    });
    return {
      title: object.title,
      tags: object.tags,
    };
  } catch (e) {
    console.error('Failed to generate Gemini title/tags object:', e);
    return { title: undefined, tags: [] };
  }
}

export async function POST(req: Request) {
    // Zod schema for index generation (move inside POST to avoid global scope issues)
    const indexSchema = z.object({
      important: z.boolean().describe('Whether this message is important for future reference.'),
      type: z.enum(['question', 'answer', 'code', 'summary', 'decision'])
        .describe('The type of important message: question, answer, code, summary, or decision.'),
      snippet: z.string().describe('A short, user-facing summary or excerpt of the important message.'),
      metadata: z.any().describe('Additional metadata or context for this index item.'),
    });
    const body = await req.json();
    console.log('Incoming request body:', JSON.stringify(body));
    const { messages, model: modelId, userSettings, chat_id, ...customFields } = body;
    const model = modelMap[modelId] || google('gemini-2.0-flash');

    // Build system prompt with user settings
    let systemPrompt = 'You are a helpful assistant.';
    if (userSettings) {
        const promptParts: string[] = [];

        // Add user identification if we have a name
        if (userSettings.name?.trim()) {
            const name = userSettings.name.trim();
            const occupation = userSettings.occupation?.trim();
            promptParts.push(`You are a helpful assistant talking to ${name}${occupation ? ` who is a ${occupation}` : ''}.`);
        }

        // Add communication style if we have traits
        const traits = Array.isArray(userSettings.traits) ? userSettings.traits.filter((t: string) => typeof t === 'string' && t.trim()) : [];
        if (traits.length > 0) {
            promptParts.push(`Your communication style should be: ${traits.join(', ')}.`);
        }

        // Add additional context if provided
        if (userSettings.extra?.trim()) {
            promptParts.push(`Additional context: ${userSettings.extra.trim()}`);
        }

        // Only use the custom prompt if we have meaningful parts
        if (promptParts.length > 0) {
            systemPrompt = promptParts.join('\n') + '\n\nPlease maintain this style throughout the conversation.';
        }
    }

    const result = streamText({
        model,
        system: systemPrompt,
        messages: messages.filter((m: any) => m.role !== 'tool'),
        ...customFields,
        tools: {
            calculator: calculatorTool,
            wikipedia: wikipediaTool,
        },
        maxSteps: 5,
        async onFinish({ response }) {
            if (!chat_id) {
                console.log('No chat_id provided, skipping message persistence.');
                return;
            }
            // Only persist the new user message and new assistant message(s)
            const newUserMsg = messages[messages.length - 1];
            const newAssistantMsgs = response.messages;
            const toPersist: any[] = [];
            let lastSavedMessageId: string | null = null;
            // Map user message
            if (newUserMsg) {
                let content = newUserMsg.content;
                if (!content && Array.isArray(newUserMsg.parts)) {
                    content = newUserMsg.parts
                        .filter((p: any) => p.type === 'text' && typeof p.text === 'string')
                        .map((p: any) => p.text)
                        .join('\n');
                }
                let createdAt: string | undefined = undefined;
                if (newUserMsg.createdAt instanceof Date) {
                    createdAt = newUserMsg.createdAt.toISOString();
                } else if (typeof newUserMsg.createdAt === 'string') {
                    createdAt = newUserMsg.createdAt;
                } else {
                    createdAt = new Date().toISOString();
                }

                // Save the message first to get its ID
                const { data: savedMessage, error: saveError } = await supabaseServer
                    .from('messages')
                    .insert({
                        chat_id,
                        role: newUserMsg.role,
                        content: content ?? '',
                        type: 'text',
                        metadata: null,
                        created_at: createdAt,
                    })
                    .select()
                    .single();

                if (saveError) {
                    console.error('Error saving message:', saveError);
                } else {
                    lastSavedMessageId = savedMessage.id;
                    // Process attachments
                    if (savedMessage && newUserMsg.experimental_attachments) {
                        for (const attachment of newUserMsg.experimental_attachments) {
                            const { error: attachmentError } = await supabaseServer
                                .from('attachments')
                                .insert({
                                    message_id: savedMessage.id,
                                    file_name: attachment.name,
                                    file_type: attachment.contentType,
                                    file_size: attachment.size || 0,
                                    url: attachment.url,
                                    metadata: {
                                        width: attachment.width,
                                        height: attachment.height,
                                    }
                                });
                            if (attachmentError) {
                                console.error('Error saving attachment:', attachmentError);
                            }
                        }
                    }
                    // --- Index Generation for User Message ---
                    try {
                        const prompt = `Given the following message in a chat, determine if it is important for future reference (e.g., a key question, answer, code, decision, or summary). If so, return true for 'important' and provide a type, a short snippet, and any relevant metadata.\n\nMessage:\nrole: ${newUserMsg.role}\ncontent: ${content}`;
                        const { object: indexResult } = await generateObject({
                            model: google('gemini-2.0-flash'),
                            schema: indexSchema,
                            prompt,
                        });
                        if (indexResult.important && indexResult.type && indexResult.snippet) {
                            await supabaseServer.from('chat_index' as any).insert({
                                chat_id,
                                message_id: savedMessage.id,
                                type: indexResult.type,
                                snippet: indexResult.snippet,
                                score: 0,
                                metadata: indexResult.metadata || null,
                            });
                        }
                    } catch (e) {
                        console.error('Error generating or saving chat index for user message:', e);
                    }
                }
            }
            // Map assistant messages (response.messages)
            for (const msg of newAssistantMsgs) {
                let content: string = '';
                let metadata: any = null;
                if (msg.role === 'tool') {
                    // For tool messages, store a summary in content and the full message as metadata
                    if (typeof msg.content === 'string') {
                        content = msg.content;
                    } else if (Array.isArray(msg.content)) {
                        content = msg.content
                            .filter((p: any) => p.type === 'text' && typeof p.text === 'string')
                            .map((p: any) => p.text)
                            .join('\n');
                    } else {
                        content = '[Tool result]';
                    }
                    metadata = { toolMessage: msg };
                } else {
                    if (Array.isArray(msg.content)) {
                        content = msg.content
                            .filter((p: any) => p.type === 'text' && typeof p.text === 'string')
                            .map((p: any) => p.text)
                            .join('\n');
                    } else {
                        content = msg.content ?? '';
                    }
                }
                // Save assistant/tool message
                const { data: savedMsg, error: saveError } = await supabaseServer
                    .from('messages')
                    .insert({
                        chat_id,
                        role: msg.role,
                        content,
                        type: 'text',
                        metadata,
                        created_at: new Date().toISOString(),
                    })
                    .select()
                    .single();
                if (saveError) {
                    console.error('Error saving assistant/tool message:', saveError);
                } else {
                    // --- Index Generation for Assistant/Tool Message ---
                    try {
                        const prompt = `Given the following message in a chat, determine if it is important for future reference (e.g., a key question, answer, code, decision, or summary). If so, return true for 'important' and provide a type, a short snippet, and any relevant metadata.\n\nMessage:\nrole: ${msg.role}\ncontent: ${content}`;
                        const { object: indexResult } = await generateObject({
                            model: google('gemini-2.0-flash'),
                            schema: indexSchema,
                            prompt,
                        });
                        if (indexResult.important && indexResult.type && indexResult.snippet) {
                            await supabaseServer.from('chat_index' as any).insert({
                                chat_id,
                                message_id: savedMsg.id,
                                type: indexResult.type,
                                snippet: indexResult.snippet,
                                full_content: content,
                                score: 0,
                                metadata: indexResult.metadata || null,
                            });
                        }
                    } catch (e) {
                        console.error('Error generating or saving chat index for assistant/tool message:', e);
                    }
                }
            }
            for (const dbMsg of toPersist) {
                const { error } = await supabaseServer.from('messages').upsert(dbMsg);
                if (error) {
                    console.error('Error upserting message:', error);
                } 
            }

            // --- Gemini title/tags generation logic ---
            // Fetch all messages for this chat
            const { data: allMsgs, error: fetchErr } = await supabaseServer
                .from('messages')
                .select('role,content')
                .eq('chat_id', chat_id)
                .order('created_at', { ascending: true });
            if (!fetchErr && allMsgs && allMsgs.length === 2) {
                // Fetch chat row
                const { data: chatRow, error: chatErr } = await supabaseServer
                    .from('chats')
                    .select('id,title,metadata')
                    .eq('id', chat_id)
                    .single();
                if (!chatErr && chatRow) {
                    const { title, tags } = await generateTitleAndTags(allMsgs);
                    let newTitle = chatRow.title;
                    if (newTitle === 'New Chat' && title) newTitle = title;
                    // Merge tags with existing tags
                    let meta = typeof chatRow.metadata === 'object' && chatRow.metadata ? { ...chatRow.metadata } : {};
                    const existingTags = Array.isArray((meta as any).tags) ? ((meta as any).tags as any[]).filter((t: any) => typeof t === 'string') : [];
                    const allTags = Array.from(new Set([...(existingTags as string[]), ...(tags as string[])]));
                    (meta as any).tags = allTags;
                    await supabaseServer
                        .from('chats')
                        .update({ title: newTitle, metadata: meta })
                        .eq('id', chat_id);
                }
            }
        },
    });

    return result.toDataStreamResponse();
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');
    if (!chatId) {
        return new Response(JSON.stringify({ error: 'chatId is required' }), { status: 400 });
    }
    const { data: messages, error } = await supabaseServer
        .from('messages')
        .select(`
            *,
            attachments (
                id,
                file_name,
                file_type,
                file_size,
                url,
                metadata
            )
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    return new Response(JSON.stringify(messages), { status: 200 });
} 