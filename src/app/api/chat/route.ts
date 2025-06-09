import { openai } from '@ai-sdk/openai';
import { xai } from '@ai-sdk/xai';
import { anthropic } from '@ai-sdk/anthropic';
import { mistral } from '@ai-sdk/mistral';
import { google } from '@ai-sdk/google';
import { deepseek } from '@ai-sdk/deepseek';
import { cerebras } from '@ai-sdk/cerebras';
import { streamText, appendResponseMessages, generateObject } from 'ai';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase/server';

export const maxDuration = 30;

const modelMap: Record<string, any> = {
    // OpenAI
    'gpt-4.1': openai('gpt-4.1'),
    'gpt-4.1-mini': openai('gpt-4.1-mini'),
    'gpt-4.1-nano': openai('gpt-4.1-nano'),
    'gpt-4o': openai('gpt-4o'),
    'gpt-4o-mini': openai('gpt-4o-mini'),
    'gpt-4o-audio-preview': openai('gpt-4o-audio-preview'),
    'gpt-4-turbo': openai('gpt-4-turbo'),
    'gpt-4': openai('gpt-4'),
    'gpt-3.5-turbo': openai('gpt-3.5-turbo'),
    'o1': openai('o1'),
    'o1-mini': openai('o1-mini'),
    'o1-preview': openai('o1-preview'),
    'o3-mini': openai('o3-mini'),
    'o3': openai('o3'),
    'o4-mini': openai('o4-mini'),
    'chatgpt-4o-latest': openai('chatgpt-4o-latest'),
    // Grok
    'grok-3': xai('grok-3'),
    'grok-3-fast': xai('grok-3-fast'),
    'grok-3-mini': xai('grok-3-mini'),
    'grok-3-mini-fast': xai('grok-3-mini-fast'),
    'grok-2-1212': xai('grok-2-1212'),
    'grok-2-vision-1212': xai('grok-2-vision-1212'),
    'grok-beta': xai('grok-beta'),
    'grok-vision-beta': xai('grok-vision-beta'),
    // Anthropic
    'claude-4-opus-20250514': anthropic('claude-4-opus-20250514'),
    'claude-4-sonnet-20250514': anthropic('claude-4-sonnet-20250514'),
    'claude-3-7-sonnet-20250219': anthropic('claude-3-7-sonnet-20250219'),
    'claude-3-5-sonnet-20241022': anthropic('claude-3-5-sonnet-20241022'),
    'claude-3-5-sonnet-20240620': anthropic('claude-3-5-sonnet-20240620'),
    'claude-3-5-haiku-20241022': anthropic('claude-3-5-haiku-20241022'),
    // Mistral
    'pixtral-large-latest': mistral('pixtral-large-latest'),
    'mistral-large-latest': mistral('mistral-large-latest'),
    'mistral-small-latest': mistral('mistral-small-latest'),
    'pixtral-12b-2409': mistral('pixtral-12b-2409'),
    // Google Generative AI
    'gemini-2.5-pro-preview-05-06': google('gemini-2.5-pro-preview-05-06'),
    'gemini-2.5-flash-preview-04-17': google('gemini-2.5-flash-preview-04-17'),
    'gemini-2.5-pro-exp-03-25': google('gemini-2.5-pro-exp-03-25'),
    'gemini-2.0-flash': google('gemini-2.0-flash'),
    'gemini-1.5-pro': google('gemini-1.5-pro'),
    'gemini-1.5-pro-latest': google('gemini-1.5-pro-latest'),
    'gemini-1.5-flash': google('gemini-1.5-flash'),
    'gemini-1.5-flash-latest': google('gemini-1.5-flash-latest'),
    'gemini-1.5-flash-8b': google('gemini-1.5-flash-8b'),
    'gemini-1.5-flash-8b-latest': google('gemini-1.5-flash-8b-latest'),
    // DeepSeek
    'deepseek-chat': deepseek('deepseek-chat'),
    'deepseek-reasoner': deepseek('deepseek-reasoner'),
    // Cerebras
    'llama3.1-8b': cerebras('llama3.1-8b'),
    'llama3.1-70b': cerebras('llama3.1-70b'),
    'llama3.3-70b': cerebras('llama3.3-70b'),
};

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
    const body = await req.json();
    console.log('Incoming request body:', JSON.stringify(body));
    const { messages, model: modelId, userSettings, chat_id, ...customFields } = body;
    const model = modelMap[modelId] || openai('gpt-4o');

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
        messages,
        ...customFields,
        async onFinish({ response }) {
            if (!chat_id) {
                console.log('No chat_id provided, skipping message persistence.');
                return;
            }
            // Only persist the new user message and new assistant message(s)
            const newUserMsg = messages[messages.length - 1];
            const newAssistantMsgs = response.messages;
            const toPersist = [];
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
                } else if (savedMessage && newUserMsg.experimental_attachments) {
                    // Process attachments
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
            }
            // Map assistant messages (response.messages)
            for (const msg of newAssistantMsgs) {
                let content: string = '';
                if (Array.isArray(msg.content)) {
                    content = msg.content
                        .filter((p: any) => p.type === 'text' && typeof p.text === 'string')
                        .map((p: any) => p.text)
                        .join('\n');
                } else {
                    content = msg.content ?? '';
                }
                toPersist.push({
                    chat_id,
                    role: msg.role,
                    content,
                    type: 'text',
                    metadata: null,
                    created_at: new Date().toISOString(),
                });
            }
            console.log('Persisting only new messages for chat_id:', chat_id, toPersist);
            for (const dbMsg of toPersist) {
                console.log('Upserting mapped message:', dbMsg);
                const { error } = await supabaseServer.from('messages').upsert(dbMsg);
                if (error) {
                    console.error('Error upserting message:', error);
                } else {
                    console.log('Message upserted successfully.');
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