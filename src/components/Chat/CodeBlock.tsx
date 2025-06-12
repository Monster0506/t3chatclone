import { useTheme } from "@/theme/ThemeProvider";
import CodeBlockActions from "./CodeBlockActions";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState, useMemo, useEffect } from "react";

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
  codeBlockIndex: number;
  conversions?: CodeConversion[];
  onCopy?: (code: string) => void;
  onConvertRequest?: (targetLanguage: string, codeBlockIndex: number) => void;
}) {
  const { theme } = useTheme();
  const style = oneDark;

  const [currentCode, setCurrentCode] = useState(originalCode);
  const [currentLanguage, setCurrentLanguage] = useState(originalLanguage);

  useEffect(() => {
    setCurrentCode(originalCode);
    setCurrentLanguage(originalLanguage);
  }, [originalCode, originalLanguage]);

  const isConverted = currentLanguage !== originalLanguage;

  const availableLanguages = useMemo(() => {
    const languages = new Set<string>();
    if (originalLanguage) {
      languages.add(originalLanguage);
    }
    conversions.forEach((conv) => languages.add(conv.target_language));
    return Array.from(languages);
  }, [originalLanguage, conversions]);

  const handleLanguageChange = (selectedLanguage: string) => {
    if (selectedLanguage === "--convert--") {
      const newLang = prompt(
        "Enter the language to convert to (e.g., python, go, rust):"
      );
      if (newLang && onConvertRequest) {
        onConvertRequest(newLang.toLowerCase().trim(), codeBlockIndex);
      }
      setTimeout(() => {
        const select = document.querySelector(
          `select[aria-label="Select code language"]`
        ) as HTMLSelectElement;
        if (select) select.value = currentLanguage || "";
      }, 0);
      return;
    }

    if (selectedLanguage === originalLanguage) {
      setCurrentCode(originalCode);
      setCurrentLanguage(originalLanguage);
    } else {
      const conversion = conversions.find(
        (c) => c.target_language === selectedLanguage
      );
      if (conversion) {
        setCurrentCode(conversion.converted_content);
        setCurrentLanguage(conversion.target_language);
      }
    }
  };

  const handleCopy = () => onCopy?.(currentCode);

  return (
    <div
      className="relative my-6 rounded-2xl shadow-xl overflow-x-auto border-l-4"
      style={{
        borderLeft: `6px solid ${theme.buttonBorder}`,
        border: `1.5px solid ${theme.buttonBorder}`,
        boxShadow: "0 8px 32px 0 rgba(31,38,135,0.10)",
        padding: "1.5rem 1.5rem 1.25rem 1.25rem",
        background: "transparent",
      }}
    >
      <SyntaxHighlighter
        language={currentLanguage}
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
        <span
          style={{ color: theme.inputText, letterSpacing: "0.05em" }}
        >
          {currentLanguage}
          {isConverted && originalLanguage && ` (from: ${originalLanguage})`}
        </span>
      </div>

      <CodeBlockActions
        onCopy={handleCopy}
        small
        availableLanguages={availableLanguages}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
    </div>
  );
}