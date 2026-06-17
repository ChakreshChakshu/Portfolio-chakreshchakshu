import { ExperienceSection } from '@/components/ExperienceSection';

export const metadata = {
  title: "Experience & Journey",
  description: "Explore the professional experience of Chakresh Chakshu. Shipping production systems, leading frontend architecture, and building user-centric interfaces.",
  keywords: ["Experience", "Work History", "Software Engineer", "Projects", "Engineering Impact", "System Performance"],
};

export default function Experience() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <ExperienceSection />
    </div>
  );
}
