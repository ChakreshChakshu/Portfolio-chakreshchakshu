'use client';

import { useState, useEffect } from 'react';
import { MinimalistHero } from '@/components/ui/minimalist-hero';
import { AboutSection } from '@/components/AboutSection';
import { SkillsSection } from '@/components/SkillsSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { ContactSection } from '@/components/ContactSection';
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack';

export default function Home() {
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().then((success) => {
            if (success) console.log('Stale service worker unregistered');
          });
        }
      });
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-clip lg:overflow-x-hidden relative">
      <ScrollStack
        useWindowScroll={true}
        itemDistance={1100}
        itemStackDistance={0}
        stackPosition="0%"
        scaleEndPosition="0%"
        baseScale={1.0}
        itemScale={0}
        showDots={true}
        className="w-full relative"
        onStackComplete={() => { }}
        onActiveIndexChange={(idx) => setActiveSectionIdx(idx)}
      >
        <ScrollStackItem extraDelay={-700}>
          <div className="min-h-screen lg:h-screen w-full bg-background shadow-[0_-10px_40px_rgba(0,0,0,0.3)] relative z-10 overflow-visible lg:overflow-hidden">
            <MinimalistHero />
          </div>
        </ScrollStackItem>
        <ScrollStackItem>
          <div className="min-h-screen lg:h-screen w-full bg-background shadow-[0_-10px_40px_rgba(0,0,0,0.3)] relative z-20 overflow-visible lg:overflow-hidden py-12 lg:py-0">
            <AboutSection isActive={activeSectionIdx === 1} />
          </div>
        </ScrollStackItem>
        <ScrollStackItem>
          <div className="min-h-screen lg:h-screen w-full bg-background shadow-[0_-10px_40px_rgba(0,0,0,0.3)] relative z-25 overflow-visible lg:overflow-hidden py-12 lg:py-0">
            <SkillsSection />
          </div>
        </ScrollStackItem>
        <ScrollStackItem>
          <div className="min-h-screen lg:h-screen w-full bg-background shadow-[0_-10px_40px_rgba(0,0,0,0.3)] relative z-28 overflow-visible lg:overflow-hidden py-12 lg:py-0">
            <ExperienceSection />
          </div>
        </ScrollStackItem>
        <ScrollStackItem extraDelay={4800}>
          <div className="min-h-screen lg:h-screen w-full bg-background shadow-[0_-10px_40px_rgba(0,0,0,0.3)] relative z-30 overflow-visible lg:overflow-hidden">
            <ProjectsSection />
          </div>
        </ScrollStackItem>
        <ScrollStackItem>
          <div className="min-h-screen lg:min-h-screen lg:h-auto flex flex-col w-full bg-background shadow-[0_-10px_40px_rgba(0,0,0,0.3)] relative z-40 overflow-visible pt-12 pb-0 lg:pt-20 lg:pb-0">
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
              <ContactSection />
            </div>
          </div>
        </ScrollStackItem>
      </ScrollStack>
    </div>
  );
}
