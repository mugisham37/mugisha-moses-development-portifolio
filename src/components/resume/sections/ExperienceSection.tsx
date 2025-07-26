"use client";

import { motion } from "framer-motion";
import {
  CalendarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { experience } from "@/data/experience";
import { ResumeFormat } from "../ResumeContainer";

interface ExperienceSectionProps {
  format: ResumeFormat;
}

export function ExperienceSection({ format }: ExperienceSectionProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getDateRange = (startDate: Date, endDate?: Date, current?: boolean) => {
    const start = formatDate(startDate);
    const end = current ? "Present" : endDate ? formatDate(endDate) : "Present";
    return `${start} - ${end}`;
  };

  if (format === "minimal") {
    return (
      <div className="space-y-6">
        {experience.slice(0, 4).map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-l-2 border-slate-200 dark:border-slate-700 pl-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <h3 className="font-medium text-slate-900 dark:text-white">
                {job.position}
              </h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {getDateRange(job.startDate, job.endDate, job.current)}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              {job.company} • {job.location}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              {job.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {job.technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded"
                >
                  {tech}
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
        {experience.slice(0, 3).map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            {/* Timeline dot */}
            <div className="absolute -left-3 top-6 w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-4 border-white dark:border-slate-900" />

            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                  {job.position}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <div className="flex items-center space-x-1">
                    <BuildingOfficeIcon className="h-4 w-4" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {getDateRange(job.startDate, job.endDate, job.current)}
                </span>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {job.description}
            </p>

            {/* Key achievements */}
            {job.achievements && job.achievements.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Key Achievement:
                </h4>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {job.achievements[0]?.description}
                  </p>
                  {job.achievements[0]?.metrics && (
                    <div className="flex space-x-4 mt-2">
                      {job.achievements[0].metrics
                        .slice(0, 2)
                        .map((metric, idx) => (
                          <div key={idx} className="text-xs">
                            <span className="font-medium text-blue-900 dark:text-blue-100">
                              {metric.value}
                            </span>
                            <span className="text-blue-700 dark:text-blue-300 ml-1">
                              {metric.label}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Technologies */}
            <div className="flex flex-wrap gap-2">
              {job.technologies.slice(0, 6).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Standard format
  return (
    <div className="space-y-8">
      {experience.map((job, index) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
        >
          {/* Timeline line */}
          {index < experience.length - 1 && (
            <div className="absolute left-6 top-12 w-px h-full bg-slate-200 dark:bg-slate-700" />
          )}

          <div className="flex items-start space-x-6">
            {/* Timeline dot */}
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {job.startDate.getFullYear().toString().slice(-2)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {job.position}
                  </h3>
                  <div className="flex items-center space-x-4 text-slate-600 dark:text-slate-400 mt-1">
                    <div className="flex items-center space-x-1">
                      <BuildingOfficeIcon className="h-4 w-4" />
                      <span className="font-medium">{job.company}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 mt-2 lg:mt-0">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="font-medium">
                    {getDateRange(job.startDate, job.endDate, job.current)}
                  </span>
                  {job.current && (
                    <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
                      Current
                    </span>
                  )}
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {job.description}
              </p>

              {/* Responsibilities */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Key Responsibilities:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {job.responsibilities
                    .slice(0, 4)
                    .map((responsibility, idx) => (
                      <li key={idx}>{responsibility}</li>
                    ))}
                </ul>
              </div>

              {/* Achievements */}
              {job.achievements && job.achievements.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Notable Achievements:
                  </h4>
                  <div className="space-y-2">
                    {job.achievements.slice(0, 2).map((achievement, idx) => (
                      <div
                        key={idx}
                        className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3"
                      >
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                          {achievement.title}
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                          {achievement.description}
                        </p>
                        {achievement.metrics && (
                          <div className="flex flex-wrap gap-3">
                            {achievement.metrics.map((metric, metricIdx) => (
                              <div key={metricIdx} className="text-xs">
                                <span className="font-semibold text-blue-900 dark:text-blue-100">
                                  {metric.value}
                                </span>
                                <span className="text-blue-700 dark:text-blue-300 ml-1">
                                  {metric.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Technologies Used:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
