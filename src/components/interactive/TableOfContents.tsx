"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
  mobile?: boolean;
}

export function TableOfContents({
  headings,
  mobile = false,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isVisible, setIsVisible] = useState(!mobile);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -35% 0%",
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed header
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  if (headings.length === 0) return null;

  const tocContent = (
    <nav className={mobile ? "" : "max-w-xs"}>
      <div
        className={`${
          mobile
            ? ""
            : "bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg"
        }`}
      >
        {!mobile && (
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-muted-foreground">
            <List className="w-4 h-4" />
            <span>Contents</span>
          </div>
        )}

        <ul className="space-y-2">
          {headings.map((heading, index) => (
            <motion.li
              key={heading.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              style={{
                paddingLeft: `${(heading.level - 1) * 12}px`,
              }}
            >
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={`
                  text-left w-full text-sm py-1 px-2 rounded transition-all duration-200
                  hover:bg-primary/10 hover:text-primary
                  ${
                    activeId === heading.id
                      ? "text-primary bg-primary/10 font-medium border-l-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                <span className="line-clamp-2">{heading.text}</span>
              </button>
            </motion.li>
          ))}
        </ul>

        {/* Progress Indicator */}
        {!mobile && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>
                {headings.findIndex((h) => h.id === activeId) + 1} /{" "}
                {headings.length}
              </span>
            </div>
            <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    ((headings.findIndex((h) => h.id === activeId) + 1) /
                      headings.length) *
                    100
                  }%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );

  if (mobile) {
    return tocContent;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="hidden xl:block"
        >
          {tocContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
