import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const requestSchema = z.object({
  messageId: z.string().describe("The ID of the message to convert."),
  codeBlockIndex: z
    .number()
    .int()
    .nonnegative("codeBlockIndex must be a non-negative integer"),
  targetLanguage: z.string().min(1, "Target language cannot be empty"),
});

const conversionSchema = z.object({
  convertedCode: z
    .string()
    .describe("The raw, converted code for the target language."),
});

export const maxDuration = 30;

export async function POST(req: Request) {
  try {

    const body = await req.json();
    const { messageId, codeBlockIndex, targetLanguage } =
      requestSchema.parse(body);

    const supabase = supabaseServer;

    const { data: message, error: messageError } = await supabase
      .from("messages")
      .select("content")
      .eq("id", messageId)
      .single();

    if (messageError) {
      console.error("Error fetching message:", messageError.message);
      return NextResponse.json(
        { error: "Message not found or access denied." },
        { status: 404 }
      );
    }

   
    const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)\n```/g;
    const matches = [...message.content.matchAll(codeBlockRegex)];
    const allCodeBlocks = matches.map((match) => match[1]); 

    if (codeBlockIndex >= allCodeBlocks.length) {
      return NextResponse.json(
        {
          error: `Invalid codeBlockIndex: ${codeBlockIndex}. Message only contains ${allCodeBlocks.length} code blocks.`,
        },
        { status: 400 }
      );
    }
    const originalCode = allCodeBlocks[codeBlockIndex];

    const prompt = `
      You are an expert code transpiler. Your task is to convert a given code snippet to a specified target language.

      - Target Language: ${targetLanguage}
      - Rules:
        1. The output must be only the raw code.
        2. Do not include any explanations, comments, or markdown formatting like \`\`\`.
        3. Ensure the converted code is functionally equivalent to the original.
        4. Follow the idiomatic conventions and best practices of the target language.

      Original Code Snippet:
      \`\`\`
      ${originalCode}
      \`\`\`
    `;

    const { object: conversionResult } = await generateObject({
      model: google("gemini-2.0-flash"),
      schema: conversionSchema,
      prompt,
    });

    const { data: savedConversion, error: saveError } = await supabase
      .from("code_conversions")
      .insert({
        message_id: messageId,
        code_block_index: codeBlockIndex,
        target_language: targetLanguage,
        converted_content: conversionResult.convertedCode,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Error saving conversion:", saveError.message);
      return NextResponse.json(
        { error: "Failed to save the code conversion." },
        { status: 500 }
      );
    }

    return NextResponse.json(savedConversion, { status: 200 });
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors }, { status: 400 });
    }
    console.error("An unexpected error occurred:", e.message);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}