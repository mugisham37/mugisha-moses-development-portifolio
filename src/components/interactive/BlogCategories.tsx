"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface BlogCategoriesProps {
  categories: string[];
  selectedCategory?: string;
  className?: string;
}

export function BlogCategories({
  categories,
  selectedCategory,
  className = "",
}: BlogCategoriesProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle category selection
  const handleCategorySelect = (category: string | null) => {
    const params = new URLSearchParams(searchParams);

    if (category) {
      params.set("category", category.toLowerCase());
    } else {
      params.delete("category");
    }

    // Reset to first page when filtering
    params.delete("page");

    const queryString = params.toString();
    const newUrl = `/blog${queryString ? `?${queryString}` : ""}`;

    router.push(newUrl, { scroll: false });
    setIsOpen(false);
  };

  const displayText = selectedCategory
    ? categories.find(
        (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
      ) || "All Categories"
    : "All Categories";

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 min-w-[160px] justify-between"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span className="truncate">{displayText}</span>
          {selectedCategory && (
            <Badge variant="secondary" className="text-xs">
              1
            </Badge>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-20 overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto">
              {/* All Categories Option */}
              <button
                onClick={() => handleCategorySelect(null)}
                className={`
                  w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors
                  flex items-center justify-between
                  ${
                    !selectedCategory
                      ? "bg-primary/10 text-primary font-medium"
                      : ""
                  }
                `}
              >
                <span>All Categories</span>
                {!selectedCategory && (
                  <Badge variant="secondary" className="text-xs">
                    {categories.length}
                  </Badge>
                )}
              </button>

              {/* Separator */}
              <div className="h-px bg-border" />

              {/* Category Options */}
              {categories.map((category, index) => {
                const isSelected =
                  selectedCategory?.toLowerCase() === category.toLowerCase();

                return (
                  <motion.button
                    key={category}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    onClick={() => handleCategorySelect(category)}
                    className={`
                      w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors
                      flex items-center justify-between group
                      ${
                        isSelected
                          ? "bg-primary/10 text-primary font-medium"
                          : ""
                      }
                    `}
                  >
                    <span className="truncate">{category}</span>

                    {/* Category indicator */}
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 bg-muted/50 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                {categories.length} categories available
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
