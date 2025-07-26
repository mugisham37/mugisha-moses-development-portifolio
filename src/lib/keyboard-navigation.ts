/**
 * Comprehensive keyboard navigation system
 * Implements WCAG 2.1 AA keyboard navigation standards
 */

export interface KeyboardNavigationConfig {
  // Navigation keys
  enableArrowKeys?: boolean;
  enableTabNavigation?: boolean;
  enableEnterActivation?: boolean;
  enableSpaceActivation?: boolean;
  enableEscapeClose?: boolean;

  // Custom key bindings
  customKeys?: Record<string, () => void>;

  // Focus management
  trapFocus?: boolean;
  restoreFocus?: boolean;
  skipDisabled?: boolean;

  // Roving tabindex
  useRovingTabindex?: boolean;
  orientation?: "horizontal" | "vertical" | "both";
}

export class KeyboardNavigationManager {
  private element: HTMLElement;
  private config: KeyboardNavigationConfig;
  private focusableElements: HTMLElement[] = [];
  private currentIndex: number = -1;
  private originalTabIndices: Map<HTMLElement, string> = new Map();
  private isActive: boolean = false;

  constructor(element: HTMLElement, config: KeyboardNavigationConfig = {}) {
    this.element = element;
    this.config = {
      enableArrowKeys: true,
      enableTabNavigation: true,
      enableEnterActivation: true,
      enableSpaceActivation: true,
      enableEscapeClose: false,
      trapFocus: false,
      restoreFocus: true,
      skipDisabled: true,
      useRovingTabindex: false,
      orientation: "both",
      ...config,
    };

    this.init();
  }

  private init(): void {
    this.updateFocusableElements();
    this.setupEventListeners();

    if (this.config.useRovingTabindex) {
      this.setupRovingTabindex();
    }
  }

  private updateFocusableElements(): void {
    const selector = [
      "button:not([disabled])",
      "[href]:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"]):not([disabled])',
      "[contenteditable]:not([disabled])",
      "audio[controls]:not([disabled])",
      "video[controls]:not([disabled])",
    ].join(", ");

    this.focusableElements = Array.from(
      this.element.querySelectorAll(selector)
    ).filter((el): el is HTMLElement => {
      const element = el as HTMLElement;
      return (
        this.isVisible(element) &&
        (!this.config.skipDisabled || !element.hasAttribute("disabled"))
      );
    });
  }

  private isVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      element.offsetWidth > 0 &&
      element.offsetHeight > 0
    );
  }

  private setupEventListeners(): void {
    this.element.addEventListener("keydown", this.handleKeyDown.bind(this));
    this.element.addEventListener("focusin", this.handleFocusIn.bind(this));
    this.element.addEventListener("focusout", this.handleFocusOut.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const { key, shiftKey, ctrlKey, altKey, metaKey } = event;

    // Handle custom key bindings first
    if (this.config.customKeys) {
      const keyCombo = [
        ctrlKey && "Ctrl",
        altKey && "Alt",
        metaKey && "Meta",
        shiftKey && "Shift",
        key,
      ]
        .filter(Boolean)
        .join("+");

      if (this.config.customKeys[keyCombo]) {
        event.preventDefault();
        this.config.customKeys[keyCombo]();
        return;
      }
    }

    switch (key) {
      case "Tab":
        if (this.config.trapFocus) {
          this.handleTabNavigation(event);
        }
        break;

      case "ArrowUp":
      case "ArrowDown":
        if (
          this.config.enableArrowKeys &&
          (this.config.orientation === "vertical" ||
            this.config.orientation === "both")
        ) {
          event.preventDefault();
          this.handleArrowNavigation(key === "ArrowUp" ? -1 : 1);
        }
        break;

      case "ArrowLeft":
      case "ArrowRight":
        if (
          this.config.enableArrowKeys &&
          (this.config.orientation === "horizontal" ||
            this.config.orientation === "both")
        ) {
          event.preventDefault();
          this.handleArrowNavigation(key === "ArrowLeft" ? -1 : 1);
        }
        break;

      case "Home":
        if (this.config.enableArrowKeys) {
          event.preventDefault();
          this.focusFirst();
        }
        break;

      case "End":
        if (this.config.enableArrowKeys) {
          event.preventDefault();
          this.focusLast();
        }
        break;

      case "Enter":
        if (this.config.enableEnterActivation) {
          this.handleActivation(event);
        }
        break;

      case " ":
        if (this.config.enableSpaceActivation) {
          // Only prevent default for buttons and custom controls
          const target = event.target as HTMLElement;
          if (target.tagName === "BUTTON" || target.hasAttribute("role")) {
            event.preventDefault();
            this.handleActivation(event);
          }
        }
        break;

      case "Escape":
        if (this.config.enableEscapeClose) {
          event.preventDefault();
          this.handleEscape();
        }
        break;
    }
  }

  private handleTabNavigation(event: KeyboardEvent): void {
    if (this.focusableElements.length === 0) return;

    const firstElement = this.focusableElements[0];
    const lastElement =
      this.focusableElements[this.focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement;

    if (event.shiftKey) {
      // Shift + Tab (backward)
      if (activeElement === firstElement && lastElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab (forward)
      if (activeElement === lastElement && firstElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  private handleArrowNavigation(direction: number): void {
    this.updateFocusableElements();

    if (this.focusableElements.length === 0) return;

    const activeElement = document.activeElement as HTMLElement;
    let currentIndex = this.focusableElements.indexOf(activeElement);

    if (currentIndex === -1) {
      currentIndex = 0;
    } else {
      currentIndex += direction;

      // Wrap around
      if (currentIndex < 0) {
        currentIndex = this.focusableElements.length - 1;
      } else if (currentIndex >= this.focusableElements.length) {
        currentIndex = 0;
      }
    }

    this.focusableElements[currentIndex]?.focus();
    this.currentIndex = currentIndex;
  }

  private handleActivation(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;

    if (target.tagName === "BUTTON") {
      target.click();
    } else if (target.tagName === "A") {
      target.click();
    } else if (target.hasAttribute("role")) {
      // Handle custom interactive elements
      const role = target.getAttribute("role");
      if (
        ["button", "link", "menuitem", "tab", "option"].includes(role || "")
      ) {
        target.click();
      }
    }
  }

  private handleEscape(): void {
    // Emit custom escape event
    const escapeEvent = new CustomEvent("keyboardEscape", {
      bubbles: true,
      cancelable: true,
    });
    this.element.dispatchEvent(escapeEvent);
  }

  private handleFocusIn(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    if (this.focusableElements.includes(target)) {
      this.currentIndex = this.focusableElements.indexOf(target);
      this.isActive = true;
    }
  }

  private handleFocusOut(event: FocusEvent): void {
    // Check if focus is moving outside the container
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (!relatedTarget || !this.element.contains(relatedTarget)) {
      this.isActive = false;
    }
  }

  private setupRovingTabindex(): void {
    // Save original tabindex values
    this.focusableElements.forEach((element) => {
      const tabIndex = element.getAttribute("tabindex");
      this.originalTabIndices.set(element, tabIndex || "");

      // Set all elements to tabindex="-1" except the first one
      element.setAttribute("tabindex", "-1");
    });

    // Set first element to tabindex="0"
    const firstElement = this.focusableElements[0];
    if (firstElement) {
      firstElement.setAttribute("tabindex", "0");
      this.currentIndex = 0;
    }
  }

  private updateRovingTabindex(newIndex: number): void {
    if (!this.config.useRovingTabindex) return;

    // Remove tabindex="0" from current element
    const currentElement = this.focusableElements[this.currentIndex];
    if (this.currentIndex >= 0 && currentElement) {
      currentElement.setAttribute("tabindex", "-1");
    }

    // Set tabindex="0" on new element
    const newElement = this.focusableElements[newIndex];
    if (newIndex >= 0 && newElement) {
      newElement.setAttribute("tabindex", "0");
    }

    this.currentIndex = newIndex;
  }

  // Public methods
  public focusFirst(): void {
    const firstElement = this.focusableElements[0];
    if (firstElement) {
      firstElement.focus();
      if (this.config.useRovingTabindex) {
        this.updateRovingTabindex(0);
      }
    }
  }

  public focusLast(): void {
    const lastIndex = this.focusableElements.length - 1;
    const lastElement = this.focusableElements[lastIndex];
    if (lastElement) {
      lastElement.focus();
      if (this.config.useRovingTabindex) {
        this.updateRovingTabindex(lastIndex);
      }
    }
  }

  public focusNext(): void {
    this.handleArrowNavigation(1);
  }

  public focusPrevious(): void {
    this.handleArrowNavigation(-1);
  }

  public refresh(): void {
    this.updateFocusableElements();
    if (this.config.useRovingTabindex) {
      this.setupRovingTabindex();
    }
  }

  public destroy(): void {
    // Restore original tabindex values
    this.originalTabIndices.forEach((originalValue, element) => {
      if (originalValue) {
        element.setAttribute("tabindex", originalValue);
      } else {
        element.removeAttribute("tabindex");
      }
    });

    // Remove event listeners
    this.element.removeEventListener("keydown", this.handleKeyDown.bind(this));
    this.element.removeEventListener("focusin", this.handleFocusIn.bind(this));
    this.element.removeEventListener(
      "focusout",
      this.handleFocusOut.bind(this)
    );
  }

  // Getters
  public get currentFocusIndex(): number {
    return this.currentIndex;
  }

  public get focusableElementsCount(): number {
    return this.focusableElements.length;
  }

  public get isNavigationActive(): boolean {
    return this.isActive;
  }
}

// Keyboard shortcuts manager
export class KeyboardShortcutsManager {
  private shortcuts: Map<string, () => void> = new Map();
  private isEnabled: boolean = true;

  constructor() {
    this.setupGlobalListener();
  }

  private setupGlobalListener(): void {
    document.addEventListener("keydown", this.handleGlobalKeyDown.bind(this));
  }

  private handleGlobalKeyDown(event: KeyboardEvent): void {
    if (!this.isEnabled) return;

    const { key, ctrlKey, altKey, metaKey, shiftKey } = event;

    // Don't trigger shortcuts when typing in form fields
    const target = event.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.contentEditable === "true"
    ) {
      return;
    }

    const keyCombo = [
      ctrlKey && "Ctrl",
      altKey && "Alt",
      metaKey && "Meta",
      shiftKey && "Shift",
      key,
    ]
      .filter(Boolean)
      .join("+");

    const handler = this.shortcuts.get(keyCombo);
    if (handler) {
      event.preventDefault();
      handler();
    }
  }

  public addShortcut(keyCombo: string, handler: () => void): void {
    this.shortcuts.set(keyCombo, handler);
  }

  public removeShortcut(keyCombo: string): void {
    this.shortcuts.delete(keyCombo);
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }

  public destroy(): void {
    document.removeEventListener(
      "keydown",
      this.handleGlobalKeyDown.bind(this)
    );
    this.shortcuts.clear();
  }
}

// Focus indicator utilities
export class FocusIndicatorManager {
  private static instance: FocusIndicatorManager;
  private isKeyboardUser: boolean = false;
  private lastInteractionWasKeyboard: boolean = false;

  private constructor() {
    this.setupEventListeners();
    this.injectStyles();
  }

  static getInstance(): FocusIndicatorManager {
    if (!FocusIndicatorManager.instance) {
      FocusIndicatorManager.instance = new FocusIndicatorManager();
    }
    return FocusIndicatorManager.instance;
  }

  private setupEventListeners(): void {
    // Track keyboard usage
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Tab" ||
        event.key.startsWith("Arrow") ||
        event.key === "Enter" ||
        event.key === " "
      ) {
        this.isKeyboardUser = true;
        this.lastInteractionWasKeyboard = true;
        document.body.classList.add("keyboard-user");
        document.body.classList.remove("mouse-user");
      }
    });

    // Track mouse usage
    document.addEventListener("mousedown", () => {
      this.lastInteractionWasKeyboard = false;
      document.body.classList.add("mouse-user");
      document.body.classList.remove("keyboard-user");
    });

    // Track touch usage
    document.addEventListener("touchstart", () => {
      this.lastInteractionWasKeyboard = false;
      document.body.classList.add("touch-user");
      document.body.classList.remove("keyboard-user");
    });
  }

  private injectStyles(): void {
    const styleId = "focus-indicator-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      /* Hide focus indicators for mouse users */
      .mouse-user *:focus,
      .touch-user *:focus {
        outline: none !important;
        box-shadow: none !important;
      }

      /* Enhanced focus indicators for keyboard users */
      .keyboard-user *:focus {
        outline: 2px solid var(--ring, #3b82f6) !important;
        outline-offset: 2px !important;
        border-radius: 4px;
      }

      /* High contrast focus indicators */
      @media (prefers-contrast: high) {
        .keyboard-user *:focus {
          outline: 3px solid var(--ring, #000) !important;
          outline-offset: 2px !important;
          background-color: var(--focus-bg, #ffff00) !important;
          color: var(--focus-text, #000) !important;
        }
      }

      /* Reduced motion focus indicators */
      @media (prefers-reduced-motion: reduce) {
        .keyboard-user *:focus {
          transition: none !important;
        }
      }

      /* Custom focus styles for specific elements */
      .keyboard-user button:focus,
      .keyboard-user [role="button"]:focus {
        outline: 2px solid var(--ring, #3b82f6) !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
      }

      .keyboard-user a:focus {
        outline: 2px solid var(--ring, #3b82f6) !important;
        outline-offset: 2px !important;
        text-decoration: underline !important;
      }

      .keyboard-user input:focus,
      .keyboard-user textarea:focus,
      .keyboard-user select:focus {
        outline: 2px solid var(--ring, #3b82f6) !important;
        outline-offset: 0 !important;
        border-color: var(--ring, #3b82f6) !important;
      }
    `;

    document.head.appendChild(style);
  }

  public get isUsingKeyboard(): boolean {
    return this.isKeyboardUser;
  }

  public get wasLastInteractionKeyboard(): boolean {
    return this.lastInteractionWasKeyboard;
  }
}

// Initialize focus indicator manager
if (typeof window !== "undefined") {
  FocusIndicatorManager.getInstance();
}

// Utility functions
export function createKeyboardNavigationManager(
  element: HTMLElement,
  config?: KeyboardNavigationConfig
): KeyboardNavigationManager {
  return new KeyboardNavigationManager(element, config);
}

export function setupGlobalKeyboardShortcuts(): KeyboardShortcutsManager {
  return new KeyboardShortcutsManager();
}

export function isKeyboardUser(): boolean {
  return FocusIndicatorManager.getInstance().isUsingKeyboard;
}
