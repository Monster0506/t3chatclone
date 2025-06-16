import { User, Bot, Calculator } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import CodeBlock from "./CodeBlock";
import ToolResult from "../ToolResults/ToolResult";
import { useTheme } from "@/theme/ThemeProvider";
import {
  FileAttachment,
  DBAttachment,
  ExtendedMessage,
  CodeConversion,
} from "@/lib/types";
import React, { useMemo, useState } from "react";
import Image from "next/image";

export default function ChatMessage({
  message,
  onRefresh,
}: {
  message: ExtendedMessage;
  onRefresh: () => Promise<void>;
}) {
  const { theme } = useTheme();
  const isUser = message.role === "user";
  const isTool = message.role === "tool";
  const [, setApiError] = useState<string | null>(null);

  const inlineCodeStyle = {
    backgroundColor: theme.inputGlass,
    padding: "0.2em 0.4em",
    margin: "0 0.2em",
    borderRadius: "5px",
    border: `1px solid ${theme.buttonBorder}`,
    fontFamily: "monospace",
    fontSize: "0.9em",
  };

  const handleCopyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      console.log("Code copied to clipboard!");
    } catch (_err) {
      console.error("Failed to copy code:", _err);
    }
  };

  const handleConversionRequest = async (
    targetLanguage: string,
    codeBlockIndex: number | undefined,
  ) => {
    console.log(
      `Requesting conversion for message ${message.id}, block ${codeBlockIndex} to ${targetLanguage}`,
    );
    try {
      const response = await fetch("/api/convert-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: message.id,
          codeBlockIndex: codeBlockIndex,
          targetLanguage: targetLanguage,
        }),
      });
      if (!response.ok) throw new Error("Conversion API call failed");

      await onRefresh();
    } catch (_error) {
      console.error("Failed to request code conversion:", _error);
      setApiError("Failed to request code conversion");
      // Re-throw the error to be caught by the calling component (CodeBlock)
      throw _error;
    }
  };

  const renderableParts = useMemo(() => {
    const content = message.content || "";
    if (!content) return [];

    const parts = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)\n```/g;
    let lastIndex = 0;
    let codeBlockIndex = 0;

    for (const match of content.matchAll(codeBlockRegex)) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: content.substring(lastIndex, match.index),
        });
      }

      parts.push({
        type: "code_block",
        language: match[1] || undefined,
        content: match[2],
        index: codeBlockIndex,
      });
      codeBlockIndex++;

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({ type: "text", content: content.substring(lastIndex) });
    }

    if (parts.length === 0 && content) {
      parts.push({ type: "text", content });
    }

    return parts;
  }, [message.content]);

  const parts = Array.isArray(message.parts)
    ? message.parts
    : Array.isArray(message.content)
      ? message.content
      : [];

  const partsAttachments = (parts.filter((part: any) => part.type === "file") ||
    []) as FileAttachment[];
  const expAttachments = (message as any).experimental_attachments || [];
  const expFileAttachments = Array.isArray(expAttachments)
    ? expAttachments.map((att: any) => ({
      type: "file",
      mimeType: att.mimeType || att.contentType,
      data:
        att.data ||
        (att.url && att.url.startsWith("data:")
          ? att.url.split(",")[1]
          : undefined),
      name: att.name,
      url: att.url,
    }))
    : [];
  const dbAttachments = (message as any).attachments || [];
  const allAttachments = [...partsAttachments, ...expFileAttachments];
  const hasAttachments = allAttachments.length > 0 || dbAttachments.length > 0;

  if (isTool && (message as any).toolName && (message as any).result) {
    return (
      <div id={`msg-${message.id}`} className="flex justify-start mb-8">
        <div className="flex-shrink-0 mr-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: theme.inputGlass }}
          >
            <Calculator style={{ color: theme.inputText }} size={22} />
          </div>
        </div>
        <div
          className="max-w-[80%] rounded-2xl p-5 shadow-xl"
          style={{
            background: theme.inputGlass,
            border: `1.5px solid ${theme.buttonBorder}`,
            color: theme.inputText,
          }}
        >
          <ToolResult
            toolName={(message as any).toolName}
            result={(message as any).result}
            state="result"
          />
        </div>
      </div>
    );
  }

  if ((message as any).mergedParts) {
    return (
      <div id={`msg-${message.id}`} className={`flex justify-start mb-8`}>
        <div className="flex-shrink-0 mr-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: theme.inputGlass }}
          >
            <Calculator style={{ color: theme.inputText }} size={22} />
          </div>
        </div>
        <div
          className="max-w-[80%] rounded-2xl p-5 shadow-xl"
          style={{
            background: theme.inputGlass,
            border: `1.5px solid ${theme.buttonBorder}`,
            color: theme.inputText,
          }}
        >
          {(message as any).mergedParts.map((part: any, idx: number) => {
            if (part.type === "text") {
              return <ReactMarkdown key={idx}>{part.text}</ReactMarkdown>;
            }
            if (part.type === "tool") {
              return (
                <ToolResult
                  key={idx}
                  toolName={part.toolName}
                  result={part.result}
                  state="result"
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      id={`msg-${message.id}`}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-8`}
    >
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: theme.inputGlass,
              border: `1.5px solid ${theme.buttonBorder}`,
            }}
          >
            <Bot style={{ color: theme.inputText }} size={22} />
          </div>
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl p-5 shadow-xl whitespace-pre-wrap break-words ${isUser ? "rounded-br-3xl" : "rounded-bl-3xl"
          }`}
        style={
          isUser
            ? {
              background: theme.buttonBg,
              color: theme.buttonText,
              border: `1.5px solid ${theme.buttonBorder}`,
              boxShadow: "0 8px 32px 0 rgba(31,38,135,0.10)",
              marginRight: 0,
            }
            : {
              background: theme.inputGlass,
              color: theme.inputText,
              border: `1.5px solid ${theme.buttonBorder}`,
              boxShadow: "0 8px 32px 0 rgba(31,38,135,0.10)",
              marginLeft: 0,
            }
        }
      >
        {renderableParts.map((part, idx) => {
          if (part.type === "text") {
            const processedContent = part.content.replace(
              /\\\((.*?)\\\)/g,
              "$$$1$$",
            );
            return (
              <ReactMarkdown
                key={idx}
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  p: ({ children }) => <span className="inline">{children}</span>,
                  code: ({ children }) => (
                    <code style={inlineCodeStyle}>{children}</code>
                  ),
                }}
              >
                {processedContent}
              </ReactMarkdown>
            );
          }
          if (part.type === "code_block") {
            const relevantConversions =
              message.conversions?.filter(
                (c: CodeConversion) =>
                  c.code_block_index !== undefined &&
                  c.code_block_index === part.index,
              ) || [];
            return (
              <CodeBlock
                key={idx}
                originalCode={part.content}
                originalLanguage={part.language}
                codeBlockIndex={part.index}
                conversions={relevantConversions}
                onCopy={handleCopyToClipboard}
                onConvertRequest={handleConversionRequest}
              />
            );
          }
          return null;
        })}
        {hasAttachments && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {allAttachments.map((attachment, idx) => {
              if (
                attachment.type === "file" &&
                attachment.mimeType?.startsWith("image/")
              ) {
                const imageUrl = attachment.data
                  ? `data:${attachment.mimeType};base64,${attachment.data}`
                  : attachment.url;
                return (
                  <div key={`part-${idx}`} className="relative group">
                    <Image
                      src={imageUrl!}
                      width={500}
                      height={500}
                      alt={attachment.name || "Attachment"}
                      className="rounded-lg w-full h-48 object-cover hover:opacity-90 transition-opacity"
                      style={{ border: `1.5px solid ${theme.buttonBorder}` }}
                    />
                  </div>
                );
              }
              return null;
            })}
            {dbAttachments.map((attachment: DBAttachment) => {
              if (attachment.file_type.startsWith("image/")) {
                return (
                  <div key={`db-${attachment.id}`} className="relative group">
                    <Image
                      src={attachment.url}
                      width={500}
                      height={500}
                      alt={attachment.file_name}
                      className="rounded-lg w-full h-48 object-cover hover:opacity-90 transition-opacity"
                      style={{ border: `1.5px solid ${theme.buttonBorder}` }}
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: theme.buttonBg,
              border: `1.5px solid ${theme.buttonBorder}`,
            }}
          >
            <User style={{ color: theme.buttonText }} size={20} />
          </div>
        </div>
      )}
    </div>
  );
}