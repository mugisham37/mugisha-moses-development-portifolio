/**
 * Accessibility utilities for semantic HTML and ARIA implementation
 * Implements WCAG 2.1 AA standards and best practices
 */

// ARIA landmark roles
export const ARIA_LANDMARKS = {
  BANNER: "banner",
  NAVIGATION: "navigation",
  MAIN: "main",
  COMPLEMENTARY: "complementary",
  CONTENTINFO: "contentinfo",
  SEARCH: "search",
  REGION: "region",
  FORM: "form",
  APPLICATION: "application",
} as const;

// ARIA live region politeness levels
export const ARIA_LIVE = {
  OFF: "off",
  POLITE: "polite",
  ASSERTIVE: "assertive",
} as const;

// Common ARIA attributes interface
export interface AriaAttributes {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-expanded"?: boolean;
  "aria-hidden"?: boolean;
  "aria-live"?: keyof typeof ARIA_LIVE;
  "aria-atomic"?: boolean;
  "aria-relevant"?: string;
  "aria-busy"?: boolean;
  "aria-current"?:
    | "page"
    | "step"
    | "location"
    | "date"
    | "time"
    | "true"
    | "false";
  "aria-disabled"?: boolean;
  "aria-invalid"?: boolean | "grammar" | "spelling";
  "aria-required"?: boolean;
  "aria-selected"?: boolean;
  "aria-checked"?: boolean | "mixed";
  "aria-pressed"?: boolean | "mixed";
  "aria-controls"?: string;
  "aria-owns"?: string;
  "aria-activedescendant"?: string;
  "aria-haspopup"?: boolean | "menu" | "listbox" | "tree" | "grid" | "dialog";
  "aria-level"?: number;
  "aria-posinset"?: number;
  "aria-setsize"?: number;
  "aria-valuemin"?: number;
  "aria-valuemax"?: number;
  "aria-valuenow"?: number;
  "aria-valuetext"?: string;
  role?: string;
}

// Screen reader only text utility
export const srOnly =
  "sr-only absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0";

// Generate unique IDs for ARIA relationships
export const generateId = (prefix: string = "aria"): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Create ARIA live region announcer
export class AriaLiveAnnouncer {
  private static instance: AriaLiveAnnouncer;
  private politeRegion: HTMLElement | null = null;
  private assertiveRegion: HTMLElement | null = null;

  private constructor() {
    if (typeof window !== "undefined") {
      this.createLiveRegions();
    }
  }

  static getInstance(): AriaLiveAnnouncer {
    if (!AriaLiveAnnouncer.instance) {
      AriaLiveAnnouncer.instance = new AriaLiveAnnouncer();
    }
    return AriaLiveAnnouncer.instance;
  }

  private createLiveRegions(): void {
    // Create polite live region
    this.politeRegion = document.createElement("div");
    this.politeRegion.setAttribute("aria-live", "polite");
    this.politeRegion.setAttribute("aria-atomic", "true");
    this.politeRegion.className = srOnly;
    this.politeRegion.id = "aria-live-polite";
    document.body.appendChild(this.politeRegion);

    // Create assertive live region
    this.assertiveRegion = document.createElement("div");
    this.assertiveRegion.setAttribute("aria-live", "assertive");
    this.assertiveRegion.setAttribute("aria-atomic", "true");
    this.assertiveRegion.className = srOnly;
    this.assertiveRegion.id = "aria-live-assertive";
    document.body.appendChild(this.assertiveRegion);
  }

  announce(message: string, priority: "polite" | "assertive" = "polite"): void {
    if (typeof window === "undefined") return;

    const region =
      priority === "assertive" ? this.assertiveRegion : this.politeRegion;
    if (region) {
      // Clear previous message
      region.textContent = "";
      // Add new message after a brief delay to ensure screen readers pick it up
      setTimeout(() => {
        region.textContent = message;
      }, 100);
    }
  }

  clear(priority?: "polite" | "assertive"): void {
    if (typeof window === "undefined") return;

    if (priority === "assertive" && this.assertiveRegion) {
      this.assertiveRegion.textContent = "";
    } else if (priority === "polite" && this.politeRegion) {
      this.politeRegion.textContent = "";
    } else {
      // Clear both if no priority specified
      if (this.politeRegion) this.politeRegion.textContent = "";
      if (this.assertiveRegion) this.assertiveRegion.textContent = "";
    }
  }
}

// Utility functions for common ARIA patterns
export const createAriaAttributes = {
  // Button with expanded state (for dropdowns, accordions)
  expandableButton: (expanded: boolean, controls?: string): AriaAttributes => ({
    "aria-expanded": expanded,
    "aria-haspopup": true,
    ...(controls && { "aria-controls": controls }),
  }),

  // Form field with validation
  formField: (
    labelId?: string,
    descriptionId?: string,
    errorId?: string,
    required: boolean = false,
    invalid: boolean = false
  ): AriaAttributes => ({
    ...(labelId && { "aria-labelledby": labelId }),
    ...(descriptionId && { "aria-describedby": descriptionId }),
    ...(errorId &&
      invalid && {
        "aria-describedby": `${
          descriptionId ? descriptionId + " " : ""
        }${errorId}`,
      }),
    "aria-required": required,
    "aria-invalid": invalid,
  }),

  // Tab panel
  tabPanel: (labelledBy: string, selected: boolean): AriaAttributes => ({
    role: "tabpanel",
    "aria-labelledby": labelledBy,
    "aria-hidden": !selected,
  }),

  // Tab button
  tab: (controls: string, selected: boolean): AriaAttributes => ({
    role: "tab",
    "aria-controls": controls,
    "aria-selected": selected,
  }),

  // Dialog/Modal
  dialog: (labelledBy?: string, describedBy?: string): AriaAttributes => ({
    role: "dialog",
    "aria-modal": true,
    ...(labelledBy && { "aria-labelledby": labelledBy }),
    ...(describedBy && { "aria-describedby": describedBy }),
  }),

  // Loading state
  loading: (label: string = "Loading"): AriaAttributes => ({
    "aria-label": label,
    "aria-busy": true,
    "aria-live": "polite",
  }),

  // Progress indicator
  progress: (
    value: number,
    min: number = 0,
    max: number = 100,
    text?: string
  ): AriaAttributes => ({
    role: "progressbar",
    "aria-valuemin": min,
    "aria-valuemax": max,
    "aria-valuenow": value,
    ...(text && { "aria-valuetext": text }),
  }),

  // Skip link
  skipLink: (target: string): AriaAttributes => ({
    "aria-label": `Skip to ${target}`,
    href: `#${target}`,
  }),

  // Breadcrumb navigation
  breadcrumb: (): AriaAttributes => ({
    "aria-label": "Breadcrumb navigation",
    role: "navigation",
  }),

  // Current page in navigation
  currentPage: (): AriaAttributes => ({
    "aria-current": "page",
  }),

  // Search landmark
  search: (label: string = "Search"): AriaAttributes => ({
    role: "search",
    "aria-label": label,
  }),

  // Status message
  status: (message: string): AriaAttributes => ({
    role: "status",
    "aria-live": "polite",
    "aria-atomic": true,
  }),

  // Alert message
  alert: (message: string): AriaAttributes => ({
    role: "alert",
    "aria-live": "assertive",
    "aria-atomic": true,
  }),
};

// Heading hierarchy validator
export class HeadingHierarchy {
  private static currentLevel: number = 0;
  private static headings: Array<{ level: number; text: string; id?: string }> =
    [];

  static validateLevel(level: number, text: string, id?: string): boolean {
    // H1 should only appear once and be the first heading
    if (level === 1) {
      if (this.headings.some((h) => h.level === 1)) {
        console.warn(
          "Multiple H1 elements detected. Only one H1 should exist per page."
        );
        return false;
      }
      this.currentLevel = 1;
    } else {
      // Subsequent headings should not skip levels
      if (level > this.currentLevel + 1) {
        console.warn(
          `Heading level ${level} follows level ${
            this.currentLevel
          }. Consider using level ${this.currentLevel + 1} instead.`
        );
        return false;
      }
      this.currentLevel = level;
    }

    this.headings.push({ level, text, id });
    return true;
  }

  static getHeadingStructure(): Array<{
    level: number;
    text: string;
    id?: string;
  }> {
    return [...this.headings];
  }

  static reset(): void {
    this.currentLevel = 0;
    this.headings = [];
  }
}

// Alt text generator for different image types
export const generateAltText = {
  decorative: () => "", // Empty alt for decorative images

  informative: (description: string) => description,

  functional: (action: string) => action, // e.g., "Search", "Close menu"

  complex: (summary: string, detailsId?: string) =>
    detailsId
      ? `${summary}. Full description available in text following this image.`
      : summary,

  chart: (type: string, data: string) => `${type} chart showing ${data}`,

  avatar: (name: string) => `Profile picture of ${name}`,

  logo: (company: string) => `${company} logo`,

  screenshot: (description: string) => `Screenshot: ${description}`,

  icon: (meaning: string) => meaning, // e.g., "Warning", "Success", "External link"
};

// Focus management utilities
export class FocusManager {
  private static focusHistory: HTMLElement[] = [];

  static saveFocus(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement !== document.body) {
      this.focusHistory.push(activeElement);
    }
  }

  static restoreFocus(): void {
    const lastFocused = this.focusHistory.pop();
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  static trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    container.addEventListener("keydown", handleTabKey);

    // Focus first element
    firstElement?.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener("keydown", handleTabKey);
    };
  }
}

// Export the live announcer instance
export const liveAnnouncer =
  typeof window !== "undefined" ? AriaLiveAnnouncer.getInstance() : null;
