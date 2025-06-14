
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export async function generateTitleAndTags(messages: any[]): Promise<{ title?: string; tags: string[] }> {
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
    } catch (_e) {
        console.error('Failed to generate Gemini title/tags object:', _e);
        return { title: undefined, tags: [] };
    }
}