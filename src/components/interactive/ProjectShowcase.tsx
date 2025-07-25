"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ProjectCard3D } from "@/components/3d/ProjectCard3D";
import { projects } from "@/data/projects";
import type { Project, ProjectCategory, ProjectComplexity } from "@/types";
import { cn } from "@/lib/utils";
import {
  SearchIcon,
  FilterIcon,
  XIcon,
  StarIcon,
  TrendingUpIcon,
  ClockIcon,
  TagIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ProjectShowcaseProps {
  className?: string;
  maxProjects?: number;
  showFeaturedOnly?: boolean;
  onProjectClick?: (project: Project) => void;
  onProjectHover?: (project: Project) => void;
  enableFiltering?: boolean;
  enableSearch?: boolean;
}

export function ProjectShowcase({
  className,
  maxProjects,
  showFeaturedOnly = false,
  onProjectClick,
  onProjectHover,
  enableFiltering = true,
  enableSearch = true,
}: ProjectShowcaseProps) {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<
    ProjectCategory[]
  >([]);
  const [selectedComplexities, setSelectedComplexities] = useState<
    ProjectComplexity[]
  >([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    []
  );
  const [showFeaturedFilter, setShowFeaturedFilter] = useState(false);
  const [sortBy, setSortBy] = useState<
    "date" | "stars" | "complexity" | "name"
  >("date");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Get unique values for filters
  const categories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category))),
    []
  );

  const complexities: ProjectComplexity[] = [
    "beginner",
    "intermediate",
    "advanced",
    "expert",
  ];

  const technologies = useMemo(
    () =>
      Array.from(
        new Set(projects.flatMap((p) => p.technologies.map((t) => t.name)))
      ).sort(),
    []
  );

  // Filter and sort projects
  const displayProjects = useMemo(() => {
    let filteredProjects = projects;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredProjects = filteredProjects.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          project.technologies.some((tech) =>
            tech.name.toLowerCase().includes(query)
          )
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filteredProjects = filteredProjects.filter((project) =>
        selectedCategories.includes(project.category)
      );
    }

    // Apply complexity filter
    if (selectedComplexities.length > 0) {
      filteredProjects = filteredProjects.filter((project) =>
        selectedComplexities.includes(project.complexity)
      );
    }

    // Apply technology filter
    if (selectedTechnologies.length > 0) {
      filteredProjects = filteredProjects.filter((project) =>
        selectedTechnologies.some((tech) =>
          project.technologies.some((projectTech) => projectTech.name === tech)
        )
      );
    }

    // Apply featured filter
    if (showFeaturedOnly || showFeaturedFilter) {
      filteredProjects = filteredProjects.filter((project) => project.featured);
    }

    // Sort projects
    filteredProjects.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
        case "stars":
          return b.metrics.githubStars - a.metrics.githubStars;
        case "complexity":
          const complexityOrder = {
            beginner: 1,
            intermediate: 2,
            advanced: 3,
            expert: 4,
          };
          return complexityOrder[b.complexity] - complexityOrder[a.complexity];
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    // Apply max projects limit
    if (maxProjects) {
      filteredProjects = filteredProjects.slice(0, maxProjects);
    }

    return filteredProjects;
  }, [
    searchQuery,
    selectedCategories,
    selectedComplexities,
    selectedTechnologies,
    showFeaturedOnly,
    showFeaturedFilter,
    sortBy,
    maxProjects,
  ]);

  const handleProjectHover = (project: Project) => {
    setHoveredProject(project);
    onProjectHover?.(project);
  };

  const handleProjectClick = (project: Project) => {
    onProjectClick?.(project);
  };

  // Filter handlers
  const toggleCategory = (category: ProjectCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleComplexity = (complexity: ProjectComplexity) => {
    setSelectedComplexities((prev) =>
      prev.includes(complexity)
        ? prev.filter((c) => c !== complexity)
        : [...prev, complexity]
    );
  };

  const toggleTechnology = (technology: string) => {
    setSelectedTechnologies((prev) =>
      prev.includes(technology)
        ? prev.filter((t) => t !== technology)
        : [...prev, technology]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedComplexities([]);
    setSelectedTechnologies([]);
    setShowFeaturedFilter(false);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    selectedComplexities.length > 0 ||
    selectedTechnologies.length > 0 ||
    showFeaturedFilter;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section ref={ref} className={cn("relative w-full", className)}>
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          {showFeaturedOnly ? "Featured Projects" : "All Projects"}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore my latest work showcasing cutting-edge technologies and
          innovative solutions
        </p>
      </motion.div>

      {/* Search and Filter Controls */}
      {(enableSearch || enableFiltering) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          {enableSearch && (
            <div className="relative max-w-md mx-auto">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects, technologies, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-card/50 border-border/50 backdrop-blur-sm focus:bg-card/80 transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Filter Controls */}
          {enableFiltering && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* Filter Toggle Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={cn(
                  "transition-all duration-200",
                  isFilterOpen && "bg-primary-500/10 border-primary-500/30"
                )}
              >
                <FilterIcon className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 w-2 h-2 bg-primary-500 rounded-full" />
                )}
              </Button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-1.5 text-sm bg-card/50 border border-border/50 rounded-md backdrop-blur-sm focus:bg-card/80 focus:border-primary-500/50 transition-all duration-200"
              >
                <option value="date">Sort by Date</option>
                <option value="stars">Sort by Stars</option>
                <option value="complexity">Sort by Complexity</option>
                <option value="name">Sort by Name</option>
              </select>

              {/* Quick Filters */}
              <Button
                variant={showFeaturedFilter ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFeaturedFilter(!showFeaturedFilter)}
                className="transition-all duration-200"
              >
                <StarIcon className="w-4 h-4 mr-2" />
                Featured
              </Button>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <XIcon className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          )}

          {/* Expanded Filter Panel */}
          <AnimatePresence>
            {isFilterOpen && enableFiltering && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-lg p-6 space-y-6">
                  {/* Categories Filter */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <TagIcon className="w-4 h-4" />
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={
                            selectedCategories.includes(category)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => toggleCategory(category)}
                          className="text-xs transition-all duration-200"
                        >
                          {category.replace("-", " ")}
                          {selectedCategories.includes(category) && (
                            <XIcon className="w-3 h-3 ml-1" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Complexity Filter */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <TrendingUpIcon className="w-4 h-4" />
                      Complexity
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {complexities.map((complexity) => (
                        <Button
                          key={complexity}
                          variant={
                            selectedComplexities.includes(complexity)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => toggleComplexity(complexity)}
                          className={cn("text-xs transition-all duration-200", {
                            "border-green-500/30 text-green-400":
                              complexity === "beginner",
                            "border-yellow-500/30 text-yellow-400":
                              complexity === "intermediate",
                            "border-orange-500/30 text-orange-400":
                              complexity === "advanced",
                            "border-red-500/30 text-red-400":
                              complexity === "expert",
                          })}
                        >
                          {complexity}
                          {selectedComplexities.includes(complexity) && (
                            <XIcon className="w-3 h-3 ml-1" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Technologies Filter */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      Technologies
                    </h3>
                    <div className="max-h-32 overflow-y-auto">
                      <div className="flex flex-wrap gap-2">
                        {technologies.map((technology) => (
                          <Button
                            key={technology}
                            variant={
                              selectedTechnologies.includes(technology)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => toggleTechnology(technology)}
                            className="text-xs transition-all duration-200"
                          >
                            {technology}
                            {selectedTechnologies.includes(technology) && (
                              <XIcon className="w-3 h-3 ml-1" />
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-sm text-muted-foreground">
                Showing {displayProjects.length} of {projects.length} projects
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        {displayProjects.length > 0 ? (
          <motion.div
            key="projects-grid"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {displayProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  layout
                  className="relative"
                  transition={{
                    layout: { duration: 0.4, ease: "easeInOut" },
                  }}
                >
                  <ProjectCard3D
                    project={project}
                    index={index}
                    isVisible={inView}
                    onHover={handleProjectHover}
                    onClick={handleProjectClick}
                    className="h-full"
                  />

                  {/* Hover Glow Effect */}
                  {hoveredProject?.id === project.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl blur-xl -z-10"
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  {/* Featured Project Highlight */}
                  {project.featured && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <StarIcon className="w-3 h-3 text-white" />
                    </motion.div>
                  )}

                  {/* Complexity Indicator */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="absolute -bottom-2 -left-2"
                  >
                    <div
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border",
                        {
                          "bg-green-500/20 text-green-300 border-green-500/30":
                            project.complexity === "beginner",
                          "bg-yellow-500/20 text-yellow-300 border-yellow-500/30":
                            project.complexity === "intermediate",
                          "bg-orange-500/20 text-orange-300 border-orange-500/30":
                            project.complexity === "advanced",
                          "bg-red-500/20 text-red-300 border-red-500/30":
                            project.complexity === "expert",
                        }
                      )}
                    >
                      {project.complexity}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="no-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center">
              <SearchIcon className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery
                ? `No projects match your search for "${searchQuery}"`
                : "No projects match your current filters"}
            </p>
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="transition-all duration-200"
            >
              <XIcon className="w-4 h-4 mr-2" />
              Clear all filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Interactive Background Grid */}
      <div className="absolute inset-0 -z-20 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Project Count Indicator and Stats */}
      {displayProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              <span>
                Showing {displayProjects.length} of {projects.length} projects
              </span>
            </div>

            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                <FilterIcon className="w-4 h-4" />
                <span>Filters active</span>
              </div>
            )}

            {(showFeaturedOnly || showFeaturedFilter) && (
              <div className="flex items-center gap-2">
                <StarIcon className="w-4 h-4 text-primary-400" />
                <span>Featured only</span>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-muted-foreground">
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">
                {displayProjects.filter((p) => p.featured).length}
              </div>
              <div>Featured</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">
                {displayProjects.reduce(
                  (sum, p) => sum + p.metrics.githubStars,
                  0
                )}
              </div>
              <div>Total Stars</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">
                {
                  Array.from(
                    new Set(
                      displayProjects.flatMap((p) =>
                        p.technologies.map((t) => t.name)
                      )
                    )
                  ).length
                }
              </div>
              <div>Technologies</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">
                {Math.round(
                  displayProjects.reduce(
                    (sum, p) => sum + p.metrics.performanceScore,
                    0
                  ) / displayProjects.length
                )}
              </div>
              <div>Avg Performance</div>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
