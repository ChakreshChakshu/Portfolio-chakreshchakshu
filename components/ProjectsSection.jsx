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

const AIDevAgentMockup = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60 group-hover:opacity-85 transition-opacity duration-500">
    <svg className="w-52 h-36 text-amber-500/30" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="60" r="30" stroke="#fca311" strokeWidth="1.5" strokeDasharray="3 3" className="group-hover:rotate-45 origin-center transition-transform duration-[2000ms]" />
      <circle cx="100" cy="60" r="15" fill="#fca311" fillOpacity="0.2" stroke="#fca311" strokeWidth="1" />
      <path d="M60 60 H85 M115 60 H140 M100 20 V45 M100 75 V100" stroke="#fca311" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="60" cy="60" r="3" fill="#fca311" />
      <circle cx="140" cy="60" r="3" fill="#fca311" />
      <circle cx="100" cy="20" r="3" fill="#fca311" />
      <circle cx="100" cy="100" r="3" fill="#fca311" />
    </svg>
  </div>
);

const DirectoryMockup = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60 group-hover:opacity-85 transition-opacity duration-500">
    <svg className="w-52 h-36 text-[#fca311]/25" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 30 H75 L85 42 H170 V100 H30 Z" stroke="#fca311" strokeWidth="1.5" fill="none" />
      <rect x="45" y="55" width="110" height="30" rx="3" fill="#fca311" fillOpacity="0.15" stroke="#fca311" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="55" y1="70" x2="145" y2="70" stroke="#fca311" strokeWidth="1.5" strokeOpacity="0.8" />
    </svg>
  </div>
);

const RoadmapMockup = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60 group-hover:opacity-85 transition-opacity duration-500">
    <svg className="w-52 h-36 text-amber-500/25" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 80 L80 40 L120 70 L160 30" stroke="#fca311" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3" className="group-hover:stroke-amber-400 transition-colors" />
      <circle cx="40" cy="80" r="4" fill="#fca311" />
      <circle cx="80" cy="40" r="4" fill="#fca311" />
      <circle cx="120" cy="70" r="4" fill="#fca311" />
      <circle cx="160" cy="30" r="5" fill="#fca311" className="animate-pulse" />
      <line x1="160" y1="30" x2="160" y2="100" stroke="#fca311" strokeWidth="0.5" strokeDasharray="2 2" />
    </svg>
  </div>
);

const SkillyardsMockup = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60 group-hover:opacity-85 transition-opacity duration-500">
    <svg className="w-52 h-36 text-blue-500/30" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 90 C 70 90, 70 40, 100 40 C 130 40, 130 80, 160 80" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />
      <g className="translate-y-0 group-hover:-translate-y-1 transition-transform duration-700">
        <rect x="25" y="75" width="30" height="20" rx="3" fill="white" stroke="#3b82f6" strokeWidth="1" />
        <circle cx="40" cy="85" r="3" fill="#fca311" />
      </g>
      <g className="translate-y-0 group-hover:-translate-y-2 transition-transform duration-700">
        <rect x="85" y="25" width="30" height="20" rx="3" fill="white" stroke="#3b82f6" strokeWidth="1" />
        <path d="M95 32 L100 37 L105 32" stroke="#3b82f6" strokeWidth="1.5" />
      </g>
      <g className="translate-y-0 group-hover:translate-y-1 transition-transform duration-700">
        <rect x="145" y="65" width="30" height="20" rx="3" fill="white" stroke="#3b82f6" strokeWidth="1" />
        <circle cx="160" cy="75" r="3" fill="#10b981" />
      </g>
    </svg>
  </div>
);

const SkillyardsAdminMockup = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60 group-hover:opacity-85 transition-opacity duration-500">
    <svg className="w-52 h-36 text-emerald-500/30" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="25" width="45" height="30" rx="3" fill="white" stroke="#10b981" strokeWidth="1" />
      <rect x="75" y="25" width="100" height="30" rx="3" fill="white" stroke="#10b981" strokeWidth="1" />
      <rect x="25" y="65" width="150" height="30" rx="3" fill="white" stroke="#10b981" strokeWidth="1" />
      <path d="M35 45 L45 35 L55 40 L60 33" stroke="#fca311" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="85" cy="40" r="3" fill="#10b981" />
      <circle cx="95" cy="40" r="3" fill="#10b981" />
      <circle cx="105" cy="40" r="3" fill="#10b981" />
      <line x1="35" y1="80" x2="165" y2="80" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  </div>
);

const QRYardsMockup = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60 group-hover:opacity-85 transition-opacity duration-500">
    <svg className="w-40 h-28 text-orange-500/30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="25" height="25" rx="2" stroke="#fca311" strokeWidth="2" />
      <rect x="15" y="15" width="15" height="15" rx="1" fill="#fca311" fillOpacity="0.3" />
      <rect x="65" y="10" width="25" height="25" rx="2" stroke="#fca311" strokeWidth="2" />
      <rect x="70" y="15" width="15" height="15" rx="1" fill="#fca311" fillOpacity="0.3" />
      <rect x="10" y="65" width="25" height="25" rx="2" stroke="#fca311" strokeWidth="2" />
      <rect x="15" y="70" width="15" height="15" rx="1" fill="#fca311" fillOpacity="0.3" />
      <rect x="45" y="20" width="8" height="8" rx="1" fill="#fca311" />
      <rect x="45" y="35" width="8" height="8" rx="1" fill="#fca311" fillOpacity="0.4" />
      <rect x="45" y="50" width="8" height="8" rx="1" fill="#fca311" />
      <rect x="65" y="45" width="8" height="8" rx="1" fill="#fca311" />
      <rect x="80" y="45" width="8" height="8" rx="1" fill="#fca311" fillOpacity="0.5" />
      <rect x="65" y="65" width="18" height="18" rx="2" stroke="#fca311" strokeWidth="1.5" />
      <rect x="70" y="70" width="8" height="8" rx="1" fill="#fca311" />
    </svg>
  </div>
);

const getMockup = (title) => {
  switch (title) {
    case "Build Directory":
      return <DirectoryMockup />;
    case "Skillyards Platform":
      return <SkillyardsMockup />;
    case "Skillyards Admin Panel":
      return <SkillyardsAdminMockup />;
    case "Skillyards CMS Platform":
      return <CMSMockup />;
    case "QRYards — QR Generator Platform":
      return <QRYardsMockup />;
    case "Future Roadmap":
      return <RoadmapMockup />;
    case "Dummy Project":
      return <AIDevAgentMockup />;
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

const getCardTheme = (title) => {
  switch (title) {
    case "Skillyards Platform":
      return {
        bg: "bg-sky-50/40 border-t-white/80 border-l-white/60 border-r-sky-200/20 border-b-sky-200/20 hover:border-sky-400/50 hover:bg-sky-50/50 shadow-[0_25px_50px_-12px_rgba(56,189,248,0.1)]",
        badge: "border-sky-200 text-sky-700 bg-sky-50/50",
        heading: "text-sky-950 group-hover:text-sky-700",
        arrow: "text-sky-400 group-hover/link:text-sky-600",
        glow: "bg-sky-500/10",
        tagText: "text-sky-600",
        actionText: "text-sky-500 hover:text-sky-800"
      };
    case "Skillyards Admin Panel":
      return {
        bg: "bg-emerald-50/40 border-t-white/80 border-l-white/60 border-r-emerald-200/20 border-b-emerald-200/20 hover:border-emerald-400/50 hover:bg-emerald-50/50 shadow-[0_25px_50px_-12px_rgba(16,185,129,0.1)]",
        badge: "border-emerald-200 text-emerald-700 bg-emerald-50/50",
        heading: "text-emerald-950 group-hover:text-emerald-700",
        arrow: "text-emerald-400 group-hover/link:text-emerald-600",
        glow: "bg-emerald-500/10",
        tagText: "text-emerald-600",
        actionText: "text-emerald-500 hover:text-emerald-800"
      };
    case "Skillyards CMS Platform":
      return {
        bg: "bg-violet-50/40 border-t-white/80 border-l-white/60 border-r-violet-200/20 border-b-violet-200/20 hover:border-violet-400/50 hover:bg-violet-50/50 shadow-[0_25px_50px_-12px_rgba(139,92,246,0.1)]",
        badge: "border-violet-200 text-violet-700 bg-violet-50/50",
        heading: "text-violet-950 group-hover:text-violet-700",
        arrow: "text-violet-400 group-hover/link:text-violet-600",
        glow: "bg-violet-500/10",
        tagText: "text-violet-600",
        actionText: "text-violet-500 hover:text-violet-800"
      };
    case "QRYards — QR Generator Platform":
      return {
        bg: "bg-orange-50/40 border-t-white/80 border-l-white/60 border-r-orange-200/20 border-b-orange-200/20 hover:border-orange-400/50 hover:bg-orange-50/50 shadow-[0_25px_50px_-12px_rgba(249,115,22,0.1)]",
        badge: "border-orange-200 text-orange-700 bg-orange-50/50",
        heading: "text-orange-950 group-hover:text-orange-700",
        arrow: "text-orange-400 group-hover/link:text-orange-600",
        glow: "bg-orange-500/10",
        tagText: "text-orange-600",
        actionText: "text-orange-500 hover:text-orange-800"
      };
    default:
      return {
        bg: "bg-white/40 border-t-white/80 border-l-white/60 border-r-white/20 border-b-white/20 hover:border-t-white hover:border-l-white hover:border-r-white/40 hover:border-b-white/40 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.12),inset_0_1px_1px_rgba(255,255,255,0.8)]",
        badge: "border-[#fca311]/40 text-[#b45309] bg-[#fca311]/5",
        heading: "text-slate-900 group-hover:text-slate-700",
        arrow: "text-slate-500 group-hover/link:text-[#b45309]",
        glow: "bg-[#fca311]/5",
        tagText: "text-[#b45309]",
        actionText: "text-slate-500 hover:text-slate-900"
      };
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
      className="w-full relative bg-gradient-to-b from-[#cbd5e1] via-[#94a3b8] to-[#64748b] pt-12 md:pt-16 pb-8 min-h-[100dvh] flex flex-col justify-start select-none overflow-hidden"
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
        <div className="absolute inset-0 bg-slate-950/10" />

        {/* Left Side Concentric Rings */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[450px] h-[450px] hidden md:block select-none opacity-25 z-0 pointer-events-none">
          <div className="absolute inset-0 rounded-full border border-slate-950/10" />
          <div className="absolute inset-10 rounded-full border border-slate-950/10" />
          <div className="absolute inset-20 rounded-full border border-slate-950/10" />
          <div className="absolute inset-30 rounded-full border border-slate-950/15 border-dashed" />
          <div className="absolute inset-40 rounded-full border border-slate-950/5" />
          <div className="absolute inset-[200px] rounded-full border border-slate-950/10" />
        </div>

        {/* Right Side Concentric Rings */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[450px] h-[450px] hidden md:block select-none opacity-25 z-0 pointer-events-none">
          <div className="absolute inset-0 rounded-full border border-slate-950/10" />
          <div className="absolute inset-10 rounded-full border border-slate-950/10" />
          <div className="absolute inset-20 rounded-full border border-slate-950/10" />
          <div className="absolute inset-30 rounded-full border border-slate-950/15 border-dashed" />
          <div className="absolute inset-40 rounded-full border border-slate-950/5" />
          <div className="absolute inset-[200px] rounded-full border border-slate-950/10" />
        </div>
        
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
        <div className="mb-6 shrink-0 relative z-10 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950 font-sans">
            Selected Builds
          </h2>
          <p className="text-xs md:text-sm text-slate-800 font-sans mt-3 max-w-2xl mx-auto leading-relaxed">
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
              {projectsData.map((project) => {
                const isIntro = project.isIntro || project.isOutro;
                const theme = getCardTheme(project.title);
                return (
                  <CardHoverReveal 
                    key={project.title}
                    className={`aspect-[4/3] rounded-2xl backdrop-blur-2xl relative overflow-hidden group flex flex-col justify-end p-0 transition-all duration-500 shrink-0 ${isIntro ? 'bg-[#0f172a]/95 border-t border-t-amber-500/35 border-l border-l-amber-500/25 border-r border-r-amber-500/10 border-b border-b-amber-500/10 hover:border-t-amber-400 hover:border-l-amber-400 shadow-[0_25px_50px_-12px_rgba(252,163,17,0.15)]' : theme.bg}`}
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
                      <div className={`absolute inset-0 z-0 ${isIntro ? 'bg-gradient-to-br from-slate-900/30 via-slate-950/90 to-black/95' : 'bg-gradient-to-br from-white/10 via-white/80 to-white/95'}`} />

                      <div className={`absolute top-1/4 right-1/4 w-[180px] h-[180px] rounded-full blur-[60px] pointer-events-none transition-all duration-700 group-hover:scale-125 ${isIntro ? 'bg-[#fca311]/10' : theme.glow}`} />

                      {/* Cinematic Rich Poster (Visible when not hovered) */}
                      <div className="absolute inset-0 flex flex-col items-center justify-between p-8 text-center z-10 transition-opacity duration-300 group-hover:opacity-0">
                        {/* Top spacer */}
                        <div className="h-6" />

                        {/* Center Title & Tag */}
                        <div className="flex flex-col items-center">
                          <span className={`text-[9px] font-mono tracking-[0.4em] uppercase mb-2 font-semibold ${isIntro ? 'text-amber-400' : theme.tagText}`}>
                            {project.tags[0]}
                          </span>
                          <h3 className={`text-xl sm:text-2xl font-black font-sans tracking-tight max-w-[320px] leading-tight ${isIntro ? 'text-white' : theme.heading}`}>
                            {project.title}
                          </h3>
                          <div className={`h-0.5 w-8 mt-4 rounded-full ${isIntro ? 'bg-amber-400/40' : theme.tagText.replace('text-', 'bg-') + '/30'}`} />
                        </div>

                        {/* Tech stack badge strip */}
                        <div className="flex flex-wrap gap-1 justify-center max-w-[280px]">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span 
                              key={tag}
                              className={`px-2 py-0.5 rounded border text-[8px] font-mono uppercase tracking-widest ${isIntro ? 'border-slate-800 bg-slate-900/60 text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' : 'border-slate-200/60 bg-white/50 ' + theme.tagText + ' shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]'}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardHoverRevealMain>

                    <CardHoverRevealContent className={`absolute inset-x-4 bottom-4 p-6 rounded-xl border backdrop-blur-xl shadow-2xl z-20 ${isIntro ? 'border-amber-500/25 bg-slate-950/95 text-white' : 'border-white/60 bg-white/95 text-slate-900'}`}>
                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline"
                            className={`px-2.5 py-0.5 text-[10px] font-mono rounded-full uppercase tracking-wider font-semibold ${isIntro ? 'border-amber-500/40 text-amber-400 bg-amber-500/5' : theme.badge}`}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Title and Link */}
                      {isIntro ? (
                        <h3 className="text-xl font-bold font-sans text-white mb-2 flex items-center justify-between">
                          {project.title}
                        </h3>
                      ) : (
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link"
                        >
                          <h3 className={`text-xl font-bold font-sans mb-2 flex items-center justify-between ${theme.heading}`}>
                            {project.title}
                            <ArrowRight size={18} className={`transition-all duration-300 ${theme.arrow}`} />
                          </h3>
                        </a>
                      )}

                      {/* Description */}
                      <p className={`text-xs font-sans leading-relaxed mb-4 ${isIntro ? 'text-slate-400' : 'text-slate-600'}`}>
                        {project.description}
                      </p>

                      <div className={`w-full h-[1px] mb-3 ${isIntro ? 'bg-slate-800' : 'bg-slate-100'}`} />
                      {project.isIntro ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400">
                          ⚡ EXPLORE SYSTEM REGISTRY →
                        </span>
                      ) : project.isOutro ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400">
                          ⚡ VIEW SYSTEM EVOLUTION →
                        </span>
                      ) : (
                        <a 
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-1 text-[10px] font-mono transition-colors duration-300 ${theme.actionText}`}
                        >
                          <Play size={10} className="current-color" /> PREVIEW LIVE DEPLOY
                        </a>
                      )}
                    </CardHoverRevealContent>
                  </CardHoverReveal>
                );
              })}

              {/* C. GORGEOUS FAKE CARD AT THE END */}
              <div 
                className="aspect-[4/3] rounded-2xl bg-[#0f172a]/95 border border-dashed border-amber-500/35 backdrop-blur-2xl relative overflow-hidden group flex flex-col justify-between p-8 hover:border-amber-400 transition-all duration-500 shadow-[0_25px_50px_-12px_rgba(252,163,17,0.15)] shrink-0"
                style={{
                  width: `${cardWidth}px`,
                  minWidth: `${cardWidth}px`,
                  maxWidth: `${cardWidth}px`
                }}
              >
                {/* Accent Grid Backdrop */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-slate-950/90 to-black/95 z-0" />
                <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl group-hover:scale-150 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-10" />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  {/* Top: Tag */}
                  <div>
                    <span className="text-[9px] font-mono tracking-[0.4em] text-amber-400 uppercase mb-2 block font-semibold">
                      ★ REPOS & SHELL SCRIPTS
                    </span>
                    <h3 className="text-2xl font-black font-sans tracking-tight text-white mt-1 group-hover:text-amber-400 transition-colors duration-300">
                      Looking for more?
                    </h3>
                  </div>

                  {/* Middle: Brief message */}
                  <p className="text-xs text-slate-400 font-sans leading-relaxed my-4 max-w-[280px]">
                    I have dozens of secondary repositories, utility scripts, and open-source packages hosted on GitHub. Let's explore the raw source code.
                  </p>

                  {/* Bottom: Call to Action */}
                  <a 
                    href="https://github.com/chakreshchakshu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-mono text-white group-hover:text-amber-400 transition-all duration-300"
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
