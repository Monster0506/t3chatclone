"use client";
import { useChat } from "@ai-sdk/react";
import {
  ChatMessageList,
  ChatInput,
  ChatStatus,
  ChatQuickActions,
} from "./index";
import ChatBar from "./ChatBar";
import { useCallback, useState, useEffect, ChangeEvent } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";
import AllChatsIndex from "./AllChatsIndex";
import { useTheme } from "@/theme/ThemeProvider";
import Card from "@/components/UI/Card";
import ModelSelectorModal from "../ModelSelector/ModelSelectorModal";
import SettingsModal from "../Settings/SettingsModal";
import { List } from "lucide-react";

const DEFAULT_MODEL = "gemini-2.0-flash";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ChatContainer({
  chatId,
  initialMessages = [],
  sidebarCollapsed,
  disabled = false,
}: {
  chatId: string;
  initialMessages?: any[];
  sidebarCollapsed?: boolean;
  disabled?: boolean;
}) {
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [userSettings, setUserSettings] =
    useState<Tables<"user_settings"> | null>(null);
  const session = useSession();
  const { theme } = useTheme();
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [allChatsIndexOpen, setAllChatsIndexOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      if (session?.user) {
        const { data } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        setUserSettings(data);
      }
    };
    fetchSettings();
  }, [session]);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    reload,
    setInput,
    setMessages, // We need this to update the chat state
    error,
  } = useChat({
    body: {
      chat_id: chatId,
      model: selectedModel,
      userSettings,
    },
    initialMessages,
  });

  // **THIS IS THE NEW REFRESH FUNCTION**
  const refreshChatMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat?chatId=${chatId}`);
      if (!res.ok) throw new Error("Failed to fetch chat data");
      window.dispatchEvent(new Event("refresh-chat-list"));
      let messagesFromApi = await res.json();

      // Map the fetched messages to rename `code_conversions` to `conversions`
      let processedMessages = messagesFromApi.map((msg: any) => ({
        ...msg,
        conversions: msg.code_conversions,
      }));

      // Update the chat state with the newly fetched and processed messages
      setMessages(processedMessages);
    } catch (err) {
      console.error("Error refreshing messages:", err);
    }
  }, [chatId, setMessages]);

  const [optimisticMessages, setOptimisticMessages] = useState<any[]>([]);

  const handleQuickPrompt = useCallback(
    (prompt: string) => {
      setInput(prompt);
    },
    [setInput]
  );

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    files?: FileList
  ) => {
    e.preventDefault();
    if (files && files.length > 0) {
      const attachments = await Promise.all(
        Array.from(files).map(async (file) => ({
          type: "file",
          mimeType: file.type,
          name: file.name,
          data: await fileToBase64(file),
        }))
      );
      const optimisticMsg = {
        id: `optimistic-${Date.now()}`,
        role: "user",
        content: input,
        type: "text",
        created_at: new Date().toISOString(),
        parts: [{ type: "text", text: input }, ...attachments],
      };
      setOptimisticMessages((prev) => [...prev, optimisticMsg]);
      handleSubmit(e, {
        experimental_attachments: files,
        body: {
          chat_id: chatId,
          model: selectedModel,
          userSettings,
        },
      });
    } else {
      const optimisticMsg = {
        id: `optimistic-${Date.now()}`,
        role: "user",
        content: input,
        type: "text",
        created_at: new Date().toISOString(),
        parts: [{ type: "text", text: input }],
      };
      setOptimisticMessages((prev) => [...prev, optimisticMsg]);
      handleSubmit(e, {
        body: {
          chat_id: chatId,
          model: selectedModel,
          userSettings,
        },
      });
    }
  };

  useEffect(() => {
    setOptimisticMessages([]);
  }, [messages]);

  const showWelcome = messages && messages.length === 0;
  const mergedMessages = [...messages, ...optimisticMessages];

  const handleSaveSettings = async (settings: any) => {
    setSettingsLoading(true);
    try {
      const settingsToSave = {
        user_id: session?.user?.id,
        ...settings,
        updated_at: new Date().toISOString(),
      };
      const { error, data } = await supabase
        .from("user_settings")
        .upsert(settingsToSave, {
          onConflict: "user_id",
          ignoreDuplicates: false,
        })
        .select()
        .single();
      if (error) {
        console.error("Error saving settings:", error);
      } else {
        setUserSettings(data);
      }
    } catch (error) {
      console.error("Unexpected error saving settings:", error);
    } finally {
      setSettingsLoading(false);
      setSettingsOpen(false);
    }
  };

  function handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
  }

  return (
    <section
      className="flex flex-col flex-1 h-full w-full mx-auto transition-all duration-300"
      style={{ background: theme.background, color: theme.foreground }}
    >
      <ModelSelectorModal
        open={modelSelectorOpen}
        onClose={() => setModelSelectorOpen(false)}
        onSelect={setSelectedModel}
        selectedModelId={selectedModel}
      />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSaveSettings}
        initial={userSettings}
        loading={settingsLoading}
      />
      <AllChatsIndex
        open={allChatsIndexOpen}
        onClose={() => setAllChatsIndexOpen(false)}
      />
      <div className="w-full px-0 md:px-8 pt-4 pb-2">
        <Card className="w-full max-w-4xl mx-auto p-0 md:p-2 shadow-none bg-transparent">
          <ChatBar
            selectedModelId={selectedModel}
            onModelChange={setSelectedModel}
            onOpenModelSelector={() => setModelSelectorOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </Card>
      </div>

      {showWelcome ? (
        <div className="flex-1 flex flex-col justify-center items-center w-full px-2">
          <Card className="w-full max-w-3xl mx-auto p-0 md:p-8">
            <ChatQuickActions onPrompt={handleQuickPrompt} />
          </Card>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto w-full px-0 md:px-8">
          <Card className="w-full max-w-4xl mx-auto p-0 md:p-4 shadow-none bg-transparent">
            {/* Pass the refresh function down to the list */}
            <ChatMessageList
              messages={mergedMessages}
              onRefresh={refreshChatMessages}
            />
            <ChatStatus
              status={status}
              error={error}
              onStop={stop}
              onReload={reload}
            />
          </Card>
        </div>
      )}

      <div
        className="sticky bottom-0 z-20 w-full px-0 md:px-8 pt-2 pb-2"
        style={{ background: "transparent" }}
      >
        <Card className="w-full max-w-4xl mx-auto p-0 md:p-2 shadow-none bg-transparent">
          <ChatInput
            input={input}
            onInputChange={handleTextareaChange}
            onSubmit={onSubmit}
            disabled={status !== "ready" || disabled}
          />
        </Card>
      </div>

      <button
        className="fixed bottom-8 right-8 z-50 rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:scale-105 transition-all border-4"
        style={{
          background: theme.buttonBg,
          color: theme.buttonText,
          borderColor: theme.buttonBorder,
          boxShadow: "0 8px 32px 0 rgba(31,38,135,0.10)",
        }}
        onClick={() => setAllChatsIndexOpen(true)}
        aria-label="Open All Chats Index"
      >
        <List size={28} />
      </button>
    </section>
  );
}