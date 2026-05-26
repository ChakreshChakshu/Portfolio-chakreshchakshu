'use client';

import React, { useState, useEffect, useRef } from 'react';
import { projectsData } from '@/data/projects';
import { Play, ArrowRight } from '@phosphor-icons/react';
import { CardHoverReveal, CardHoverRevealMain, CardHoverRevealContent } from '@/components/ui/reveal-on-hover';
import { Badge } from '@/components/ui/badge';
import { ScrollXCarousel, ScrollXCarouselContainer, ScrollXCarouselWrap } from '@/components/ui/scroll-x-carousel';
import { useMotionValue } from 'motion/react';

export function ProjectsSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [maxScrollX, setMaxScrollX] = useState(0);
  const [cardWidth, setCardWidth] = useState(320); // explicit pixel width
  
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const progressMotionValue = useMotionValue(0);

  // Sync scrollProgress to Framer MotionValue
  useEffect(() => {
    progressMotionValue.set(scrollProgress);
  }, [scrollProgress, progressMotionValue]);

  // Track scroll progress and calculate maximum horizontal scroll width
  useEffect(() => {
    const handleScroll = () => {
      const cardTop = 3 * window.innerHeight;

      // Card 3 starts pinning at cardTop + 5800.
      // Horizontal scrubbing executes over exactly 2000px.
      // Remaining pin scroll space serves as a lingering cinematic delay before Contact.
      const rangeStart = cardTop + 5800;
      const rangeEnd = rangeStart + 2000;

      const currentScroll = window.scrollY;

      if (currentScroll < rangeStart) {
        setScrollProgress(0);
      } else if (currentScroll > rangeEnd) {
        setScrollProgress(1);
      } else {
        const progress = (currentScroll - rangeStart) / (rangeEnd - rangeStart);
        setScrollProgress(progress);
      }
    };

    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;

      const screenWidth = window.innerWidth;
      
      // Bounded container visible client width
      const visibleWidth = container.clientWidth;
      
      // Exact widths: 1 card on mobile (<640px), exactly 2 cards on tablet/desktop (>=640px)
      const gap = 32; // gap-8 is 32px
      const isMobile = screenWidth < 640;
      const computedCardWidth = isMobile ? visibleWidth : (visibleWidth - gap) / 2;
      setCardWidth(computedCardWidth);

      // Synchronously compute exact future scrollWidth including +1 fake card to avoid async state measurement delays
      const totalCards = projectsData.length + 1; 
      const totalWidth = (totalCards * computedCardWidth) + ((totalCards - 1) * gap);
      setMaxScrollX(Math.max(0, totalWidth - visibleWidth));
      
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    
    // Initial trigger
    const timer = setTimeout(handleResize, 200);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section 
      id="projects" 
      className="w-full relative bg-transparent pt-12 md:pt-16 pb-8 min-h-[100dvh] flex flex-col justify-start select-none overflow-hidden"
    >
      
      {/* Bounded Content Container */}
      <div className="container mx-auto px-6 md:px-12 max-w-6xl w-full flex flex-col flex-grow" ref={containerRef}>
        
        {/* Header Block */}
        <div className="mb-6 shrink-0">
          <span className="text-[10px] font-mono tracking-[0.35em] text-[#fca311]/80 uppercase mb-2 block">
            04 / SOURCE CONTROL & DEPLOYS
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans">
            Selected Builds
          </h2>
          <div className="h-1 w-20 bg-[#fca311] mt-4 rounded-full"></div>
        </div>

        {/* ==================== BOUNDED HORIZONTAL CAROUSEL SCROLLER ==================== */}
        <ScrollXCarousel progress={progressMotionValue} className="w-full relative overflow-hidden mt-6">
          <ScrollXCarouselContainer className="relative overflow-hidden w-full">
            <ScrollXCarouselWrap 
              xRagnge={[0, -maxScrollX]}
              ref={trackRef}
              className="flex gap-8 py-6"
            >
              {/* Detailed Work Builds (Mapped list using custom CardHoverReveal with aspect-[4/3]) */}
              {projectsData.map((project) => (
                <CardHoverReveal 
                  key={project.title}
                  className="aspect-[4/3] rounded-2xl bg-[#07090e]/60 border border-white/5 relative overflow-hidden group flex flex-col justify-end p-0 hover:border-[#fca311]/25 transition-all duration-500 shadow-xl shrink-0"
                  style={{
                    width: `${cardWidth}px`,
                    minWidth: `${cardWidth}px`,
                    maxWidth: `${cardWidth}px`
                  }}
                >
                  <CardHoverRevealMain hoverScale={1.03} className="relative w-full h-full">
                    {/* Blur gradient backdrop overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#14213d]/20 via-[#07090e]/90 to-[#000000] z-0" />
                    <div className="absolute top-1/4 right-1/4 w-[180px] h-[180px] rounded-full bg-[#fca311]/5 blur-[60px] pointer-events-none transition-all duration-700 group-hover:scale-125" />
                    
                    {/* Cinematic Minimal Poster (Visible when not hovered) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 transition-opacity duration-300 group-hover:opacity-10">
                      <span className="text-[10px] font-mono tracking-[0.4em] text-[#fca311]/60 uppercase mb-3">
                        {project.tags[0]}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-white max-w-[280px]">
                        {project.title}
                      </h3>
                      <div className="h-0.5 w-8 bg-[#fca311]/30 mt-5 rounded-full" />
                    </div>
                  </CardHoverRevealMain>

                  <CardHoverRevealContent className="absolute inset-x-4 bottom-4 p-6 rounded-xl border border-white/10 bg-[#07090e]/95 backdrop-blur-xl shadow-2xl z-20">
                    {/* Tech Tags using the new Badge component */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline"
                          className="px-2.5 py-0.5 text-[10px] font-mono border-[#fca311]/30 text-[#fca311] rounded-full uppercase tracking-wider"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Title and Link */}
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link"
                    >
                      <h3 className="text-xl font-bold font-sans text-white mb-2 flex items-center justify-between">
                        {project.title}
                        <ArrowRight size={18} className="text-gray-400 group-hover/link:text-[#fca311] group-hover/link:translate-x-1.5 transition-all duration-300" />
                      </h3>
                    </a>

                    {/* Description */}
                    <p className="text-xs text-gray-400 font-sans leading-relaxed mb-4">
                      {project.description}
                    </p>

                    <div className="w-full h-[1px] bg-white/5 mb-3" />
                    <a 
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-mono text-gray-500 hover:text-white transition-colors duration-300"
                    >
                      <Play size={10} className="text-[#fca311]" /> PREVIEW LIVE DEPLOY
                    </a>
                  </CardHoverRevealContent>
                </CardHoverReveal>
              ))}

              {/* C. GORGEOUS FAKE CARD AT THE END */}
              <div 
                className="aspect-[4/3] rounded-2xl bg-[#07090e]/80 border border-dashed border-white/20 relative overflow-hidden group flex flex-col justify-between p-8 hover:border-[#fca311]/40 transition-all duration-500 shadow-xl shrink-0"
                style={{
                  width: `${cardWidth}px`,
                  minWidth: `${cardWidth}px`,
                  maxWidth: `${cardWidth}px`
                }}
              >
                {/* Accent Grid Backdrop */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#14213d]/10 via-[#07090e]/95 to-[#000000] z-0" />
                <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-[#fca311]/5 blur-2xl group-hover:scale-150 transition-all duration-700" />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  {/* Top: Tag */}
                  <div>
                    <span className="text-[9px] font-mono tracking-[0.4em] text-[#fca311]/70 uppercase mb-2 block">
                      ★ REPOS & SHELL SCRIPTS
                    </span>
                    <h3 className="text-2xl font-black font-sans tracking-tight text-white mt-1 group-hover:text-[#fca311] transition-colors duration-300">
                      Looking for more?
                    </h3>
                  </div>

                  {/* Middle: Brief message */}
                  <p className="text-xs text-gray-400 font-sans leading-relaxed my-4 max-w-[280px]">
                    I have dozens of secondary repositories, utility scripts, and open-source packages hosted on GitHub. Let's explore the raw source code.
                  </p>

                  {/* Bottom: Call to Action */}
                  <a 
                    href="https://github.com/chakreshchakshu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-mono text-white group-hover:text-[#fca311] transition-all duration-300"
                  >
                    EXPLORE ALL REPOS <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                  </a>
                </div>
              </div>

            </ScrollXCarouselWrap>
          </ScrollXCarouselContainer>
        </ScrollXCarousel>
      </div>

    </section>
  );
}
