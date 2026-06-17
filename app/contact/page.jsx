import { ContactSection } from '@/components/ContactSection';

export const metadata = {
  title: "Contact & Connect",
  description: "Get in touch with Chakresh Chakshu. Let's discuss collaborations, freelance opportunities, or full-time frontend/full-stack engineering roles.",
  keywords: ["Contact", "Hire", "Freelancer", "Full Stack Developer", "Get in Touch", "Chakresh Chakshu Email"],
};

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden pt-20">
      <ContactSection />
    </div>
  );
}
