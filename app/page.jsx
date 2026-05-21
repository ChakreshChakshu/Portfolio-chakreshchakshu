'use client';

import { MinimalistHero } from '@/components/ui/minimalist-hero';
import { AboutSection } from '@/components/AboutSection';
import { SkillsSection } from '@/components/SkillsSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <ScrollStack
        useWindowScroll={true}
        itemDistance={400}
        itemStackDistance={0}
        stackPosition="0%"
        scaleEndPosition="0%"
        baseScale={1.0}
        itemScale={0}
        blurAmount={12}
        showDots={true}
        className="w-full relative"
        onStackComplete={() => { }}
      >
        <ScrollStackItem>
          <div className="h-screen w-full bg-[#000000] shadow-[0_-10px_40px_rgba(0,0,0,0.3)] relative z-10 overflow-hidden">
            <MinimalistHero />
          </div>
        </ScrollStackItem>
        <ScrollStackItem>
          <div className="h-screen w-full bg-[#14213d] shadow-[0_-10px_40px_rgba(0,0,0,0.3)] relative z-20">
            <AboutSection />
          </div>
        </ScrollStackItem>
        <ScrollStackItem>
          <div className="h-screen w-full bg-[#000000] shadow-[0_-10px_40px_rgba(0,0,0,0.3)] relative z-25 overflow-hidden">
            <SkillsSection />
          </div>
        </ScrollStackItem>
        <ScrollStackItem>
          <div className="h-screen w-full bg-[#000000] shadow-[0_-10px_40px_rgba(0,0,0,0.3)] relative z-30">
            <ProjectsSection />
          </div>
        </ScrollStackItem>
        <ScrollStackItem>
          <div className="h-screen flex flex-col w-full bg-[#14213d] shadow-[0_-10px_40px_rgba(0,0,0,0.3)] relative z-40 overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <ContactSection />
            </div>
            <Footer />
          </div>
        </ScrollStackItem>
      </ScrollStack>
    </div>
  );
}
