'use client';

import { useState } from 'react';
import { MinimalistHero } from '@/components/ui/minimalist-hero';
import { AboutSection } from '@/components/AboutSection';
import { SkillsSection } from '@/components/SkillsSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack';
import GradualBlur from '@/components/GradualBlur';

export default function Home() {
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden relative">
      <ScrollStack
        useWindowScroll={true}
        itemDistance={1600}
        itemStackDistance={0}
        stackPosition="0%"
        scaleEndPosition="0%"
        baseScale={1.0}
        itemScale={0}
        blurAmount={24}
        showDots={true}
        className="w-full relative"
        onStackComplete={() => { }}
        onActiveIndexChange={(idx) => setActiveSectionIdx(idx)}
      >
        <ScrollStackItem>
          <div className="min-h-screen lg:h-screen w-full bg-background shadow-[0_-10px_40px_rgba(0,0,0,0.3)] relative z-10 overflow-hidden">
            <MinimalistHero />
          </div>
        </ScrollStackItem>
        <ScrollStackItem>
          <div className="min-h-screen lg:h-screen w-full bg-black/60 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] relative z-20 overflow-hidden py-12 lg:py-0">
            <AboutSection isActive={activeSectionIdx === 1} />
          </div>
        </ScrollStackItem>
        <ScrollStackItem>
          <div className="min-h-screen lg:h-screen w-full bg-black/60 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] relative z-25 overflow-hidden py-12 lg:py-0">
            <SkillsSection />
          </div>
        </ScrollStackItem>
        <ScrollStackItem>
          <div className="min-h-screen lg:h-screen w-full bg-black/60 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] relative z-28 overflow-hidden py-12 lg:py-0">
            <ExperienceSection />
          </div>
        </ScrollStackItem>
        <ScrollStackItem extraDelay={4800}>
          <div className="min-h-screen lg:h-screen w-full bg-black/60 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] relative z-30 overflow-hidden">
            <ProjectsSection />
          </div>
        </ScrollStackItem>
        <ScrollStackItem>
          <div className="min-h-screen lg:h-screen flex flex-col w-full bg-black/60 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] relative z-40 overflow-hidden py-12 lg:py-0">
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <ContactSection />
            </div>
            <Footer />
          </div>
        </ScrollStackItem>
      </ScrollStack>

      {activeSectionIdx < 4 && (
        <GradualBlur
          target="page"
          position="bottom"
          height="8rem"
          strength={3}
          divCount={8}
          curve="bezier"
          exponential={true}
          opacity={1}
          zIndex={100}
        />
      )}
    </div>
  );
}
