"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardNavigation";
import { liveAnnouncer } from "@/lib/accessibility";

interface KeyboardNavigationContextType {
  isKeyboardUser: boolean;
  shortcuts: Map<string, { handler: () => void; description: string }>;
  addGlobalShortcut: (
    key: string,
    handler: () => void,
    description: string
  ) => void;
  removeGlobalShortcut: (key: string) => void;
  announceShortcut: (key: string, description: string) => void;
}

const KeyboardNavigationContext =
  createContext<KeyboardNavigationContextType | null>(null);

interface KeyboardNavigationProviderProps {
  children: React.ReactNode;
}

/**
 * Provider for global keyboard navigation state and shortcuts
 */
export function KeyboardNavigationProvider({
  children,
}: KeyboardNavigationProviderProps) {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);
  const [shortcuts, setShortcuts] = useState(
    new Map<string, { handler: () => void; description: string }>()
  );
  const { addShortcut, removeShortcut } = useKeyboardShortcuts();

  useEffect(() => {
    // Track keyboard usage
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Tab" ||
        event.key.startsWith("Arrow") ||
        event.key === "Enter" ||
        event.key === " "
      ) {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);

    // Set up default global shortcuts
    setupDefaultShortcuts();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  const setupDefaultShortcuts = () => {
    // Skip to main content
    addGlobalShortcut(
      "Alt+m",
      () => {
        const mainContent = document.getElementById("main-content");
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: "smooth" });
        }
      },
      "Skip to main content"
    );

    // Skip to navigation
    addGlobalShortcut(
      "Alt+n",
      () => {
        const navigation = document.querySelector(
          'nav[role="navigation"]'
        ) as HTMLElement;
        if (navigation) {
          const firstLink = navigation.querySelector(
            "a, button"
          ) as HTMLElement;
          firstLink?.focus();
        }
      },
      "Skip to navigation"
    );

    // Open search (if available)
    addGlobalShortcut(
      "Ctrl+k",
      () => {
        const searchInput = document.querySelector(
          '[role="search"] input, [type="search"]'
        ) as HTMLElement;
        if (searchInput) {
          searchInput.focus();
        } else {
          liveAnnouncer?.announce(
            "Search not available on this page",
            "polite"
          );
        }
      },
      "Open search"
    );

    // Show keyboard shortcuts help
    addGlobalShortcut(
      "Shift+?",
      () => {
        showKeyboardShortcutsHelp();
      },
      "Show keyboard shortcuts help"
    );
  };

  const addGlobalShortcut = (
    key: string,
    handler: () => void,
    description: string
  ) => {
    addShortcut(key, handler, description);
    setShortcuts((prev) => new Map(prev.set(key, { handler, description })));
  };

  const removeGlobalShortcut = (key: string) => {
    removeShortcut(key);
    setShortcuts((prev) => {
      const newMap = new Map(prev);
      newMap.delete(key);
      return newMap;
    });
  };

  const announceShortcut = (key: string, description: string) => {
    liveAnnouncer?.announce(
      `Keyboard shortcut: ${key} - ${description}`,
      "polite"
    );
  };

  const showKeyboardShortcutsHelp = () => {
    const shortcutsList = Array.from(shortcuts.entries())
      .map(([key, { description }]) => `${key}: ${description}`)
      .join(", ");

    liveAnnouncer?.announce(
      `Available keyboard shortcuts: ${shortcutsList}`,
      "polite"
    );
  };

  const contextValue: KeyboardNavigationContextType = {
    isKeyboardUser,
    shortcuts,
    addGlobalShortcut,
    removeGlobalShortcut,
    announceShortcut,
  };

  return (
    <KeyboardNavigationContext.Provider value={contextValue}>
      {children}
    </KeyboardNavigationContext.Provider>
  );
}

export function useKeyboardNavigationContext() {
  const context = useContext(KeyboardNavigationContext);
  if (!context) {
    throw new Error(
      "useKeyboardNavigationContext must be used within KeyboardNavigationProvider"
    );
  }
  return context;
}
