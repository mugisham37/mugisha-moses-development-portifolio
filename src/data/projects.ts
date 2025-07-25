import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "elite-portfolio",
    title: "Elite Developer Portfolio",
    description:
      "A cutting-edge portfolio showcasing advanced web development skills with 3D animations, interactive elements, and modern design patterns.",
    longDescription:
      "This portfolio represents the pinnacle of modern web development, combining Next.js 15, Three.js, and advanced animation libraries to create an immersive experience. Built with performance and accessibility in mind, it demonstrates expertise in full-stack development, 3D graphics, and user experience design.",
    technologies: [
      {
        name: "Next.js",
        category: "frontend",
        proficiency: "expert",
        yearsExperience: 4,
        projects: ["elite-portfolio"],
        icon: "nextjs",
        color: "#000000",
      },
      {
        name: "React",
        category: "frontend",
        proficiency: "expert",
        yearsExperience: 5,
        projects: ["elite-portfolio"],
        icon: "react",
        color: "#61DAFB",
      },
      {
        name: "TypeScript",
        category: "frontend",
        proficiency: "expert",
        yearsExperience: 4,
        projects: ["elite-portfolio"],
        icon: "typescript",
        color: "#3178C6",
      },
      {
        name: "Three.js",
        category: "frontend",
        proficiency: "advanced",
        yearsExperience: 2,
        projects: ["elite-portfolio"],
        icon: "threejs",
        color: "#000000",
      },
      {
        name: "Tailwind CSS",
        category: "frontend",
        proficiency: "expert",
        yearsExperience: 3,
        projects: ["elite-portfolio"],
        icon: "tailwind",
        color: "#06B6D4",
      },
      {
        name: "Framer Motion",
        category: "frontend",
        proficiency: "advanced",
        yearsExperience: 2,
        projects: ["elite-portfolio"],
        icon: "framer",
        color: "#0055FF",
      },
    ],
    images: [
      {
        src: "/projects/elite-portfolio/hero.jpg",
        alt: "Elite Portfolio Hero Section with 3D animations",
        width: 1920,
        height: 1080,
        blurDataURL:
          "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==",
        caption: "Interactive 3D hero section with particle system",
      },
      {
        src: "/projects/elite-portfolio/projects-showcase.jpg",
        alt: "Interactive projects showcase with 3D cards",
        width: 1920,
        height: 1080,
        blurDataURL:
          "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==",
        caption: "3D project cards with hover effects and animations",
      },
      {
        src: "/projects/elite-portfolio/skills-radar.jpg",
        alt: "Dynamic skills radar chart visualization",
        width: 1920,
        height: 1080,
        blurDataURL:
          "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==",
        caption: "Interactive skills radar with proficiency visualization",
      },
      {
        src: "/projects/elite-portfolio/mobile-responsive.jpg",
        alt: "Mobile responsive design showcase",
        width: 375,
        height: 812,
        caption: "Perfect mobile experience with touch optimizations",
      },
      {
        src: "/projects/elite-portfolio/performance-metrics.jpg",
        alt: "Performance metrics dashboard",
        width: 1920,
        height: 1080,
        caption: "Real-time performance monitoring and analytics",
      },
    ],
    liveUrl: "https://elite-portfolio.vercel.app",
    githubUrl: "https://github.com/developer/elite-portfolio",
    featured: true,
    complexity: "expert",
    status: "completed",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-03-20"),
    category: "web-app",
    tags: ["portfolio", "3d", "animations", "nextjs", "typescript", "react"],
    metrics: {
      githubStars: 127,
      forks: 23,
      commits: 156,
      contributors: 1,
      linesOfCode: 12500,
      testCoverage: 85,
      performanceScore: 98,
      accessibilityScore: 100,
      seoScore: 95,
      bundleSize: "245KB",
      loadTime: 1.2,
    },
    caseStudy: {
      overview: {
        problem:
          "Need to create a standout portfolio that demonstrates advanced technical skills while providing excellent user experience",
        solution:
          "Built a cutting-edge portfolio using Next.js 15, Three.js, and modern animation libraries with focus on performance and accessibility",
        impact: [
          { label: "Performance Score", value: 98, unit: "/100" },
          { label: "Accessibility Score", value: 100, unit: "/100" },
          { label: "Load Time", value: 1.2, unit: "seconds" },
        ],
        timeline: "2 months",
        role: "Full Stack Developer & Designer",
        teamSize: 1,
      },
      technicalDetails: {
        architecture: {
          title: "Modern Next.js Architecture",
          description:
            "Server-side rendered application with client-side interactivity",
          imageUrl: "/projects/elite-portfolio/architecture.png",
          components: [
            {
              name: "Next.js App Router",
              type: "Framework",
              description: "Server-side rendering and routing",
              technologies: ["Next.js", "React", "TypeScript"],
            },
            {
              name: "Three.js Scene",
              type: "3D Graphics",
              description: "Interactive 3D animations and particle systems",
              technologies: ["Three.js", "React Three Fiber", "WebGL"],
            },
          ],
        },
        codeExamples: [
          {
            title: "3D Particle System",
            description:
              "GPU-accelerated particle system with mouse interaction",
            language: "typescript",
            code: `const ParticleSystem = () => {
  const mesh = useRef<THREE.Points>(null);
  const { mouse } = useThree();
  
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.position.x = mouse.x * 0.1;
    }
  });
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1000}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} />
    </points>
  );
};`,
            explanation:
              "Creates interactive particles that respond to mouse movement",
          },
        ],
        challenges: [
          {
            title: "Performance Optimization",
            description: "Maintaining 60fps with complex 3D animations",
            solution: "Implemented LOD system and GPU-accelerated computations",
            impact: "Achieved consistent 60fps across all devices",
          },
        ],
        decisions: [
          {
            decision: "Use Three.js with React Three Fiber",
            alternatives: ["Pure Three.js", "Babylon.js", "CSS 3D transforms"],
            reasoning: "Better React integration and declarative API",
            tradeoffs: ["Larger bundle size", "Learning curve"],
            outcome: "Excellent developer experience and maintainable code",
          },
        ],
        learnings: [
          "Advanced 3D graphics programming",
          "Performance optimization techniques",
          "Accessibility in interactive applications",
        ],
      },
      results: {
        beforeAfter: {
          before: {
            label: "Previous Portfolio",
            value: "Static HTML/CSS",
            description: "Basic portfolio with limited interactivity",
          },
          after: {
            label: "Elite Portfolio",
            value: "Interactive 3D Experience",
            description: "Advanced portfolio with 3D animations and modern UX",
          },
          improvement: {
            percentage: 300,
            description:
              "Significant improvement in user engagement and technical demonstration",
          },
        },
        metrics: [
          {
            name: "Lighthouse Performance",
            value: 98,
            unit: "/100",
            target: 90,
            status: "good",
            description: "Excellent performance despite complex animations",
          },
          {
            name: "Core Web Vitals LCP",
            value: 1.2,
            unit: "seconds",
            target: 2.5,
            status: "good",
            description: "Fast loading of critical content",
          },
        ],
        userFeedback: [
          {
            id: "feedback-1",
            name: "Sarah Johnson",
            position: "Senior Recruiter",
            company: "TechCorp",
            content:
              "This portfolio immediately caught my attention. The 3D animations and smooth interactions demonstrate exceptional technical skills.",
            rating: 5,
            date: new Date("2024-03-25"),
            verified: true,
          },
        ],
        lessonsLearned: [
          "Balance between visual appeal and performance is crucial",
          "Accessibility should never be compromised for aesthetics",
          "Progressive enhancement ensures broad device compatibility",
        ],
        futureImprovements: [
          "Add WebXR support for VR/AR experiences",
          "Implement real-time collaboration features",
          "Add AI-powered content recommendations",
        ],
      },
    },
  },
  {
    id: "ecommerce-platform",
    title: "Advanced E-commerce Platform",
    description:
      "Full-stack e-commerce solution with real-time inventory, payment processing, and advanced analytics dashboard.",
    longDescription:
      "A comprehensive e-commerce platform built with modern technologies, featuring real-time inventory management, secure payment processing, advanced analytics, and a responsive admin dashboard. Designed to handle high traffic and provide excellent user experience.",
    technologies: [
      {
        name: "Next.js",
        category: "frontend",
        proficiency: "expert",
        yearsExperience: 4,
        projects: ["ecommerce-platform"],
        icon: "nextjs",
        color: "#000000",
      },
      {
        name: "Node.js",
        category: "backend",
        proficiency: "expert",
        yearsExperience: 5,
        projects: ["ecommerce-platform"],
        icon: "nodejs",
        color: "#339933",
      },
      {
        name: "PostgreSQL",
        category: "database",
        proficiency: "advanced",
        yearsExperience: 3,
        projects: ["ecommerce-platform"],
        icon: "postgresql",
        color: "#336791",
      },
      {
        name: "Stripe",
        category: "backend",
        proficiency: "advanced",
        yearsExperience: 2,
        projects: ["ecommerce-platform"],
        icon: "stripe",
        color: "#635BFF",
      },
    ],
    images: [
      {
        src: "/projects/ecommerce/dashboard.jpg",
        alt: "E-commerce admin dashboard with analytics",
        width: 1920,
        height: 1080,
      },
      {
        src: "/projects/ecommerce/storefront.jpg",
        alt: "Modern e-commerce storefront design",
        width: 1920,
        height: 1080,
      },
    ],
    liveUrl: "https://ecommerce-demo.vercel.app",
    githubUrl: "https://github.com/developer/ecommerce-platform",
    featured: true,
    complexity: "expert",
    status: "completed",
    startDate: new Date("2023-08-01"),
    endDate: new Date("2023-12-15"),
    category: "web-app",
    tags: ["ecommerce", "fullstack", "payments", "analytics", "nextjs"],
    metrics: {
      githubStars: 89,
      forks: 15,
      commits: 234,
      contributors: 2,
      linesOfCode: 18500,
      testCoverage: 78,
      performanceScore: 94,
      accessibilityScore: 96,
      seoScore: 92,
      bundleSize: "312KB",
      loadTime: 1.8,
    },
  },
  {
    id: "ai-content-generator",
    title: "AI Content Generation Tool",
    description:
      "AI-powered content generation platform with multiple models, custom templates, and collaborative editing features.",
    longDescription:
      "An innovative AI content generation platform that leverages multiple language models to create high-quality content. Features include custom templates, collaborative editing, version control, and integration with popular content management systems.",
    technologies: [
      {
        name: "React",
        category: "frontend",
        proficiency: "expert",
        yearsExperience: 5,
        projects: ["ai-content-generator"],
        icon: "react",
        color: "#61DAFB",
      },
      {
        name: "Python",
        category: "backend",
        proficiency: "advanced",
        yearsExperience: 3,
        projects: ["ai-content-generator"],
        icon: "python",
        color: "#3776AB",
      },
      {
        name: "OpenAI API",
        category: "ai-ml",
        proficiency: "advanced",
        yearsExperience: 2,
        projects: ["ai-content-generator"],
        icon: "openai",
        color: "#412991",
      },
      {
        name: "FastAPI",
        category: "backend",
        proficiency: "advanced",
        yearsExperience: 2,
        projects: ["ai-content-generator"],
        icon: "fastapi",
        color: "#009688",
      },
    ],
    images: [
      {
        src: "/projects/ai-content/editor.jpg",
        alt: "AI content editor with real-time suggestions",
        width: 1920,
        height: 1080,
      },
      {
        src: "/projects/ai-content/templates.jpg",
        alt: "Custom content templates library",
        width: 1920,
        height: 1080,
      },
    ],
    liveUrl: "https://ai-content-gen.vercel.app",
    githubUrl: "https://github.com/developer/ai-content-generator",
    featured: false,
    complexity: "advanced",
    status: "completed",
    startDate: new Date("2023-03-01"),
    endDate: new Date("2023-06-30"),
    category: "web-app",
    tags: ["ai", "content", "nlp", "collaboration", "saas"],
    metrics: {
      githubStars: 156,
      forks: 34,
      commits: 189,
      contributors: 3,
      linesOfCode: 15200,
      testCoverage: 82,
      performanceScore: 91,
      accessibilityScore: 94,
      seoScore: 88,
      bundleSize: "278KB",
      loadTime: 2.1,
    },
  },
  {
    id: "real-time-chat-app",
    title: "Real-Time Chat Application",
    description:
      "Scalable real-time chat application with WebSocket connections, message encryption, and file sharing capabilities.",
    longDescription:
      "A comprehensive real-time messaging platform built with modern web technologies. Features include end-to-end encryption, file sharing, group chats, message reactions, and offline message synchronization. Designed to handle thousands of concurrent users with optimal performance.",
    technologies: [
      {
        name: "React",
        category: "frontend",
        proficiency: "expert",
        yearsExperience: 5,
        projects: ["real-time-chat-app"],
        icon: "react",
        color: "#61DAFB",
      },
      {
        name: "Socket.io",
        category: "backend",
        proficiency: "advanced",
        yearsExperience: 2,
        projects: ["real-time-chat-app"],
        icon: "socketio",
        color: "#010101",
      },
      {
        name: "Redis",
        category: "database",
        proficiency: "advanced",
        yearsExperience: 3,
        projects: ["real-time-chat-app"],
        icon: "redis",
        color: "#DC382D",
      },
      {
        name: "MongoDB",
        category: "database",
        proficiency: "advanced",
        yearsExperience: 2,
        projects: ["real-time-chat-app"],
        icon: "mongodb",
        color: "#47A248",
      },
    ],
    images: [
      {
        src: "/projects/chat-app/main-interface.jpg",
        alt: "Real-time chat application main interface",
        width: 1920,
        height: 1080,
      },
      {
        src: "/projects/chat-app/group-chat.jpg",
        alt: "Group chat functionality with file sharing",
        width: 1920,
        height: 1080,
      },
    ],
    liveUrl: "https://chat-app-demo.vercel.app",
    githubUrl: "https://github.com/developer/real-time-chat",
    featured: false,
    complexity: "advanced",
    status: "completed",
    startDate: new Date("2023-01-10"),
    endDate: new Date("2023-04-20"),
    category: "web-app",
    tags: ["chat", "real-time", "websockets", "encryption", "react"],
    metrics: {
      githubStars: 67,
      forks: 12,
      commits: 145,
      contributors: 1,
      linesOfCode: 8900,
      testCoverage: 88,
      performanceScore: 92,
      accessibilityScore: 94,
      seoScore: 85,
      bundleSize: "189KB",
      loadTime: 1.5,
    },
  },
  {
    id: "task-management-system",
    title: "Enterprise Task Management System",
    description:
      "Comprehensive project management platform with team collaboration, time tracking, and advanced reporting features.",
    longDescription:
      "An enterprise-grade task management system designed for large teams and complex projects. Features include Kanban boards, Gantt charts, time tracking, resource allocation, custom workflows, and comprehensive reporting dashboard. Built with scalability and performance in mind.",
    technologies: [
      {
        name: "Vue.js",
        category: "frontend",
        proficiency: "advanced",
        yearsExperience: 2,
        projects: ["task-management-system"],
        icon: "vue",
        color: "#4FC08D",
      },
      {
        name: "Laravel",
        category: "backend",
        proficiency: "advanced",
        yearsExperience: 2,
        projects: ["task-management-system"],
        icon: "laravel",
        color: "#FF2D20",
      },
      {
        name: "MySQL",
        category: "database",
        proficiency: "advanced",
        yearsExperience: 4,
        projects: ["task-management-system"],
        icon: "mysql",
        color: "#4479A1",
      },
    ],
    images: [
      {
        src: "/projects/task-management/dashboard.jpg",
        alt: "Task management dashboard with analytics",
        width: 1920,
        height: 1080,
      },
      {
        src: "/projects/task-management/kanban-board.jpg",
        alt: "Interactive Kanban board interface",
        width: 1920,
        height: 1080,
      },
    ],
    liveUrl: "https://taskmanager-enterprise.com",
    githubUrl: "https://github.com/developer/task-management-system",
    featured: false,
    complexity: "expert",
    status: "maintained",
    startDate: new Date("2022-05-01"),
    endDate: new Date("2022-11-30"),
    category: "web-app",
    tags: [
      "project-management",
      "enterprise",
      "collaboration",
      "vue",
      "laravel",
    ],
    metrics: {
      githubStars: 43,
      forks: 8,
      commits: 298,
      contributors: 2,
      linesOfCode: 22000,
      testCoverage: 76,
      performanceScore: 89,
      accessibilityScore: 91,
      seoScore: 87,
      bundleSize: "456KB",
      loadTime: 2.3,
    },
  },
  {
    id: "mobile-fitness-tracker",
    title: "Mobile Fitness Tracking App",
    description:
      "Cross-platform mobile application for fitness tracking with workout plans, nutrition logging, and social features.",
    longDescription:
      "A comprehensive fitness tracking application built with React Native. Features include workout planning, exercise tracking, nutrition logging, progress analytics, social challenges, and integration with wearable devices. Designed with a focus on user engagement and motivation.",
    technologies: [
      {
        name: "React Native",
        category: "mobile",
        proficiency: "advanced",
        yearsExperience: 2,
        projects: ["mobile-fitness-tracker"],
        icon: "react",
        color: "#61DAFB",
      },
      {
        name: "Expo",
        category: "mobile",
        proficiency: "advanced",
        yearsExperience: 2,
        projects: ["mobile-fitness-tracker"],
        icon: "expo",
        color: "#000020",
      },
      {
        name: "Firebase",
        category: "backend",
        proficiency: "advanced",
        yearsExperience: 3,
        projects: ["mobile-fitness-tracker"],
        icon: "firebase",
        color: "#FFCA28",
      },
    ],
    images: [
      {
        src: "/projects/fitness-app/home-screen.jpg",
        alt: "Fitness app home screen with daily stats",
        width: 375,
        height: 812,
      },
      {
        src: "/projects/fitness-app/workout-tracking.jpg",
        alt: "Workout tracking interface",
        width: 375,
        height: 812,
      },
    ],
    liveUrl: "https://apps.apple.com/app/fitness-tracker-pro",
    githubUrl: "https://github.com/developer/mobile-fitness-tracker",
    featured: false,
    complexity: "advanced",
    status: "completed",
    startDate: new Date("2022-09-01"),
    endDate: new Date("2023-02-15"),
    category: "mobile-app",
    tags: ["fitness", "mobile", "react-native", "health", "social"],
    metrics: {
      githubStars: 92,
      forks: 18,
      commits: 187,
      contributors: 1,
      linesOfCode: 11200,
      testCoverage: 82,
      performanceScore: 95,
      accessibilityScore: 88,
      seoScore: 0, // N/A for mobile apps
      bundleSize: "12.5MB",
      loadTime: 0.8,
    },
  },
];
