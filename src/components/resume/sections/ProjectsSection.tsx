"use client";

import { motion } from "framer-motion";
import {
  CodeBracketIcon,
  EyeIcon,
  StarIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { projects } from "@/data/projects";
import { ResumeFormat, ResumeView } from "../ResumeContainer";

interface ProjectsSectionProps {
  format: ResumeFormat;
  view: ResumeView;
}

export function ProjectsSection({ format }: ProjectsSectionProps) {
  // Get featured projects for resume
  const featuredProjects = projects
    .filter((project) => project.featured)
    .slice(0, 4);

  if (format === "minimal") {
    return (
      <div className="space-y-4">
        {featuredProjects.slice(0, 3).map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-l-2 border-slate-200 dark:border-slate-700 pl-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <h3 className="font-medium text-slate-900 dark:text-white">
                {project.title}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    <CodeBracketIcon className="h-4 w-4" />
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech.name}
                  className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded"
                >
                  {tech.name}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featuredProjects.slice(0, 4).map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {project.title}
              </h3>
              <div className="flex items-center space-x-2">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <CodeBracketIcon className="h-4 w-4" />
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              {project.description}
            </p>

            {/* Metrics */}
            {project.metrics && (
              <div className="flex items-center space-x-4 mb-3 text-xs text-slate-500 dark:text-slate-400">
                {project.metrics.githubStars > 0 && (
                  <div className="flex items-center space-x-1">
                    <StarIcon className="h-3 w-3" />
                    <span>{project.metrics.githubStars}</span>
                  </div>
                )}
                {project.metrics.performanceScore && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
                    {project.metrics.performanceScore}/100
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech.name}
                  className="px-2 py-1 text-xs bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 rounded-full"
                >
                  {tech.name}
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {featuredProjects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {project.title}
              </h3>
              <div className="flex items-center space-x-2 mb-3">
                <span
                  className={`
                  px-2 py-1 text-xs rounded-full font-medium
                  ${
                    project.complexity === "advanced"
                      ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                      : project.complexity === "intermediate"
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                      : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                  }
                `}
                >
                  {project.complexity}
                </span>
                {project.featured && (
                  <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full font-medium">
                    Featured
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="View Source Code"
                >
                  <CodeBracketIcon className="h-5 w-5" />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="View Live Demo"
                >
                  <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {project.description}
          </p>

          {/* Key Features */}
          {project.keyFeatures && project.keyFeatures.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Key Features:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                {project.keyFeatures
                  .slice(0, 3)
                  .map((feature: string, featureIndex: number) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
              </ul>
            </div>
          )}

          {/* Metrics */}
          {project.metrics && (
            <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {project.metrics.githubStars > 0 && (
                  <div className="flex items-center space-x-2">
                    <StarIcon className="h-4 w-4 text-yellow-500" />
                    <span className="text-slate-600 dark:text-slate-400">
                      {project.metrics.githubStars} stars
                    </span>
                  </div>
                )}
                {project.metrics.performanceScore && (
                  <div className="text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {project.metrics.performanceScore}/100
                    </span>
                    <span className="ml-1">Performance</span>
                  </div>
                )}
                {project.metrics.commits > 0 && (
                  <div className="text-slate-600 dark:text-slate-400">
                    <span className="font-medium">
                      {project.metrics.commits}
                    </span>
                    <span className="ml-1">commits</span>
                  </div>
                )}
                {project.metrics.testCoverage > 0 && (
                  <div className="text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {project.metrics.testCoverage}%
                    </span>
                    <span className="ml-1">coverage</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Technologies */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Technologies:
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech.name}
                  className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
