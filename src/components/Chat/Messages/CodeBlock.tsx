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
  ) => void;
}) {
  const { theme } = useTheme();
  const style = oneDark;

  const [selectedLanguage, setSelectedLanguage] = useState(
    originalLanguage || "text",
  );
  const [loadingLanguage, setLoadingLanguage] = useState<string | null>(null);

  useEffect(() => {
    if (
      loadingLanguage &&
      conversions.some((c) => c.target_language === loadingLanguage)
    ) {
      setLoadingLanguage(null);
    }
  }, [conversions, loadingLanguage]);

  const { currentCode, currentLanguage } = useMemo(() => {
    if (selectedLanguage === originalLanguage) {
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
    if (loadingLanguage === selectedLanguage) {
      return {
        currentCode: `Converting to ${selectedLanguage}...`,
        currentLanguage: selectedLanguage,
      };
    }
    return {
      currentCode: originalCode,
      currentLanguage: originalLanguage,
    };
  }, [
    selectedLanguage,
    originalCode,
    originalLanguage,
    conversions,
    loadingLanguage,
  ]);

  const mappedLanguage = useMemo(() => {
    const langKey = currentLanguage?.toLowerCase() ?? "";
    return languageMap[langKey] || currentLanguage || "text";
  }, [currentLanguage]);

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
    const isOriginal = newLanguage === originalLanguage;
    const hasConversion = conversions.some(
      (c) => c.target_language === newLanguage,
    );
    if (!isOriginal && !hasConversion) {
      setLoadingLanguage(newLanguage);
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
        customStyle={{ margin: 0, fontSize: "1rem", paddingBottom: "2.5rem" }}
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
        currentLanguage={selectedLanguage}
        isLoading={loadingLanguage != null}
        onLanguageChange={handleLanguageChange}
        existingConversions={conversions.map((c) => c.target_language)}
      />
    </div>
  );
}