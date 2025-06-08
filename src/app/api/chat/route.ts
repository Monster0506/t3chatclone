import { openai } from '@ai-sdk/openai';
import { xai } from '@ai-sdk/xai';
import { anthropic } from '@ai-sdk/anthropic';
import { mistral } from '@ai-sdk/mistral';
import { google } from '@ai-sdk/google';
import { deepseek } from '@ai-sdk/deepseek';
import { cerebras } from '@ai-sdk/cerebras';
import { streamText } from 'ai';

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
  'gemini-2.5-pro-preview-05-06': google('models/gemini-2.5-pro-preview-05-06'),
  'gemini-2.5-flash-preview-04-17': google('models/gemini-2.5-flash-preview-04-17'),
  'gemini-2.5-pro-exp-03-25': google('models/gemini-2.5-pro-exp-03-25'),
  'gemini-2.0-flash': google('models/gemini-2.0-flash'),
  'gemini-1.5-pro': google('models/gemini-1.5-pro'),
  'gemini-1.5-pro-latest': google('models/gemini-1.5-pro-latest'),
  'gemini-1.5-flash': google('models/gemini-1.5-flash'),
  'gemini-1.5-flash-latest': google('models/gemini-1.5-flash-latest'),
  'gemini-1.5-flash-8b': google('models/gemini-1.5-flash-8b'),
  'gemini-1.5-flash-8b-latest': google('models/gemini-1.5-flash-8b-latest'),
  // DeepSeek
  'deepseek-chat': deepseek('deepseek-chat'),
  'deepseek-reasoner': deepseek('deepseek-reasoner'),
  // Cerebras
  'llama3.1-8b': cerebras('llama3.1-8b'),
  'llama3.1-70b': cerebras('llama3.1-70b'),
  'llama3.3-70b': cerebras('llama3.3-70b'),
};

export async function POST(req: Request) {
  const { messages, model: modelId, ...customFields } = await req.json();
  const model = modelMap[modelId] || openai('gpt-4o');

  const result = streamText({
    model,
    system: 'You are a helpful assistant.',
    messages,
    ...customFields,
  });

  return result.toDataStreamResponse();
} 