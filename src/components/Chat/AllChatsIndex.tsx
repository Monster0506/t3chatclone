import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, HelpCircle, FileText, Code2, ListChecks, Info } from 'lucide-react';
import { useSession } from '@supabase/auth-helpers-react';
import { useTheme } from '@/theme/ThemeProvider';
import Card from '@/components/UI/Card';
import { IndexItem } from '@/lib/types';
import { useCloseModal } from '@/hooks/use-close-modal';


const typeIcon: Record<IndexItem['type'], React.ReactNode> = {
  question: <HelpCircle size={16} />,
  answer: <Info size={16} />,
  code: <Code2 size={16} />,
  summary: <FileText size={16} />,
  decision: <ListChecks size={16} />,
};

export default function AllChatsIndex({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [indexData, setIndexData] = useState<IndexItem[]>([]);
  const session = useSession();
  const router = useRouter();
  const { theme } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);
  useCloseModal({ ref: modalRef, isOpen: open, onClose });


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

    fetch(`/api/chat-index?user_id=${encodeURIComponent(userId)}`)
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then((data: IndexItem[]) => {
        setIndexData(data);
        setLoading(false);
      })
      .catch(_err => {
        setError('Failed to load index.');
        setLoading(false);
        setIndexData([]);
      });
  }, [open, session]);


  const grouped = indexData.reduce((acc, item) => {
    if (!acc[item.chat_id]) acc[item.chat_id] = { chatTitle: item.chatTitle, items: [] };
    acc[item.chat_id].items.push(item);
    return acc;
  }, {} as Record<string, { chatTitle: string; items: IndexItem[] }>);

  const allowedTypes: IndexItem['type'][] = ['question', 'answer', 'code', 'summary', 'decision'];

  const handleJump = (chatId: string, messageId: string) => {
    router.push(`/chat/${chatId}#${messageId}`);
    onClose();
  };

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <Card ref={modalRef} className="w-full max-h-[80vh] mx-auto p-0 md:p-6 rounded-2xl shadow-xl" style={{ background: theme.glass, border: `1.5px solid ${theme.buttonBorder}` }}>
        <div className="flex justify-between items-center mb-4">
          <div className="font-bold text-xl" style={{ color: theme.buttonText }}>All Important Messages</div>
          <button
            className="rounded-full p-2 ml-2 shadow"
            style={{ background: theme.inputGlass, color: theme.buttonText, border: `1.5px solid ${theme.buttonBorder}` }}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {loading && <div className="text-center py-8" style={{ color: theme.inputText }}>Loading...</div>}
          {error && <div className="text-center py-4" style={{ color: '#e53935' }}>{error}</div>}
          {!loading && !error && Object.keys(grouped).length === 0 && (
            <div className="text-center py-8" style={{ color: theme.inputText }}>No important messages found.</div>
          )}
          {!loading && !error && Object.entries(grouped).map(([chatId, group]) => (
            <div key={chatId} className="mb-6">
              <div className="font-semibold text-lg mb-2" style={{ color: theme.buttonText }}>{group.chatTitle}</div>
              <ul className="space-y-2">
                {group.items.map((item: IndexItem) => (
                  allowedTypes.includes(item.type) && (
                    <li
                      key={item.id}
                      data-message-id={item.message_id}
                      className="flex items-start gap-2 group rounded-2xl p-3 cursor-pointer transition shadow"
                      style={{ background: theme.inputGlass, color: theme.inputText, border: `1.5px solid ${theme.buttonBorder}` }}
                      onClick={() => handleJump(item.chat_id, item.message_id)}
                    >
                      <span className="mt-1" style={{ color: theme.buttonText }}>{typeIcon[item.type]}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium" style={{ color: theme.inputText }}>{item.snippet}</div>
                        <div className="text-xs opacity-70" style={{ color: theme.inputText }}>{new Date(item.created_at).toLocaleString()}</div>
                      </div>
                      <button
                        className="ml-2 text-xs opacity-0 group-hover:opacity-100 underline"
                        style={{ color: theme.buttonText }}
                        onClick={e => { e.stopPropagation(); handleJump(item.chat_id, item.message_id); }}
                      >Jump</button>
                    </li>
                  )
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 