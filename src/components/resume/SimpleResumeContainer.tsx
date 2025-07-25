"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DocumentArrowDownIcon,
  PrinterIcon,
  ComputerDesktopIcon,
  PresentationChartLineIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/outline";
import {
  personalInfo,
  experience,
  education,
  certifications,
  achievements,
} from "@/data/personal-info";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";

export type ResumeFormat = "standard" | "creative" | "minimal";
export type ResumeView = "interactive" | "print" | "presentation";

export function SimpleResumeContainer() {
  const [format, setFormat] = useState<ResumeFormat>("standard");
  const [view, setView] = useState<ResumeView>("interactive");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePDFGeneration = async () => {
    setIsGeneratingPDF(true);
    // Simulate PDF generation
    setTimeout(() => {
      setIsGeneratingPDF(false);
      // In a real implementation, this would trigger the PDF download
      alert("PDF generation would happen here");
    }, 2000);
  };

  const slides = [
    { title: "Introduction", content: "header" },
    { title: "Professional Experience", content: "experience" },
    { title: "Technical Skills", content: "skills" },
    { title: "Education", content: "education" },
    { title: "Certifications", content: "certifications" },
  ];

  const handlePresentationMode = () => {
    setView("presentation");
    setCurrentSlide(0);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  // Keyboard navigation for presentation mode
  const handleKeyPress = (e: KeyboardEvent) => {
    if (view === "presentation") {
      switch (e.key) {
        case "ArrowRight":
        case " ":
          nextSlide();
          break;
        case "ArrowLeft":
          prevSlide();
          break;
        case "Escape":
          setView("interactive");
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
      }
    }
  };

  // Add keyboard event listener
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [view]);

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

  const renderPresentationSlide = () => {
    const slide = slides[currentSlide];

    switch (slide.content) {
      case "header":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <h1 className="text-6xl font-bold mb-4">{personalInfo.name}</h1>
            <p className="text-3xl text-blue-300 mb-6">{personalInfo.title}</p>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              {personalInfo.bio}
            </p>
            <div className="flex justify-center space-x-8 text-lg text-slate-400 mt-8">
              <span>{personalInfo.email}</span>
              <span>{personalInfo.location}</span>
              <span>{personalInfo.website}</span>
            </div>
          </motion.div>
        );

      case "experience":
        return (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold mb-8">Professional Experience</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {experience.slice(0, 4).map((job, index) => (
                <div key={job.id} className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-2xl font-semibold text-blue-300 mb-2">
                    {job.position}
                  </h3>
                  <p className="text-lg text-slate-300 mb-2">{job.company}</p>
                  <p className="text-slate-400 mb-4">
                    {getDateRange(job.startDate, job.endDate, job.current)}
                  </p>
                  <p className="text-slate-300">{job.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        );

      default:
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-bold mb-8">{slide.title}</h2>
            <p className="text-xl text-slate-300">
              Content for {slide.title} slide
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Controls */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Format Selection */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Format:
              </span>
              <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                {(["standard", "creative", "minimal"] as ResumeFormat[]).map(
                  (f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                        format === f
                          ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* View Options */}
            <div className="flex items-center space-x-2">
              {[
                {
                  value: "interactive" as ResumeView,
                  label: "Interactive",
                  icon: ComputerDesktopIcon,
                },
                {
                  value: "print" as ResumeView,
                  label: "Print",
                  icon: PrinterIcon,
                },
              ].map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setView(option.value)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      view === option.value
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{option.label}</span>
                  </button>
                );
              })}

              {/* Presentation Mode Button */}
              <button
                onClick={handlePresentationMode}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  view === "presentation"
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                    : "text-slate-600 dark:text-slate-400 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                }`}
              >
                <PresentationChartLineIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Present</span>
              </button>
            </div>

            {/* PDF Download */}
            <button
              onClick={handlePDFGeneration}
              disabled={isGeneratingPDF}
              className={`flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-all duration-200 ${
                isGeneratingPDF ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>{isGeneratingPDF ? "Generating..." : "Download PDF"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Presentation Controls */}
      {view === "presentation" && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center space-x-4">
          <button
            onClick={prevSlide}
            className="text-white hover:text-blue-300 transition-colors"
            disabled={currentSlide === 0}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>

          <span className="text-white text-sm">
            {currentSlide + 1} / {slides.length}
          </span>

          <button
            onClick={nextSlide}
            className="text-white hover:text-blue-300 transition-colors"
            disabled={currentSlide === slides.length - 1}
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>

          <div className="w-px h-6 bg-white/30" />

          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-blue-300 transition-colors"
          >
            {isFullscreen ? (
              <ArrowsPointingInIcon className="h-5 w-5" />
            ) : (
              <ArrowsPointingOutIcon className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={() => setView("interactive")}
            className="text-white hover:text-red-300 transition-colors text-sm"
          >
            Exit
          </button>
        </div>
      )}

      {/* Resume Content */}
      <motion.div
        key={`${format}-${view}-${currentSlide}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`${
          view === "presentation"
            ? "fixed inset-0 bg-slate-900 text-white flex items-center justify-center p-8"
            : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        } ${view === "presentation" ? "text-lg" : ""}`}
      >
        {view === "presentation" ? (
          <div className="max-w-6xl mx-auto text-center">
            {renderPresentationSlide()}
          </div>
        ) : (
          <div>
            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-12 ${
                format === "creative"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8"
                  : format === "minimal"
                  ? "border-b border-slate-200 dark:border-slate-700 pb-8"
                  : "bg-white dark:bg-slate-800 rounded-lg p-8 shadow-sm"
              }`}
            >
              <h1
                className={`font-bold mb-2 ${
                  view === "presentation" ? "text-5xl" : "text-4xl"
                } ${format === "minimal" ? "font-light" : ""}`}
              >
                {personalInfo.name}
              </h1>
              <p
                className={`mb-4 ${
                  view === "presentation" ? "text-2xl" : "text-xl"
                } ${
                  format === "creative"
                    ? "text-blue-100"
                    : format === "minimal"
                    ? "text-slate-600 dark:text-slate-400"
                    : "text-blue-600 dark:text-blue-400"
                }`}
              >
                {personalInfo.title}
              </p>
              <p
                className={`${
                  format === "creative"
                    ? "text-blue-100"
                    : "text-slate-600 dark:text-slate-400"
                } max-w-3xl`}
              >
                {personalInfo.bio}
              </p>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-6 mt-6 text-sm">
                <span>{personalInfo.email}</span>
                <span>{personalInfo.phone}</span>
                <span>{personalInfo.location}</span>
                <span>{personalInfo.website}</span>
              </div>
            </motion.header>

            {/* Experience Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h2
                className={`font-bold mb-6 ${
                  view === "presentation" ? "text-3xl" : "text-2xl"
                } ${
                  format === "minimal" ? "font-light" : ""
                } text-slate-900 dark:text-white`}
              >
                Professional Experience
              </h2>
              <div className="space-y-8">
                {experience.slice(0, 4).map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className={`${
                      format === "creative"
                        ? "bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm"
                        : format === "minimal"
                        ? "border-l-2 border-slate-200 dark:border-slate-700 pl-6"
                        : "bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3">
                      <div>
                        <h3
                          className={`font-semibold ${
                            view === "presentation" ? "text-2xl" : "text-xl"
                          } text-slate-900 dark:text-white`}
                        >
                          {job.position}
                        </h3>
                        <p
                          className={`${
                            view === "presentation" ? "text-lg" : ""
                          } text-slate-600 dark:text-slate-400 mt-1`}
                        >
                          {job.company} • {job.location}
                        </p>
                      </div>
                      <span
                        className={`${
                          view === "presentation" ? "text-lg" : "text-sm"
                        } text-slate-500 dark:text-slate-400 mt-2 lg:mt-0`}
                      >
                        {getDateRange(job.startDate, job.endDate, job.current)}
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      {job.description}
                    </p>

                    {/* Key responsibilities */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                        Key Responsibilities:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        {job.responsibilities
                          .slice(0, 3)
                          .map((responsibility, idx) => (
                            <li key={idx}>{responsibility}</li>
                          ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {job.technologies.slice(0, 6).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Skills Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h2
                className={`font-bold mb-6 ${
                  view === "presentation" ? "text-3xl" : "text-2xl"
                } ${
                  format === "minimal" ? "font-light" : ""
                } text-slate-900 dark:text-white`}
              >
                Technical Skills
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.slice(0, 6).map((category, index) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm"
                  >
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.skills.slice(0, 4).map((skill) => (
                        <div
                          key={skill.name}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {skill.name}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-500">
                            {skill.yearsExperience}y
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Education Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <h2
                className={`font-bold mb-6 ${
                  view === "presentation" ? "text-3xl" : "text-2xl"
                } ${
                  format === "minimal" ? "font-light" : ""
                } text-slate-900 dark:text-white`}
              >
                Education
              </h2>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3">
                      <div>
                        <h3
                          className={`font-semibold ${
                            view === "presentation" ? "text-xl" : "text-lg"
                          } text-slate-900 dark:text-white`}
                        >
                          {edu.degree}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                          {edu.institution}
                        </p>
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-2 lg:mt-0">
                        <span>{getDateRange(edu.startDate, edu.endDate)}</span>
                        {edu.gpa && (
                          <span className="ml-4 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded">
                            GPA: {edu.gpa}
                          </span>
                        )}
                      </div>
                    </div>

                    {edu.honors && edu.honors.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                          Honors:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {edu.honors.map((honor, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded"
                            >
                              {honor}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Certifications Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <h2
                className={`font-bold mb-6 ${
                  view === "presentation" ? "text-3xl" : "text-2xl"
                } ${
                  format === "minimal" ? "font-light" : ""
                } text-slate-900 dark:text-white`}
              >
                Certifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.slice(0, 4).map((cert, index) => (
                  <motion.div
                    key={cert.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm"
                  >
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {cert.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-2">
                      {cert.issuer}
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        {formatDate(cert.date)}
                      </span>
                      {cert.expiryDate && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-xs">
                          Valid
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>
        )}
      </motion.div>
    </div>
  );
}
