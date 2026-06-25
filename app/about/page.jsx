import { AboutSection } from '@/components/AboutSection';

export const metadata = {
  title: "About Me",
  description: "Learn more about Chakresh Chakshu, a Frontend Focused Full Stack Developer specializing in crafting interactive, high-performance web experiences with clean code.",
  keywords: ["Chakresh Chakshu", "About Chakresh Chakshu", "Frontend Engineer", "Interaction Designer", "Full Stack Developer"],
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <div className="w-full min-h-screen bg-background">
      <h1 className="sr-only">About Chakresh Chakshu, Frontend Focused Full Stack Developer</h1>
      <AboutSection />
    </div>
  );
}
