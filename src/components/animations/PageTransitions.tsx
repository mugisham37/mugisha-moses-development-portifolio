"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
  variant?: "fade" | "slide" | "scale" | "rotate" | "blur" | "curtain";
  duration?: number;
  className?: string;
}

const transitionVariants: Record<string, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 },
  },
  rotate: {
    initial: { rotate: -90, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    exit: { rotate: 90, opacity: 0 },
  },
  blur: {
    initial: { filter: "blur(10px)", opacity: 0 },
    animate: { filter: "blur(0px)", opacity: 1 },
    exit: { filter: "blur(10px)", opacity: 0 },
  },
  curtain: {
    initial: { y: "-100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
  },
};

export function PageTransition({
  children,
  variant = "fade",
  duration = 0.4,
  className = "",
}: PageTransitionProps) {
  const pathname = usePathname();

  const variants = {
    ...transitionVariants[variant],
    animate: {
      ...transitionVariants[variant].animate,
      transition: { duration, ease: "easeInOut" },
    },
    exit: {
      ...transitionVariants[variant].exit,
      transition: { duration: duration * 0.8, ease: "easeInOut" },
    },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Route-specific transitions
interface RouteTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function RouteTransition({
  children,
  className = "",
}: RouteTransitionProps) {
  const pathname = usePathname();

  // Different transitions for different routes
  const getTransitionForRoute = (path: string) => {
    if (path === "/") return "fade";
    if (path.startsWith("/projects")) return "slide";
    if (path.startsWith("/about")) return "scale";
    if (path.startsWith("/contact")) return "blur";
    return "fade";
  };

  const variant = getTransitionForRoute(pathname);

  return (
    <PageTransition variant={variant} className={className}>
      {children}
    </PageTransition>
  );
}

// Loading transition
interface LoadingTransitionProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  className?: string;
}

export function LoadingTransition({
  isLoading,
  children,
  loadingComponent,
  className = "",
}: LoadingTransitionProps) {
  const defaultLoader = (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={className}
        >
          {loadingComponent || defaultLoader}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Modal transition
interface ModalTransitionProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export function ModalTransition({
  isOpen,
  children,
  onClose,
  className = "",
}: ModalTransitionProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
          >
            <div onClick={(e) => e.stopPropagation()}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Drawer transition
interface DrawerTransitionProps {
  isOpen: boolean;
  children: React.ReactNode;
  direction?: "left" | "right" | "top" | "bottom";
  onClose?: () => void;
  className?: string;
}

export function DrawerTransition({
  isOpen,
  children,
  direction = "right",
  onClose,
  className = "",
}: DrawerTransitionProps) {
  const getTransform = () => {
    switch (direction) {
      case "left":
        return { x: "-100%" };
      case "right":
        return { x: "100%" };
      case "top":
        return { y: "-100%" };
      case "bottom":
        return { y: "100%" };
      default:
        return { x: "100%" };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={getTransform()}
            animate={{ x: 0, y: 0 }}
            exit={getTransform()}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed z-50 bg-background shadow-xl ${
              direction === "left" || direction === "right"
                ? "top-0 bottom-0 w-80"
                : "left-0 right-0 h-80"
            } ${
              direction === "left"
                ? "left-0"
                : direction === "right"
                ? "right-0"
                : direction === "top"
                ? "top-0"
                : "bottom-0"
            } ${className}`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Accordion transition
interface AccordionTransitionProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}

export function AccordionTransition({
  isOpen,
  children,
  className = "",
}: AccordionTransitionProps) {
  return (
    <motion.div
      initial={false}
      animate={{ height: isOpen ? "auto" : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`overflow-hidden ${className}`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2, delay: isOpen ? 0.1 : 0 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default PageTransition;
