import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { z } from 'zod';

export const maxDuration = 10; // Shorter timeout for autocomplete

const requestSchema = z.object({
  text: z.string(),
  cursorPosition: z.number(),
  model: z.string().default('gemini-2.0-flash'),
  maxTokens: z.number().default(20),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, cursorPosition, model, maxTokens } = requestSchema.parse(body);

    // Get the text before the cursor
    const textBeforeCursor = text.slice(0, cursorPosition);
    const lastNewLine = textBeforeCursor.lastIndexOf('\n') + 1;
    const currentLine = textBeforeCursor.slice(lastNewLine);
    const lines = textBeforeCursor.split('\n');
    const currentLineIndex = lines.length - 1;

    // Create a prompt for the model
    const prompt = `Complete the following text. Only return the completion, nothing else.\n\n${textBeforeCursor}`;

    // Generate completion using the model
    const result = await streamText({
      model: google(model),
      maxTokens,
      temperature: 0.3, // Lower temperature for more predictable completions
      prompt,
    });

    // Convert the stream to text
    let completion = '';
    for await (const chunk of result.textStream) {
      completion += chunk;
      // Stop at the first newline or if we've got enough text
      if (completion.includes('\n') || completion.length > maxTokens * 2) {
        break;
      }
    }

    // Clean up the completion
    completion = completion.split('\n')[0].trim();

    // Calculate the position information
    const startPos = lastNewLine;
    const endPos = cursorPosition;
    const currentWord = currentLine.trim().split(/\s+/).pop() || '';

    // Return the completion information
    return Response.json({
      completion,
      currentWord,
      currentLine,
      currentLineIndex,
      startPos,
      endPos,
    });
  } catch (error) {
    console.error('Autocomplete error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate completion' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
