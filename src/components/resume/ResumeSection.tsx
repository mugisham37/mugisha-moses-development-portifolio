"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ResumeFormat } from "./ResumeContainer";

interface ResumeSectionProps {
  title: string;
  format: ResumeFormat;
  children: ReactNode;
  className?: string;
}

export function ResumeSection({
  title,
  format,
  children,
  className = "",
}: ResumeSectionProps) {
  const getSectionStyles = () => {
    switch (format) {
      case "creative":
        return "creative-section";
      case "minimal":
        return "minimal-section";
      default:
        return "standard-section";
    }
  };

  if (format === "minimal") {
    return (
      <section className={`minimal-section ${className}`}>
        <h2 className="text-xl font-light text-slate-900 dark:text-white mb-6 pb-2 border-b border-slate-200 dark:border-slate-700">
          {title}
        </h2>
        {children}
      </section>
    );
  }

  if (format === "creative") {
    return (
      <section className={`creative-section ${className}`}>
        <div className="relative">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 relative">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </span>
            <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
          </h2>
          {children}
        </div>
      </section>
    );
  }

  // Standard format
  return (
    <section className={`standard-section ${className}`}>
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
        <div className="flex-1 ml-4 h-px bg-gradient-to-r from-blue-600 to-transparent" />
      </div>
      {children}
    </section>
  );
}
