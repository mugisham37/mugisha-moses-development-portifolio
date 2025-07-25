import type { Experience } from "@/types";

export const experience: Experience[] = [
  {
    id: "senior-fullstack-dev",
    company: "TechInnovate Solutions",
    position: "Senior Full Stack Developer",
    startDate: new Date("2022-03-01"),
    endDate: new Date("2024-01-31"),
    current: false,
    description:
      "Led development of enterprise-level web applications using modern technologies. Architected scalable solutions and mentored junior developers.",
    responsibilities: [
      "Architected and developed full-stack applications using React, Node.js, and PostgreSQL",
      "Led a team of 4 developers in agile development processes",
      "Implemented CI/CD pipelines reducing deployment time by 60%",
      "Optimized application performance resulting in 40% faster load times",
      "Mentored 3 junior developers and conducted code reviews",
      "Collaborated with product managers and designers on feature planning",
    ],
    achievements: [
      {
        title: "Performance Optimization Initiative",
        description:
          "Led company-wide performance optimization resulting in 40% improvement in application speed",
        date: new Date("2023-08-15"),
        impact: "Improved user satisfaction scores by 25%",
        metrics: [
          { label: "Load Time Reduction", value: "40%", unit: "percentage" },
          { label: "User Satisfaction", value: "25%", unit: "increase" },
        ],
        recognition: "Employee of the Quarter Q3 2023",
      },
      {
        title: "Microservices Architecture Migration",
        description:
          "Successfully migrated monolithic application to microservices architecture",
        date: new Date("2023-11-20"),
        impact: "Improved system scalability and reduced deployment risks",
        metrics: [
          { label: "Deployment Frequency", value: "300%", unit: "increase" },
          { label: "System Downtime", value: "80%", unit: "reduction" },
        ],
      },
    ],
    technologies: [
      "React",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Docker",
      "AWS",
      "GraphQL",
    ],
    location: "San Francisco, CA (Remote)",
    type: "full-time",
    companyLogo: "/companies/techinnovate-logo.png",
    companyUrl: "https://techinnovate.com",
  },
  {
    id: "frontend-dev",
    company: "Digital Dynamics",
    position: "Frontend Developer",
    startDate: new Date("2020-06-01"),
    endDate: new Date("2022-02-28"),
    current: false,
    description:
      "Developed responsive web applications with focus on user experience and performance. Collaborated with design teams to implement pixel-perfect interfaces.",
    responsibilities: [
      "Developed responsive web applications using React and Vue.js",
      "Implemented complex UI components with attention to accessibility",
      "Collaborated with UX/UI designers to translate designs into code",
      "Optimized applications for performance and SEO",
      "Participated in agile development processes and sprint planning",
      "Conducted user testing and implemented feedback",
    ],
    achievements: [
      {
        title: "Component Library Creation",
        description:
          "Built comprehensive component library used across 5+ projects",
        date: new Date("2021-09-10"),
        impact: "Reduced development time by 30% for new projects",
        metrics: [
          { label: "Development Time Saved", value: "30%", unit: "percentage" },
          { label: "Code Reusability", value: "85%", unit: "percentage" },
        ],
      },
      {
        title: "Accessibility Compliance Project",
        description:
          "Led initiative to achieve WCAG 2.1 AA compliance across all applications",
        date: new Date("2021-12-05"),
        impact: "Improved accessibility scores and expanded user base",
        metrics: [
          { label: "Accessibility Score", value: "95%", unit: "percentage" },
          { label: "User Base Growth", value: "15%", unit: "increase" },
        ],
      },
    ],
    technologies: [
      "React",
      "Vue.js",
      "JavaScript",
      "Sass",
      "Webpack",
      "Jest",
      "Cypress",
    ],
    location: "New York, NY",
    type: "full-time",
    companyLogo: "/companies/digital-dynamics-logo.png",
    companyUrl: "https://digitaldynamics.com",
  },
  {
    id: "junior-dev",
    company: "StartupHub",
    position: "Junior Web Developer",
    startDate: new Date("2019-01-15"),
    endDate: new Date("2020-05-31"),
    current: false,
    description:
      "Started career developing web applications and learning modern development practices. Contributed to multiple client projects and internal tools.",
    responsibilities: [
      "Developed web applications using HTML, CSS, JavaScript, and PHP",
      "Assisted in database design and implementation",
      "Participated in client meetings and requirement gathering",
      "Maintained and updated existing web applications",
      "Learned and implemented new technologies as needed",
      "Collaborated with senior developers on complex features",
    ],
    achievements: [
      {
        title: "Client Project Success",
        description:
          "Successfully delivered first major client project ahead of schedule",
        date: new Date("2019-08-20"),
        impact: "Client satisfaction and repeat business",
        metrics: [
          {
            label: "Project Delivery",
            value: "2 weeks",
            unit: "ahead of schedule",
          },
          { label: "Client Satisfaction", value: "5/5", unit: "rating" },
        ],
      },
      {
        title: "Internal Tool Development",
        description:
          "Built internal project management tool used by entire team",
        date: new Date("2020-02-14"),
        impact: "Improved team productivity and project tracking",
        metrics: [
          { label: "Team Productivity", value: "20%", unit: "increase" },
          {
            label: "Project Tracking Accuracy",
            value: "90%",
            unit: "percentage",
          },
        ],
      },
    ],
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "PHP",
      "MySQL",
      "jQuery",
      "Bootstrap",
    ],
    location: "Austin, TX",
    type: "full-time",
    companyLogo: "/companies/startuphub-logo.png",
    companyUrl: "https://startuphub.com",
  },
  {
    id: "freelance-dev",
    company: "Freelance",
    position: "Freelance Web Developer",
    startDate: new Date("2024-02-01"),
    current: true,
    description:
      "Providing web development services to various clients, specializing in modern React applications and performance optimization.",
    responsibilities: [
      "Develop custom web applications for diverse client needs",
      "Provide technical consulting and architecture recommendations",
      "Optimize existing applications for performance and SEO",
      "Implement modern development practices and tools",
      "Manage client relationships and project timelines",
      "Stay updated with latest web development trends and technologies",
    ],
    achievements: [
      {
        title: "Portfolio Website Success",
        description:
          "Built elite developer portfolio with advanced 3D animations",
        date: new Date("2024-03-20"),
        impact: "Increased client inquiries by 200%",
        metrics: [
          { label: "Client Inquiries", value: "200%", unit: "increase" },
          { label: "Performance Score", value: "98/100", unit: "Lighthouse" },
        ],
      },
    ],
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Three.js",
      "Tailwind CSS",
      "Vercel",
    ],
    location: "Global (Remote)",
    type: "freelance",
    companyLogo: "/companies/freelance-logo.png",
  },
  {
    id: "tech-lead-consultant",
    company: "Various Clients",
    position: "Technical Lead & Consultant",
    startDate: new Date("2021-01-01"),
    endDate: new Date("2022-02-28"),
    current: false,
    description:
      "Provided technical leadership and consulting services to multiple startups and established companies, focusing on architecture design and team mentoring.",
    responsibilities: [
      "Architected scalable solutions for high-growth startups",
      "Conducted technical audits and performance optimizations",
      "Mentored development teams on best practices and modern technologies",
      "Led code reviews and established development standards",
      "Provided strategic technical guidance to C-level executives",
      "Implemented CI/CD pipelines and DevOps practices",
    ],
    achievements: [
      {
        title: "Multi-Client Success",
        description:
          "Successfully delivered projects for 8 different clients with 100% satisfaction rate",
        date: new Date("2022-01-15"),
        impact: "All clients renewed contracts or provided referrals",
        metrics: [
          { label: "Client Satisfaction", value: "100%", unit: "percentage" },
          { label: "Project Success Rate", value: "100%", unit: "percentage" },
        ],
      },
      {
        title: "Performance Optimization Expertise",
        description:
          "Improved application performance by average of 60% across all client projects",
        date: new Date("2021-10-30"),
        impact: "Reduced infrastructure costs and improved user experience",
        metrics: [
          { label: "Performance Improvement", value: "60%", unit: "average" },
          { label: "Cost Reduction", value: "35%", unit: "percentage" },
        ],
      },
    ],
    technologies: [
      "React",
      "Node.js",
      "TypeScript",
      "AWS",
      "Docker",
      "PostgreSQL",
      "MongoDB",
    ],
    location: "Remote",
    type: "contract",
    companyLogo: "/companies/consulting-logo.png",
  },
  {
    id: "mobile-dev-intern",
    company: "MobileTech Innovations",
    position: "Mobile Development Intern",
    startDate: new Date("2018-06-01"),
    endDate: new Date("2018-12-31"),
    current: false,
    description:
      "Internship focused on mobile application development using React Native and native iOS/Android technologies. Gained experience in mobile-first design and cross-platform development.",
    responsibilities: [
      "Developed mobile applications using React Native",
      "Assisted in native iOS development with Swift",
      "Participated in mobile UI/UX design sessions",
      "Conducted mobile app testing on various devices",
      "Learned mobile app deployment processes",
      "Collaborated with senior developers on feature implementation",
    ],
    achievements: [
      {
        title: "Successful App Launch",
        description:
          "Contributed to mobile app that achieved 10K+ downloads in first month",
        date: new Date("2018-11-15"),
        impact: "Gained valuable mobile development experience",
        metrics: [
          { label: "App Downloads", value: "10K+", unit: "first month" },
          { label: "App Store Rating", value: "4.5/5", unit: "stars" },
        ],
      },
    ],
    technologies: [
      "React Native",
      "Swift",
      "Java",
      "Firebase",
      "Redux",
      "Expo",
    ],
    location: "Seattle, WA",
    type: "internship",
    companyLogo: "/companies/mobiletech-logo.png",
    companyUrl: "https://mobiletech-innovations.com",
  },
];
