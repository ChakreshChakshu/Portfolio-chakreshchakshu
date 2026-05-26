'use client';

import React, { useState, useEffect, useRef } from 'react';
import { projectsData } from '@/data/projects';
import { Play, ArrowRight } from '@phosphor-icons/react';
import { CardHoverReveal, CardHoverRevealMain, CardHoverRevealContent } from '@/components/ui/reveal-on-hover';
import { Badge } from '@/components/ui/badge';
import { ScrollXCarousel, ScrollXCarouselContainer, ScrollXCarouselWrap } from '@/components/ui/scroll-x-carousel';
import { useMotionValue } from 'motion/react';

// ==================== INTERACTIVE MOCKUPS FOR CARDS ====================

const ECommerceMockup = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60 group-hover:opacity-85 transition-opacity duration-500">
    <svg className="w-52 h-36 text-[#fca311]/30" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="20" x2="180" y2="20" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="20" y1="60" x2="180" y2="60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
      
      {/* Credit Card Shape */}
      <g className="translate-y-0 group-hover:-translate-y-1.5 transition-transform duration-700">
        <rect x="30" y="25" width="140" height="80" rx="8" fill="white" stroke="#fca311" strokeWidth="1.5" />
        <rect x="45" y="45" width="20" height="15" rx="3" fill="#fca311" fillOpacity="0.4" />
        <line x1="45" y1="75" x2="95" y2="75" stroke="#fca311" strokeWidth="2.5" strokeOpacity="0.8" />
        <line x1="45" y1="85" x2="75" y2="85" stroke="#fca311" strokeWidth="2.5" strokeOpacity="0.5" />
        <circle cx="145" cy="80" r="10" fill="#fca311" fillOpacity="0.4" />
        <circle cx="153" cy="80" r="10" fill="#3b82f6" fillOpacity="0.3" />
      </g>
    </svg>
  </div>
);

const AnalyticsMockup = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60 group-hover:opacity-85 transition-opacity duration-500">
    <svg className="w-52 h-36 text-blue-500/30" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 20 H180 M20 50 H180 M20 80 H180 M20 110 H180" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
      
      {/* Graph Line */}
      <path 
        d="M20 100 Q 50 40, 80 80 T 140 30 T 180 60" 
        stroke="#3b82f6" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        className="transition-all duration-700 group-hover:stroke-[#fca311]" 
      />
      
      <circle cx="80" cy="80" r="4" fill="#3b82f6" />
      <circle cx="140" cy="30" r="4" fill="#fca311" className="animate-pulse" />
    </svg>
  </div>
);

const SocialMockup = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60 group-hover:opacity-85 transition-opacity duration-500">
    <svg className="w-52 h-36 text-purple-500/30" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chat bubbles drifting on hover */}
      <g className="translate-x-0 group-hover:translate-x-2 transition-transform duration-700">
        <rect x="25" y="20" width="110" height="32" rx="6" fill="white" stroke="#8b5cf6" strokeWidth="1" />
        <line x1="37" y1="30" x2="115" y2="30" stroke="#8b5cf6" strokeWidth="2.5" strokeOpacity="0.8" />
        <line x1="37" y1="38" x2="85" y2="38" stroke="#8b5cf6" strokeWidth="2.5" strokeOpacity="0.5" />
      </g>
      
      <g className="translate-x-0 group-hover:-translate-x-2 transition-transform duration-700">
        <rect x="65" y="65" width="110" height="32" rx="6" fill="white" stroke="#fca311" strokeWidth="1" />
        <line x1="77" y1="75" x2="155" y2="75" stroke="#fca311" strokeWidth="2.5" strokeOpacity="0.8" />
        <line x1="77" y1="83" x2="125" y2="83" stroke="#fca311" strokeWidth="2.5" strokeOpacity="0.5" />
      </g>
    </svg>
  </div>
);

const CMSMockup = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60 group-hover:opacity-85 transition-opacity duration-500">
    <svg className="w-52 h-36 text-emerald-500/30" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="20" width="65" height="35" rx="5" fill="white" stroke="#10b981" strokeWidth="1" strokeDasharray="3 2" className="group-hover:scale-95 origin-center transition-all duration-500" />
      <rect x="98" y="20" width="75" height="35" rx="5" fill="white" stroke="#fca311" strokeWidth="1" className="group-hover:scale-105 origin-center transition-all duration-500" />
      <rect x="25" y="65" width="148" height="35" rx="5" fill="white" stroke="#10b981" strokeWidth="1" />
      <circle cx="40" cy="37" r="4" fill="#10b981" fillOpacity="0.5" />
      <line x1="50" y1="37" x2="80" y2="37" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.5" />
    </svg>
  </div>
);

const getMockup = (title) => {
  switch (title) {
    case "E-Commerce Platform":
      return <ECommerceMockup />;
    case "Analytics Dashboard":
      return <AnalyticsMockup />;
    case "Social Media App":
      return <SocialMockup />;
    case "Portfolio CMS":
      return <CMSMockup />;
    default:
      return null;
  }
};

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
      className="w-full relative bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] pt-12 md:pt-16 pb-8 min-h-[100dvh] flex flex-col justify-start select-none overflow-hidden"
    >
      {/* Premium Keyframes styles */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, -80px) scale(1.15); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translate(0, 0) scale(1.15); }
          50% { transform: translate(-80px, 60px) scale(0.9); }
        }
      `}</style>

      {/* Premium Animated Background (Liquid Glass Aurora - Light Theme) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Soft Ambient base overlays */}
        <div className="absolute inset-0 bg-white/45" />
        
        {/* Liquid Glass Orb 1: Radiant Gold/Amber with glossy specular glow */}
        <div 
          className="absolute -top-20 -left-20 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#fca311]/12 via-white/40 to-transparent blur-[80px] opacity-90"
          style={{
            animation: 'float-slow 18s ease-in-out infinite'
          }}
        />

        {/* Liquid Glass Orb 2: Bright Sky Blue with glossy specular glow */}
        <div 
          className="absolute -bottom-40 -right-20 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#38bdf8]/12 via-white/40 to-transparent blur-[90px] opacity-90"
          style={{
            animation: 'float-reverse 22s ease-in-out infinite'
          }}
        />

        {/* Liquid Glass Orb 3: Soft Fuchsia/Pink with glossy specular glow */}
        <div 
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-[#f472b6]/10 via-white/30 to-transparent blur-[80px] opacity-80"
          style={{
            animation: 'float-slow 28s ease-in-out infinite alternate'
          }}
        />
      </div>
      
      {/* Bounded Content Container */}
      <div className="container mx-auto px-6 md:px-12 max-w-6xl w-full flex flex-col flex-grow relative z-10" ref={containerRef}>
        
        {/* Header Block */}
        <div className="mb-6 shrink-0 relative z-10">
          <span className="text-[10px] font-mono tracking-[0.35em] text-[#b45309] uppercase mb-2 block">
            04 / SOURCE CONTROL & DEPLOYS
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-sans">
            Selected Builds
          </h2>
          <p className="text-xs md:text-sm text-slate-600 font-sans mt-3 max-w-xl leading-relaxed">
            A curated showcase of production-ready applications, open-source libraries, and developer tools. Each build represents a deep dive into systems design, API architecture, and user experience.
          </p>
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
                  className="aspect-[4/3] rounded-2xl bg-white/40 border-t border-t-white/80 border-l border-l-white/60 border-r border-r-white/20 border-b border-b-white/20 backdrop-blur-2xl relative overflow-hidden group flex flex-col justify-end p-0 hover:border-t-white hover:border-l-white hover:border-r-white/40 hover:border-b-white/40 transition-all duration-500 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.12),inset_0_1px_1px_rgba(255,255,255,0.8)] shrink-0"
                  style={{
                    width: `${cardWidth}px`,
                    minWidth: `${cardWidth}px`,
                    maxWidth: `${cardWidth}px`
                  }}
                >
                  <CardHoverRevealMain hoverScale={1.02} className="relative w-full h-full">
                    {/* Glossy diagonal sheen reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent pointer-events-none z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Blur gradient backdrop overlay (White/Frosted gradient in Light mode) */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/80 to-white/95 z-0" />
                    
                    {/* Exquisite animated SVG dashboard mockups matching card theme */}
                    {getMockup(project.title)}

                    <div className="absolute top-1/4 right-1/4 w-[180px] h-[180px] rounded-full bg-[#fca311]/5 blur-[60px] pointer-events-none transition-all duration-700 group-hover:scale-125" />
                    
                    {/* Status indicator top left */}
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-white/80 bg-white/90 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(15,23,42,0.05)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#b45309] animate-ping" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#b45309] absolute" />
                      <span className="text-[8px] font-mono tracking-widest text-[#b45309] uppercase pl-1 font-bold">
                        PRODUCTION ACTIVE
                      </span>
                    </div>

                    {/* Cinematic Rich Poster (Visible when not hovered) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-between p-8 text-center z-10 transition-opacity duration-300 group-hover:opacity-0">
                      {/* Top spacer */}
                      <div className="h-6" />

                      {/* Center Title & Tag */}
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-mono tracking-[0.4em] text-[#b45309] uppercase mb-2 font-semibold">
                          {project.tags[0]}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black font-sans tracking-tight text-slate-900 max-w-[320px] leading-tight">
                          {project.title}
                        </h3>
                        <div className="h-0.5 w-8 bg-[#b45309]/30 mt-4 rounded-full" />
                      </div>

                      {/* Tech stack badge strip - instantly provides rich developer content! */}
                      <div className="flex flex-wrap gap-1 justify-center max-w-[280px]">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span 
                            key={tag}
                            className="px-2 py-0.5 rounded border border-slate-200/60 bg-white/50 text-[8px] font-mono text-slate-500 uppercase tracking-widest shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardHoverRevealMain>

                  <CardHoverRevealContent className="absolute inset-x-4 bottom-4 p-6 rounded-xl border border-white/60 bg-white/95 backdrop-blur-xl shadow-2xl z-20">
                    {/* Tech Tags using the new Badge component */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline"
                          className="px-2.5 py-0.5 text-[10px] font-mono border-[#fca311]/40 text-[#b45309] bg-[#fca311]/5 rounded-full uppercase tracking-wider font-semibold"
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
                      <h3 className="text-xl font-bold font-sans text-slate-900 mb-2 flex items-center justify-between">
                        {project.title}
                        <ArrowRight size={18} className="text-slate-500 group-hover/link:text-[#b45309] group-hover/link:translate-x-1.5 transition-all duration-300" />
                      </h3>
                    </a>

                    {/* Description */}
                    <p className="text-xs text-slate-600 font-sans leading-relaxed mb-4">
                      {project.description}
                    </p>

                    <div className="w-full h-[1px] bg-slate-100 mb-3" />
                    <a 
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-mono text-slate-500 hover:text-slate-900 transition-colors duration-300"
                    >
                      <Play size={10} className="text-[#b45309]" /> PREVIEW LIVE DEPLOY
                    </a>
                  </CardHoverRevealContent>
                </CardHoverReveal>
              ))}

              {/* C. GORGEOUS FAKE CARD AT THE END */}
              <div 
                className="aspect-[4/3] rounded-2xl bg-white/40 border border-dashed border-slate-300 backdrop-blur-2xl relative overflow-hidden group flex flex-col justify-between p-8 hover:border-[#fca311]/60 transition-all duration-500 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.12),inset_0_1px_1px_rgba(255,255,255,0.8)] shrink-0"
                style={{
                  width: `${cardWidth}px`,
                  minWidth: `${cardWidth}px`,
                  maxWidth: `${cardWidth}px`
                }}
              >
                {/* Accent Grid Backdrop */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/80 to-white/95 z-0" />
                <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-[#fca311]/5 blur-2xl group-hover:scale-150 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none z-10" />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  {/* Top: Tag */}
                  <div>
                    <span className="text-[9px] font-mono tracking-[0.4em] text-[#b45309] uppercase mb-2 block font-semibold">
                      ★ REPOS & SHELL SCRIPTS
                    </span>
                    <h3 className="text-2xl font-black font-sans tracking-tight text-slate-900 mt-1 group-hover:text-[#b45309] transition-colors duration-300">
                      Looking for more?
                    </h3>
                  </div>

                  {/* Middle: Brief message */}
                  <p className="text-xs text-slate-600 font-sans leading-relaxed my-4 max-w-[280px]">
                    I have dozens of secondary repositories, utility scripts, and open-source packages hosted on GitHub. Let's explore the raw source code.
                  </p>

                  {/* Bottom: Call to Action */}
                  <a 
                    href="https://github.com/chakreshchakshu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-mono text-slate-900 group-hover:text-[#b45309] transition-all duration-300"
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
