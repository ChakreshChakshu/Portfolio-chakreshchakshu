export interface Contribution {
  id: string;
  title: string;
  explanation: string;
  iconName: string;
}

export interface Metric {
  value: number;
  suffix: string;
  label: string;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  summary: string;
  contributions: Contribution[];
  metrics: Metric[];
}

export const experienceData: Experience = {
  company: "Skillyards Versatility",
  role: "Full Stack Developer",
  duration: "April 2025 — Present",
  summary: "Building and scaling the digital ecosystem behind Skillyards through frontend architecture, full stack development, and product-focused engineering.",
  contributions: [
    {
      id: "architecture",
      title: "Frontend Architecture",
      explanation: "Led frontend architecture across the Skillyards ecosystem. Authored modular component systems and performance-optimized Next.js pages.",
      iconName: "layout"
    },
    {
      id: "admin",
      title: "Admin Platform",
      explanation: "Designed and developed the complete Admin Panel UI from scratch to orchestrate internal content, courses, and operations.",
      iconName: "terminal"
    },
    {
      id: "cms",
      title: "CMS Systems",
      explanation: "Integrated Sanity CMS and GROQ query pipelines to deploy real-time schema structures and rich-text authoring engines.",
      iconName: "database"
    },
    {
      id: "qr",
      title: "QR Yards",
      explanation: "Built the QR Yards platform end-to-end, enabling high-performance custom vector QR code generation and export.",
      iconName: "qrcode"
    },
    {
      id: "auth",
      title: "Authentication",
      explanation: "Implemented secure OAuth authentication systems, middleware, and granular role-based route access controls.",
      iconName: "shield"
    }
  ],
  metrics: [
    {
      value: 4,
      suffix: "+",
      label: "Production Applications"
    },
    {
      value: 20,
      suffix: "+",
      label: "Production Screens"
    },
    {
      value: 30,
      suffix: "+",
      label: "Reusable Components"
    }
  ]
};
