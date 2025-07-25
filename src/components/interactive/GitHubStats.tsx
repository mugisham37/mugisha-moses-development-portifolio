"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GitHubMetricsDashboard from "./GitHubMetricsDashboard";
import GitHubActivityFeed from "./GitHubActivityFeed";
import GitHubRepositoryInsights from "./GitHubRepositoryInsights";
import GitHubRealTimeMetrics from "./GitHubRealTimeMetrics";

type TabType = "overview" | "activity" | "repositories" | "realtime";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  description: string;
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  description,
}: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-200 ${
        active
          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
          : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-gray-300"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <div className="text-left">
        <div className="font-medium">{label}</div>
        <div className="text-xs opacity-75">{description}</div>
      </div>

      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-blue-500/10 rounded-xl border border-blue-500/20"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
}

interface GitHubStatsProps {
  className?: string;
  defaultTab?: TabType;
}

export default function GitHubStats({
  className = "",
  defaultTab = "overview",
}: GitHubStatsProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  const tabs = [
    {
      id: "overview" as TabType,
      icon: "📊",
      label: "Overview",
      description: "Key metrics and insights",
    },
    {
      id: "realtime" as TabType,
      icon: "🔴",
      label: "Live Metrics",
      description: "Real-time statistics",
    },
    {
      id: "activity" as TabType,
      icon: "⚡",
      label: "Activity",
      description: "Recent commits and PRs",
    },
    {
      id: "repositories" as TabType,
      icon: "📁",
      label: "Repositories",
      description: "Detailed repo analysis",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <GitHubMetricsDashboard />;
      case "realtime":
        return (
          <GitHubRealTimeMetrics refreshInterval={30000} showTrends={true} />
        );
      case "activity":
        return <GitHubActivityFeed maxItems={50} showFilters={true} />;
      case "repositories":
        return <GitHubRepositoryInsights />;
      default:
        return <GitHubMetricsDashboard />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row gap-4">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            icon={tab.icon}
            label={tab.label}
            description={tab.description}
          />
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
