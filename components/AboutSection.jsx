"use client";

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import MagicRings from './MagicRings';
import { Cpu, HandPointing, Rocket } from '@phosphor-icons/react';

const ringColors = [
  { color: '#ffffff', colorTwo: '#cccccc' }, // Slide 1: Who I Am
  { color: '#38bdf8', colorTwo: '#0284c7' }, // Slide 2: Sky / Blue (Description slide)
  { color: '#FF8A88', colorTwo: '#FF312E' }, // Slide 3: Electric Red
  { color: '#818cf8', colorTwo: '#c084fc' }, // Slide 4: Indigo / Purple
  { color: '#34d399', colorTwo: '#2dd4bf' }  // Slide 5: Emerald / Teal
];

export function AboutSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const timelineRef = useRef(null);

  const stats = [
    { target: 150000, suffix: "+", label: "Lines of Code" },
    { target: 20, suffix: "+", label: "Products Built" },
    { target: 2500, suffix: "+", label: "GitHub Commits" },
    { target: 99, suffix: ".9%", label: "UI Precision" }
  ];

  // GSAP Count-up animation for Slide 5 stats
  useEffect(() => {
    if (activeIndex === 4 && heroRef.current) {
      const numbers = heroRef.current.querySelectorAll('.stat-number');
      numbers.forEach(num => {
        const target = parseFloat(num.getAttribute('data-target'));
        const suffix = num.getAttribute('data-suffix') || '';
        
        gsap.fromTo(num, 
          { textContent: 0 },
          {
            textContent: target,
            duration: 1.8,
            ease: "power2.out",
            snap: { textContent: 1 },
            onUpdate: function() {
              num.innerHTML = Math.floor(this.targets()[0].textContent).toLocaleString() + suffix;
            }
          }
        );
      });
    }
  }, [activeIndex]);

  // Set up the GSAP timeline for kinetic scroll-scrubbed text transitions
  useEffect(() => {
    if (heroRef.current) {
      const lines = heroRef.current.querySelectorAll('.kinetic-line');
      if (lines.length === 0) return;

      // Kill any running timeline to prevent conflicts
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // Reset initial styles
      gsap.killTweensOf(lines);
      gsap.killTweensOf(heroRef.current);

      // Centered layout configuration for 5 lines (offset starts at 40%)
      gsap.set(heroRef.current, { yPercent: 40, opacity: 1 });
      lines.forEach((line, idx) => {
        gsap.set(line, { opacity: idx === 0 ? 1 : 0 });
      });

      // Create a paused timeline that we will scrub manually on scroll
      const tl = gsap.timeline({ paused: true });
      timelineRef.current = tl;

      const duration = 0.5; // Relative duration since it is scrubbed
      const gap = 0.5;      // Gap between entries

      lines.forEach((line, index) => {
        const startTime = index * (duration + gap);

        // Step 1: Set opacity of current line to 1 at its startTime (skip first line since it is already opacity 1)
        if (index > 0) {
          tl.set(line, { opacity: 1 }, startTime);
        }

        // Step 2: Animate current line in (rising and scaling)
        tl.fromTo(line, 
          { yPercent: 120, scale: 0.6 },
          { 
            yPercent: 0, 
            scale: 1, 
            duration: duration, 
            ease: "power2.out" 
          }, 
          startTime
        );

        // Step 3: Shift the entire hero wrapper up (20% increments for 5 slides)
        if (index > 0) {
          tl.to(heroRef.current, {
            yPercent: 40 - (index * 20),
            duration: duration,
            ease: "power2.out"
          }, startTime);
        }

        // Step 4: Fade out previous lines to keep focus perfectly on the active one
        if (index > 0) {
          const prevLines = Array.from(lines).slice(0, index);
          tl.to(prevLines, {
            opacity: 0,
            scale: 0.6,
            duration: duration,
            ease: "power2.out"
          }, startTime);
        }
      });

      // Buffer time at the end
      tl.to({}, { duration: 0.2 });
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth < 1024;
      let progress = 0;

      if (!isMobile) {
        const cardTop = 1 * window.innerHeight;
        // Card 1 (AboutSection) starts pinning at cardTop + 1600
        // Transitions text over exactly 1600px of scrolling space
        const rangeStart = cardTop + 1600;
        const rangeEnd = rangeStart + 1600;
        const currentScroll = window.scrollY;

        if (currentScroll < rangeStart) {
          progress = 0;
        } else if (currentScroll > rangeEnd) {
          progress = 1;
        } else {
          progress = (currentScroll - rangeStart) / (rangeEnd - rangeStart);
        }
      } else {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const containerHeight = rect.height;
        const windowHeight = window.innerHeight;
        const totalScrollableDistance = containerHeight - windowHeight;

        if (totalScrollableDistance > 0) {
          const scrolled = -rect.top;
          if (scrolled < 0) {
            progress = 0;
          } else if (scrolled > totalScrollableDistance) {
            progress = 1;
          } else {
            progress = scrolled / totalScrollableDistance;
          }
        }
      }

      // Update active index based on progress
      let activeIdx = 0;
      if (progress < 0.20) {
        activeIdx = 0;
      } else if (progress < 0.40) {
        activeIdx = 1;
      } else if (progress < 0.60) {
        activeIdx = 2;
      } else if (progress < 0.80) {
        activeIdx = 3;
      } else {
        activeIdx = 4;
      }
      setActiveIndex(activeIdx);

      if (timelineRef.current) {
        // Scrub the timeline directly based on scroll progress
        timelineRef.current.progress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    // Initial trigger
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[250vh] lg:h-full flex flex-col bg-transparent text-white relative overflow-visible lg:overflow-hidden select-none">
      
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden z-10">
        {/* Cinematic Ambient Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full bg-accent/4 blur-[300px] pointer-events-none z-0" />
        <div className="absolute bottom-10 left-10 w-[600px] h-[600px] rounded-full bg-accent/4 blur-[200px] pointer-events-none z-0" />

        {/* Dynamic Three.js Magic Rings Background */}
        <div className="absolute inset-0 z-0 opacity-80 mix-blend-screen pointer-events-none">
          <MagicRings 
            color={ringColors[activeIndex]?.color || '#FF312E'}
            colorTwo={ringColors[activeIndex]?.colorTwo || '#b21f1d'}
            speed={0.6}
            ringCount={8}
            attenuation={7.5}
            lineThickness={2.2}
            baseRadius={0.35}
            radiusStep={0.10}
            scaleRate={0.14}
            opacity={0.45}
            noiseAmount={0.02}
            followMouse={true}
            mouseInfluence={0.15}
            hoverScale={1.15}
            parallax={0.06}
            clickBurst={true}
          />
        </div>

        {/* Borderless Screen Slide Container */}
        <div className="w-full h-full z-10 relative flex items-center justify-center overflow-hidden">
          
          {/* Kinetic Text Animation Wrapper */}
          <div 
            ref={heroRef} 
            className="flex flex-col items-center justify-center flex-grow-0 w-full"
            style={{ height: 'fit-content' }}
          >
            {/* Line 1: Who I Am Title Slide */}
            <div className="kinetic-line opacity-0 flex flex-col justify-center items-center text-center px-6 md:px-16 w-full h-[60vh] shrink-0">
              <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight text-white font-sans">
                Who I Am
              </h1>
              <div className="h-1.5 w-24 bg-gradient-to-r from-white via-accent to-accent mt-6 rounded-full shadow-[0_0_12px_rgba(255,49,46,0.5)]" />
            </div>

            {/* Line 2: Hero Description Slide */}
            <div className="kinetic-line opacity-0 flex flex-col justify-center items-center text-center px-6 md:px-16 w-full h-[60vh] shrink-0">
              <h2 className="text-xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.3] text-white font-sans max-w-xs sm:max-w-xl md:max-w-5xl">
                I am a <span className="bg-gradient-to-r from-white via-accent to-accent bg-clip-text text-transparent">full-stack developer</span> focused on frontend systems, interaction engineering, and production-grade UX architectures.
              </h2>
            </div>

            {/* Line 3: Interfaces & Experiences */}
            <div className="kinetic-line opacity-0 flex flex-col justify-center items-center text-center px-6 md:px-16 w-full h-[60vh] shrink-0">
              <p className="text-base sm:text-2xl md:text-3xl text-white/50 font-medium tracking-wide mb-3 font-sans">
                I don&apos;t just build interfaces.
              </p>
              <h2 className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none text-white font-sans">
                I <span className="bg-gradient-to-r from-accent via-white to-white bg-clip-text text-transparent">engineer experiences.</span>
              </h2>
            </div>

            {/* Line 4: Systems, Interaction & Execution */}
            <div className="kinetic-line opacity-0 flex flex-col justify-center items-center text-center px-6 md:px-16 w-full h-[60vh] shrink-0">
              <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-accent font-bold mb-4">
                METHODOLOGY
              </span>
              <h2 className="text-xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-sans mb-4 sm:mb-10 max-w-3xl">
                I approach development through three core pillars
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 max-w-5xl w-full px-4">
                {/* Card 1: Systems */}
                <div className="group relative p-4 sm:p-6 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-white/[0.01] backdrop-blur-xl flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:border-accent/30 hover:shadow-[0_15px_30px_-10px_rgba(255,49,46,0.15)]">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-3 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Cpu size={24} weight="duotone" className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-xl font-bold text-white tracking-wider mb-1 sm:mb-2 font-sans">
                    SYSTEMS
                  </h3>
                  <div className="w-8 h-0.5 bg-accent/30 mb-2 sm:mb-4" />
                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-sans">
                    Scalable architecture, strict typescript engineering, and robust backend integrations.
                  </p>
                </div>

                {/* Card 2: Interaction */}
                <div className="group relative p-4 sm:p-6 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-white/[0.01] backdrop-blur-xl flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_15px_30px_-10px_rgba(255,255,255,0.08)]">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-3 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
                    <HandPointing size={24} weight="duotone" className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-xl font-bold text-white tracking-wider mb-1 sm:mb-2 font-sans">
                    INTERACTION
                  </h3>
                  <div className="w-8 h-0.5 bg-white/20 mb-2 sm:mb-4" />
                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-sans">
                    Cinematic animations, layout transitions, and high-fidelity interface polishing.
                  </p>
                </div>

                {/* Card 3: Execution */}
                <div className="group relative p-4 sm:p-6 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-white/[0.01] backdrop-blur-xl flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:border-secondary/30 hover:shadow-[0_15px_30px_-10px_rgba(81,80,82,0.15)]">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary mb-3 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Rocket size={24} weight="duotone" className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-xl font-bold text-white tracking-wider mb-1 sm:mb-2 font-sans">
                    EXECUTION
                  </h3>
                  <div className="w-8 h-0.5 bg-secondary/30 mb-2 sm:mb-4" />
                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-sans">
                    Lighthouse score optimization, responsive layout integrity, and production reliability.
                  </p>
                </div>
              </div>
            </div>

            {/* Line 5: Full Stack Integrity */}
            <div className="kinetic-line opacity-0 flex flex-col justify-center items-center text-center px-6 md:px-16 w-full h-[65vh] shrink-0">
              <h2 className="text-xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight text-white font-sans max-w-4xl">
                I build <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">full-stack products</span> focused on clean architecture and immersive user experience.
              </h2>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 md:gap-8 mt-6 sm:mt-10 w-full max-w-4xl px-4 z-40">
                {stats.map((stat, i) => (
                  <div key={i} className="flex flex-col items-center p-3 sm:p-5 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-md hover:border-accent/20 hover:bg-white/[0.03] transition-all duration-300 select-none">
                    <span 
                      className="stat-number text-xl sm:text-3xl md:text-4xl font-black text-white font-sans bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent"
                      data-target={stat.target} 
                      data-suffix={stat.suffix}
                    >
                      0{stat.suffix}
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-mono text-gray-500 tracking-wider uppercase mt-2 text-center">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
