"use client";

import React, { useEffect, useState } from "react";
import { HeadingHierarchy } from "@/lib/accessibility";

interface AccessibilityIssue {
  type: "error" | "warning" | "info";
  message: string;
  element?: string;
  fix?: string;
}

/**
 * Development-only component for validating accessibility implementation
 * Checks for common ARIA and semantic HTML issues
 */
export function AccessibilityValidator() {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== "development") return;

    const validateAccessibility = () => {
      const foundIssues: AccessibilityIssue[] = [];

      // Check for missing alt text on images
      const images = document.querySelectorAll("img");
      images.forEach((img, index) => {
        if (!img.hasAttribute("alt")) {
          foundIssues.push({
            type: "error",
            message: `Image missing alt attribute`,
            element: `img[${index}]`,
            fix: 'Add alt="" for decorative images or descriptive alt text for informative images',
          });
        }
      });

      // Check for missing form labels
      const inputs = document.querySelectorAll("input, select, textarea");
      inputs.forEach((input, index) => {
        const hasLabel =
          input.hasAttribute("aria-label") ||
          input.hasAttribute("aria-labelledby") ||
          document.querySelector(`label[for="${input.id}"]`);

        if (!hasLabel) {
          foundIssues.push({
            type: "error",
            message: `Form control missing label`,
            element: `${input.tagName.toLowerCase()}[${index}]`,
            fix: "Add aria-label, aria-labelledby, or associate with a <label> element",
          });
        }
      });

      // Check for missing ARIA landmarks
      const hasMain = document.querySelector('main, [role="main"]');
      if (!hasMain) {
        foundIssues.push({
          type: "error",
          message: "Page missing main landmark",
          fix: 'Add <main> element or role="main" to identify main content area',
        });
      }

      const hasNavigation = document.querySelector('nav, [role="navigation"]');
      if (!hasNavigation) {
        foundIssues.push({
          type: "warning",
          message: "Page missing navigation landmark",
          fix: 'Add <nav> element or role="navigation" for main navigation',
        });
      }

      // Check for proper heading hierarchy
      const headingStructure = HeadingHierarchy.getHeadingStructure();
      if (headingStructure.length === 0) {
        foundIssues.push({
          type: "warning",
          message: "No headings found on page",
          fix: "Add heading elements (h1-h6) to structure content",
        });
      } else if (!headingStructure.some((h) => h.level === 1)) {
        foundIssues.push({
          type: "error",
          message: "Page missing h1 element",
          fix: "Add exactly one h1 element as the main page heading",
        });
      }

      // Check for buttons without accessible names
      const buttons = document.querySelectorAll("button");
      buttons.forEach((button, index) => {
        const hasAccessibleName =
          button.textContent?.trim() ||
          button.hasAttribute("aria-label") ||
          button.hasAttribute("aria-labelledby") ||
          button.querySelector("img[alt]");

        if (!hasAccessibleName) {
          foundIssues.push({
            type: "error",
            message: `Button missing accessible name`,
            element: `button[${index}]`,
            fix: "Add text content, aria-label, or aria-labelledby attribute",
          });
        }
      });

      // Check for links without accessible names
      const links = document.querySelectorAll("a[href]");
      links.forEach((link, index) => {
        const hasAccessibleName =
          link.textContent?.trim() ||
          link.hasAttribute("aria-label") ||
          link.hasAttribute("aria-labelledby") ||
          link.querySelector("img[alt]");

        if (!hasAccessibleName) {
          foundIssues.push({
            type: "error",
            message: `Link missing accessible name`,
            element: `a[${index}]`,
            fix: "Add text content, aria-label, or aria-labelledby attribute",
          });
        }
      });

      // Check for missing skip links
      const skipLinks = document.querySelectorAll('a[href^="#"]');
      const hasSkipToMain = Array.from(skipLinks).some(
        (link) =>
          link.getAttribute("href") === "#main-content" ||
          link.textContent?.toLowerCase().includes("skip to main")
      );

      if (!hasSkipToMain) {
        foundIssues.push({
          type: "warning",
          message: "Missing skip to main content link",
          fix: 'Add skip link as first focusable element: <a href="#main-content">Skip to main content</a>',
        });
      }

      // Check for ARIA live regions
      const liveRegions = document.querySelectorAll(
        '[aria-live], [role="status"], [role="alert"]'
      );
      if (liveRegions.length === 0) {
        foundIssues.push({
          type: "info",
          message: "No ARIA live regions found",
          fix: "Consider adding live regions for dynamic content updates",
        });
      }

      // Check for focus indicators
      const focusableElements = document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      let hasFocusStyles = false;
      focusableElements.forEach((element) => {
        const styles = window.getComputedStyle(element, ":focus");
        if (styles.outline !== "none" || styles.boxShadow !== "none") {
          hasFocusStyles = true;
        }
      });

      if (!hasFocusStyles && focusableElements.length > 0) {
        foundIssues.push({
          type: "warning",
          message: "Focus indicators may be missing",
          fix: "Ensure all focusable elements have visible focus indicators",
        });
      }

      setIssues(foundIssues);
    };

    // Run validation after a delay to allow DOM to settle
    const timeoutId = setTimeout(validateAccessibility, 1000);

    // Re-run validation when DOM changes
    const observer = new MutationObserver(() => {
      clearTimeout(timeoutId);
      setTimeout(validateAccessibility, 500);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        "aria-label",
        "aria-labelledby",
        "aria-describedby",
        "alt",
        "role",
      ],
    });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // Don't render in production
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const errorCount = issues.filter((issue) => issue.type === "error").length;
  const warningCount = issues.filter(
    (issue) => issue.type === "warning"
  ).length;

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
          transition-all duration-200 shadow-lg
          ${
            errorCount > 0
              ? "bg-red-500 text-white hover:bg-red-600"
              : warningCount > 0
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-green-500 text-white hover:bg-green-600"
          }
        `}
        aria-label={`Accessibility validator: ${errorCount} errors, ${warningCount} warnings`}
      >
        <span>♿</span>
        <span>{errorCount + warningCount}</span>
      </button>

      {/* Issues Panel */}
      {isVisible && (
        <div className="absolute bottom-12 right-0 w-96 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Accessibility Issues
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {errorCount} errors, {warningCount} warnings,{" "}
              {issues.filter((i) => i.type === "info").length} info
            </p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {issues.length === 0 ? (
              <div className="p-4 text-center text-green-600 dark:text-green-400">
                <span className="text-2xl">✅</span>
                <p className="mt-2">No accessibility issues found!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {issues.map((issue, index) => (
                  <div key={index} className="p-4">
                    <div className="flex items-start space-x-2">
                      <span
                        className={`
                        flex-shrink-0 w-2 h-2 rounded-full mt-2
                        ${
                          issue.type === "error"
                            ? "bg-red-500"
                            : issue.type === "warning"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }
                      `}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {issue.message}
                        </p>
                        {issue.element && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Element: {issue.element}
                          </p>
                        )}
                        {issue.fix && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                            Fix: {issue.fix}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <button
              onClick={() => setIsVisible(false)}
              className="w-full px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
