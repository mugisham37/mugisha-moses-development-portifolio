"use client";

import { RefObject, useCallback } from "react";
import { ResumeFormat } from "./ResumeContainer";

interface ResumePDFGeneratorProps {
  resumeRef: RefObject<HTMLDivElement | null>;
  format: ResumeFormat;
  isGenerating: boolean;
}

export function ResumePDFGenerator({
  resumeRef,
  format,
  isGenerating,
}: ResumePDFGeneratorProps) {
  const generatePDF = useCallback(async () => {
    if (!resumeRef.current || isGenerating) return;

    try {
      // Dynamic import to reduce bundle size
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      // Configure the element for PDF generation
      const element = resumeRef.current;
      const originalStyle = element.style.cssText;

      // Apply print-specific styles
      element.style.cssText = `
        ${originalStyle}
        width: 210mm;
        min-height: 297mm;
        background: white;
        color: black;
        font-size: 12px;
        line-height: 1.4;
        padding: 20mm;
        box-sizing: border-box;
      `;

      // Generate canvas from HTML
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      // Restore original styles
      element.style.cssText = originalStyle;

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const fileName = `Alex_Morgan_Resume_${format}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // You could show a toast notification here
    }
  }, [resumeRef, format, isGenerating]);

  // Auto-generate PDF when isGenerating becomes true
  if (isGenerating) {
    generatePDF();
  }

  return null; // This component doesn't render anything
}
