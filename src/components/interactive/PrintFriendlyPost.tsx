"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Printer, Download, FileText, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { BlogPost } from "@/types";

interface PrintFriendlyPostProps {
  post: BlogPost;
  content: string;
  className?: string;
}

export function PrintFriendlyPost({
  post,
  content,
  className = "",
}: PrintFriendlyPostProps) {
  const [isPrintPreview, setIsPrintPreview] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [printStats, setPrintStats] = useState({
    pages: 0,
    words: 0,
    characters: 0,
    readingTime: 0,
  });

  // Calculate print statistics
  useEffect(() => {
    const calculateStats = () => {
      const words = content.split(/\s+/).length;
      const characters = content.length;
      const readingTime = Math.ceil(words / 200); // 200 words per minute
      const pages = Math.ceil(words / 250); // Approximate 250 words per page

      setPrintStats({
        pages,
        words,
        characters,
        readingTime,
      });
    };

    calculateStats();
  }, [content]);

  const handlePrint = () => {
    // Add print-specific styles
    const printStyles = `
      <style>
        @import url('/styles/print.css');
        
        /* Additional print-specific styles for this post */
        .print-header {
          display: block !important;
          margin-bottom: 2cm;
          padding-bottom: 1cm;
          border-bottom: 2pt solid #333;
        }
        
        .print-title {
          font-size: 24pt !important;
          font-weight: bold !important;
          margin-bottom: 0.5cm !important;
        }
        
        .print-meta {
          font-size: 10pt !important;
          color: #666 !important;
          margin-bottom: 1cm !important;
        }
        
        .print-content {
          font-size: 11pt !important;
          line-height: 1.6 !important;
        }
        
        .print-footer {
          margin-top: 2cm;
          padding-top: 1cm;
          border-top: 1pt solid #ccc;
          font-size: 9pt;
          color: #666;
        }
      </style>
    `;

    // Create print content
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${post.title} - Alex Morgan's Blog</title>
          ${printStyles}
        </head>
        <body>
          <div class="print-container">
            <header class="print-header">
              <h1 class="print-title">${post.title}</h1>
              <div class="print-meta">
                <div class="article-author">By: ${post.author.name}</div>
                <div class="article-date">Published: ${post.publishedAt.toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}</div>
                <div class="article-category">Category: ${post.category}</div>
                <div class="article-reading-time">Reading Time: ${
                  post.readingTime
                } minutes</div>
                <div class="article-tags">
                  Tags: ${post.tags.join(", ")}
                </div>
              </div>
              <div class="article-description">
                <p><em>${post.description}</em></p>
              </div>
            </header>
            
            <main class="print-content">
              ${content}
            </main>
            
            <footer class="print-footer">
              <div class="print-url">
                Original article: https://alexmorgan.dev/blog/${post.slug}
              </div>
              <div class="print-date">
                Printed on: ${new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div class="print-stats">
                ${printStats.words} words • ${printStats.pages} pages • ${
      printStats.readingTime
    } min read
              </div>
            </footer>
          </div>
        </body>
      </html>
    `;

    // Open print dialog
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();

      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }

    // Track print event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "article_printed", {
        article_title: post.title,
        article_slug: post.slug,
        print_pages: printStats.pages,
        print_words: printStats.words,
      });
    }
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);

    try {
      // In a real implementation, you would call a PDF generation service
      // For now, we'll simulate the process and use the browser's print to PDF
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Trigger print dialog with PDF option
      handlePrint();

      // Track PDF generation
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "article_pdf_generated", {
          article_title: post.title,
          article_slug: post.slug,
          pdf_pages: printStats.pages,
          pdf_words: printStats.words,
        });
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const togglePrintPreview = () => {
    setIsPrintPreview(!isPrintPreview);

    if (!isPrintPreview) {
      // Add print preview styles to body
      document.body.classList.add("print-preview");
    } else {
      // Remove print preview styles
      document.body.classList.remove("print-preview");
    }
  };

  return (
    <div className={className}>
      <Card className="p-6 bg-gradient-to-br from-muted/30 to-muted/10 border-muted">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Print & Export</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {printStats.pages} pages
          </Badge>
        </div>

        {/* Print Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {printStats.pages}
            </div>
            <div className="text-xs text-muted-foreground">Pages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {printStats.words.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Words</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {Math.round(printStats.characters / 1000)}K
            </div>
            <div className="text-xs text-muted-foreground">Characters</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {printStats.readingTime}
            </div>
            <div className="text-xs text-muted-foreground">Min Read</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handlePrint}
            className="flex items-center gap-2 flex-1"
            variant="outline"
          >
            <Printer className="w-4 h-4" />
            <span>Print Article</span>
          </Button>

          <Button
            onClick={handleGeneratePDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 flex-1"
            variant="outline"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPDF ? "Generating..." : "Save as PDF"}</span>
          </Button>

          <Button
            onClick={togglePrintPreview}
            variant="ghost"
            className="flex items-center gap-2"
          >
            {isPrintPreview ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Exit Preview</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </>
            )}
          </Button>
        </div>

        {/* Print Tips */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2 text-sm">Print Tips:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Use "Print to PDF" to save a digital copy</li>
            <li>
              • Select "More settings" → "Options" → "Headers and footers" for
              page numbers
            </li>
            <li>• Choose "A4" or "Letter" paper size for best results</li>
            <li>• Enable "Background graphics" to include styling</li>
          </ul>
        </div>

        {/* Print Preview Mode Indicator */}
        {isPrintPreview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg"
          >
            <div className="flex items-center gap-2 text-primary">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">
                Print Preview Mode Active
              </span>
            </div>
            <p className="text-xs text-primary/80 mt-1">
              The page is now optimized for printing. Scroll to see how it will
              look on paper.
            </p>
          </motion.div>
        )}
      </Card>

      {/* Print Preview Styles */}
      <style jsx global>{`
        .print-preview {
          background: #f5f5f5 !important;
        }

        .print-preview .article-content {
          background: white !important;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1) !important;
          margin: 2rem auto !important;
          max-width: 21cm !important;
          min-height: 29.7cm !important;
          padding: 2cm !important;
          font-family: "Times New Roman", Times, serif !important;
          font-size: 11pt !important;
          line-height: 1.6 !important;
          color: black !important;
        }

        .print-preview .no-print {
          opacity: 0.3 !important;
          pointer-events: none !important;
        }

        .print-preview h1,
        .print-preview h2,
        .print-preview h3,
        .print-preview h4,
        .print-preview h5,
        .print-preview h6 {
          color: black !important;
          font-weight: bold !important;
          page-break-after: avoid !important;
        }

        .print-preview pre,
        .print-preview code {
          font-family: "Courier New", Courier, monospace !important;
          background: #f8f8f8 !important;
          border: 1pt solid #ddd !important;
        }

        .print-preview blockquote {
          border-left: 3pt solid #ccc !important;
          background: #f9f9f9 !important;
          font-style: italic !important;
        }

        .print-preview table {
          border-collapse: collapse !important;
        }

        .print-preview th,
        .print-preview td {
          border: 1pt solid #333 !important;
          padding: 0.2cm !important;
        }

        .print-preview th {
          background: #f0f0f0 !important;
          font-weight: bold !important;
        }

        .print-preview img {
          max-width: 100% !important;
          height: auto !important;
          border: 1pt solid #ddd !important;
        }
      `}</style>
    </div>
  );
}
