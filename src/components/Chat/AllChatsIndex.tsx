import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, X, HelpCircle, FileText, Code2, ListChecks, Info, List } from 'lucide-react';
import { useSession } from '@supabase/auth-helpers-react';

// Type for index items
interface IndexItem {
  id: string;
  chat_id: string;
  chatTitle: string;
  message_id: string;
  type: 'question' | 'answer' | 'code' | 'summary' | 'decision';
  snippet: string;
  created_at: string;
}

const typeIcon: Record<IndexItem['type'], React.ReactNode> = {
  question: <HelpCircle className="text-blue-500" size={16} />,
  answer: <Info className="text-green-500" size={16} />,
  code: <Code2 className="text-purple-600" size={16} />,
  summary: <FileText className="text-orange-500" size={16} />,
  decision: <ListChecks className="text-pink-500" size={16} />,
};

export default function AllChatsIndex() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [indexData, setIndexData] = useState<IndexItem[]>([]);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    const userId = session?.user?.id;
    if (!userId) {
      setError('Not logged in.');
      setLoading(false);
      return;
    }
    // Pass user_id as query param
    fetch(`/api/chat-index?user_id=${encodeURIComponent(userId)}`)
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then((data: IndexItem[]) => {
        setIndexData(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load index.');
        setLoading(false);
        // Fallback to mock data for now
        setIndexData([
          {
            id: '1',
            chat_id: 'chat-1',
            chatTitle: 'Project Launch',
            message_id: 'msg-1',
            type: 'question',
            snippet: 'What is the timeline for the project launch?',
            created_at: '2024-06-10T10:00:00Z',
          },
          {
            id: '2',
            chat_id: 'chat-1',
            chatTitle: 'Project Launch',
            message_id: 'msg-2',
            type: 'decision',
            snippet: 'We decided to launch on July 1st.',
            created_at: '2024-06-10T10:05:00Z',
          },
          {
            id: '3',
            chat_id: 'chat-2',
            chatTitle: 'AI Research',
            message_id: 'msg-3',
            type: 'summary',
            snippet: 'Summary: Discussed the latest Gemini model capabilities.',
            created_at: '2024-06-09T15:00:00Z',
          },
        ]);
      });
  }, [open, session]);

  // Group by chat
  const grouped = indexData.reduce((acc, item) => {
    if (!acc[item.chat_id]) acc[item.chat_id] = { chatTitle: item.chatTitle, items: [] };
    acc[item.chat_id].items.push(item);
    return acc;
  }, {} as Record<string, { chatTitle: string; items: IndexItem[] }>);

  // Only support enum types for icons
  const allowedTypes: IndexItem['type'][] = ['question', 'answer', 'code', 'summary', 'decision'];

  // Jump handler
  const handleJump = (chatId: string, messageId: string) => {
    // Navigate to the chat page with a hash for the message
    router.push(`/chat/${chatId}#${messageId}`);
    setOpen(false);
    // Optionally, you can implement scroll-to-message logic in the chat page using the hash
  };

  return (
    <>
      {/* Floating round button */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:scale-105 transition-all border-4 border-white"
        onClick={() => setOpen(true)}
        aria-label="Open All Chats Index"
      >
        <List size={28} />
      </button>

      {/* Overlay panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-20">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 sm:mx-0 p-6 relative animate-fade-in-up">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-purple-500"
              onClick={() => setOpen(false)}
              aria-label="Close Index"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-purple-700 flex items-center gap-2">
              <List size={24} /> All Chats Index
            </h2>
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {loading && <div className="text-center text-purple-400 py-8">Loading...</div>}
              {error && <div className="text-center text-red-500 py-4">{error}</div>}
              {!loading && !error && Object.keys(grouped).length === 0 && (
                <div className="text-center text-gray-400 py-8">No important messages found.</div>
              )}
              {!loading && !error && Object.entries(grouped).map(([chatId, group]) => (
                <div key={chatId} className="mb-6">
                  <div className="font-semibold text-lg text-purple-600 mb-2">{group.chatTitle}</div>
                  <ul className="space-y-2">
                    {group.items.map(item => (
                      allowedTypes.includes(item.type) && (
                        <li
                          key={item.id}
                          data-message-id={item.message_id}
                          className="flex items-start gap-2 group hover:bg-purple-50 rounded p-2 cursor-pointer transition"
                        >
                          <span className="mt-1">{typeIcon[item.type]}</span>
                          <div className="flex-1">
                            <div className="text-sm text-gray-800 font-medium">{item.snippet}</div>
                            <div className="text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</div>
                          </div>
                          <button
                            className="ml-2 text-xs text-purple-500 opacity-0 group-hover:opacity-100 underline"
                            onClick={() => handleJump(item.chat_id, item.message_id)}
                          >Jump</button>
                        </li>
                      )
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 