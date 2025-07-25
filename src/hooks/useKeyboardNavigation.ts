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

  const focusFirst = useCallback(() => {
    managerRef.current?.focusFirst();
  }, []);

  const focusLast = useCallback(() => {
    managerRef.current?.focusLast();
  }, []);

  const focusNext = useCallback(() => {
    managerRef.current?.focusNext();
  }, []);

  const focusPrevious = useCallback(() => {
    managerRef.current?.focusPrevious();
  }, []);

  const refresh = useCallback(() => {
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
    (keyCombo: string, handler: () => void, description?: string) => {
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

  const removeShortcut = useCallback((keyCombo: string) => {
    managerRef.current?.removeShortcut(keyCombo);
  }, []);

  const enable = useCallback(() => {
    managerRef.current?.enable();
  }, []);

  const disable = useCallback(() => {
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

      modalRef.current.addEventListener("keyboardEscape", handleEscape);

      return () => {
        modalRef.current?.removeEventListener("keyboardEscape", handleEscape);
        managerRef.current?.destroy();
      };
    } else if (!isOpen && previousFocusRef.current) {
      // Restore focus when modal closes
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
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
        setSelectedIndex(0);
      }, 100);

      // Listen for selection changes
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

      const menu = menuRef.current;
      menu.addEventListener("focusin", handleFocusChange);
      menu.addEventListener("keyboardEscape", handleEscape);

      return () => {
        menu.removeEventListener("focusin", handleFocusChange);
        menu.removeEventListener("keyboardEscape", handleEscape);
        managerRef.current?.destroy();
      };
    }
  }, [isOpen]);

  const selectNext = useCallback(() => {
    managerRef.current?.focusNext();
  }, []);

  const selectPrevious = useCallback(() => {
    managerRef.current?.focusPrevious();
  }, []);

  const selectFirst = useCallback(() => {
    managerRef.current?.focusFirst();
  }, []);

  const selectLast = useCallback(() => {
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
 * Hook for managing tab navigation
 */
export function useTabNavigation(tabs: string[], defaultTab: string = "") {
  const tabListRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]);
  const [focusedTab, setFocusedTab] = useState(defaultTab || tabs[0]);
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
          liveAnnouncer?.announce(`${tabId} tab selected`, "polite");
        }
      };

      // Handle focus changes
      const handleFocusChange = (event: FocusEvent) => {
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
  }, [tabs]);

  const selectTab = useCallback((tabId: string) => {
    setActiveTab(tabId);
    setFocusedTab(tabId);

    // Focus the tab button
    const tabButton = tabListRef.current?.querySelector(
      `[data-tab-id="${tabId}"]`
    ) as HTMLElement;
    tabButton?.focus();
  }, []);

  const selectNextTab = useCallback(() => {
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    selectTab(tabs[nextIndex]);
  }, [tabs, activeTab, selectTab]);

  const selectPreviousTab = useCallback(() => {
    const currentIndex = tabs.indexOf(activeTab);
    const previousIndex =
      currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    selectTab(tabs[previousIndex]);
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
 * Hook for managing carousel/slider keyboard navigation
 */
export function useCarouselKeyboardNavigation(
  itemCount: number,
  currentIndex: number = 0
) {
  const carouselRef = useRef<HTMLElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(currentIndex);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          const prevIndex =
            focusedIndex === 0 ? itemCount - 1 : focusedIndex - 1;
          setFocusedIndex(prevIndex);
          liveAnnouncer?.announce(
            `Item ${prevIndex + 1} of ${itemCount}`,
            "polite"
          );
          break;

        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          const nextIndex = (focusedIndex + 1) % itemCount;
          setFocusedIndex(nextIndex);
          liveAnnouncer?.announce(
            `Item ${nextIndex + 1} of ${itemCount}`,
            "polite"
          );
          break;

        case "Home":
          event.preventDefault();
          setFocusedIndex(0);
          liveAnnouncer?.announce(`First item, 1 of ${itemCount}`, "polite");
          break;

        case "End":
          event.preventDefault();
          setFocusedIndex(itemCount - 1);
          liveAnnouncer?.announce(
            `Last item, ${itemCount} of ${itemCount}`,
            "polite"
          );
          break;

        case "Enter":
        case " ":
          event.preventDefault();
          // Emit selection event
          const selectEvent = new CustomEvent("carouselSelect", {
            detail: { index: focusedIndex },
            bubbles: true,
          });
          carouselRef.current?.dispatchEvent(selectEvent);
          break;
      }
    },
    [focusedIndex, itemCount]
  );

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("keydown", handleKeyDown);
      return () => carousel.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown]);

  const goToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < itemCount) {
        setFocusedIndex(index);
        liveAnnouncer?.announce(`Item ${index + 1} of ${itemCount}`, "polite");
      }
    },
    [itemCount]
  );

  const goToNext = useCallback(() => {
    const nextIndex = (focusedIndex + 1) % itemCount;
    goToIndex(nextIndex);
  }, [focusedIndex, itemCount, goToIndex]);

  const goToPrevious = useCallback(() => {
    const prevIndex = focusedIndex === 0 ? itemCount - 1 : focusedIndex - 1;
    goToIndex(prevIndex);
  }, [focusedIndex, itemCount, goToIndex]);

  return {
    carouselRef,
    focusedIndex,
    goToIndex,
    goToNext,
    goToPrevious,
  };
}
