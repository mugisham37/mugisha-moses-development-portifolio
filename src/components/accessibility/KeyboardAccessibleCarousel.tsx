"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCarouselKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { createAriaAttributes, generateId } from "@/lib/accessibility";
import { SemanticButton } from "@/components/accessibility/SemanticSection";

interface CarouselItem {
  id: string;
  content: React.ReactNode;
  alt?: string;
  title?: string;
}

interface KeyboardAccessibleCarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  loop?: boolean;
  className?: string;
  itemClassName?: string;
  controlsClassName?: string;
  indicatorsClassName?: string;
  onItemChange?: (index: number, item: CarouselItem) => void;
}

/**
 * Fully keyboard-accessible carousel component
 * Implements ARIA 1.1 carousel pattern with keyboard navigation
 */
export function KeyboardAccessibleCarousel({
  items,
  autoPlay = false,
  autoPlayInterval = 5000,
  showControls = true,
  showIndicators = true,
  loop = true,
  className = "",
  itemClassName = "",
  controlsClassName = "",
  indicatorsClassName = "",
  onItemChange,
}: KeyboardAccessibleCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const carouselId = generateId("carousel");
  const liveRegionId = generateId("carousel-live");

  const { carouselRef, focusedIndex, goToIndex, goToNext, goToPrevious } =
    useCarouselKeyboardNavigation(items.length, currentIndex);

  // Handle auto-play
  useEffect(() => {
    if (!isPlaying || items.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, autoPlayInterval, items.length]);

  // Pause auto-play on focus or hover
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleFocus = () => setIsPlaying(false);
    const handleBlur = () => setIsPlaying(autoPlay);
    const handleMouseEnter = () => setIsPlaying(false);
    const handleMouseLeave = () => setIsPlaying(autoPlay);

    carousel.addEventListener("focusin", handleFocus);
    carousel.addEventListener("focusout", handleBlur);
    carousel.addEventListener("mouseenter", handleMouseEnter);
    carousel.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      carousel.removeEventListener("focusin", handleFocus);
      carousel.removeEventListener("focusout", handleBlur);
      carousel.removeEventListener("mouseenter", handleMouseEnter);
      carousel.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [autoPlay]);

  // Handle carousel selection events
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleCarouselSelect = (event: CustomEvent) => {
      const { index } = event.detail;
      goToItem(index);
    };

    carousel.addEventListener(
      "carouselSelect",
      handleCarouselSelect as EventListener
    );
    return () => {
      carousel.removeEventListener(
        "carouselSelect",
        handleCarouselSelect as EventListener
      );
    };
  }, []);

  // Navigation functions
  const goToItem = (index: number) => {
    if (index === currentIndex) return;

    setDirection(index > currentIndex ? "next" : "prev");
    setCurrentIndex(index);
    goToIndex(index);
    onItemChange?.(index, items[index]);
  };

  const handleNext = () => {
    const nextIndex = loop
      ? (currentIndex + 1) % items.length
      : Math.min(currentIndex + 1, items.length - 1);

    if (nextIndex !== currentIndex) {
      setDirection("next");
      setCurrentIndex(nextIndex);
      goToNext();
      onItemChange?.(nextIndex, items[nextIndex]);
    }
  };

  const handlePrevious = () => {
    const prevIndex = loop
      ? currentIndex === 0
        ? items.length - 1
        : currentIndex - 1
      : Math.max(currentIndex - 1, 0);

    if (prevIndex !== currentIndex) {
      setDirection("prev");
      setCurrentIndex(prevIndex);
      goToPrevious();
      onItemChange?.(prevIndex, items[prevIndex]);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Animation variants
  const slideVariants = {
    enter: (direction: "next" | "prev") => ({
      x: direction === "next" ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: "next" | "prev") => ({
      zIndex: 0,
      x: direction === "next" ? -1000 : 1000,
      opacity: 0,
    }),
  };

  const currentItem = items[currentIndex];

  return (
    <div className={`relative ${className}`}>
      {/* Carousel Container */}
      <div
        ref={carouselRef}
        id={carouselId}
        role="region"
        aria-label="Image carousel"
        aria-live="polite"
        aria-atomic="false"
        tabIndex={0}
        className="relative overflow-hidden rounded-lg bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {/* Items */}
        <div className="relative h-64 md:h-96">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className={`absolute inset-0 ${itemClassName}`}
            >
              {currentItem.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        {showControls && items.length > 1 && (
          <div
            className={`absolute inset-y-0 left-0 right-0 flex items-center justify-between p-4 ${controlsClassName}`}
          >
            {/* Previous Button */}
            <SemanticButton
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={!loop && currentIndex === 0}
              ariaLabel="Previous item"
              className="bg-background/80 hover:bg-background/90 backdrop-blur-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </SemanticButton>

            {/* Next Button */}
            <SemanticButton
              variant="ghost"
              size="sm"
              onClick={handleNext}
              disabled={!loop && currentIndex === items.length - 1}
              ariaLabel="Next item"
              className="bg-background/80 hover:bg-background/90 backdrop-blur-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </SemanticButton>
          </div>
        )}

        {/* Play/Pause Button */}
        {autoPlay && (
          <div className="absolute top-4 right-4">
            <SemanticButton
              variant="ghost"
              size="sm"
              onClick={togglePlayPause}
              ariaLabel={isPlaying ? "Pause carousel" : "Play carousel"}
              className="bg-background/80 hover:bg-background/90 backdrop-blur-sm"
            >
              {isPlaying ? (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </SemanticButton>
          </div>
        )}
      </div>

      {/* Indicators */}
      {showIndicators && items.length > 1 && (
        <div
          className={`flex justify-center space-x-2 mt-4 ${indicatorsClassName}`}
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => goToItem(index)}
              className={`
                w-3 h-3 rounded-full transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${
                  index === currentIndex
                    ? "bg-primary"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }
              `}
              aria-label={`Go to item ${index + 1}`}
              aria-current={index === currentIndex ? "true" : "false"}
            />
          ))}
        </div>
      )}

      {/* Live Region for Screen Readers */}
      <div
        id={liveRegionId}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {currentItem.title && `${currentItem.title}. `}
        Item {currentIndex + 1} of {items.length}
        {currentItem.alt && `. ${currentItem.alt}`}
      </div>

      {/* Instructions for Screen Readers */}
      <div className="sr-only">
        Use arrow keys to navigate between items. Press Enter or Space to select
        an item.
        {autoPlay &&
          ` Carousel will auto-advance every ${
            autoPlayInterval / 1000
          } seconds when not focused.`}
      </div>
    </div>
  );
}

/**
 * Hook for managing carousel state
 */
export function useKeyboardAccessibleCarousel(
  items: CarouselItem[],
  initialIndex: number = 0
) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);

  const goToItem = (index: number) => {
    if (index >= 0 && index < items.length) {
      setCurrentIndex(index);
    }
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const getCurrentItem = () => {
    return items[currentIndex];
  };

  return {
    currentIndex,
    isPlaying,
    goToItem,
    goToNext,
    goToPrevious,
    togglePlayPause,
    getCurrentItem,
  };
}
