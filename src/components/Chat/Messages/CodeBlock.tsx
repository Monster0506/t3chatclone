import { useTheme } from "@/theme/ThemeProvider";
import CodeBlockActions from "./CodeBlockActions";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState, useMemo } from "react";
import { languageMap } from "@/lib/languageMap";

// The interface remains the same
interface CodeConversion {
  code_block_index: number;
  target_language: string;
  converted_content: string;
}

export default function CodeBlock({
  originalCode,
  originalLanguage,
  codeBlockIndex,
  conversions = [],
  onCopy,
  onConvertRequest,
}: {
  originalCode: string;
  originalLanguage?: string;
  codeBlockIndex: number | undefined;
  conversions?: CodeConversion[];
  onCopy?: (code: string) => void;
  onConvertRequest?: (
    targetLanguage: string,
    codeBlockIndex: number | undefined,
  ) => void;
}) {
  const { theme } = useTheme();
  const style = oneDark;

  // State is simplified to only track the user's selection.
  // We default to the original language.
  const [selectedLanguage, setSelectedLanguage] = useState(
    originalLanguage || "text",
  );

  // All display logic is derived directly from props and the single state variable.
  // This makes the component declarative and removes the need for useEffect.
  const { currentCode, currentLanguage } = useMemo(() => {
    // If the user selects the original language, show the original code.
    if (selectedLanguage === originalLanguage) {
      return {
        currentCode: originalCode,
        currentLanguage: originalLanguage,
      };
    }

    // Otherwise, find the selected language in the conversions array.
    const conversion = conversions.find(
      (c) => c.target_language === selectedLanguage,
    );

    // If found, display the converted code.
    if (conversion) {
      return {
        currentCode: conversion.converted_content,
        currentLanguage: conversion.target_language,
      };
    }

    // Fallback: if the conversion isn't available (e.g., still loading),
    // show the original code until the new props arrive.
    return {
      currentCode: originalCode,
      currentLanguage: originalLanguage,
    };
  }, [selectedLanguage, originalCode, originalLanguage, conversions]);

  const mappedLanguage = useMemo(() => {
    const langKey = currentLanguage?.toLowerCase() ?? "";
    return languageMap[langKey] || currentLanguage || "text";
  }, [currentLanguage]);

  const handleLanguageChange = (newLanguage: string) => {
    // Always update the user's selection in our local state.
    setSelectedLanguage(newLanguage);

    // If the selected language is not the original and we don't have a conversion for it,
    // then we need to request it from the parent.
    const isOriginal = newLanguage === originalLanguage;
    const hasConversion = conversions.some(
      (c) => c.target_language === newLanguage,
    );

    if (!isOriginal && !hasConversion) {
      onConvertRequest?.(newLanguage, codeBlockIndex);
    }
  };

  const handleCopy = () => onCopy?.(currentCode);

  const isConverted = currentLanguage !== originalLanguage;

  return (
    <div
      className="relative my-6 rounded-2xl shadow-xl overflow-x-auto"
      style={{
        borderLeft: `6px solid ${theme.buttonBorder}`,
        border: `1.5px solid ${theme.buttonBorder}`,
        boxShadow: "0 8px 32px 0 rgba(31,38,135,0.10)",
        padding: "1.5rem 1.5rem 1.25rem 1.25rem",
        background: "transparent",
      }}
    >
      <SyntaxHighlighter
        language={mappedLanguage}
        style={style}
        customStyle={{
          margin: 0,
          fontSize: "1rem",
          paddingBottom: "2.5rem",
        }}
        showLineNumbers={false}
      >
        {currentCode}
      </SyntaxHighlighter>

      <div className="absolute top-3 right-4 text-xs font-semibold opacity-60">
        <span style={{ color: theme.inputText, letterSpacing: "0.05em" }}>
          {currentLanguage}
          {isConverted && originalLanguage && ` (from: ${originalLanguage})`}
        </span>
      </div>

      <CodeBlockActions
        onCopy={handleCopy}
        small
        currentLanguage={currentLanguage || ""}
        onLanguageChange={handleLanguageChange}
        existingConversions={conversions.map((c) => c.target_language)}
      />
    </div>
  );
}