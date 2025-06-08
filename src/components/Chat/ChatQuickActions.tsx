const quickPrompts = [
  'How does AI work?',
  'Are black holes real?',
  'How many Rs are in the word "strawberry"?',
  'What is the meaning of life?',
];

export default function ChatQuickActions({ onPrompt }: { onPrompt: (prompt: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
      {quickPrompts.map((prompt) => (
        <button
          key={prompt}
          className="bg-white border border-purple-100 rounded-lg px-4 py-3 text-purple-700 text-base font-medium shadow hover:bg-purple-50 transition"
          onClick={() => onPrompt(prompt)}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
} 