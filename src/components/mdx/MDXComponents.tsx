"use client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  ExternalLink,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

// Separate CodeBlock component to fix React Hook violation
const CodeBlock = ({ children }: { children: ReactNode }) => {
  const [copied, setCopied] = useState(false);

  // Extract code content and language with proper typing
  const codeElement = children as React.ReactElement & {
    props?: {
      children?: string;
      className?: string;
    };
  };
  const code = codeElement?.props?.children || "";
  const language =
    codeElement?.props?.className?.replace("language-", "") || "text";

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative my-6 group"
    >
      {/* Language badge and copy button */}
      <div className="flex items-center justify-between mb-2">
        <Badge variant="secondary" className="text-xs">
          {language}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyCode}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
        }}
        showLineNumbers
        wrapLines
      >
        {code}
      </SyntaxHighlighter>
    </motion.div>
  );
};

// Custom components for MDX
export const MDXComponents = {
  // Headings with auto-generated IDs
  h1: ({ children, ...props }: { children: ReactNode }) => (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-3xl font-bold mt-8 mb-4 scroll-mt-20"
      {...props}
    >
      {children}
    </motion.h1>
  ),

  h2: ({ children, ...props }: { children: ReactNode }) => (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-2xl font-bold mt-8 mb-4 scroll-mt-20"
      {...props}
    >
      {children}
    </motion.h2>
  ),

  h3: ({ children, ...props }: { children: ReactNode }) => (
    <motion.h3
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-xl font-bold mt-6 mb-3 scroll-mt-20"
      {...props}
    >
      {children}
    </motion.h3>
  ),

  // Enhanced paragraphs
  p: ({ children, ...props }: { children: ReactNode }) => (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mb-4 leading-relaxed"
      {...props}
    >
      {children}
    </motion.p>
  ),

  // Enhanced links
  a: ({ href, children, ...props }: { href?: string; children: ReactNode }) => {
    const isExternal = href?.startsWith("http");

    return (
      <Link
        href={href || "#"}
        className="text-primary hover:text-primary/80 underline underline-offset-2 decoration-primary/30 hover:decoration-primary/60 transition-colors inline-flex items-center gap-1"
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
        {isExternal && <ExternalLink className="w-3 h-3" />}
      </Link>
    );
  },

  // Enhanced images
  img: ({ src, alt, ...props }: { src?: string; alt?: string }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="my-8"
    >
      <Image
        src={src || ""}
        alt={alt || ""}
        width={800}
        height={400}
        className="rounded-lg shadow-lg"
        {...props}
      />
      {alt && (
        <p className="text-sm text-muted-foreground text-center mt-2 italic">
          {alt}
        </p>
      )}
    </motion.div>
  ),

  // Enhanced code blocks - Fixed React Hook violation
  pre: ({ children }: { children: ReactNode }) => {
    return <CodeBlock>{children}</CodeBlock>;
  },

  // Inline code
  code: ({ children }: { children: ReactNode }) => (
    <code
      className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
    >
      {children}
    </code>
  ),

  // Enhanced lists
  ul: ({ children, ...props }: { children: ReactNode }) => (
    <motion.ul
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="list-disc list-inside mb-4 space-y-2"
      {...props}
    >
      {children}
    </motion.ul>
  ),

  ol: ({ children, ...props }: { children: ReactNode }) => (
    <motion.ol
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="list-decimal list-inside mb-4 space-y-2"
      {...props}
    >
      {children}
    </motion.ol>
  ),

  // Enhanced blockquotes
  blockquote: ({ children, ...props }: { children: ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="border-l-4 border-primary pl-6 py-2 my-6 bg-muted/50 rounded-r-lg italic"
      role="blockquote"
      {...props}
    >
      {children}
    </motion.div>
  ),

  // Tables
  table: ({ children, ...props }: { children: ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="my-6 overflow-x-auto"
    >
      <table
        className="w-full border-collapse border border-border rounded-lg"
        {...props}
      >
        {children}
      </table>
    </motion.div>
  ),

  th: ({ children, ...props }: { children: ReactNode }) => (
    <th
      className="border border-border bg-muted px-4 py-2 text-left font-semibold"
      {...props}
    >
      {children}
    </th>
  ),

  td: ({ children, ...props }: { children: ReactNode }) => (
    <td className="border border-border px-4 py-2" {...props}>
      {children}
    </td>
  ),

  // Custom components
  Callout: ({
    type = "info",
    children,
  }: {
    type?: "info" | "warning" | "success" | "error";
    children: ReactNode;
  }) => {
    const icons = {
      info: Info,
      warning: AlertTriangle,
      success: CheckCircle,
      error: XCircle,
    };

    const colors = {
      info: "border-blue-200 bg-blue-50 text-blue-800",
      warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
      success: "border-green-200 bg-green-50 text-green-800",
      error: "border-red-200 bg-red-50 text-red-800",
    };

    const Icon = icons[type];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className={`my-6 p-4 border-l-4 rounded-r-lg ${colors[type]}`}
      >
        <div className="flex items-start gap-3">
          <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">{children}</div>
        </div>
      </motion.div>
    );
  },

  TechStack: ({ technologies }: { technologies: string[] }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="my-6"
    >
      <Card className="p-4">
        <h4 className="font-semibold mb-3">Technologies Used</h4>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary">{tech}</Badge>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  ),

  ProjectMetrics: ({
    metrics,
  }: {
    metrics: Array<{ label: string; value: number; unit: string }>;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="my-6"
    >
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Project Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-2xl font-bold text-primary">
                {metric.value}
                {metric.unit}
              </div>
              <div className="text-sm text-muted-foreground">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  ),

  Timeline: ({
    items,
  }: {
    items: Array<{ date: string; title: string; description: string }>;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="my-6"
    >
      <div className="space-y-6">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex gap-4"
          >
            <div className="flex-shrink-0 w-24 text-sm text-muted-foreground font-medium">
              {item.date}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">{item.title}</h4>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  ),
};

// Export aliases for backward compatibility
export const mdxComponents = MDXComponents;
export const CustomComponents = MDXComponents;

// Default export
export default MDXComponents;
