import { Sparkles, Bot, Brain, Landmark, Mountain, Swords, Orbit, Atom } from 'lucide-react';

export type ModelFamily = {
  id: string;
  name: string;
  icon: React.ReactNode;
  models: { id: string; name: string }[];
};

export const modelFamilies: ModelFamily[] = [
  {
    id: 'gemini',
    name: 'Gemini',
    icon: <Sparkles size={18} />, // Google Generative AI & Vertex
    models: [
      { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash Exp' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    icon: <Bot size={18} />,
    models: [
      { id: 'gpt-4.1', name: 'GPT-4.1' },
      { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini' },
      { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano' },
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
      { id: 'gpt-4', name: 'GPT-4' },
      { id: 'o3-mini', name: 'O3 Mini' },
      { id: 'o3', name: 'O3' },
      { id: 'o4-mini', name: 'O4 Mini' },
      { id: 'o1', name: 'O1' },
      { id: 'o1-mini', name: 'O1 Mini' },
      { id: 'o1-preview', name: 'O1 Preview' },
    ],
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: <Brain size={18} />,
    models: [
      { id: 'claude-4-opus-20250514', name: 'Claude 4 Opus' },
      { id: 'claude-4-sonnet-20250514', name: 'Claude 4 Sonnet' },
      { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet' },
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (2024-10-22)' },
      { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet (2024-06-20)' },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku (2024-10-22)' },
    ],
  },
  {
    id: 'llama',
    name: 'Llama',
    icon: <Landmark size={18} />, // Cerebras & Groq
    models: [
      { id: 'llama3.1-8b', name: 'Llama 3.1 8B' },
      { id: 'llama3.1-70b', name: 'Llama 3.1 70B' },
      { id: 'llama3.3-70b', name: 'Llama 3.3 70B' },
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile' },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant' },
      { id: 'llama-4-scout-17b-16e-instruct', name: 'Llama 4 Scout 17B' },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: <Mountain size={18} />,
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat' },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner' },
    ],
  },
  {
    id: 'grok',
    name: 'Grok',
    icon: <Orbit size={18} />,
    models: [
      { id: 'grok-3', name: 'Grok 3' },
      { id: 'grok-3-fast', name: 'Grok 3 Fast' },
      { id: 'grok-3-mini', name: 'Grok 3 Mini' },
      { id: 'grok-3-mini-fast', name: 'Grok 3 Mini Fast' },
      { id: 'grok-2-1212', name: 'Grok 2 1212' },
      { id: 'grok-2-vision-1212', name: 'Grok 2 Vision 1212' },
      { id: 'grok-beta', name: 'Grok Beta' },
      { id: 'grok-vision-beta', name: 'Grok Vision Beta' },
    ],
  },
  {
    id: 'mistral',
    name: 'Mistral',
    icon: <Swords size={18} />,
    models: [
      { id: 'pixtral-large-latest', name: 'Pixtral Large Latest' },
      { id: 'mistral-large-latest', name: 'Mistral Large Latest' },
      { id: 'mistral-small-latest', name: 'Mistral Small Latest' },
      { id: 'pixtral-12b-2409', name: 'Pixtral 12B 2409' },
    ],
  },
  // {
  //   id: 'qwen',
  //   name: 'Qwen',
  //   icon: <Atom size={18} />,
  //   models: [], // Add Qwen models here if needed
  // },
]; 