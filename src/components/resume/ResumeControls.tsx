"use client";

import { motion } from "framer-motion";
import {
  DocumentArrowDownIcon,
  PresentationChartLineIcon,
  PrinterIcon,
  ComputerDesktopIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { ResumeFormat, ResumeView } from "./ResumeContainer";

interface ResumeControlsProps {
  format: ResumeFormat;
  view: ResumeView;
  showAnalytics: boolean;
  isGeneratingPDF: boolean;
  onFormatChange: (format: ResumeFormat) => void;
  onViewChange: (view: ResumeView) => void;
  onPDFGeneration: () => void;
  onToggleAnalytics: () => void;
}

export function ResumeControls({
  format,
  view,
  showAnalytics,
  isGeneratingPDF,
  onFormatChange,
  onViewChange,
  onPDFGeneration,
  onToggleAnalytics,
}: ResumeControlsProps) {
  const formatOptions: {
    value: ResumeFormat;
    label: string;
    description: string;
  }[] = [
    {
      value: "standard",
      label: "Standard",
      description: "Traditional professional format",
    },
    {
      value: "creative",
      label: "Creative",
      description: "Modern design with visual elements",
    },
    {
      value: "minimal",
      label: "Minimal",
      description: "Clean, minimalist layout",
    },
  ];

  const viewOptions: { value: ResumeView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: "interactive", label: "Interactive", icon: ComputerDesktopIcon },
    { value: "print", label: "Print Preview", icon: PrinterIcon },
    {
      value: "presentation",
      label: "Presentation",
      icon: PresentationChartLineIcon,
    },
  ];

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Left: Format Selection */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Cog6ToothIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Format:
              </span>
            </div>
            <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              {formatOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onFormatChange(option.value)}
                  className={`
                    px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                    ${
                      format === option.value
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }
                  `}
                  title={option.description}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Center: View Options */}
          <div className="flex items-center space-x-2">
            {viewOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => onViewChange(option.value)}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      view === option.value
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{option.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3">
            {/* Analytics Toggle */}
            <button
              onClick={onToggleAnalytics}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${
                  showAnalytics
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }
              `}
              title="Toggle Analytics"
            >
              <ChartBarIcon className="h-5 w-5" />
            </button>

            {/* PDF Download */}
            <motion.button
              onClick={onPDFGeneration}
              disabled={isGeneratingPDF}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                disabled:bg-blue-400 text-white rounded-lg font-medium transition-all duration-200
                ${isGeneratingPDF ? "cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>{isGeneratingPDF ? "Generating..." : "Download PDF"}</span>
              {isGeneratingPDF && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
