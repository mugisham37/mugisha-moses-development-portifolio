"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyIcon, CheckIcon } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  language: string;
  code: string;
  highlights?: number[];
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  language,
  code,
  highlights = [],
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div className={cn("relative group", className)}>
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
        >
          {copied ? (
            <CheckIcon className="w-4 h-4 text-green-400" />
          ) : (
            <CopyIcon className="w-4 h-4" />
          )}
        </Button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers={showLineNumbers}
        wrapLines={highlights.length > 0}
        lineProps={(lineNumber) => {
          const isHighlighted = highlights.includes(lineNumber);
          return {
            style: {
              backgroundColor: isHighlighted
                ? "rgba(59, 130, 246, 0.1)"
                : "transparent",
              borderLeft: isHighlighted
                ? "3px solid rgb(59, 130, 246)"
                : "3px solid transparent",
              paddingLeft: "0.5rem",
              display: "block",
              width: "100%",
            },
          };
        }}
        customStyle={{
          margin: 0,
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
