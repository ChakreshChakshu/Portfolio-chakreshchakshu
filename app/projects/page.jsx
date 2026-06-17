import { ProjectsSection } from '@/components/ProjectsSection';

export const metadata = {
  title: "Featured Projects",
  description: "A showcase of engineering and interactive projects by Chakresh Chakshu. A portfolio of clean UI, high-performance web systems, and responsive designs.",
  keywords: ["Projects", "Portfolio", "Websites", "SaaS platforms", "Admin dashboards", "UI UX Design", "Frontend engineering"],
};

export default function Projects() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <ProjectsSection />
    </div>
  );
}
