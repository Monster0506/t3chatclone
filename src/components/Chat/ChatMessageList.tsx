import ChatMessage from "./Messages/ChatMessage";
import { ExtendedMessage } from "@/lib/types";
export default function ChatMessageList({
  messages,
  onRefresh,
}: {
  messages: ExtendedMessage[];
  onRefresh: () => Promise<void>;  
}) {
  return (
    <div className="flex flex-col gap-6 px-2 py-6 w-full max-w-4xl mx-auto">
      {messages.map((msg, i) => (
        <ChatMessage
          message={msg}
          key={msg.id || i}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}