"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import {
  KeyboardNavigationManager,
  KeyboardShortcutsManager,
  KeyboardNavigationConfig,
  createKeyboardNavigationManager,
  setupGlobalKeyboardShortcuts,
} from "@/lib/keyboard-navigation";
import { liveAnnouncer } from "@/lib/accessibility";

/**
 * Hook for managing keyboard navigation within a container
 */
export function useKeyboardNavigation(config: KeyboardNavigationConfig = {}) {
  const containerRef = useRef<HTMLElement>(null);
  const managerRef = useRef<KeyboardNavigationManager | null>(null);
  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1);
  const [isNavigationActive, setIsNavigationActive] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create keyboard navigation manager
    managerRef.current = createKeyboardNavigationManager(
      containerRef.current,
      config
    );

    // Listen for focus changes
    const handleFocusChange = () => {
      if (managerRef.current) {
        setCurrentFocusIndex(managerRef.current.currentFocusIndex);
        setIsNavigationActive(managerRef.current.isNavigationActive);
      }
    };

    const container = containerRef.current;
    container.addEventListener("focusin", handleFocusChange);
    container.addEventListener("focusout", handleFocusChange);

    return () => {
      container.removeEventListener("focusin", handleFocusChange);
      container.removeEventListener("focusout", handleFocusChange);
      managerRef.current?.destroy();
    };
  }, [config]);

  const focusFirst = useCallback((): void => {
    managerRef.current?.focusFirst();
  }, []);

  const focusLast = useCallback((): void => {
    managerRef.current?.focusLast();
  }, []);

  const focusNext = useCallback((): void => {
    managerRef.current?.focusNext();
  }, []);

  const focusPrevious = useCallback((): void => {
    managerRef.current?.focusPrevious();
  }, []);

  const refresh = useCallback((): void => {
    managerRef.current?.refresh();
  }, []);

  return {
    containerRef,
    currentFocusIndex,
    isNavigationActive,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    refresh,
    focusableElementsCount: managerRef.current?.focusableElementsCount || 0,
  };
}

/**
 * Hook for managing global keyboard shortcuts
 */
export function useKeyboardShortcuts() {
  const managerRef = useRef<KeyboardShortcutsManager | null>(null);

  useEffect(() => {
    managerRef.current = setupGlobalKeyboardShortcuts();

    return () => {
      managerRef.current?.destroy();
    };
  }, []);

  const addShortcut = useCallback(
    (keyCombo: string, handler: () => void, description?: string): void => {
      managerRef.current?.addShortcut(keyCombo, handler);

      // Announce shortcut addition for screen readers
      if (description) {
        liveAnnouncer?.announce(
          `Keyboard shortcut ${keyCombo} added: ${description}`,
          "polite"
        );
      }
    },
    []
  );

  const removeShortcut = useCallback((keyCombo: string): void => {
    managerRef.current?.removeShortcut(keyCombo);
  }, []);

  const enable = useCallback((): void => {
    managerRef.current?.enable();
  }, []);

  const disable = useCallback((): void => {
    managerRef.current?.disable();
  }, []);

  return {
    addShortcut,
    removeShortcut,
    enable,
    disable,
  };
}

/**
 * Hook for managing modal keyboard navigation
 */
export function useModalKeyboardNavigation(isOpen: boolean) {
  const modalRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const managerRef = useRef<KeyboardNavigationManager | null>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Save current focus
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Create keyboard navigation manager for modal
      managerRef.current = createKeyboardNavigationManager(modalRef.current, {
        trapFocus: true,
        enableEscapeClose: true,
        useRovingTabindex: false,
      });

      // Focus first element in modal
      setTimeout(() => {
        managerRef.current?.focusFirst();
      }, 100);

      // Listen for escape key
      const handleEscape = () => {
        // Emit close event
        const closeEvent = new CustomEvent("modalClose", { bubbles: true });
        modalRef.current?.dispatchEvent(closeEvent);
      };

      const currentModalRef = modalRef.current;
      currentModalRef.addEventListener("keyboardEscape", handleEscape);

      return () => {
        currentModalRef?.removeEventListener("keyboardEscape", handleEscape);
        managerRef.current?.destroy();
      };
    }

    if (!isOpen && previousFocusRef.current) {
      // Restore focus when modal closes
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }

    return () => {
      // Cleanup function for all code paths
    };
  }, [isOpen]);

  return { modalRef };
}

/**
 * Hook for managing menu keyboard navigation
 */
export function useMenuKeyboardNavigation(isOpen: boolean) {
  const menuRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const managerRef = useRef<KeyboardNavigationManager | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      managerRef.current = createKeyboardNavigationManager(menuRef.current, {
        enableArrowKeys: true,
        enableEnterActivation: true,
        enableSpaceActivation: true,
        enableEscapeClose: true,
        orientation: "vertical",
        useRovingTabindex: true,
      });

      // Focus first menu item
      setTimeout(() => {
        managerRef.current?.focusFirst();
      }, 100);

      // Listen for focus changes
      const handleFocusChange = () => {
        if (managerRef.current) {
          setSelectedIndex(managerRef.current.currentFocusIndex);
        }
      };

      // Listen for escape key
      const handleEscape = () => {
        // Close menu and return focus to trigger
        const closeEvent = new CustomEvent("menuClose", { bubbles: true });
        menuRef.current?.dispatchEvent(closeEvent);
        setTimeout(() => {
          triggerRef.current?.focus();
        }, 100);
      };

      const currentMenuRef = menuRef.current;
      currentMenuRef.addEventListener("focusin", handleFocusChange);
      currentMenuRef.addEventListener("keyboardEscape", handleEscape);

      return () => {
        currentMenuRef?.removeEventListener("focusin", handleFocusChange);
        currentMenuRef?.removeEventListener("keyboardEscape", handleEscape);
        managerRef.current?.destroy();
      };
    }

    return () => {
      // Cleanup function for all code paths
    };
  }, [isOpen]);

  const selectNext = useCallback((): void => {
    managerRef.current?.focusNext();
  }, []);

  const selectPrevious = useCallback((): void => {
    managerRef.current?.focusPrevious();
  }, []);

  const selectFirst = useCallback((): void => {
    managerRef.current?.focusFirst();
  }, []);

  const selectLast = useCallback((): void => {
    managerRef.current?.focusLast();
  }, []);

  return {
    menuRef,
    triggerRef,
    selectedIndex,
    selectNext,
    selectPrevious,
    selectFirst,
    selectLast,
  };
}

/**
 * Hook for managing dropdown keyboard navigation
 */
export function useDropdownKeyboardNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const managerRef = useRef<KeyboardNavigationManager | null>(null);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      managerRef.current = createKeyboardNavigationManager(
        dropdownRef.current,
        {
          enableArrowKeys: true,
          enableEnterActivation: true,
          enableEscapeClose: true,
          orientation: "vertical",
          useRovingTabindex: true,
        }
      );

      // Listen for focus changes
      const handleFocusChange = () => {
        if (managerRef.current) {
          setSelectedIndex(managerRef.current.currentFocusIndex);
        }
      };

      const currentDropdownRef = dropdownRef.current;
      currentDropdownRef.addEventListener("focusin", handleFocusChange);

      return () => {
        currentDropdownRef?.removeEventListener("focusin", handleFocusChange);
        managerRef.current?.destroy();
      };
    }

    return () => {
      // Cleanup function for all code paths
    };
  }, [isOpen]);

  const open = useCallback((): void => {
    setIsOpen(true);
    setSelectedIndex(0);
  }, []);

  const close = useCallback((): void => {
    setIsOpen(false);
    setSelectedIndex(-1);
    triggerRef.current?.focus();
  }, []);

  const toggle = useCallback((): void => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, close, open]);

  return {
    isOpen,
    selectedIndex,
    dropdownRef,
    triggerRef,
    open,
    close,
    toggle,
  };
}

/**
 * Hook for managing tab keyboard navigation
 */
export function useTabKeyboardNavigation(tabs: Array<{ id: string; label: string }>) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");
  const [focusedTab, setFocusedTab] = useState(tabs[0]?.id || "");
  const tabListRef = useRef<HTMLElement>(null);
  const managerRef = useRef<KeyboardNavigationManager | null>(null);

  useEffect(() => {
    if (tabListRef.current) {
      managerRef.current = createKeyboardNavigationManager(tabListRef.current, {
        enableArrowKeys: true,
        enableEnterActivation: true,
        enableSpaceActivation: true,
        orientation: "horizontal",
        useRovingTabindex: true,
      });

      // Handle tab activation
      const handleActivation = (event: Event) => {
        const target = event.target as HTMLElement;
        const tabId = target.getAttribute("data-tab-id");
        if (tabId) {
          setActiveTab(tabId);
        }
      };

      // Handle focus changes
      const handleFocusChange = (event: Event) => {
        const target = event.target as HTMLElement;
        const tabId = target.getAttribute("data-tab-id");
        if (tabId) {
          setFocusedTab(tabId);
        }
      };

      const tabList = tabListRef.current;
      tabList.addEventListener("click", handleActivation);
      tabList.addEventListener("focusin", handleFocusChange);

      return () => {
        tabList.removeEventListener("click", handleActivation);
        tabList.removeEventListener("focusin", handleFocusChange);
        managerRef.current?.destroy();
      };
    }

    return () => {
      // Cleanup function for all code paths
    };
  }, [tabs]);

  const selectTab = useCallback((tabId: string): void => {
    setActiveTab(tabId);
    setFocusedTab(tabId);

    // Focus the tab button
    const tabButton = tabListRef.current?.querySelector(
      `[data-tab-id="${tabId}"]`
    ) as HTMLElement;
    tabButton?.focus();
  }, []);

  const selectNextTab = useCallback((): void => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    const nextTab = tabs[nextIndex];
    if (nextTab) {
      selectTab(nextTab.id);
    }
  }, [tabs, activeTab, selectTab]);

  const selectPreviousTab = useCallback((): void => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    const previousIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    const previousTab = tabs[previousIndex];
    if (previousTab) {
      selectTab(previousTab.id);
    }
  }, [tabs, activeTab, selectTab]);

  return {
    tabListRef,
    activeTab,
    focusedTab,
    selectTab,
    selectNextTab,
    selectPreviousTab,
  };
}

/**
 * Hook for managing breadcrumb keyboard navigation
 */
export function useBreadcrumbKeyboardNavigation(
  breadcrumbs: Array<{ id: string; label: string; href?: string }>
) {
  const breadcrumbRef = useRef<HTMLElement>(null);
  const managerRef = useRef<KeyboardNavigationManager | null>(null);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    if (breadcrumbRef.current) {
      managerRef.current = createKeyboardNavigationManager(
        breadcrumbRef.current,
        {
          enableArrowKeys: true,
          enableEnterActivation: true,
          orientation: "horizontal",
        }
      );

      // Handle focus changes
      const handleFocusChange = () => {
        if (managerRef.current) {
          setCurrentIndex(managerRef.current.currentFocusIndex);
        }
      };

      const currentBreadcrumbRef = breadcrumbRef.current;
      currentBreadcrumbRef.addEventListener("focusin", handleFocusChange);

      return () => {
        currentBreadcrumbRef?.removeEventListener("focusin", handleFocusChange);
        managerRef.current?.destroy();
      };
    }

    return () => {
      // Cleanup function for all code paths
    };
  }, [breadcrumbs]);

  const goToNext = useCallback((): void => {
    managerRef.current?.focusNext();
  }, []);

  const goToPrevious = useCallback((): void => {
    managerRef.current?.focusPrevious();
  }, []);

  const getCurrentBreadcrumb = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < breadcrumbs.length) {
      return breadcrumbs[currentIndex];
    }
    return null;
  }, [currentIndex, breadcrumbs]);

  return {
    breadcrumbRef,
    currentIndex,
    goToNext,
    goToPrevious,
    getCurrentBreadcrumb,
  };
}
