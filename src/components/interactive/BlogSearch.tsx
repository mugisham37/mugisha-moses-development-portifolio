"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce";

interface BlogSearchProps {
  initialValue?: string;
  placeholder?: string;
  className?: string;
}

export function BlogSearch({
  initialValue = "",
  placeholder = "Search articles...",
  className = "",
}: BlogSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search query to avoid too many URL updates
  const debouncedQuery = useDebounce(query, 300);

  // Update URL when debounced query changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedQuery.trim()) {
      params.set("search", debouncedQuery.trim());
    } else {
      params.delete("search");
    }

    // Reset to first page when searching
    params.delete("page");

    const queryString = params.toString();
    const newUrl = `/blog${queryString ? `?${queryString}` : ""}`;

    router.push(newUrl, { scroll: false });
  }, [debouncedQuery, router, searchParams]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }

      // Clear search on Escape
      if (e.key === "Escape" && isFocused) {
        setQuery("");
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFocused]);

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`
              w-full pl-10 pr-12 py-3 text-sm
              bg-background border border-border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
              transition-all duration-200
              ${isFocused ? "shadow-lg" : "shadow-sm"}
            `}
          />

          {/* Clear Button */}
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Keyboard Shortcut Hint */}
        <AnimatePresence>
          {!isFocused && !query && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground pointer-events-none"
            >
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
                {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
                K
              </kbd>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Status */}
      <AnimatePresence>
        {query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 p-3 bg-background border border-border rounded-lg shadow-lg z-10"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Search className="w-4 h-4" />
              <span>
                Searching for "
                <span className="font-medium text-foreground">{query}</span>"
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
