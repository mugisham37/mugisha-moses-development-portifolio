import type { MetricValue, PerformanceMetric } from "@/types";

// Enhanced project metrics and KPIs
export const portfolioMetrics = {
  performance: {
    lighthouse: {
      performance: 98,
      accessibility: 100,
      bestPractices: 96,
      seo: 95,
      pwa: 92,
    },
    coreWebVitals: {
      lcp: 1.2, // Largest Contentful Paint (seconds)
      fid: 45, // First Input Delay (milliseconds)
      cls: 0.05, // Cumulative Layout Shift
    },
    bundleAnalysis: {
      totalSize: "245KB",
      gzippedSize: "89KB",
      chunkSizes: {
        main: "156KB",
        vendor: "67KB",
        runtime: "22KB",
      },
    },
    loadTimes: {
      firstByte: 180, // milliseconds
      firstContentfulPaint: 890, // milliseconds
      largestContentfulPaint: 1200, // milliseconds
      timeToInteractive: 1450, // milliseconds
    },
  },
  engagement: {
    averageSessionDuration: "4:32", // minutes:seconds
    bounceRate: 12.5, // percentage
    pageViews: 15420,
    uniqueVisitors: 8930,
    returnVisitorRate: 34.2, // percentage
    conversionRate: 8.7, // percentage (contact form submissions)
  },
  technical: {
    uptime: 99.98, // percentage
    errorRate: 0.02, // percentage
    apiResponseTime: 145, // milliseconds
    cdnHitRate: 96.8, // percentage
    imageOptimization: 87.3, // percentage savings
  },
  social: {
    githubStars: 127,
    linkedinViews: 2340,
    twitterImpressions: 8920,
    blogPostViews: 45600,
    newsletterSubscribers: 890,
  },
};

// Professional achievement metrics
export const achievementMetrics: MetricValue[] = [
  {
    label: "Years of Experience",
    value: 6,
    unit: "years",
    trend: "up",
  },
  {
    label: "Projects Completed",
    value: 50,
    unit: "projects",
    trend: "up",
  },
  {
    label: "Client Satisfaction",
    value: 98.5,
    unit: "%",
    trend: "stable",
  },
  {
    label: "Code Quality Score",
    value: 9.2,
    unit: "/10",
    trend: "up",
  },
  {
    label: "Performance Optimization",
    value: 45,
    unit: "% avg improvement",
    trend: "up",
  },
  {
    label: "Team Members Mentored",
    value: 12,
    unit: "developers",
    trend: "up",
  },
  {
    label: "Open Source Contributions",
    value: 156,
    unit: "commits",
    trend: "up",
  },
  {
    label: "Technical Articles Published",
    value: 25,
    unit: "articles",
    trend: "up",
  },
];

// Skill proficiency metrics with detailed breakdown
export const skillMetrics = {
  frontend: {
    overall: 9.2,
    breakdown: {
      react: 9.8,
      typescript: 9.5,
      nextjs: 9.3,
      css: 9.0,
      threejs: 8.5,
      animations: 8.8,
    },
  },
  backend: {
    overall: 8.7,
    breakdown: {
      nodejs: 9.2,
      python: 8.5,
      databases: 8.3,
      apis: 9.0,
      microservices: 8.2,
      serverless: 7.8,
    },
  },
  devops: {
    overall: 8.3,
    breakdown: {
      docker: 8.5,
      aws: 8.0,
      cicd: 8.8,
      monitoring: 7.9,
      kubernetes: 7.2,
      terraform: 6.8,
    },
  },
  design: {
    overall: 8.0,
    breakdown: {
      figma: 8.5,
      uxui: 8.2,
      prototyping: 7.8,
      accessibility: 9.0,
      responsive: 9.2,
      branding: 7.5,
    },
  },
  soft: {
    overall: 9.1,
    breakdown: {
      communication: 9.5,
      leadership: 8.8,
      problemSolving: 9.8,
      mentoring: 9.2,
      projectManagement: 8.5,
      adaptability: 9.3,
    },
  },
};

// Project impact metrics
export const projectImpactMetrics = {
  "elite-portfolio": {
    userEngagement: {
      averageTimeOnSite: "5:23",
      bounceRate: 8.2,
      pageViews: 12500,
      conversionRate: 12.3,
    },
    technicalMetrics: {
      performanceScore: 98,
      accessibilityScore: 100,
      loadTime: 1.2,
      bundleSize: "245KB",
    },
    businessImpact: {
      leadGeneration: 45,
      clientInquiries: 23,
      jobOffers: 8,
      speakingInvitations: 3,
    },
  },
  "ecommerce-platform": {
    businessMetrics: {
      revenueIncrease: 340,
      conversionRateImprovement: 67,
      userRetention: 89,
      customerSatisfaction: 4.8,
    },
    technicalMetrics: {
      performanceImprovement: 45,
      loadTimeReduction: 60,
      errorRateReduction: 85,
      scalabilityIncrease: 300,
    },
  },
  "ai-content-generator": {
    userMetrics: {
      activeUsers: 2340,
      contentGenerated: 45600,
      userSatisfaction: 4.6,
      retentionRate: 78,
    },
    technicalMetrics: {
      apiResponseTime: 245,
      accuracyRate: 94.2,
      uptime: 99.7,
      costOptimization: 35,
    },
  },
};

// Learning and growth metrics
export const learningMetrics = {
  currentYear: {
    newTechnologies: 8,
    coursesCompleted: 12,
    certificationsEarned: 3,
    conferencesAttended: 5,
    booksRead: 15,
    projectsStarted: 6,
  },
  skillDevelopment: {
    webgl: { progress: 75, timeInvested: "120 hours" },
    rust: { progress: 45, timeInvested: "80 hours" },
    kubernetes: { progress: 60, timeInvested: "95 hours" },
    machinelearning: { progress: 35, timeInvested: "150 hours" },
    gamedev: { progress: 25, timeInvested: "60 hours" },
  },
  goals: {
    2024: [
      "Master WebXR development",
      "Contribute to major open source project",
      "Speak at international conference",
      "Launch SaaS product",
      "Mentor 5 junior developers",
    ],
    2025: [
      "Start tech YouTube channel",
      "Write technical book",
      "Build AI-powered development tool",
      "Establish developer community",
      "Achieve AWS Solutions Architect Professional",
    ],
  },
};

// Industry recognition and awards
export const recognitionMetrics = {
  awards: [
    {
      title: "Developer of the Year",
      organization: "TechInnovate Solutions",
      year: 2023,
      category: "Technical Excellence",
    },
    {
      title: "Innovation Award",
      organization: "React Summit",
      year: 2023,
      category: "3D Web Development",
    },
    {
      title: "Community Contributor",
      organization: "GitHub",
      year: 2023,
      category: "Open Source",
    },
  ],
  rankings: {
    github: "Top 1% of developers",
    stackoverflow: "Top 5% contributor",
    linkedin: "Top Voice in Web Development",
    medium: "Top Writer in Technology",
  },
  media: [
    {
      title: "The Future of 3D Web Development",
      publication: "TechCrunch",
      date: "2023-11-15",
      type: "Interview",
    },
    {
      title: "Building Performant React Applications",
      publication: "CSS-Tricks",
      date: "2023-09-22",
      type: "Guest Article",
    },
    {
      title: "Developer Spotlight: Alex Morgan",
      publication: "Dev.to",
      date: "2023-08-10",
      type: "Feature",
    },
  ],
};

// Export all metrics for easy access
export const allMetrics = {
  portfolio: portfolioMetrics,
  achievements: achievementMetrics,
  skills: skillMetrics,
  projectImpact: projectImpactMetrics,
  learning: learningMetrics,
  recognition: recognitionMetrics,
};
