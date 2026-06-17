import { SkillsSection } from '@/components/SkillsSection';

export const metadata = {
  title: "Skills & Stack",
  description: "Technical skills and software engineering technologies of Chakresh Chakshu. Specializing in React, Next.js, Node.js, and modern CSS/animations.",
  keywords: ["Skills", "Tech Stack", "Next.js", "React", "TypeScript", "Node.js", "GSAP", "Tailwind CSS"],
};

export default function Skills() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <SkillsSection />
    </div>
  );
}
