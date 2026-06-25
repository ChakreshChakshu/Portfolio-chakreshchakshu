import { ExperienceSection } from '@/components/ExperienceSection';

export const metadata = {
  title: "Experience & Journey",
  description: "Explore the professional experience of Chakresh Chakshu. Shipping production systems, leading frontend architecture, and building user-centric interfaces.",
  keywords: ["Experience", "Work History", "Software Engineer", "Projects", "Engineering Impact", "System Performance"],
  alternates: { canonical: "/experience" },
};

export default function Experience() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <h1 className="sr-only">Chakresh Chakshu Professional Experience & Journey</h1>
      <ExperienceSection />
    </div>
  );
}
