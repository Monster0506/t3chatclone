import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import z from "zod";
export async function determinePersistance(newUserMsg: any, content: string) {
    const indexSchema = z.object({
        important: z.boolean().describe('Whether this message is important for future reference.'),
        type: z.enum(['question', 'answer', 'code', 'summary', 'decision'])
            .describe('The type of important message: question, answer, code, summary, or decision.'),
        snippet: z.string().describe('A short, user-facing summary or excerpt of the important message.'),
        metadata: z.any().describe('Additional metadata or context for this index item.'),
    });
    const prompt = `Given the following message in a chat, determine if it is important for future reference (e.g., a key question, answer, code, decision, or summary). If so, return true for 'important' and provide a type, a short snippet, and any relevant metadata.\n\nMessage:\nrole: ${newUserMsg.role}\ncontent: ${content}`;
    const { object: indexResult } = await generateObject({
        model: google('gemini-2.0-flash'),
        schema: indexSchema,
        prompt,
    });
    return indexResult;
}