import type { Skill, SkillCategory, SkillCategoryName } from "@/types";

export const skills: Skill[] = [
  // Programming Languages
  {
    name: "TypeScript",
    category: "programming-languages",
    level: 9,
    yearsExperience: 4,
    projects: ["elite-portfolio", "ecommerce-platform", "ai-content-generator"],
    description:
      "Advanced TypeScript development with complex type systems, generics, and utility types. Expert in building type-safe applications with strict configurations.",
    keywords: [
      "types",
      "generics",
      "interfaces",
      "decorators",
      "utility types",
      "strict mode",
    ],
    certifications: [
      {
        name: "TypeScript Advanced Certification",
        issuer: "Microsoft",
        date: new Date("2023-06-15"),
        credentialId: "TS-ADV-2023-001",
        credentialUrl:
          "https://learn.microsoft.com/credentials/TS-ADV-2023-001",
      },
    ],
  },
  {
    name: "JavaScript",
    category: "programming-languages",
    level: 10,
    yearsExperience: 6,
    projects: ["elite-portfolio", "ecommerce-platform", "ai-content-generator"],
    description:
      "Expert-level JavaScript including ES6+, async programming, and performance optimization",
    keywords: ["ES6+", "async/await", "closures", "prototypes", "performance"],
  },
  {
    name: "Python",
    category: "programming-languages",
    level: 8,
    yearsExperience: 3,
    projects: ["ai-content-generator"],
    description:
      "Python for backend development, AI/ML, data processing, and automation. Proficient in modern Python frameworks and data science libraries.",
    keywords: [
      "FastAPI",
      "Django",
      "pandas",
      "numpy",
      "machine learning",
      "asyncio",
      "pytest",
    ],
    certifications: [
      {
        name: "Python Institute PCPP1",
        issuer: "Python Institute",
        date: new Date("2023-03-20"),
        credentialId: "PCPP1-2023-789",
      },
    ],
  },
  {
    name: "Go",
    category: "programming-languages",
    level: 6,
    yearsExperience: 1,
    projects: [],
    description:
      "Learning Go for high-performance backend services and microservices architecture.",
    keywords: [
      "goroutines",
      "channels",
      "microservices",
      "performance",
      "concurrency",
    ],
  },
  {
    name: "Rust",
    category: "programming-languages",
    level: 5,
    yearsExperience: 1,
    projects: [],
    description:
      "Exploring Rust for systems programming and WebAssembly applications.",
    keywords: [
      "memory safety",
      "performance",
      "WebAssembly",
      "systems programming",
    ],
  },

  // Frameworks & Libraries
  {
    name: "React",
    category: "frameworks-libraries",
    level: 10,
    yearsExperience: 5,
    projects: ["elite-portfolio", "ecommerce-platform", "ai-content-generator"],
    description:
      "Expert React development with hooks, context, and performance optimization",
    keywords: ["hooks", "context", "performance", "testing", "patterns"],
    endorsements: [
      {
        endorser: "Sarah Johnson",
        position: "Senior Developer",
        company: "TechCorp",
        relationship: "Colleague",
        content:
          "Exceptional React skills with deep understanding of performance optimization",
        date: new Date("2024-01-15"),
        linkedinUrl: "https://linkedin.com/in/sarah-johnson",
      },
    ],
  },
  {
    name: "Next.js",
    category: "frameworks-libraries",
    level: 9,
    yearsExperience: 4,
    projects: ["elite-portfolio", "ecommerce-platform"],
    description:
      "Advanced Next.js development with App Router, SSR, and performance optimization",
    keywords: ["App Router", "SSR", "SSG", "API routes", "optimization"],
  },
  {
    name: "Three.js",
    category: "frameworks-libraries",
    level: 7,
    yearsExperience: 2,
    projects: ["elite-portfolio"],
    description: "3D graphics programming with Three.js and React Three Fiber",
    keywords: ["3D graphics", "WebGL", "shaders", "animations", "performance"],
  },
  {
    name: "Node.js",
    category: "frameworks-libraries",
    level: 9,
    yearsExperience: 5,
    projects: ["ecommerce-platform", "ai-content-generator"],
    description:
      "Expert backend development with Node.js, Express, Fastify, and microservices architecture. Proficient in building scalable APIs and real-time applications.",
    keywords: [
      "Express",
      "Fastify",
      "microservices",
      "REST APIs",
      "GraphQL",
      "authentication",
      "middleware",
      "WebSockets",
    ],
  },
  {
    name: "Vue.js",
    category: "frameworks-libraries",
    level: 7,
    yearsExperience: 2,
    projects: [],
    description:
      "Vue.js development with Composition API, Pinia state management, and Nuxt.js for SSR applications.",
    keywords: [
      "Composition API",
      "Pinia",
      "Nuxt.js",
      "SSR",
      "reactive programming",
    ],
  },
  {
    name: "Svelte",
    category: "frameworks-libraries",
    level: 6,
    yearsExperience: 1,
    projects: [],
    description:
      "Modern frontend development with Svelte and SvelteKit for high-performance applications.",
    keywords: [
      "SvelteKit",
      "reactive",
      "compile-time optimization",
      "performance",
    ],
  },
  {
    name: "Express.js",
    category: "frameworks-libraries",
    level: 9,
    yearsExperience: 4,
    projects: ["ecommerce-platform", "ai-content-generator"],
    description:
      "Expert Express.js development for RESTful APIs, middleware architecture, and server-side applications.",
    keywords: [
      "REST APIs",
      "middleware",
      "routing",
      "authentication",
      "error handling",
    ],
  },
  {
    name: "Tailwind CSS",
    category: "frameworks-libraries",
    level: 10,
    yearsExperience: 3,
    projects: ["elite-portfolio", "ecommerce-platform"],
    description:
      "Expert utility-first CSS framework usage with custom design systems and component libraries.",
    keywords: [
      "utility-first",
      "design systems",
      "responsive design",
      "custom components",
    ],
  },
  {
    name: "Framer Motion",
    category: "frameworks-libraries",
    level: 8,
    yearsExperience: 2,
    projects: ["elite-portfolio"],
    description:
      "Advanced animation library for React with complex gesture handling and layout animations.",
    keywords: [
      "animations",
      "gestures",
      "layout animations",
      "spring physics",
      "SVG animations",
    ],
  },

  // Databases
  {
    name: "PostgreSQL",
    category: "databases",
    level: 8,
    yearsExperience: 3,
    projects: ["ecommerce-platform"],
    description:
      "Advanced PostgreSQL with complex queries, indexing, and performance tuning",
    keywords: [
      "complex queries",
      "indexing",
      "performance",
      "migrations",
      "ACID",
    ],
  },
  {
    name: "MongoDB",
    category: "databases",
    level: 7,
    yearsExperience: 2,
    projects: ["ai-content-generator"],
    description:
      "NoSQL database design, optimization, and scaling with MongoDB. Proficient in aggregation pipelines and performance tuning.",
    keywords: [
      "NoSQL",
      "aggregation",
      "indexing",
      "sharding",
      "replication",
      "Atlas",
      "performance tuning",
    ],
  },
  {
    name: "Redis",
    category: "databases",
    level: 8,
    yearsExperience: 3,
    projects: ["ecommerce-platform"],
    description:
      "In-memory data structure store for caching, session management, and real-time applications.",
    keywords: [
      "caching",
      "session storage",
      "pub/sub",
      "data structures",
      "performance",
    ],
  },
  {
    name: "Supabase",
    category: "databases",
    level: 7,
    yearsExperience: 1,
    projects: [],
    description:
      "Open-source Firebase alternative with PostgreSQL, real-time subscriptions, and authentication.",
    keywords: [
      "PostgreSQL",
      "real-time",
      "authentication",
      "edge functions",
      "storage",
    ],
  },
  {
    name: "Prisma",
    category: "databases",
    level: 8,
    yearsExperience: 2,
    projects: ["ecommerce-platform"],
    description:
      "Type-safe database client and ORM for Node.js and TypeScript applications.",
    keywords: [
      "ORM",
      "type safety",
      "migrations",
      "schema management",
      "query builder",
    ],
  },

  // Cloud Platforms
  {
    name: "Vercel",
    category: "cloud-platforms",
    level: 9,
    yearsExperience: 3,
    projects: ["elite-portfolio", "ecommerce-platform", "ai-content-generator"],
    description: "Expert deployment and optimization on Vercel platform",
    keywords: ["deployment", "edge functions", "analytics", "performance"],
  },
  {
    name: "AWS",
    category: "cloud-platforms",
    level: 7,
    yearsExperience: 2,
    projects: ["ecommerce-platform"],
    description:
      "AWS cloud services including compute, storage, databases, and serverless functions. Experienced in cloud architecture and deployment.",
    keywords: [
      "EC2",
      "S3",
      "Lambda",
      "RDS",
      "CloudFront",
      "API Gateway",
      "CloudFormation",
      "IAM",
    ],
    certifications: [
      {
        name: "AWS Solutions Architect Associate",
        issuer: "Amazon Web Services",
        date: new Date("2023-09-10"),
        credentialId: "AWS-SAA-2023-456",
        expiryDate: new Date("2026-09-10"),
      },
    ],
  },
  {
    name: "Google Cloud Platform",
    category: "cloud-platforms",
    level: 6,
    yearsExperience: 1,
    projects: [],
    description:
      "Google Cloud services for application deployment, data analytics, and machine learning.",
    keywords: [
      "Compute Engine",
      "Cloud Storage",
      "Cloud Functions",
      "BigQuery",
      "Firebase",
    ],
  },
  {
    name: "Netlify",
    category: "cloud-platforms",
    level: 8,
    yearsExperience: 3,
    projects: ["elite-portfolio"],
    description:
      "JAMstack deployment platform with continuous deployment, serverless functions, and edge computing.",
    keywords: [
      "JAMstack",
      "continuous deployment",
      "serverless functions",
      "edge computing",
      "CDN",
    ],
  },

  // DevOps Tools
  {
    name: "Docker",
    category: "devops-tools",
    level: 8,
    yearsExperience: 3,
    projects: ["ecommerce-platform", "ai-content-generator"],
    description:
      "Containerization and orchestration with Docker and Docker Compose",
    keywords: [
      "containerization",
      "orchestration",
      "microservices",
      "deployment",
    ],
  },
  {
    name: "Git",
    category: "devops-tools",
    level: 10,
    yearsExperience: 6,
    projects: ["elite-portfolio", "ecommerce-platform", "ai-content-generator"],
    description:
      "Expert Git version control with advanced workflows, branching strategies, and team collaboration. Proficient in Git hooks and automation.",
    keywords: [
      "workflows",
      "branching",
      "merging",
      "collaboration",
      "CI/CD",
      "hooks",
      "automation",
    ],
  },
  {
    name: "GitHub Actions",
    category: "devops-tools",
    level: 8,
    yearsExperience: 3,
    projects: ["elite-portfolio", "ecommerce-platform"],
    description:
      "CI/CD automation with GitHub Actions for testing, building, and deployment workflows.",
    keywords: [
      "CI/CD",
      "automation",
      "workflows",
      "testing",
      "deployment",
      "matrix builds",
    ],
  },
  {
    name: "Kubernetes",
    category: "devops-tools",
    level: 6,
    yearsExperience: 1,
    projects: [],
    description:
      "Container orchestration and management for scalable application deployment.",
    keywords: [
      "orchestration",
      "containers",
      "scaling",
      "deployment",
      "services",
      "ingress",
    ],
  },
  {
    name: "Terraform",
    category: "devops-tools",
    level: 6,
    yearsExperience: 1,
    projects: [],
    description:
      "Infrastructure as Code for cloud resource provisioning and management.",
    keywords: [
      "IaC",
      "provisioning",
      "cloud resources",
      "state management",
      "modules",
    ],
  },
  {
    name: "Jest",
    category: "devops-tools",
    level: 9,
    yearsExperience: 4,
    projects: ["elite-portfolio", "ecommerce-platform", "ai-content-generator"],
    description:
      "JavaScript testing framework for unit tests, integration tests, and snapshot testing.",
    keywords: [
      "unit testing",
      "integration testing",
      "mocking",
      "snapshot testing",
      "coverage",
    ],
  },
  {
    name: "Cypress",
    category: "devops-tools",
    level: 8,
    yearsExperience: 2,
    projects: ["ecommerce-platform"],
    description:
      "End-to-end testing framework for web applications with real browser testing.",
    keywords: [
      "e2e testing",
      "browser testing",
      "automation",
      "visual testing",
      "debugging",
    ],
  },

  // Design Tools
  {
    name: "Figma",
    category: "design-tools",
    level: 8,
    yearsExperience: 3,
    projects: ["elite-portfolio", "ecommerce-platform"],
    description:
      "Advanced UI/UX design, prototyping, and design system creation with Figma. Proficient in component libraries and collaborative design.",
    keywords: [
      "UI design",
      "prototyping",
      "design systems",
      "collaboration",
      "components",
      "auto-layout",
    ],
  },
  {
    name: "Adobe Creative Suite",
    category: "design-tools",
    level: 7,
    yearsExperience: 4,
    projects: ["elite-portfolio"],
    description:
      "Graphic design and image editing with Photoshop, Illustrator, and After Effects for web assets.",
    keywords: [
      "Photoshop",
      "Illustrator",
      "After Effects",
      "graphic design",
      "image editing",
    ],
  },
  {
    name: "Blender",
    category: "design-tools",
    level: 6,
    yearsExperience: 1,
    projects: ["elite-portfolio"],
    description:
      "3D modeling and animation for web-based 3D experiences and asset creation.",
    keywords: [
      "3D modeling",
      "animation",
      "rendering",
      "texturing",
      "web assets",
    ],
  },

  // Soft Skills
  {
    name: "Problem Solving",
    category: "soft-skills",
    level: 10,
    yearsExperience: 6,
    projects: ["elite-portfolio", "ecommerce-platform", "ai-content-generator"],
    description: "Analytical thinking and creative problem-solving approaches",
    keywords: [
      "analytical thinking",
      "creativity",
      "debugging",
      "optimization",
    ],
  },
  {
    name: "Team Leadership",
    category: "soft-skills",
    level: 8,
    yearsExperience: 3,
    projects: ["ecommerce-platform", "ai-content-generator"],
    description: "Leading development teams and mentoring junior developers",
    keywords: [
      "leadership",
      "mentoring",
      "communication",
      "project management",
    ],
  },
  {
    name: "Communication",
    category: "soft-skills",
    level: 9,
    yearsExperience: 6,
    projects: ["elite-portfolio", "ecommerce-platform", "ai-content-generator"],
    description:
      "Excellent technical communication with stakeholders, team members, and clients. Skilled in documentation and knowledge sharing.",
    keywords: [
      "technical writing",
      "presentations",
      "stakeholder management",
      "documentation",
      "knowledge sharing",
    ],
  },
  {
    name: "Project Management",
    category: "soft-skills",
    level: 8,
    yearsExperience: 3,
    projects: ["ecommerce-platform", "ai-content-generator"],
    description:
      "Agile project management with experience in Scrum, Kanban, and cross-functional team coordination.",
    keywords: [
      "Agile",
      "Scrum",
      "Kanban",
      "team coordination",
      "sprint planning",
      "stakeholder management",
    ],
  },
  {
    name: "Mentoring",
    category: "soft-skills",
    level: 9,
    yearsExperience: 3,
    projects: ["ecommerce-platform"],
    description:
      "Mentoring junior developers, conducting code reviews, and knowledge transfer sessions.",
    keywords: [
      "code reviews",
      "knowledge transfer",
      "junior development",
      "technical guidance",
    ],
  },
  {
    name: "Critical Thinking",
    category: "soft-skills",
    level: 10,
    yearsExperience: 6,
    projects: ["elite-portfolio", "ecommerce-platform", "ai-content-generator"],
    description:
      "Analytical approach to complex problems with systematic debugging and optimization strategies.",
    keywords: [
      "analysis",
      "debugging",
      "optimization",
      "systematic approach",
      "root cause analysis",
    ],
  },
  {
    name: "Adaptability",
    category: "soft-skills",
    level: 9,
    yearsExperience: 6,
    projects: ["elite-portfolio", "ecommerce-platform", "ai-content-generator"],
    description:
      "Quick adaptation to new technologies, changing requirements, and evolving project needs. Thrives in dynamic environments.",
    keywords: [
      "technology adoption",
      "change management",
      "flexibility",
      "learning agility",
      "resilience",
    ],
  },
  {
    name: "Time Management",
    category: "soft-skills",
    level: 9,
    yearsExperience: 6,
    projects: ["elite-portfolio", "ecommerce-platform", "ai-content-generator"],
    description:
      "Excellent time management skills with ability to prioritize tasks, meet deadlines, and manage multiple projects simultaneously.",
    keywords: [
      "prioritization",
      "deadline management",
      "multitasking",
      "productivity",
      "planning",
    ],
  },
  {
    name: "Creative Problem Solving",
    category: "soft-skills",
    level: 10,
    yearsExperience: 6,
    projects: ["elite-portfolio", "ecommerce-platform", "ai-content-generator"],
    description:
      "Innovative approach to solving complex technical challenges with creative and efficient solutions.",
    keywords: [
      "innovation",
      "creativity",
      "out-of-the-box thinking",
      "solution design",
      "technical innovation",
    ],
  },
];

export const skillCategories: SkillCategory[] = [
  {
    name: "Programming Languages",
    skills: skills.filter(
      (skill) => skill.category === "programming-languages"
    ),
    color: "#3B82F6",
    icon: "code",
    proficiency: 9.0,
  },
  {
    name: "Frameworks & Libraries",
    skills: skills.filter((skill) => skill.category === "frameworks-libraries"),
    color: "#10B981",
    icon: "layers",
    proficiency: 8.8,
  },
  {
    name: "Databases",
    skills: skills.filter((skill) => skill.category === "databases"),
    color: "#F59E0B",
    icon: "database",
    proficiency: 7.5,
  },
  {
    name: "Cloud Platforms",
    skills: skills.filter((skill) => skill.category === "cloud-platforms"),
    color: "#8B5CF6",
    icon: "cloud",
    proficiency: 8.0,
  },
  {
    name: "DevOps Tools",
    skills: skills.filter((skill) => skill.category === "devops-tools"),
    color: "#EF4444",
    icon: "settings",
    proficiency: 9.0,
  },
  {
    name: "Design Tools",
    skills: skills.filter((skill) => skill.category === "design-tools"),
    color: "#EC4899",
    icon: "palette",
    proficiency: 8.0,
  },
  {
    name: "Soft Skills",
    skills: skills.filter((skill) => skill.category === "soft-skills"),
    color: "#06B6D4",
    icon: "users",
    proficiency: 9.0,
  },
];
