"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTabNavigation } from "@/hooks/useKeyboardNavigation";
import { createAriaAttributes, generateId } from "@/lib/accessibility";

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface KeyboardAccessibleTabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "pills" | "underline";
  size?: "sm" | "md" | "lg";
  className?: string;
  tabListClassName?: string;
  tabClassName?: string;
  tabPanelClassName?: string;
  onTabChange?: (tabId: string) => void;
}

/**
 * Fully keyboard-accessible tabs component
 * Implements ARIA 1.1 tabs pattern with roving tabindex
 */
export function KeyboardAccessibleTabs({
  tabs,
  defaultTab,
  orientation = "horizontal",
  variant = "default",
  size = "md",
  className = "",
  tabListClassName = "",
  tabClassName = "",
  tabPanelClassName = "",
  onTabChange,
}: KeyboardAccessibleTabsProps) {
  const tabIds = tabs.map((tab) => tab.id);
  const { tabListRef, activeTab, focusedTab, selectTab } = useTabNavigation(
    tabIds,
    defaultTab
  );

  const tabListId = generateId("tablist");

  // Handle tab selection
  const handleTabSelect = (tabId: string) => {
    if (tabs.find((tab) => tab.id === tabId)?.disabled) return;

    selectTab(tabId);
    onTabChange?.(tabId);
  };

  // Handle keyboard navigation
  const handleTabKeyDown = (event: React.KeyboardEvent, tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab?.disabled) return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        handleTabSelect(tabId);
        break;
    }
  };

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case "pills":
        return {
          tabList: "bg-muted p-1 rounded-lg",
          tab: "rounded-md",
          activeTab: "bg-background shadow-sm",
        };
      case "underline":
        return {
          tabList: "border-b border-border",
          tab: "border-b-2 border-transparent",
          activeTab: "border-primary",
        };
      default:
        return {
          tabList: "border-b border-border",
          tab: "border border-transparent",
          activeTab: "border-border border-b-background bg-background",
        };
    }
  };

  // Size styles
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-sm";
      case "lg":
        return "px-6 py-3 text-lg";
      default:
        return "px-4 py-2 text-base";
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const activeTabContent = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className={`w-full ${className}`}>
      {/* Tab List */}
      <div
        ref={tabListRef}
        id={tabListId}
        role="tablist"
        aria-orientation={orientation}
        className={`
          flex ${orientation === "vertical" ? "flex-col" : "flex-row"}
          ${variantStyles.tabList}
          ${tabListClassName}
        `}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isFocused = focusedTab === tab.id;
          const tabPanelId = `${tab.id}-panel`;

          return (
            <button
              key={tab.id}
              data-tab-id={tab.id}
              role="tab"
              tabIndex={isFocused ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => handleTabSelect(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
              className={`
                relative flex items-center justify-center space-x-2
                font-medium transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                ${sizeStyles}
                ${variantStyles.tab}
                ${isActive ? variantStyles.activeTab : "hover:bg-muted"}
                ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }
                ${tabClassName}
              `}
              {...createAriaAttributes.tab(tabPanelId, isActive)}
            >
              {/* Icon */}
              {tab.icon && (
                <span className="flex-shrink-0" aria-hidden="true">
                  {tab.icon}
                </span>
              )}

              {/* Label */}
              <span>{tab.label}</span>

              {/* Badge */}
              {tab.badge && (
                <span
                  className="ml-2 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full"
                  aria-label={`${tab.badge} items`}
                >
                  {tab.badge}
                </span>
              )}

              {/* Active indicator for underline variant */}
              {variant === "underline" && isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ duration: 0.2 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const tabPanelId = `${tab.id}-panel`;

          return (
            <div
              key={tab.id}
              id={tabPanelId}
              role="tabpanel"
              tabIndex={0}
              hidden={!isActive}
              className={`
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded
                ${tabPanelClassName}
              `}
              {...createAriaAttributes.tabPanel(`${tab.id}`, isActive)}
            >
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {tab.content}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Hook for managing tab state
 */
export function useKeyboardAccessibleTabs(
  tabs: TabItem[],
  defaultTab?: string
) {
  const tabIds = tabs.map((tab) => tab.id);
  const { activeTab, selectTab, selectNextTab, selectPreviousTab } =
    useTabNavigation(tabIds, defaultTab);

  const getActiveTabContent = () => {
    return tabs.find((tab) => tab.id === activeTab)?.content;
  };

  const getActiveTab = () => {
    return tabs.find((tab) => tab.id === activeTab);
  };

  return {
    activeTab,
    selectTab,
    selectNextTab,
    selectPreviousTab,
    getActiveTabContent,
    getActiveTab,
  };
}
