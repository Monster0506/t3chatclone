import { useTheme } from "@/theme/ThemeProvider";
import CodeBlockActions from "./CodeBlockActions";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState, useMemo, useEffect } from "react";
import { languageMap } from "@/lib/languageMap";
import { CodeConversion } from "@/lib/types";

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
  ) => Promise<void>; // Updated prop type
}) {
  const { theme } = useTheme();
  const style = oneDark;

  const [selectedLanguage, setSelectedLanguage] = useState(
    originalLanguage || "text",
  );
  const [loadingLanguage, setLoadingLanguage] = useState<string | null>(null);

  useEffect(() => {
    // This effect runs when a conversion is successful and the `conversions`
    // prop updates, clearing the loading state.
    if (
      loadingLanguage &&
      conversions.some((c) => c.target_language === loadingLanguage)
    ) {
      setLoadingLanguage(null);
    }
  }, [conversions, loadingLanguage]);

  const { currentCode, currentLanguage } = useMemo(() => {
    if (selectedLanguage === (originalLanguage || "text")) {
      return {
        currentCode: originalCode,
        currentLanguage: originalLanguage,
      };
    }
    const conversion = conversions.find(
      (c) => c.target_language === selectedLanguage,
    );
    if (conversion) {
      return {
        currentCode: conversion.converted_content,
        currentLanguage: conversion.target_language,
      };
    }
    // This case is now primarily handled by the loading state
    return {
      currentCode: originalCode,
      currentLanguage: originalLanguage,
    };
  }, [selectedLanguage, originalCode, originalLanguage, conversions]);

  const mappedLanguage = useMemo(() => {
    const langKey = currentLanguage?.toLowerCase() ?? "";
    return languageMap[langKey] || currentLanguage || "text";
  }, [currentLanguage]);

  const handleLanguageChange = async (newLanguage: string) => {
    const previousLanguage = selectedLanguage;
    setSelectedLanguage(newLanguage); // Optimistically update UI

    const isOriginal = newLanguage === (originalLanguage || "text");
    const hasConversion = conversions.some(
      (c) => c.target_language === newLanguage,
    );

    // If the selected language is new and needs conversion
    if (!isOriginal && !hasConversion && onConvertRequest) {
      setLoadingLanguage(newLanguage);
      try {
        await onConvertRequest(newLanguage, codeBlockIndex);
        // On success, the useEffect will clear the loading state
        // once the new `conversions` prop arrives.
      } catch (error) {
        console.error("Conversion failed, reverting UI state.", error);
        // On failure, revert the UI state.
        setLoadingLanguage(null);
        setSelectedLanguage(previousLanguage);
      }
    }
  };

  const handleCopy = () => onCopy?.(currentCode);
  const isConverted = currentLanguage !== originalLanguage;

  // Display a loading message if a conversion is in progress
  const displayCode =
    loadingLanguage === selectedLanguage
      ? `Converting to ${selectedLanguage}...`
      : currentCode;

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
        customStyle={{ margin: 0, fontSize: "1rem", paddingBottom: "2.5rem" }}
        showLineNumbers={false}
      >
        {displayCode}
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
        currentLanguage={selectedLanguage}
        isLoading={loadingLanguage != null}
        onLanguageChange={handleLanguageChange}
        existingConversions={conversions.map((c) => c.target_language)}
      />
    </div>
  );
}