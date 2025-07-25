"use client";

import { motion } from "framer-motion";
import {
  TrophyIcon,
  CalendarIcon,
  TagIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { achievements } from "@/data/personal-info";
import { ResumeFormat, ResumeView } from "../ResumeContainer";

interface AchievementsSectionProps {
  format: ResumeFormat;
  view: ResumeView;
}

export function AchievementsSection({
  format,
  view,
}: AchievementsSectionProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "recognition":
        return TrophyIcon;
      case "speaking":
        return SparklesIcon;
      case "certification":
        return TagIcon;
      default:
        return TrophyIcon;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "recognition":
        return "from-yellow-500 to-orange-500";
      case "speaking":
        return "from-purple-500 to-pink-500";
      case "open source":
        return "from-green-500 to-emerald-500";
      case "technical excellence":
        return "from-blue-500 to-cyan-500";
      case "certification":
        return "from-indigo-500 to-purple-500";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  if (format === "minimal") {
    return (
      <div className="space-y-3">
        {achievements.slice(0, 5).map((achievement, index) => (
          <motion.div
            key={achievement.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-l-2 border-slate-200 dark:border-slate-700 pl-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
              <h3 className="font-medium text-slate-900 dark:text-white text-sm">
                {achievement.title}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatDate(achievement.date)}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {achievement.description}
            </p>
          </motion.div>
        ))}
      </div>
    );
  }

  if (format === "creative") {
    return (
      <div className="space-y-3">
        {achievements.slice(0, 6).map((achievement, index) => {
          const IconComponent = getCategoryIcon(achievement.category);
          return (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`flex-shrink-0 w-8 h-8 bg-gradient-to-r ${getCategoryColor(
                    achievement.category
                  )} rounded-full flex items-center justify-center`}
                >
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    {achievement.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs mb-2">
                    {achievement.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(achievement.date)}
                    </span>
                    <span className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full">
                      {achievement.category}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Standard format
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {achievements.map((achievement, index) => {
        const IconComponent = getCategoryIcon(achievement.category);
        return (
          <motion.div
            key={achievement.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div
                className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${getCategoryColor(
                  achievement.category
                )} rounded-full flex items-center justify-center`}
              >
                <IconComponent className="h-6 w-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {achievement.title}
                  </h3>
                  <span
                    className={`
                    px-2 py-1 text-xs rounded-full font-medium
                    ${
                      achievement.category === "Recognition"
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                        : achievement.category === "Speaking"
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
                        : achievement.category === "Open Source"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                        : achievement.category === "Technical Excellence"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }
                  `}
                  >
                    {achievement.category}
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-400 mb-3">
                  {achievement.description}
                </p>

                <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{formatDate(achievement.date)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
