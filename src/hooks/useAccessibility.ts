"use client";

import { useEffect, useCallback, useRef } from "react";
import { liveAnnouncer, FocusManager } from "@/lib/accessibility";

/**
 * Custom hook for accessibility features
 * Provides utilities for ARIA announcements, focus management, and keyboard navigation
 */
export function useAccessibility() {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Announce messages to screen readers
  const announce = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      liveAnnouncer?.announce(message, priority);
    },
    []
  );

  // Clear announcements
  const clearAnnouncements = useCallback(
    (priority?: "polite" | "assertive") => {
      liveAnnouncer?.clear(priority);
    },
    []
  );

  // Save current focus
  const saveFocus = useCallback(() => {
    FocusManager.saveFocus();
  }, []);

  // Restore previously saved focus
  const restoreFocus = useCallback(() => {
    FocusManager.restoreFocus();
  }, []);

  // Trap focus within a container
  const trapFocus = useCallback((container: HTMLElement) => {
    return FocusManager.trapFocus(container);
  }, []);

  // Focus first focusable element in container
  const focusFirst = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, []);

  // Focus last focusable element in container
  const focusLast = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }, []);

  // Handle keyboard navigation
  const handleKeyboardNavigation = useCallback(
    (
      event: KeyboardEvent,
      options: {
        onEscape?: () => void;
        onEnter?: () => void;
        onSpace?: () => void;
        onArrowUp?: () => void;
        onArrowDown?: () => void;
        onArrowLeft?: () => void;
        onArrowRight?: () => void;
        onTab?: (shiftKey: boolean) => void;
      }
    ) => {
      const { key, shiftKey } = event;

      switch (key) {
        case "Escape":
          options.onEscape?.();
          break;
        case "Enter":
          options.onEnter?.();
          break;
        case " ":
          options.onSpace?.();
          break;
        case "ArrowUp":
          options.onArrowUp?.();
          break;
        case "ArrowDown":
          options.onArrowDown?.();
          break;
        case "ArrowLeft":
          options.onArrowLeft?.();
          break;
        case "ArrowRight":
          options.onArrowRight?.();
          break;
        case "Tab":
          options.onTab?.(shiftKey);
          break;
      }
    },
    []
  );

  // Check if user prefers reduced motion
  const prefersReducedMotion = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Check if user prefers high contrast
  const prefersHighContrast = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-contrast: high)").matches;
  }, []);

  // Get user's color scheme preference
  const getColorSchemePreference = useCallback(() => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, []);

  // Announce page changes for SPA navigation
  const announcePageChange = useCallback(
    (pageName: string) => {
      announce(`Navigated to ${pageName} page`, "polite");
    },
    [announce]
  );

  // Announce loading states
  const announceLoading = useCallback(
    (isLoading: boolean, context?: string) => {
      if (isLoading) {
        announce(`Loading${context ? ` ${context}` : ""}...`, "polite");
      } else {
        announce(`Finished loading${context ? ` ${context}` : ""}`, "polite");
      }
    },
    [announce]
  );

  // Announce form validation errors
  const announceFormError = useCallback(
    (errors: string[]) => {
      if (errors.length === 1) {
        announce(`Form error: ${errors[0]}`, "assertive");
      } else if (errors.length > 1) {
        announce(
          `Form has ${errors.length} errors. Please review and correct them.`,
          "assertive"
        );
      }
    },
    [announce]
  );

  // Announce form success
  const announceFormSuccess = useCallback(
    (message: string) => {
      announce(`Success: ${message}`, "polite");
    },
    [announce]
  );

  return {
    // Announcement functions
    announce,
    clearAnnouncements,
    announcePageChange,
    announceLoading,
    announceFormError,
    announceFormSuccess,

    // Focus management
    saveFocus,
    restoreFocus,
    trapFocus,
    focusFirst,
    focusLast,

    // Keyboard navigation
    handleKeyboardNavigation,

    // User preferences
    prefersReducedMotion,
    prefersHighContrast,
    getColorSchemePreference,
  };
}

/**
 * Hook for managing modal accessibility
 */
export function useModalAccessibility(isOpen: boolean) {
  const { saveFocus, restoreFocus, trapFocus, announce } = useAccessibility();
  const modalRef = useRef<HTMLElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Save current focus and announce modal opening
      saveFocus();
      announce("Modal dialog opened", "polite");

      // Trap focus in modal
      if (modalRef.current) {
        cleanupRef.current = trapFocus(modalRef.current);
      }

      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      // Restore focus and announce modal closing
      restoreFocus();
      announce("Modal dialog closed", "polite");

      // Cleanup focus trap
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      // Restore body scroll
      document.body.style.overflow = "unset";
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      document.body.style.overflow = "unset";
    };
  }, [isOpen, saveFocus, restoreFocus, trapFocus, announce]);

  return { modalRef };
}

/**
 * Hook for managing form accessibility
 */
export function useFormAccessibility() {
  const { announceFormError, announceFormSuccess, announce } =
    useAccessibility();

  const announceFieldError = useCallback(
    (fieldName: string, error: string) => {
      announce(`${fieldName}: ${error}`, "assertive");
    },
    [announce]
  );

  const announceFieldSuccess = useCallback(
    (fieldName: string) => {
      announce(`${fieldName} is valid`, "polite");
    },
    [announce]
  );

  const announceFormSubmission = useCallback(() => {
    announce("Form submitted successfully", "polite");
  }, [announce]);

  const announceFormReset = useCallback(() => {
    announce("Form has been reset", "polite");
  }, [announce]);

  return {
    announceFormError,
    announceFormSuccess,
    announceFieldError,
    announceFieldSuccess,
    announceFormSubmission,
    announceFormReset,
  };
}

/**
 * Hook for managing navigation accessibility
 */
export function useNavigationAccessibility() {
  const { announce, handleKeyboardNavigation } = useAccessibility();

  const announceNavigation = useCallback(
    (destination: string, isCurrent: boolean = false) => {
      if (isCurrent) {
        announce(`Currently on ${destination}`, "polite");
      } else {
        announce(`Navigating to ${destination}`, "polite");
      }
    },
    [announce]
  );

  const handleMenuKeyboard = useCallback(
    (
      event: KeyboardEvent,
      menuItems: HTMLElement[],
      currentIndex: number,
      onIndexChange: (index: number) => void,
      onSelect: () => void,
      onClose: () => void
    ) => {
      handleKeyboardNavigation(event, {
        onEscape: onClose,
        onEnter: onSelect,
        onSpace: onSelect,
        onArrowUp: () => {
          event.preventDefault();
          const newIndex =
            currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
          onIndexChange(newIndex);
          menuItems[newIndex]?.focus();
        },
        onArrowDown: () => {
          event.preventDefault();
          const newIndex =
            currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
          onIndexChange(newIndex);
          menuItems[newIndex]?.focus();
        },
      });
    },
    [handleKeyboardNavigation]
  );

  return {
    announceNavigation,
    handleMenuKeyboard,
  };
}
