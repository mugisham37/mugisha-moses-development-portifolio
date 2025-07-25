"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useModalKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { createAriaAttributes, generateId } from "@/lib/accessibility";
import { SemanticButton } from "@/components/accessibility/SemanticSection";

interface KeyboardAccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
}

/**
 * Fully keyboard-accessible modal component
 * Implements ARIA 1.1 dialog pattern with focus management
 */
export function KeyboardAccessibleModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = "",
  overlayClassName = "",
  contentClassName = "",
}: KeyboardAccessibleModalProps) {
  const { modalRef } = useModalKeyboardNavigation(isOpen);

  const modalId = generateId("modal");
  const titleId = generateId("modal-title");
  const descriptionId = generateId("modal-description");

  // Handle escape key and overlay clicks
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Listen for modal close events from keyboard navigation
  useEffect(() => {
    if (!modalRef.current) return;

    const handleModalClose = () => {
      onClose();
    };

    modalRef.current.addEventListener("modalClose", handleModalClose);
    return () => {
      modalRef.current?.removeEventListener("modalClose", handleModalClose);
    };
  }, [isOpen, onClose]);

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4",
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`
          fixed inset-0 z-50 flex items-center justify-center p-4
          bg-background/80 backdrop-blur-sm
          ${overlayClassName}
        `}
        onClick={handleOverlayClick}
        aria-hidden="true"
      >
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className={`
            w-full ${sizeClasses[size]} bg-card border border-border rounded-lg shadow-lg
            ${className}
          `}
          onClick={(e) => e.stopPropagation()}
          {...createAriaAttributes.dialog(
            titleId,
            description ? descriptionId : undefined
          )}
          aria-modal="true"
          role="dialog"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2
                id={titleId}
                className="text-lg font-semibold text-foreground"
              >
                {title}
              </h2>
              {description && (
                <p
                  id={descriptionId}
                  className="mt-1 text-sm text-muted-foreground"
                >
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <SemanticButton
                variant="ghost"
                size="sm"
                onClick={onClose}
                ariaLabel="Close modal"
                className="ml-4 hover:bg-muted"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </SemanticButton>
            )}
          </div>

          {/* Content */}
          <div className={`p-6 ${contentClassName}`}>{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  // Render modal in portal
  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}

/**
 * Hook for managing modal state with keyboard accessibility
 */
export function useKeyboardAccessibleModal(initialOpen: boolean = false) {
  const [isOpen, setIsOpen] = React.useState(initialOpen);

  const openModal = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleModal = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
}
