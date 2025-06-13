import { Tables } from "@/lib/supabase/types";

export function createSystemPrompt(userSettings: Tables<'user_settings'>) {
    let systemPrompt = 'You are a helpful assistant.';
    if (userSettings) {
        const promptParts: string[] = [];

        if (userSettings.name?.trim()) {
            const name = userSettings.name.trim();
            const occupation = userSettings.occupation?.trim();
            promptParts.push(`You are a helpful assistant talking to ${name}${occupation ? ` who is a ${occupation}` : ''}.`);
        }

        const traits = Array.isArray(userSettings.traits) ? userSettings.traits.filter((t) => typeof t === 'string' && t.trim()) : [];
        if (traits.length > 0) {
            promptParts.push(`Your communication style should be: ${traits.join(', ')}.`);
        }

        if (userSettings.extra?.trim()) {
            promptParts.push(`Additional context: ${userSettings.extra.trim()}`);
        }

        if (promptParts.length > 0) {
            systemPrompt = promptParts.join('\n') + '\n\nPlease maintain this style throughout the conversation.';
        }
    }
    systemPrompt += "\n\nYou can perform various tasks, such as writing code, answering questions, and creating text or stories. You can also use tools to perform tasks. You always write in markdown format, and when writing code, always indicate the language of the code you are writing."
    return systemPrompt;
}