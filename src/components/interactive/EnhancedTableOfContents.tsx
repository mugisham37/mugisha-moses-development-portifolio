"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, ChevronRight, Clock, BookOpen, Eye, Hash } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface Heading {
  id: string;
  text: string;
  level: number;
  element?: HTMLElement;
  readingTime?: number;
}

interface EnhancedTableOfContentsProps {
  headings: Heading[];
  mobile?: boolean;
  showReadingTime?: boolean;
  showProgress?: boolean;
  className?: string;
}

export function EnhancedTableOfContents({
  headings,
  mobile = false,
  showReadingTime = true,
  showProgress = true,
  className = "",
}: EnhancedTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isVisible, setIsVisible] = useState(!mobile);
  const [isExpanded, setIsExpanded] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [estimatedReadingTime, setEstimatedReadingTime] = useState(0);
  const [currentSectionTime, setCurrentSectionTime] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Calculate reading times for each section
  useEffect(() => {
    const calculateReadingTimes = () => {
      const updatedHeadings = headings.map((heading, index) => {
        const element = document.getElementById(heading.id);
        if (!element) return heading;

        // Get content between this heading and the next
        const nextHeading = headings[index + 1];
        const nextElement = nextHeading
          ? document.getElementById(nextHeading.id)
          : null;

        let content = "";
        let currentElement = element.nextElementSibling;

        while (currentElement && currentElement !== nextElement) {
          content += currentElement.textContent || "";
          currentElement = currentElement.nextElementSibling;
        }

        // Calculate reading time (average 200 words per minute)
        const wordCount = content.split(/\s+/).length;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));

        return { ...heading, element, readingTime };
      });

      const totalTime = updatedHeadings.reduce(
        (acc, h) => acc + (h.readingTime || 0),
        0
      );
      setEstimatedReadingTime(totalTime);

      return updatedHeadings;
    };

    if (headings.length > 0) {
      const timer = setTimeout(calculateReadingTimes, 100);
      return () => clearTimeout(timer);
    }
  }, [headings]);

  // Set up intersection observer for active section tracking
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the entry that's most visible
        let mostVisible = entries[0];
        let maxRatio = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisible = entry;
          }
        });

        if (mostVisible && mostVisible.isIntersecting) {
          setActiveId(mostVisible.target.id);

          // Update current section reading time
          const heading = headings.find((h) => h.id === mostVisible.target.id);
          if (heading?.readingTime) {
            setCurrentSectionTime(heading.readingTime);
          }
        }
      },
      {
        rootMargin: "-20% 0% -35% 0%",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [headings]);

  // Calculate overall reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(
        100,
        Math.max(0, (scrollTop / docHeight) * 100)
      );
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed header
      const elementPosition = element.offsetTop - offset;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });

      // Track navigation
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "toc_navigation", {
          heading_id: id,
          heading_text: headings.find((h) => h.id === id)?.text,
        });
      }
    }
  };

  const getHeadingIcon = (level: number) => {
    switch (level) {
      case 1:
        return "📖";
      case 2:
        return "📝";
      case 3:
        return "📋";
      case 4:
        return "📌";
      case 5:
        return "🔸";
      default:
        return "•";
    }
  };

  if (headings.length === 0) return null;

  const tocContent = (
    <div className={mobile ? "" : "max-w-xs"}>
      <Card
        className={`${
          mobile
            ? "border-0 shadow-none bg-transparent"
            : "bg-background/95 backdrop-blur-sm border border-border shadow-lg"
        } ${mobile ? "" : "p-4"}`}
      >
        {/* Header */}
        {!mobile && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <List className="w-4 h-4" />
              <span>Contents</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {headings.length} sections
            </Badge>
          </div>
        )}

        {/* Mobile Header */}
        {mobile && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg mb-4 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-2">
              <List className="w-4 h-4" />
              <span className="font-semibold">Table of Contents</span>
              <Badge variant="secondary" className="text-xs">
                {headings.length}
              </Badge>
            </div>
            <ChevronRight
              className={`w-4 h-4 transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </button>
        )}

        {/* Reading Stats */}
        {showReadingTime && !mobile && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Est. reading time</span>
              </div>
              <span className="font-medium">{estimatedReadingTime} min</span>
            </div>

            {showProgress && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Progress</span>
                  <span>{Math.round(readingProgress)}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${readingProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Table of Contents List */}
        <AnimatePresence>
          {(!mobile || isExpanded) && (
            <motion.nav
              initial={mobile ? { opacity: 0, height: 0 } : { opacity: 1 }}
              animate={mobile ? { opacity: 1, height: "auto" } : { opacity: 1 }}
              exit={mobile ? { opacity: 0, height: 0 } : { opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="space-y-1">
                {headings.map((heading, index) => {
                  const isActive = activeId === heading.id;
                  const indent = (heading.level - 1) * 12;

                  return (
                    <motion.li
                      key={heading.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      style={{ paddingLeft: `${indent}px` }}
                    >
                      <button
                        onClick={() => scrollToHeading(heading.id)}
                        className={`
                          group flex items-start gap-2 w-full text-left py-2 px-3 rounded-lg transition-all duration-200
                          hover:bg-primary/10 hover:text-primary
                          ${
                            isActive
                              ? "text-primary bg-primary/10 font-medium border-l-2 border-primary shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }
                        `}
                      >
                        {/* Heading Icon */}
                        <span className="text-xs mt-0.5 opacity-60">
                          {getHeadingIcon(heading.level)}
                        </span>

                        <div className="flex-1 min-w-0">
                          <span
                            className={`text-sm line-clamp-2 ${
                              heading.level === 1 ? "font-semibold" : ""
                            }`}
                          >
                            {heading.text}
                          </span>

                          {/* Reading time for this section */}
                          {showReadingTime && heading.readingTime && (
                            <div className="flex items-center gap-2 mt-1 text-xs opacity-60">
                              <Clock className="w-3 h-3" />
                              <span>{heading.readingTime} min</span>
                              {isActive && (
                                <Badge variant="secondary" className="text-xs">
                                  Current
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-primary rounded-full mt-2"
                          />
                        )}
                      </button>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Quick Actions */}
              {!mobile && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                      className="flex-1 text-xs"
                    >
                      <ChevronRight className="w-3 h-3 mr-1 rotate-[-90deg]" />
                      Top
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        window.scrollTo({
                          top: document.body.scrollHeight,
                          behavior: "smooth",
                        })
                      }
                      className="flex-1 text-xs"
                    >
                      <ChevronRight className="w-3 h-3 mr-1 rotate-90" />
                      Bottom
                    </Button>
                  </div>
                </div>
              )}
            </motion.nav>
          )}
        </AnimatePresence>

        {/* Compact Progress Indicator for Mobile */}
        {mobile && showProgress && (
          <div className="mt-3 p-2 bg-muted/30 rounded">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Reading Progress</span>
              <span>{Math.round(readingProgress)}%</span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${readingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  if (mobile) {
    return <div className={className}>{tocContent}</div>;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className={`hidden xl:block ${className}`}
        >
          {tocContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
