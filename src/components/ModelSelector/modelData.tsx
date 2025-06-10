import { Gemini, Mistral, Qwen, OpenAI, Claude, DeepSeek, Grok, } from './svgs';
import { openai } from '@ai-sdk/openai';
import { xai } from '@ai-sdk/xai';
import { anthropic } from '@ai-sdk/anthropic';
import { mistral } from '@ai-sdk/mistral';
import { google } from '@ai-sdk/google';
import { deepseek } from '@ai-sdk/deepseek';
import { cerebras } from '@ai-sdk/cerebras';
import { Landmark } from 'lucide-react';
import { ModelFamily } from '@/lib/types';


export const modelFamilies: ModelFamily[] = [
  {
    id: 'gemini',
    name: 'Gemini',
    icon: <Gemini />,
    models: [
      {
        id: 'gemini-2.5-pro-preview-05-06',
        name: 'Gemini 2.5 Pro Preview 05-06',
        aiFn: google('gemini-2.5-pro-preview-05-06'),
      },
      {
        id: 'gemini-2.5-flash-preview-04-17',
        name: 'Gemini 2.5 Flash Preview 04-17',
        aiFn: google('gemini-2.5-flash-preview-04-17'),
      },
      {
        id: 'gemini-2.5-pro-exp-03-25',
        name: 'Gemini 2.5 Pro Exp 03-25',
        aiFn: google('gemini-2.5-pro-exp-03-25'),
      },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', aiFn: google('gemini-2.0-flash') },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', aiFn: google('gemini-1.5-pro') },
      {
        id: 'gemini-1.5-pro-latest',
        name: 'Gemini 1.5 Pro Latest',
        aiFn: google('gemini-1.5-pro-latest'),
      },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', aiFn: google('gemini-1.5-flash') },
      {
        id: 'gemini-1.5-flash-latest',
        name: 'Gemini 1.5 Flash Latest',
        aiFn: google('gemini-1.5-flash-latest'),
      },
      {
        id: 'gemini-1.5-flash-8b',
        name: 'Gemini 1.5 Flash 8B',
        aiFn: google('gemini-1.5-flash-8b'),
      },
      {
        id: 'gemini-1.5-flash-8b-latest',
        name: 'Gemini 1.5 Flash 8B Latest',
        aiFn: google('gemini-1.5-flash-8b-latest'),
      },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    icon: <OpenAI />,
    models: [
      { id: 'gpt-4.1', name: 'GPT-4.1', aiFn: openai('gpt-4.1') },
      { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', aiFn: openai('gpt-4.1-mini') },
      { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano', aiFn: openai('gpt-4.1-nano') },
      { id: 'gpt-4o', name: 'GPT-4o', aiFn: openai('gpt-4o') },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', aiFn: openai('gpt-4o-mini') },
      {
        id: 'gpt-4o-audio-preview',
        name: 'GPT-4o Audio Preview',
        aiFn: openai('gpt-4o-audio-preview'),
      },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', aiFn: openai('gpt-4-turbo') },
      { id: 'gpt-4', name: 'GPT-4', aiFn: openai('gpt-4') },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', aiFn: openai('gpt-3.5-turbo') },
      { id: 'o1', name: 'O1', aiFn: openai('o1') },
      { id: 'o1-mini', name: 'O1 Mini', aiFn: openai('o1-mini') },
      { id: 'o1-preview', name: 'O1 Preview', aiFn: openai('o1-preview') },
      { id: 'o3-mini', name: 'O3 Mini', aiFn: openai('o3-mini') },
      { id: 'o3', name: 'O3', aiFn: openai('o3') },
      { id: 'o4-mini', name: 'O4 Mini', aiFn: openai('o4-mini') },
      {
        id: 'chatgpt-4o-latest',
        name: 'ChatGPT-4o Latest',
        aiFn: openai('chatgpt-4o-latest'),
      },
    ],
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: <Claude />,
    models: [
      {
        id: 'claude-4-opus-20250514',
        name: 'Claude 4 Opus',
        aiFn: anthropic('claude-4-opus-20250514'),
      },
      {
        id: 'claude-4-sonnet-20250514',
        name: 'Claude 4 Sonnet',
        aiFn: anthropic('claude-4-sonnet-20250514'),
      },
      {
        id: 'claude-3-7-sonnet-20250219',
        name: 'Claude 3.7 Sonnet',
        aiFn: anthropic('claude-3-7-sonnet-20250219'),
      },
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet (2024-10-22)',
        aiFn: anthropic('claude-3-5-sonnet-20241022'),
      },
      {
        id: 'claude-3-5-sonnet-20240620',
        name: 'Claude 3.5 Sonnet (2024-06-20)',
        aiFn: anthropic('claude-3-5-sonnet-20240620'),
      },
      {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude 3.5 Haiku (2024-10-22)',
        aiFn: anthropic('claude-3-5-haiku-20241022'),
      },
      // Note: These Claude 3 models were in modelFamilies but not modelMap,
      // adding them here as per the original combined table request.
      // Assuming they are also from anthropic if not specified.
      {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        aiFn: anthropic('claude-3-opus-20240229'),
      },
      {
        id: 'claude-3-sonnet-20240229',
        name: 'Claude 3 Sonnet',
        aiFn: anthropic('claude-3-sonnet-20240229'),
      },
      {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        aiFn: anthropic('claude-3-haiku-20240307'),
      },
    ],
  },
  {
    id: 'llama',
    name: 'Llama',
    icon: <Landmark size={18} />,
    models: [
      { id: 'llama3.1-8b', name: 'Llama 3.1 8B', aiFn: cerebras('llama3.1-8b') },
      { id: 'llama3.1-70b', name: 'Llama 3.1 70B', aiFn: cerebras('llama3.1-70b') },
      { id: 'llama3.3-70b', name: 'Llama 3.3 70B', aiFn: cerebras('llama3.3-70b') },
      // Note: These Llama models were in modelFamilies but not modelMap,
      // adding them here. Assuming they are also from cerebras if not specified.
      {
        id: 'llama-3.3-70b-versatile',
        name: 'Llama 3.3 70B Versatile',
        aiFn: cerebras('llama-3.3-70b-versatile'),
      },
      {
        id: 'llama-3.1-8b-instant',
        name: 'Llama 3.1 8B Instant',
        aiFn: cerebras('llama-3.1-8b-instant'),
      },
      {
        id: 'llama-4-scout-17b-16e-instruct',
        name: 'Llama 4 Scout 17B',
        aiFn: cerebras('llama-4-scout-17b-16e-instruct'),
      },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: <DeepSeek />,
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat', aiFn: deepseek('deepseek-chat') },
      {
        id: 'deepseek-reasoner',
        name: 'DeepSeek Reasoner',
        aiFn: deepseek('deepseek-reasoner'),
      },
    ],
  },
  {
    id: 'grok',
    name: 'Grok',
    icon: <Grok />,
    models: [
      { id: 'grok-3', name: 'Grok 3', aiFn: xai('grok-3') },
      { id: 'grok-3-fast', name: 'Grok 3 Fast', aiFn: xai('grok-3-fast') },
      { id: 'grok-3-mini', name: 'Grok 3 Mini', aiFn: xai('grok-3-mini') },
      { id: 'grok-3-mini-fast', name: 'Grok 3 Mini Fast', aiFn: xai('grok-3-mini-fast') },
      { id: 'grok-2-1212', name: 'Grok 2 1212', aiFn: xai('grok-2-1212') },
      {
        id: 'grok-2-vision-1212',
        name: 'Grok 2 Vision 1212',
        aiFn: xai('grok-2-vision-1212'),
      },
      { id: 'grok-beta', name: 'Grok Beta', aiFn: xai('grok-beta') },
      { id: 'grok-vision-beta', name: 'Grok Vision Beta', aiFn: xai('grok-vision-beta') },
    ],
  },
  {
    id: 'mistral',
    name: 'Mistral',
    icon: <Mistral />,
    models: [
      {
        id: 'pixtral-large-latest',
        name: 'Pixtral Large Latest',
        aiFn: mistral('pixtral-large-latest'),
      },
      {
        id: 'mistral-large-latest',
        name: 'Mistral Large Latest',
        aiFn: mistral('mistral-large-latest'),
      },
      {
        id: 'mistral-small-latest',
        name: 'Mistral Small Latest',
        aiFn: mistral('mistral-small-latest'),
      },
      { id: 'pixtral-12b-2409', name: 'Pixtral 12B 2409', aiFn: mistral('pixtral-12b-2409') },
      // Note: These Mistral models were in modelFamilies but not modelMap,
        // adding them here. Assuming they are also from mistral if not specified.
      {
        id: 'devstral-small-2505',
        name: 'Devstral Small',
        aiFn: mistral('devstral-small-2505'),
      },
      {
        id: 'mistral-small-2503',
        name: 'Mistral Small',
        aiFn: mistral('mistral-small-2503'),
      },
      {
        id: 'open-mistral-nemo',
        name: 'Mistral Nemo',
        aiFn: mistral('open-mistral-nemo'),
      },
      {
        id: 'open-codestral-mamba',
        name: 'Codestral Mamba',
        aiFn: mistral('open-codestral-mamba'),
      },
      {
        id: 'mistral-medium-2505',
        name: 'Mistral Medium',
        aiFn: mistral('mistral-medium-2505'),
      },
      { id: 'codestral-2501', name: 'Codestral', aiFn: mistral('codestral-2501') },
      { id: 'mistral-ocr-2505', name: 'Mistral OCR', aiFn: mistral('mistral-ocr-2505') },
      {
        id: 'mistral-saba-2502',
        name: 'Mistral Saba',
        aiFn: mistral('mistral-saba-2502'),
      },
      {
        id: 'mistral-large-2411',
        name: 'Mistral Large',
        aiFn: mistral('mistral-large-2411'),
      },
      {
        id: 'pixtral-large-2411',
        name: 'Pixtral Large',
        aiFn: mistral('pixtral-large-2411'),
      },
      {
        id: 'ministral-3b-2410',
        name: 'Ministral 3B',
        aiFn: mistral('ministral-3b-2410'),
      },
      {
        id: 'ministral-8b-2410',
        name: 'Ministral 8B',
        aiFn: mistral('ministral-8b-2410'),
      },
      { id: 'mistral-embed', name: 'Mistral Embed', aiFn: mistral('mistral-embed') },
      { id: 'codestral-embed', name: 'Codestral Embed', aiFn: mistral('codestral-embed') },
      {
        id: 'mistral-moderation-2411',
        name: 'Mistral Moderation',
        aiFn: mistral('mistral-moderation-2411'),
      },
    ],
  },

];