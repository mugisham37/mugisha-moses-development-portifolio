// Core Type Definitions for Elite Developer Portfolio

// Export performance types
export * from './performance';

// Project Types
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: Technology[];
  images: ImageAsset[];
  liveUrl?: string;
  githubUrl: string;
  featured: boolean;
  complexity: ProjectComplexity;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  metrics: ProjectMetrics;
  caseStudy?: CaseStudy;
  category: ProjectCategory;
  tags: string[];
}

export interface ProjectMetrics {
  githubStars: number;
  forks: number;
  commits: number;
  contributors: number;
  linesOfCode: number;
  testCoverage: number;
  performanceScore: number;
  accessibilityScore: number;
  seoScore: number;
  bundleSize?: string;
  loadTime?: number;
}

export interface CaseStudy {
  overview: {
    problem: string;
    solution: string;
    impact: MetricValue[];
    timeline: string;
    role: string;
    teamSize?: number;
  };
  technicalDetails: {
    architecture: ArchitectureDiagram;
    codeExamples: CodeSnippet[];
    challenges: Challenge[];
    decisions: TechnicalDecision[];
    learnings: string[];
  };
  results: {
    beforeAfter: Comparison;
    metrics: PerformanceMetric[];
    userFeedback: Testimonial[];
    lessonsLearned: string[];
    futureImprovements: string[];
  };
}

export type ProjectComplexity =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";
export type ProjectStatus =
  | "planning"
  | "in-progress"
  | "completed"
  | "maintained"
  | "archived";
export type ProjectCategory =
  | "web-app"
  | "mobile-app"
  | "desktop-app"
  | "library"
  | "tool"
  | "game"
  | "other";

// Technology Types
export interface Technology {
  name: string;
  category: TechnologyCategory;
  proficiency: ProficiencyLevel;
  yearsExperience: number;
  projects: string[]; // Project IDs
  certifications?: Certification[];
  icon?: string;
  color?: string;
  description?: string;
}

export type TechnologyCategory =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "mobile"
  | "desktop"
  | "cloud"
  | "ai-ml"
  | "blockchain"
  | "testing"
  | "design";

export type ProficiencyLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

// Skill Types
export interface Skill {
  name: string;
  category: SkillCategoryName;
  level: number; // 1-10 scale
  yearsExperience: number;
  projects: string[];
  certifications?: Certification[];
  endorsements?: Endorsement[];
  description?: string;
  keywords?: string[];
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
  color: string;
  icon?: string;
  proficiency: number; // Average proficiency in this category
}

export type SkillCategoryName =
  | "programming-languages"
  | "frameworks-libraries"
  | "databases"
  | "cloud-platforms"
  | "devops-tools"
  | "design-tools"
  | "soft-skills"
  | "methodologies";

// Experience Types
export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  responsibilities: string[];
  achievements: Achievement[];
  technologies: string[];
  location: string;
  type: EmploymentType;
  companyLogo?: string;
  companyUrl?: string;
}

export type EmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "freelance"
  | "internship";

export interface Achievement {
  title: string;
  description: string;
  date: Date;
  impact?: string;
  metrics?: MetricValue[];
  recognition?: string;
}

// GitHub Integration Types
export interface GitHubData {
  profile: GitHubProfile;
  repositories: Repository[];
  contributions: ContributionData;
  languages: LanguageStats;
  activity: ActivityData;
}

export interface GitHubProfile {
  username: string;
  name: string;
  bio: string;
  location: string;
  company: string;
  followers: number;
  following: number;
  publicRepos: number;
  avatarUrl: string;
  profileUrl: string;
  createdAt: Date;
}

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  homepage?: string;
  language: string;
  stars: number;
  forks: number;
  watchers: number;
  size: number;
  createdAt: Date;
  updatedAt: Date;
  pushedAt: Date;
  topics: string[];
  isPrivate: boolean;
  isFork: boolean;
  isArchived: boolean;
}

export interface ContributionData {
  totalContributions: number;
  weeks: ContributionWeek[];
  longestStreak: number;
  currentStreak: number;
  contributionYears: number[];
}

export interface ContributionWeek {
  week: Date;
  days: ContributionDay[];
  total: number;
}

export interface ContributionDay {
  date: Date;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface LanguageStats {
  [language: string]: {
    bytes: number;
    percentage: number;
    color: string;
  };
}

export interface ActivityData {
  recentCommits: Commit[];
  recentPullRequests: PullRequest[];
  recentIssues: Issue[];
}

// Content Types
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  excerpt: string;
  publishedAt: Date;
  updatedAt: Date;
  tags: string[];
  category: string;
  readingTime: number;
  featured: boolean;
  draft: boolean;
  seo: SEOMetadata;
  author: Author;
  coverImage?: ImageAsset;
  relatedPosts?: string[];
}

export interface Author {
  name: string;
  bio: string;
  avatar?: string;
  social: SocialLinks;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  ogType: string;
  canonicalUrl: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

// Asset Types
export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
  caption?: string;
  credit?: string;
}

export interface VideoAsset {
  src: string;
  poster?: string;
  width?: number;
  height?: number;
  duration?: number;
  caption?: string;
}

// UI Component Types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface AnimationProps {
  delay?: number;
  duration?: number;
  easing?: string;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  budget?: string;
  timeline?: string;
  projectType?: string;
  attachments?: File[];
}

export interface NewsletterFormData {
  email: string;
  name?: string;
  interests?: string[];
}

// Analytics Types
export type AnalyticsPropertyValue = 
  | string 
  | number 
  | boolean 
  | Date 
  | string[] 
  | number[] 
  | Record<string, string | number | boolean>;

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, AnalyticsPropertyValue>;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export interface PageView {
  path: string;
  title: string;
  referrer?: string;
  timestamp: Date;
  duration?: number;
  userId?: string;
  sessionId?: string;
}

// Utility Types
export interface MetricValue {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  trend?: "up" | "down" | "stable";
}

export interface Comparison {
  before: {
    label: string;
    value: string | number;
    description?: string;
  };
  after: {
    label: string;
    value: string | number;
    description?: string;
  };
  improvement: {
    percentage: number;
    description: string;
  };
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  target?: number;
  status: "good" | "needs-improvement" | "poor";
  description?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  date: Date;
  avatar?: string;
  verified: boolean;
  projectId?: string;
}

export interface Endorsement {
  endorser: string;
  position: string;
  company: string;
  relationship: string;
  content: string;
  date: Date;
  linkedinUrl?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  badge?: string;
}

export interface Challenge {
  title: string;
  description: string;
  solution: string;
  impact?: string;
  learnings?: string[];
}

export interface TechnicalDecision {
  decision: string;
  alternatives: string[];
  reasoning: string;
  tradeoffs: string[];
  outcome?: string;
}

export interface CodeSnippet {
  title: string;
  description: string;
  language: string;
  code: string;
  highlights?: number[];
  explanation?: string;
}

export interface ArchitectureDiagram {
  title: string;
  description: string;
  imageUrl: string;
  components: ArchitectureComponent[];
}

export interface ArchitectureComponent {
  name: string;
  type: string;
  description: string;
  technologies: string[];
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  website?: string;
  email?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Error Types
export type ErrorDetails = 
  | string 
  | number 
  | boolean 
  | Record<string, unknown> 
  | unknown[] 
  | Error 
  | null;

export interface AppError {
  code: string;
  message: string;
  details?: ErrorDetails;
  timestamp: Date;
  stack?: string;
}

// Theme Types (re-exported from theme.ts)
export type Theme = "light" | "dark" | "neon" | "minimal";

// Navigation Types
export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  external?: boolean;
  children?: NavigationItem[];
}

// Search Types
export interface SearchResult {
  type: "project" | "blog" | "skill" | "experience";
  id: string;
  title: string;
  description: string;
  url: string;
  relevance: number;
}

// Commit and PR types for GitHub integration
export interface Commit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: Date;
  };
  url: string;
  repository: string;
}

export interface PullRequest {
  id: number;
  title: string;
  state: "open" | "closed" | "merged";
  createdAt: Date;
  updatedAt: Date;
  url: string;
  repository: string;
}

export interface Issue {
  id: number;
  title: string;
  state: "open" | "closed";
  createdAt: Date;
  updatedAt: Date;
  url: string;
  repository: string;
}

// Re-export webpack types
export * from './webpack';
