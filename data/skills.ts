export interface Skill {
  name: string;
  level: number;
  icon: string;
  description: string;
  tags: string[];
  years: number;
}

export const skillsData: {
  frontend: Skill[];
  backend: Skill[];
  tools: Skill[];
} = {
  frontend: [
    {
      name: "React",
      level: 95,
      icon: "⚛️",
      description: "Building highly interactive web apps, managing complex global state, and custom hook design.",
      tags: ["React 19", "Zustand", "Context API", "React Query", "Redux Toolkit"],
      years: 4
    },
    {
      name: "Next.js",
      level: 90,
      icon: "▲",
      description: "Full-stack server components architecture, ISR/SSG optimization, and API route design.",
      tags: ["App Router", "Server Components", "SEO Optimization", "Dynamic Routing", "Server Actions"],
      years: 3
    },
    {
      name: "TypeScript",
      level: 88,
      icon: "🔷",
      description: "Writing scalable, strongly-typed frontend and backend applications with robust type safety.",
      tags: ["Generics", "Type Guards", "Interfaces", "Utility Types", "TS Config"],
      years: 3
    },
    {
      name: "Tailwind CSS",
      level: 92,
      icon: "🎨",
      description: "Designing highly customized, responsive, utility-first interfaces with performance optimization.",
      tags: ["Responsive Design", "Custom Config", "Flexbox/Grid", "Dark Mode", "Animations"],
      years: 4
    },
    {
      name: "GSAP",
      level: 85,
      icon: "✨",
      description: "Crafting scroll-driven animations, SVG morphs, and complex timeline-based page transitions.",
      tags: ["ScrollTrigger", "Draggable", "CustomEase", "FLIP Transitions", "SVG Anims"],
      years: 2
    },
    {
      name: "Framer Motion",
      level: 80,
      icon: "🎬",
      description: "Creating fluid micro-interactions, page transitions, and layout-preserving components.",
      tags: ["AnimatePresence", "Layout Animations", "Variants", "Gestures", "Drag Controls"],
      years: 2
    },
  ],
  backend: [
    {
      name: "Node.js",
      level: 82,
      icon: "🟢",
      description: "Developing high-performance, asynchronous, non-blocking REST APIs and background services.",
      tags: ["Express.js", "Fastify", "Async/Await", "Event Loop", "Streams"],
      years: 3
    },
    {
      name: "PostgreSQL",
      level: 75,
      icon: "🐘",
      description: "Designing normalized database schemas, writing complex SQL queries, and indexing for speed.",
      tags: ["Drizzle ORM", "Prisma", "Transactions", "Query Optimization", "Indexing"],
      years: 2
    },
    {
      name: "MongoDB",
      level: 78,
      icon: "🍃",
      description: "Designing flexible NoSQL databases and performing complex aggregations and indexes.",
      tags: ["Mongoose", "Aggregation Pipeline", "Indexing", "Atlas Search", "GridFS"],
      years: 3
    },
    {
      name: "REST APIs",
      level: 88,
      icon: "🔗",
      description: "Designing clean, RESTful APIs following OpenAPI specifications with robust authentication.",
      tags: ["JWT Auth", "OAuth 2.0", "CORS", "Rate Limiting", "Swagger/OpenAPI"],
      years: 4
    },
  ],
  tools: [
    {
      name: "Git",
      level: 90,
      icon: "📦",
      description: "Managing version control, resolving conflicts, branching strategies, and CI/CD integrations.",
      tags: ["Git Rebase", "Cherry-picking", "Git Hooks", "Submodules", "GitHub Actions"],
      years: 5
    },
    {
      name: "Docker",
      level: 70,
      icon: "🐳",
      description: "Containerizing applications for consistent local development and production environments.",
      tags: ["Dockerfile", "Docker Compose", "Multi-stage builds", "Volumes", "Networking"],
      years: 2
    },
    {
      name: "Figma",
      level: 75,
      icon: "🎯",
      description: "Collaborating on high-fidelity designs, UI prototyping, and exporting production-ready assets.",
      tags: ["Design Systems", "Component Variants", "Prototyping", "Auto-layout", "Dev Mode"],
      years: 3
    },
    {
      name: "Vercel",
      level: 85,
      icon: "▲",
      description: "Deploying and managing production serverless frontend architectures with edge optimizations.",
      tags: ["Serverless Functions", "Analytics", "Edge Middleware", "CDN Caching", "Cron Jobs"],
      years: 3
    },
    {
      name: "Claude Code",
      level: 92,
      icon: "🤖",
      description: "Automating developer workflows, semantic refactoring, and intelligent codebase navigation.",
      tags: ["AI Tooling", "Workflow Automation", "Context Management", "AI-assisted Coding"],
      years: 1
    },
    {
      name: "Codex",
      level: 88,
      icon: "🧠",
      description: "Integrating large language models to automate programming tasks and build intelligent interfaces.",
      tags: ["LLMs", "Prompt Engineering", "Semantic Search", "OpenAI APIs"],
      years: 1
    },
    {
      name: "Agentic AI",
      level: 85,
      icon: "⚡",
      description: "Architecting autonomous agents that execute multi-step workflows, tools, and complex reasoning.",
      tags: ["LangChain", "ReAct Pattern", "Function Calling", "Tool Calling", "LangGraph"],
      years: 1
    },
  ],
};
