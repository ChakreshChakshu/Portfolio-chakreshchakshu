import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: "success",
      meta: {
        api_name: "Chakresh Dev API",
        version: "v1.4.2",
        environment: "Production",
        uptime: "99.99%",
        responseTime: "120ms"
      },
      profile: {
        name: "Chakresh Chakshu",
        role: "Frontend Engineer (Full Stack Expertise)",
        experience: "3+ Years Professional",
        location: "India",
        availability: "Open to High-Impact Opportunities"
      },
      tech_stack: {
        core: ["Next.js", "React.js", "Node.js", "PostgreSQL", "MongoDB"],
        frontend: ["TypeScript", "GSAP", "TailwindCSS", "Framer Motion", "CSS Grid/Flexbox"],
        backend: ["Express.js", "RESTful APIs", "Next.js Route Handlers"],
        databases: ["PostgreSQL", "MongoDB", "Redis", "Prisma ORM"],
        tools: ["Git", "Docker", "Figma", "VS Code", "Vercel / AWS"]
      },
      diagnostics: {
        coffee_level: "94%",
        operating_system: "Linux Bash / macOS",
        favorite_editor: "VS Code / Vim Mode",
        tabs_vs_spaces: "Spaces (2)",
        current_focus: "High-performance interface systems & fluid motion dynamics"
      },
      narrative: {
        headline: "Crafting High-Performance Interactive Architectures for the Modern Web",
        paragraphs: [
          "I am a full-stack interaction engineer dedicated to designing production-grade, immersive frontend architectures. I combine software scalability with interactive detailing to make systems feel beautiful, robust, and alive.",
          "I care deeply about speed, loading states, and response times. By optimizing code sizes, loading assets asynchronously, and utilizing Next.js Server Components, I build web structures that feel instantaneous and buttery smooth.",
          "I specialize in creating fluid interactive experiences that bridge the gap between design and engineering, combining structural clean practices with robust database foundations."
        ]
      },
      contact: {
        email: "chakreshchakshu@gmail.com",
        github: "https://github.com/chakreshchakshu",
        linkedin: "https://linkedin.com/in/chakreshchakshu"
      }
    },
    { status: 200 }
  );
}
