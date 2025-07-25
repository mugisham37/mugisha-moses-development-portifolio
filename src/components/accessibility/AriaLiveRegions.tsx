"use client";

import { useEffect } from "react";
import { srOnly } from "@/lib/accessibility";

/**
 * ARIA live regions for dynamic content announcements
 * Provides screen reader announcements for dynamic updates
 */
export function AriaLiveRegions() {
  useEffect(() => {
    // Ensure live regions are properly initialized
    const politeRegion = document.getElementById("aria-live-polite");
    const assertiveRegion = document.getElementById("aria-live-assertive");

    if (!politeRegion || !assertiveRegion) {
      console.warn("ARIA live regions not properly initialized");
    }
  }, []);

  return (
    <>
      {/* Polite live region for non-urgent announcements */}
      <div
        id="aria-live-polite"
        aria-live="polite"
        aria-atomic="true"
        aria-relevant="additions text"
        className={srOnly}
      />

      {/* Assertive live region for urgent announcements */}
      <div
        id="aria-live-assertive"
        aria-live="assertive"
        aria-atomic="true"
        aria-relevant="additions text"
        className={srOnly}
      />

      {/* Status region for form feedback and loading states */}
      <div
        id="aria-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={srOnly}
      />

      {/* Alert region for error messages */}
      <div
        id="aria-alert"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className={srOnly}
      />
    </>
  );
}
