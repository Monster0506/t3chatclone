import { streamText } from 'ai';
import { supabaseServer } from '@/lib/supabase/server';
import { calculatorTool } from '@/tools/calculator-tool';
import { wikipediaTool } from '@/tools/wikipedia-tool';

export const maxDuration = 30;
import { google } from '@ai-sdk/google';

import { modelFamilies as modelMap } from '@/components/ModelSelector/modelData';
import { FlatModelMap, ModelDefinition } from '@/lib/types';
import { generateTitleAndTags, getImportanceIndex, buildSystemPrompt } from '@/lib/api/ai';


export async function POST(req: Request) {
    const body = await req.json();
    console.log('Incoming request body:', JSON.stringify(body));
    const { messages, model: modelId, userSettings, chat_id, ...customFields } = body;

    const flatModelMap: FlatModelMap = modelMap.reduce((accumulator, family) => {
        family.models.forEach((model: ModelDefinition) => {
            (accumulator)[model.id] = model;
        });
        return accumulator;
    }, {} as FlatModelMap);

    if (!modelId.startsWith('gemini-2.0-flash')) {

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            start(controller) {
                const message = {
                    role: 'assistant',
                    content: 'I\'m sorry, but the model you selected is not supported. Please select a different model.',
                };

                const chunk = `data: ${JSON.stringify(message)}\n\n`;
                controller.enqueue(encoder.encode(chunk));
                controller.close();
            },
        });
        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    }
    const model = flatModelMap[modelId]?.aiFn || google('gemini-2.0-flash');

    const systemPrompt = buildSystemPrompt(userSettings);
    console.log("System prompt built")


    const filteredMessages = messages
        .filter((m: any) => {
            // Keep tool messages and messages with content
            if (m.role === 'tool' || m.content) return true;

            // For messages with parts, ensure at least one part has content
            if (m.parts && Array.isArray(m.parts)) {
                return m.parts.some((part: any) => {
                    if (part.text && part.text.trim() !== '') return true;
                    if (part.inlineData) return true; // Keep inline data parts
                    return false;
                });
            }
            return false;
        })
        .map((m: any) => {
            // For messages with parts, filter out empty parts
            if (m.parts && Array.isArray(m.parts)) {
                return {
                    ...m,
                    parts: m.parts.filter((part: any) => {
                        if (part.text && part.text.trim() !== '') return true;
                        if (part.inlineData) return true;
                        return false;
                    })
                };
            }
            return m;
        })
        .filter((m: any) => {
            // Final check to ensure we don't have empty parts arrays
            if (m.parts && Array.isArray(m.parts) && m.parts.length === 0) return false;
            return true;
        });

    console.log('Filtered messages:', JSON.stringify(filteredMessages, null, 2));
    const result = streamText({
        model,
        system: systemPrompt,
        messages: filteredMessages,
        ...customFields,
        tools: {
            calculator: calculatorTool,
            wikipedia: wikipediaTool,
        },
        maxSteps: 5,
        async onError({ error }) {
            console.error('onError', error);
        },
        async onFinish({ response }) {
            console.log('onFinish', response);
            if (!chat_id) {
                console.log('No chat_id provided, skipping message persistence.');
                return;
            }
            const newUserMsg = messages[messages.length - 1];
            const newAssistantMsgs = response.messages;
            const toPersist: any[] = [];

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

                    try {
                        const indexResult = await getImportanceIndex(newUserMsg.role, content)
                        console.log('indexResult', indexResult);
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
                    } catch (_e) {
                        console.error('Error generating or saving chat index for user message:', _e);
                    }
                }
            }
            for (const msg of newAssistantMsgs) {
                let content: string = '';
                let metadata: any = null;
                if (msg.role === 'tool') {
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
                    try {
                        const indexResult = await getImportanceIndex(msg.role, content);
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
                    } catch (_e) {
                        console.error('Error generating or saving chat index for assistant/tool message:', _e);
                    }
                }
            }
            for (const dbMsg of toPersist) {
                const { error } = await supabaseServer.from('messages').upsert(dbMsg);
                if (error) {
                    console.error('Error upserting message:', error);
                }
            }

            const { data: allMsgs, error: fetchErr } = await supabaseServer
                .from('messages')
                .select('role,content')
                .eq('chat_id', chat_id)
                .order('created_at', { ascending: true });
            if (!fetchErr && allMsgs && allMsgs.length === 2) {
                const { data: chatRow, error: chatErr } = await supabaseServer
                    .from('chats')
                    .select('id,title,metadata')
                    .eq('id', chat_id)
                    .single();
                if (!chatErr && chatRow) {
                    const { title, tags } = await generateTitleAndTags(allMsgs);
                    let newTitle = chatRow.title;
                    if (newTitle === 'New Chat' && title) newTitle = title;
                    const meta = typeof chatRow.metadata === 'object' && chatRow.metadata ? { ...chatRow.metadata } : {};
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
            ),
            code_conversions (
                code_block_index,
                target_language,
                converted_content
            )
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    return new Response(JSON.stringify(messages), { status: 200 });
} 