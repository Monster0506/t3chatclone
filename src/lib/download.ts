// src/lib/download.ts
import { jsPDF } from 'jspdf';
import type { Tables } from '@/lib/supabase/types';

type Message = Tables<'messages'>;
type Chat = Tables<'chats'>;

export type DownloadFormat = 'json' | 'txt' | 'pdf';

const formatMessage = (message: Message): string => {
  const metadata = message.metadata as any;

  switch (message.role) {
    case 'user':
      return `User: ${message.content}`;
    case 'assistant':
      return `Assistant: ${message.content}`;
    case 'tool': {
      const toolResult =
        metadata?.toolMessage?.content?.[0]?.result?.result;
      return `Tool Output: ${
        toolResult ? JSON.stringify(toolResult) : 'No result'
      }`;
    }
    default:
      return `${message.role}: ${message.content}`;
  }
};

export const handleDownload = (
  thread: Chat,
  messages: Message[],
  format: DownloadFormat,
) => {
  if (!messages || messages.length === 0) {
    console.error('No messages to download.');
    return;
  }

  const sortedMessages = [...messages].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  const title = thread.title || 'Untitled Chat';
  const filename = `${title}.${format}`;

  switch (format) {
    case 'json':
      downloadJson(thread, sortedMessages, filename);
      break;
    case 'txt':
      downloadTxt(thread, sortedMessages, filename);
      break;
    case 'pdf':
      downloadPdf(thread, sortedMessages, filename);
      break;
    default:
      console.error(`Unsupported download format: ${format}`);
  }
};


const downloadJson = (
  chat: Chat,
  messages: Message[],
  filename: string,
) => {
  const data = { chat, messages };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  triggerBrowserDownload(blob, filename);
};

const downloadTxt = (chat: Chat, messages: Message[], filename: string) => {
  const header = [
    `Title: ${chat.title || 'Untitled Chat'}`,
    `Date: ${new Date(chat.created_at).toLocaleString()}`,
    `Model: ${chat.model}`,
    '---',
    '',
  ];

  const messageLines = messages.map(formatMessage);
  const content = [...header, ...messageLines].join('\n');

  const blob = new Blob([content], { type: 'text/plain' });
  triggerBrowserDownload(blob, filename);
};

const downloadPdf = (chat: Chat, messages: Message[], filename: string) => {
  const doc = new jsPDF();
  const margin = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const usableWidth = pageWidth - margin * 2;
  let yPosition = margin;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(chat.title || 'Untitled Chat', margin, yPosition);
  yPosition += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(
    `Date: ${new Date(chat.created_at).toLocaleString()} | Model: ${
      chat.model
    }`,
    margin,
    yPosition,
  );
  yPosition += 10;
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  messages.forEach((message) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = margin;
    }

    const role = message.role.charAt(0).toUpperCase() + message.role.slice(1);
    const content = formatMessage(message).substring(role.length + 2); // Remove "Role: " prefix

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`${role}:`, margin, yPosition);

    doc.setFont('helvetica', 'normal');
    const textLines = doc.splitTextToSize(content, usableWidth - 15);
    doc.text(textLines, margin + 15, yPosition);

    yPosition += textLines.length * 5 + 5;
  });

  doc.save(filename);
};


const triggerBrowserDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};