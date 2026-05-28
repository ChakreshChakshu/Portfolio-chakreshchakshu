"use client";

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

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

  // GSAP Count-up animation for Slide 3 stats
  useEffect(() => {
    if (activeIndex === 2 && heroRef.current) {
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

      // Centered layout configuration
      gsap.set(heroRef.current, { yPercent: 33.33, opacity: 1 });
      gsap.set(lines, { opacity: 0 });

      // Create a paused timeline that we will scrub manually on scroll
      const tl = gsap.timeline({ paused: true });
      timelineRef.current = tl;

      const duration = 0.5; // Relative duration since it is scrubbed
      const gap = 0.5;      // Gap between entries

      lines.forEach((line, index) => {
        const startTime = index * (duration + gap);

        // Step 1: Set opacity of current line to 1 at its startTime
        tl.set(line, { opacity: 1 }, startTime);

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

        // Step 3: Shift the entire hero wrapper up
        if (index > 0) {
          tl.to(heroRef.current, {
            yPercent: 33.33 - (index * 33.33),
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
    const ITEM_DISTANCE = 1600;

    const handleScroll = () => {
      const cardTop = 1 * window.innerHeight;

      // Card 1 (AboutSection) starts pinning at cardTop + 1600
      // Transitions text over exactly 1600px of scrolling space
      const rangeStart = cardTop + 1600;
      const rangeEnd = rangeStart + 1600;

      const currentScroll = window.scrollY;
      let progress = 0;

      if (currentScroll < rangeStart) {
        progress = 0;
        setActiveIndex(0);
      } else if (currentScroll > rangeEnd) {
        progress = 1;
        setActiveIndex(2);
      } else {
        progress = (currentScroll - rangeStart) / (rangeEnd - rangeStart);
        if (progress < 0.33) {
          setActiveIndex(0);
        } else if (progress < 0.66) {
          setActiveIndex(1);
        } else {
          setActiveIndex(2);
        }
      }

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
    <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-transparent text-white relative overflow-hidden select-none">
      
      {/* Cinematic Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#fca311]/4 blur-[200px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] rounded-full bg-blue-500/4 blur-[150px] pointer-events-none z-0" />

      {/* Symmetrical "About me" Header (Fixed at top of screen) */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center transition-all duration-1000 z-40">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans">
          About me
        </h2>
        <div className="h-1 w-12 bg-[#fca311] mt-3 rounded-full mx-auto" />
      </div>

      {/* Borderless Screen Slide Container */}
      <div className="w-full h-full z-10 relative flex items-center justify-center overflow-hidden">
        
        {/* Kinetic Text Animation Wrapper */}
        <div 
          ref={heroRef} 
          className="flex flex-col items-center justify-center flex-grow-0 w-full"
          style={{ height: 'fit-content' }}
        >
          {/* Line 1: Interfaces & Experiences */}
          <div className="kinetic-line opacity-0 flex flex-col justify-center items-center text-center px-6 md:px-16 w-full h-[60vh] shrink-0">
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.15] text-white font-sans max-w-6xl">
              I don't just build <br />
              <span className="text-white/40 font-bold italic select-none">interfaces.</span>
            </h2>
            
            <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight font-sans mt-10">
              I <span className="bg-gradient-to-r from-[#ffe169] via-[#fca311] to-[#d97706] bg-clip-text text-transparent underline decoration-[#fca311]/25 decoration-[3px] underline-offset-[16px] md:underline-offset-[24px]">engineer experiences.</span>
            </h3>
          </div>

          {/* Line 2: Systems, Interaction & Execution */}
          <div className="kinetic-line opacity-0 flex flex-col justify-center items-center text-center px-6 md:px-16 w-full h-[60vh] shrink-0">
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.15] text-white/50 font-sans max-w-6xl">
              I approach development through
            </h2>
            
            <div className="mt-14 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white font-sans">
              <span className="text-[#fca311] hover:scale-105 transition-transform duration-300">systems,</span>
              <span className="hidden md:inline w-3 h-3 rounded-full bg-white/20" />
              <span className="text-white hover:scale-105 transition-transform duration-300">interaction,</span>
              <span className="hidden md:inline w-3 h-3 rounded-full bg-[#fca311]/50 shadow-[0_0_12px_#fca311]" />
              <span className="bg-gradient-to-r from-indigo-300 via-violet-400 to-purple-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">execution.</span>
            </div>
            <span className="text-[10px] font-mono text-gray-500 tracking-[0.4em] uppercase mt-12 block opacity-70">
              and intentional pathing
            </span>
          </div>

          {/* Line 3: Full Stack Integrity */}
          <div className="kinetic-line opacity-0 flex flex-col justify-center items-center text-center px-6 md:px-16 w-full h-[65vh] shrink-0">
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] text-white font-sans max-w-6xl">
              I build <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">full stack products</span>
            </h2>
            
            <p className="text-xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-400 font-semibold tracking-wide leading-[1.5] max-w-5xl mt-10 font-sans">
              focused on <span className="text-white font-bold underline decoration-emerald-400/35 decoration-2 underline-offset-8">clean architecture</span>, <br className="hidden md:inline" />
              <span className="text-white font-bold underline decoration-indigo-400/35 decoration-2 underline-offset-8">strong user experiences</span>, and software <br className="hidden md:inline" />
              that feels <span className="bg-gradient-to-r from-[#ffe169] to-[#fca311] bg-clip-text text-transparent font-black">engineered</span>, not assembled.
            </p>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-10 w-full max-w-5xl px-4 z-40">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center p-4 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-md hover:border-[#fca311]/20 hover:bg-white/[0.03] transition-all duration-300 select-none">
                  <span 
                    className="stat-number text-2xl sm:text-3xl md:text-4xl font-black text-white font-sans bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent"
                    data-target={stat.target} 
                    data-suffix={stat.suffix}
                  >
                    0{stat.suffix}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500 tracking-wider uppercase mt-2 text-center">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
