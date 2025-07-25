"use client";

import { createAriaAttributes } from "@/lib/accessibility";

/**
 * Skip links component for keyboard navigation accessibility
 * Provides quick navigation to main content areas
 */
export function SkipLinks() {
  const skipLinks = [
    { href: "#main-content", label: "Skip to main content" },
    { href: "#navigation", label: "Skip to navigation" },
    { href: "#footer", label: "Skip to footer" },
    { href: "#search", label: "Skip to search" },
  ];

  return (
    <div className="skip-links">
      {skipLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="skip-link"
          {...createAriaAttributes.skipLink(link.href.replace("#", ""))}
        >
          {link.label}
        </a>
      ))}

      <style jsx>{`
        .skip-links {
          position: absolute;
          top: -100vh;
          left: 0;
          z-index: 9999;
        }

        .skip-link {
          position: absolute;
          top: -100vh;
          left: 0;
          background: var(--background);
          color: var(--foreground);
          padding: 0.75rem 1rem;
          text-decoration: none;
          border: 2px solid var(--primary);
          border-radius: 0.25rem;
          font-weight: 600;
          white-space: nowrap;
          transform: translateY(-100%);
          transition: transform 0.2s ease-in-out;
        }

        .skip-link:focus {
          position: fixed;
          top: 1rem;
          left: 1rem;
          transform: translateY(0);
          outline: 2px solid var(--ring);
          outline-offset: 2px;
        }

        .skip-link:hover:focus {
          background: var(--primary);
          color: var(--primary-foreground);
        }
      `}</style>
    </div>
  );
}
