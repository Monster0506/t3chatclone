import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAutocompleteProps {
  input: string;
  cursorPosition: number;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  setCursorPosition: (position: number) => void;
}

export function useAutocomplete({ 
  input, 
  cursorPosition, 
  onInputChange, 
  textareaRef, 
  setCursorPosition 
}: UseAutocompleteProps) {
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastCursorPosition = useRef(cursorPosition);
  
  // Keep track of the last cursor position
  useEffect(() => {
    lastCursorPosition.current = cursorPosition;
  }, [cursorPosition]);

  const fetchSuggestion = useCallback(async () => {
    if (input.length < 3) {
      setSuggestion('');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: input,
          cursorPosition: lastCursorPosition.current,
          maxTokens: 20
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestion');
      }

      const { completion } = await response.json();
      
      if (completion && completion.length > 0) {
        setSuggestion(completion);
      } else {
        setSuggestion('');
      }
    } catch (error) {
      console.error('Error fetching suggestion:', error);
      setSuggestion('');
    } finally {
      setIsLoading(false);
    }
  }, [input]);

  useEffect(() => {
    debounceTimer.current = setTimeout(fetchSuggestion, 1000);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [fetchSuggestion]);

  const acceptSuggestion = useCallback(() => {
    if (!suggestion) return;
    
    const start = lastCursorPosition.current;
    const end = start; // No selection, just cursor position
    
    // Insert the suggestion at the cursor position
    const beforeCursor = input.substring(0, start);
    const afterCursor = input.substring(end);
    const newValue = beforeCursor + suggestion + afterCursor;
    
    // Create a synthetic event to update the input
    const syntheticEvent = {
      target: { 
        value: newValue,
        selectionStart: start + suggestion.length,
        selectionEnd: start + suggestion.length
      }
    } as unknown as React.ChangeEvent<HTMLTextAreaElement>;
    
    // Update the input value and cursor position
    onInputChange(syntheticEvent);
    
    // Clear the suggestion
    setSuggestion('');
    
    // Focus the textarea and set cursor position
    if (textareaRef.current) {
      const newPos = start + suggestion.length;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(newPos, newPos);
      setCursorPosition(newPos);
    }
  }, [suggestion, input, onInputChange, textareaRef, setCursorPosition]);

  return {
    suggestion,
    isLoading,
    acceptSuggestion,
    setSuggestion
  };
}
