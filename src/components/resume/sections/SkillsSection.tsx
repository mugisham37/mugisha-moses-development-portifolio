"use client";

import { motion } from "framer-motion";
import { skillCategories } from "@/data/skills";
import { ResumeFormat, ResumeView } from "../ResumeContainer";

interface SkillsSectionProps {
  format: ResumeFormat;
  view: ResumeView;
}

export function SkillsSection({ format }: SkillsSectionProps) {
  const getSkillLevel = (level: number) => {
    if (level >= 90) return "Expert";
    if (level >= 75) return "Advanced";
    if (level >= 60) return "Intermediate";
    return "Beginner";
  };

  const getSkillColor = (level: number) => {
    if (level >= 90) return "from-green-500 to-emerald-500";
    if (level >= 75) return "from-blue-500 to-cyan-500";
    if (level >= 60) return "from-yellow-500 to-orange-500";
    return "from-gray-400 to-gray-500";
  };

  if (format === "minimal") {
    return (
      <div className="space-y-6">
        {skillCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <h3 className="font-medium text-slate-900 dark:text-white mb-3">
              {category.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.slice(0, 8).map((skill) => (
                <span
                  key={skill.name}
                  className="px-2 py-1 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (format === "creative") {
    return (
      <div className="space-y-6">
        {skillCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-center">
              {category.name}
            </h3>
            <div className="space-y-3">
              {category.skills.slice(0, 5).map((skill, skillIndex) => (
                <motion.div
                  key={skill.name}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{
                    delay: categoryIndex * 0.1 + skillIndex * 0.05,
                    duration: 0.8,
                  }}
                  className="relative"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {skill.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {getSkillLevel(skill.level * 10)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level * 10}%` }}
                      transition={{
                        delay: categoryIndex * 0.1 + skillIndex * 0.05,
                        duration: 1,
                      }}
                      className={`h-2 rounded-full bg-gradient-to-r ${getSkillColor(
                        skill.level * 10
                      )}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Standard format
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {skillCategories.map((category, categoryIndex) => (
        <motion.div
          key={category.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: categoryIndex * 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <span className="w-3 h-3 bg-blue-600 rounded-full mr-3" />
            {category.name}
          </h3>

          <div className="space-y-4">
            {category.skills.map((skill, skillIndex) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                className="relative"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {skill.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {skill.yearsExperience}y
                    </span>
                    <span
                      className={`
                      px-2 py-1 text-xs rounded-full font-medium
                      ${
                        skill.level >= 9
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                          : skill.level >= 7.5
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                          : skill.level >= 6
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                          : "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200"
                      }
                    `}
                    >
                      {getSkillLevel(skill.level * 10)}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level * 10}%` }}
                    transition={{
                      delay: categoryIndex * 0.1 + skillIndex * 0.05,
                      duration: 1,
                    }}
                    className={`h-2 rounded-full bg-gradient-to-r ${getSkillColor(
                      skill.level * 10
                    )}`}
                  />
                </div>

                {skill.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {skill.description}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
