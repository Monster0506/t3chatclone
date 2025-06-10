import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import { useTheme } from '@/theme/ThemeProvider';
import { useState } from 'react';
import Badge from '@/components/UI/Badge';

const promptGroups: Record<string, string[]> = {
  Create: [
    'How does AI work?',
    'Are black holes real?',
    'How many Rs are in the word "strawberry"?',
    'What is the meaning of life?',
  ],
  Explore: [
    'What are the wonders of the world?',
    'Tell me about deep sea creatures.',
    'What is the most remote place on Earth?',
    'What are some unsolved mysteries?',
  ],
  Code: [
    'Show me a Python hello world.',
    'How do I center a div in CSS?',
    'What is a closure in JavaScript?',
    'Explain recursion with code.',
  ],
  Learn: [
    'Teach me a new word.',
    'What is quantum physics?',
    'How do I improve my memory?',
    'What is the history of the internet?',
  ],
};

const actionTags = Object.keys(promptGroups);

export default function ChatQuickActions({ onPrompt }: { onPrompt: (prompt: string) => void }) {
  const { theme } = useTheme();
  const [selectedTag, setSelectedTag] = useState('Create');
  const prompts = promptGroups[selectedTag];

  return (
    <div className="flex-1 flex flex-col justify-center items-center w-full">
      <div
        className="w-full flex flex-col items-center justify-center mb-6"
        style={{ background: theme.glass, borderRadius: '1.5rem', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)', padding: '2.5rem 1rem 2rem 1rem', maxWidth: 700 }}
      >
        <h1
          className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg text-center"
          style={{ color: theme.foreground, letterSpacing: '-0.02em' }}
        >
          How can I help you?
        </h1>
        <div className="flex gap-3 mb-4 justify-center flex-wrap">
          {actionTags.map(tag => (
            <Badge
              key={tag}
              className={`px-4 py-2 text-lg font-semibold cursor-pointer transition ${selectedTag === tag ? 'ring-2 ring-offset-2' : ''}`}
              style={{
                background: selectedTag === tag ? theme.buttonGlass : theme.inputGlass,
                color: theme.buttonText,
                borderColor: theme.buttonBorder,
                boxShadow: selectedTag === tag ? '0 0 0 2px ' + theme.buttonBorder : undefined,
                fontWeight: 600,
                fontSize: '1.1rem',
                letterSpacing: '0.01em',
              }}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <Card className="mt-6 p-6 w-full max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prompts.map((prompt) => (
            <Button
              key={prompt}
              className="w-full text-base font-medium py-4"
              style={{ background: theme.buttonGlass, color: theme.buttonText, borderColor: theme.buttonBorder, minHeight: 56 }}
              onClick={() => onPrompt(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
} 