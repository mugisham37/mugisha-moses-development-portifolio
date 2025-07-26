"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "./Navigation";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import {
  FocusManager,
  generateId,
} from "@/lib/accessibility";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const navigationId = generateId("navigation");
  const mobileMenuId = generateId("mobile-menu");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        !(event.target as Element).closest(".mobile-menu")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open and manage focus
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      // Save current focus and trap focus in mobile menu
      FocusManager.saveFocus();
      if (mobileMenuRef.current) {
        const cleanup = FocusManager.trapFocus(mobileMenuRef.current);
        return () => {
          cleanup();
          document.body.style.overflow = "unset";
        };
      }
    } else {
      document.body.style.overflow = "unset";
      // Restore focus to menu button when closing
      if (mobileMenuButtonRef.current) {
        mobileMenuButtonRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  return (
    <motion.header
      role="banner"
      aria-label="Site header"
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent"
        }
        ${className}
      `}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center"
          >
            <a
              href="#home"
              className="text-xl lg:text-2xl font-bold gradient-text focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-2 py-1"
              aria-label="Elite Developer Portfolio - Go to homepage"
              role="img"
            >
              <span aria-hidden="true">Elite Dev</span>
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <nav
            id={navigationId}
            role="navigation"
            aria-label="Main navigation"
            className="hidden md:flex items-center space-x-8"
          >
            <Navigation />
          </nav>

          {/* Desktop Theme Switcher */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeSwitcher variant="toggle" size="md" showLabels={false} />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeSwitcher variant="toggle" size="sm" showLabels={false} />
            <motion.button
              ref={mobileMenuButtonRef}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-haspopup={true}
              aria-controls={mobileMenuId}
              aria-label={
                isMobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
            >
              <HamburgerIcon isOpen={isMobileMenuOpen} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            />

            {/* Mobile Menu */}
            <motion.nav
              ref={mobileMenuRef}
              id={mobileMenuId}
              role="navigation"
              aria-label="Mobile navigation menu"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="mobile-menu fixed top-16 right-0 bottom-0 w-80 max-w-[80vw] bg-card border-l border-border shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Screen reader heading for mobile menu */}
                <h2 className="sr-only">Navigation Menu</h2>
                <Navigation
                  isMobile
                  onItemClick={() => setIsMobileMenuOpen(false)}
                />
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// Animated Hamburger Icon Component
interface HamburgerIconProps {
  isOpen: boolean;
}

function HamburgerIcon({ isOpen }: HamburgerIconProps) {
  return (
    <div className="w-6 h-6 flex flex-col justify-center items-center">
      <motion.span
        animate={{
          rotate: isOpen ? 45 : 0,
          y: isOpen ? 6 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="w-6 h-0.5 bg-current block"
      />
      <motion.span
        animate={{
          opacity: isOpen ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="w-6 h-0.5 bg-current block mt-1.5"
      />
      <motion.span
        animate={{
          rotate: isOpen ? -45 : 0,
          y: isOpen ? -6 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="w-6 h-0.5 bg-current block mt-1.5"
      />
    </div>
  );
}
