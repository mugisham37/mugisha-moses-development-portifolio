"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResumeHeader } from "./ResumeHeader";
import { ResumeContent } from "./ResumeContent";
import { ResumeControls } from "./ResumeControls";
import { ResumePDFGenerator } from "./ResumePDFGenerator";
import { useAnalytics } from "@/hooks/useAnalytics";

export type ResumeFormat = "standard" | "creative" | "minimal";
export type ResumeView = "interactive" | "print" | "presentation";

interface ResumeState {
  format: ResumeFormat;
  view: ResumeView;
  showAnalytics: boolean;
  isGeneratingPDF: boolean;
}

export function ResumeContainer() {
  const [state, setState] = useState<ResumeState>({
    format: "standard",
    view: "interactive",
    showAnalytics: false,
    isGeneratingPDF: false,
  });

  const resumeRef = useRef<HTMLDivElement>(null);
  const { trackEvent } = useAnalytics();

  const handleFormatChange = (format: ResumeFormat) => {
    setState((prev) => ({ ...prev, format }));
    trackEvent("resume_format_changed", { format });
  };

  const handleViewChange = (view: ResumeView) => {
    setState((prev) => ({ ...prev, view }));
    trackEvent("resume_view_changed", { view });
  };

  const handlePDFGeneration = async () => {
    setState((prev) => ({ ...prev, isGeneratingPDF: true }));
    trackEvent("resume_pdf_generation_started", { format: state.format });

    try {
      // PDF generation will be handled by ResumePDFGenerator
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate generation
      trackEvent("resume_pdf_generation_completed", { format: state.format });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      trackEvent("resume_pdf_generation_failed", { error: errorMessage });
    } finally {
      setState((prev) => ({ ...prev, isGeneratingPDF: false }));
    }
  };

  const toggleAnalytics = () => {
    setState((prev) => ({ ...prev, showAnalytics: !prev.showAnalytics }));
    trackEvent("resume_analytics_toggled", { show: !state.showAnalytics });
  };

  return (
    <div className="relative min-h-screen">
      {/* Resume Controls */}
      <ResumeControls
        format={state.format}
        view={state.view}
        showAnalytics={state.showAnalytics}
        isGeneratingPDF={state.isGeneratingPDF}
        onFormatChange={handleFormatChange}
        onViewChange={handleViewChange}
        onPDFGeneration={handlePDFGeneration}
        onToggleAnalytics={toggleAnalytics}
      />

      {/* Resume Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${state.format}-${state.view}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`
            ${state.view === "print" ? "print-optimized" : ""}
            ${state.view === "presentation" ? "presentation-mode" : ""}
          `}
        >
          <div ref={resumeRef} className="resume-container">
            <ResumeHeader format={state.format} view={state.view} />
            <ResumeContent format={state.format} view={state.view} />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* PDF Generator */}
      <ResumePDFGenerator
        resumeRef={resumeRef}
        format={state.format}
        isGenerating={state.isGeneratingPDF}
      />

      {/* Analytics Panel */}
      <AnimatePresence>
        {state.showAnalytics && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-20 right-4 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-6 z-50"
          >
            <h3 className="text-lg font-semibold mb-4">Resume Analytics</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Views Today:</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex justify-between">
                <span>PDF Downloads:</span>
                <span className="font-medium">7</span>
              </div>
              <div className="flex justify-between">
                <span>Most Popular Format:</span>
                <span className="font-medium">Standard</span>
              </div>
              <div className="flex justify-between">
                <span>Avg. Time on Page:</span>
                <span className="font-medium">3m 42s</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
