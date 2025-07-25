"use client";

import { motion } from "framer-motion";
import {
  AcademicCapIcon,
  CalendarIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { education } from "@/data/personal-info";
import { ResumeFormat, ResumeView } from "../ResumeContainer";

interface EducationSectionProps {
  format: ResumeFormat;
  view: ResumeView;
}

export function EducationSection({ format, view }: EducationSectionProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getDateRange = (startDate: Date, endDate: Date) => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  if (format === "minimal") {
    return (
      <div className="space-y-4">
        {education.map((edu, index) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-l-2 border-slate-200 dark:border-slate-700 pl-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
              <h3 className="font-medium text-slate-900 dark:text-white">
                {edu.degree}
              </h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {getDateRange(edu.startDate, edu.endDate)}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              {edu.institution}
            </p>
            {edu.gpa && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                GPA: {edu.gpa}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    );
  }

  if (format === "creative") {
    return (
      <div className="space-y-4">
        {education.map((edu, index) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <AcademicCapIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {edu.degree}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  {edu.institution}
                </p>
                <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{getDateRange(edu.startDate, edu.endDate)}</span>
                  </div>
                  {edu.gpa && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                      GPA: {edu.gpa}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Standard format
  return (
    <div className="space-y-6">
      {education.map((edu, index) => (
        <motion.div
          key={edu.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <AcademicCapIcon className="h-6 w-6 text-white" />
            </div>

            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {edu.degree}
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">
                    {edu.institution}
                  </p>
                </div>
                <div className="flex items-center space-x-4 text-slate-500 dark:text-slate-400 mt-2 lg:mt-0">
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{getDateRange(edu.startDate, edu.endDate)}</span>
                  </div>
                  {edu.gpa && (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full font-medium">
                      GPA: {edu.gpa}
                    </span>
                  )}
                </div>
              </div>

              {edu.honors && edu.honors.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Honors & Recognition:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {edu.honors.map((honor, honorIndex) => (
                      <span
                        key={honorIndex}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium"
                      >
                        {honor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Relevant Coursework:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {edu.relevantCoursework.map((course, courseIndex) => (
                      <span
                        key={courseIndex}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-sm"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {edu.projects && edu.projects.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Notable Projects:
                  </h4>
                  <div className="space-y-2">
                    {edu.projects.map((project, projectIndex) => (
                      <div
                        key={projectIndex}
                        className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3"
                      >
                        <h5 className="font-medium text-slate-900 dark:text-white mb-1">
                          {project.name}
                        </h5>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {edu.activities && edu.activities.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Activities & Leadership:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    {edu.activities.map((activity, activityIndex) => (
                      <li key={activityIndex}>{activity}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
