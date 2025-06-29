"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession, useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase/client";
import ChatContainer from "@/components/Chat/ChatContainer";

export default function Page() {
  const { id: chatId } = useParams();
  const session = useSession();
  const { isLoading: sessionLoading } = useSessionContext();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [initialMessages, setInitialMessages] = useState<any[]>([]);

  const id = Array.isArray(chatId) ? chatId[0] : chatId;

  useEffect(() => {
    const fetchChat = async () => {
      if (sessionLoading) return; // Wait for session to load
      if (!session?.user || !id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("id", id)
        .eq("user_id", session.user.id)
        .single();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/chat?chatId=${id}`);
        const messagesFromApi = await res.json();


        let messages = messagesFromApi.map((msg: any) => ({
          ...msg,
          conversions: msg.code_conversions,
        }));

        // Hydrate tool messages
        messages = messages.map((msg: any) => {
          if (msg.role === "tool" && Array.isArray(msg.content)) {
            const toolResultPart = msg.content.find(
              (part: any) => part.type === "tool-result"
            );
            if (toolResultPart) {
              return {
                ...msg,
                toolName: toolResultPart.toolName,
                result: toolResultPart.result,
              };
            }
          }
          if (msg.role === "tool" && msg.metadata?.toolMessage) {
            const toolMsg = msg.metadata.toolMessage;
            if (Array.isArray(toolMsg.content)) {
              const toolResultPart = toolMsg.content.find(
                (part: any) => part.type === "tool-result"
              );
              if (toolResultPart) {
                return {
                  ...msg,
                  toolName: toolResultPart.toolName,
                  result: toolResultPart.result,
                };
              }
            }
            return {
              ...msg,
              ...toolMsg,
              db_id: msg.id,
              db_created_at: msg.created_at,
            };
          }
          return msg;
        });

        // Merge assistant, tool, and assistant messages into one
        const mergedMessages = [];
        for (let i = 0; i < messages.length; i++) {
          const msg = messages[i];
          if (
            msg.role === "assistant" &&
            messages[i + 1] &&
            messages[i + 1].role === "tool" &&
            messages[i + 2] &&
            messages[i + 2].role === "assistant" &&
            (messages[i + 1].toolName ||
              (messages[i + 1].result && messages[i + 1].result.expression))
          ) {
            mergedMessages.push({
              ...msg,
              mergedParts: [
                { type: "text", text: msg.content },
                {
                  type: "tool",
                  toolName: messages[i + 1].toolName,
                  result: messages[i + 1].result,
                },
                { type: "text", text: messages[i + 2].content },
              ],
            });
            i += 2;
          } else {
            mergedMessages.push(msg);
          }
        }
        setInitialMessages(mergedMessages);
      } catch (_err) {
        console.error("Error fetching initial messages:", _err);
      }
      setLoading(false);
    };
    fetchChat();
  }, [session, sessionLoading, id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash && hash.startsWith("#")) {
      const el = document.getElementById(`msg-${hash.substring(1)}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-purple-400", "transition");
        setTimeout(() => {
          el.classList.remove("ring-2", "ring-purple-400", "transition");
        }, 2000);
      }
    }
  }, [initialMessages]);

  return (
    <>
      <main className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex flex-1 items-center justify-center text-lg text-gray-400">
            Loading...
          </div>
        ) : notFound ? (
          <div className="flex flex-1 items-center justify-center text-lg text-red-400">
            Chat not found.
          </div>
        ) : id ? (
          <ChatContainer chatId={id} initialMessages={initialMessages} />
        ) : null}
      </main>
    </>
  );
}