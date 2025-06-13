import { Message } from "ai";
import { openai } from '@ai-sdk/openai';
import { xai } from '@ai-sdk/xai';
import { anthropic } from '@ai-sdk/anthropic';
import { mistral } from '@ai-sdk/mistral';
import { google } from '@ai-sdk/google';
import { deepseek } from '@ai-sdk/deepseek';
import { cerebras } from '@ai-sdk/cerebras';



export type Theme = {
    name: string;
    representativeBg: string;
    buttonBg: string;
    buttonText: string;
    buttonHover: string;
    buttonGlass: string;
    buttonBorder: string;
    inputBg: string;
    inputText: string;
    inputFocus: string;
    inputGlass: string;
    inputBorder: string;
    background: string;
    foreground: string;
    glass: string;
};

export interface IndexItem {
    id: string;
    chat_id: string;
    chatTitle: string;
    message_id: string;
    type: 'question' | 'answer' | 'code' | 'summary' | 'decision';
    snippet: string;
    created_at: string;
}

export interface CodeConversion {
    target_language: string;
    converted_content: string;
    code_block_index?: number;
}
export type ExtendedMessage = Omit<Message, 'role'> & {
    role: 'system' | 'user' | 'assistant' | 'data' | 'tool';
    content: string;
    conversions?: CodeConversion[];
    parts?: Array<{
        type: string;
        text: string;
        toolName?: string;
        result?: {
            expression: string;
            result: string | number;
        };
    }>;
    toolInvocations?: Array<{
        toolName: string;
        toolCallId: string;
        state: 'loading' | 'result' | 'error' | 'partial-call' | 'call';
        result?: {
            expression: string;
            result: string | number;
        } | {
            error: string;
        };
        step?: number;
        args?: {
            expression: string;
        };
    }>;
};

export interface FileAttachment {
    type: 'file';
    mimeType?: string;
    data?: string;
    name?: string;
    url?: string;
}

export interface DBAttachment {
    id: string;
    file_name: string;
    file_type: string;
    file_size: number;
    url: string;
    metadata: any;
}

export type ModelDefinition = {
    id: string;
    name: string;
    aiFn: ReturnType<
        | typeof openai
        | typeof xai
        | typeof anthropic
        | typeof mistral
        | typeof google
        | typeof deepseek
        | typeof cerebras
    >;
};

export type ModelFamily = {
    id: string;
    name: string;
    icon: React.ReactNode;
    models: ModelDefinition[];
};



export type FlatModelMap = {
    [modelId: string]: ModelDefinition;
};


export type Shortcut = {
    label: string;
    keys: string[];
};

export type ShortcutGroup = {
    group: string;
    items: Shortcut[];
};

export const SHORTCUTS: ShortcutGroup[] = [
    {
      group: 'Navigation',
      items: [
        { label: 'Toggle sidebar', keys: ['Ctrl', 'B'] },
        { label: 'Search conversations', keys: ['Ctrl', 'K'] },
        { label: 'New conversation', keys: ['Ctrl', 'Shift', 'N'] },
        { label: 'Show keyboard shortcuts', keys: ['Ctrl', '?'] },
      ],
    },
    {
      group: 'Conversation',
      items: [
        { label: 'Send message', keys: ['Enter'] },
        { label: 'New line', keys: ['Shift', 'Enter'] },
        { label: 'Clear input', keys: ['Ctrl', 'Backspace'] },
        { label: 'Focus chat input', keys: ['Ctrl', 'Y'] },
      ],
    },
    {
      group: 'Messages',
      items: [
        { label: 'Pin/unpin current conversation', keys: ['Ctrl', 'Shift', 'D'] },
        { label: 'Copy last message', keys: ['Ctrl', 'C'] },
      ],
    },
  ];