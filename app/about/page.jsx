import { AboutSection } from '@/components/AboutSection';

export const metadata = {
  title: "About Me",
  description: "Learn more about Chakresh Chakshu, a Frontend Focused Full Stack Developer specializing in crafting interactive, high-performance web experiences with clean code.",
  keywords: ["Chakresh Chakshu", "About Chakresh Chakshu", "Frontend Engineer", "Interaction Designer", "Full Stack Developer"],
};

export default function About() {
  return (
    <div className="w-full min-h-screen bg-background">
      <AboutSection />
    </div>
  );
}
