'use client';

import React, { useState, useEffect, useRef } from 'react';
import { projectsData } from '@/data/projects';
import { gsap } from 'gsap';

export function ProjectsSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);
  
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const slideRefs = useRef([]);
  const cardRefs = useRef([]);
  const detailRefs = useRef([]);
  const timelineRef = useRef(null);

  // Check screen width for mobile responsive layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Extract actual projects (excluding overview cards)
  const activeProjects = projectsData.filter(p => !p.isIntro && p.imageSrc);

  // Prepend a special Interactive System Index card to the slides list!
  const slidesData = [
    {
      isIntro: true,
      title: "BUILD REPOSITORY",
      description: "A curated collection of production platforms, administrative consoles, and interactive micro-architectures built using cutting-edge client-server technologies.",
      tags: ["GSAP", "Three.js", "WebGL", "Next.js"]
    },
    ...activeProjects
  ];

  const accentColors = ["#FFFFFF", "#7DD6FF", "#D5FF37", "#FFA0B0", "#FFA17B"];
  const cardBgColors = ["#020a18", "#001d35", "#071a00", "#1c0020", "#1f0a00"];
  const bgColors = ["#02050f", "#000a1f", "#001509", "#0f021f", "#1b0a00"];
  const thumbAccents = [
    { color: '#FFFFFF', glow: 'rgba(255, 255, 255, 0.2)' },
    { color: '#7DD6FF', glow: 'rgba(125, 214, 255, 0.2)' },
    { color: '#D5FF37', glow: 'rgba(213, 255, 55, 0.2)' },
    { color: '#FFA0B0', glow: 'rgba(255, 160, 176, 0.2)' },
    { color: '#FFA17B', glow: 'rgba(255, 161, 123, 0.2)' }
  ];

  // Scroll listener for desktop (drives the GSAP timeline manually based on absolute page scroll)
  const handleScroll = () => {
    if (isMobile) return;

    const cardTop = 3 * window.innerHeight;
    const rangeStart = cardTop + 5800;
    const rangeEnd = rangeStart + 2200;

    const currentScroll = window.scrollY;
    let progress = 0;

    if (currentScroll < rangeStart) {
      progress = 0;
      setActiveIndex(0);
    } else if (currentScroll > rangeEnd) {
      progress = 1;
      setActiveIndex(slidesData.length - 1);
    } else {
      progress = (currentScroll - rangeStart) / (rangeEnd - rangeStart);
      const step = 1 / slidesData.length;
      const index = Math.min(
        Math.floor(progress / step),
        slidesData.length - 1
      );
      setActiveIndex(index);
    }

    if (timelineRef.current) {
      timelineRef.current.progress(progress);
    }
  };

  // Setup GSAP scroll-scrubbed timeline on desktop
  useEffect(() => {
    if (isMobile) return;

    const ctx = gsap.context(() => {
      if (sectionRef.current) {
        const tl = gsap.timeline({ paused: true });
        timelineRef.current = tl;

        const numSlides = slidesData.length;
        const step = 1 / numSlides;

        // Set initial state for all slides and cards
        slidesData.forEach((_, idx) => {
          const slide = slideRefs.current[idx];
          const card = cardRefs.current[idx];
          const details = detailRefs.current[idx];
          if (!slide) return;

          if (idx === 0) {
            gsap.set(slide, { scale: 1.0, opacity: 1, yPercent: 0, visibility: "visible" });
            if (card) gsap.set(card, { borderRadius: "0px" });
            if (details) gsap.set(details, { opacity: 1, y: 0 });
          } else {
            gsap.set(slide, { scale: 0.1, opacity: 0, yPercent: 100, visibility: "hidden" });
            if (card) gsap.set(card, { borderRadius: "48px" });
            if (details) gsap.set(details, { opacity: 0, y: 20 });
          }
        });

        // Build the multi-slide scroll transition timeline
        for (let i = 0; i < numSlides - 1; i++) {
          const currentSlide = slideRefs.current[i];
          const currentCard = cardRefs.current[i];
          const currentDetails = detailRefs.current[i];
          const upcomingSlide = slideRefs.current[i + 1];
          const upcomingCard = cardRefs.current[i + 1];
          const upcomingDetails = detailRefs.current[i + 1];

          const startProgress = i * step;
          const midProgress = startProgress + step * 0.4;

          // Step 1: Slide comes out of bottom, is small (scale: 0.4), showing only title
          tl.to(upcomingSlide, {
            visibility: "visible",
            opacity: 1,
            scale: 0.4,
            yPercent: 0,
            duration: step * 0.4,
            ease: "power2.out"
          }, startProgress)
          .to(upcomingCard, {
            borderRadius: "48px",
            duration: step * 0.4,
            ease: "power2.out"
          }, startProgress)
          .to(currentDetails, {
            opacity: 0,
            y: -10,
            duration: step * 0.4,
            ease: "power2.in"
          }, startProgress)

          // Step 2: Slide gets bigger to cover section (scale: 1.0), flattens corners, and reveals all info
          .to(upcomingSlide, {
            scale: 1.0,
            duration: step * 0.6,
            ease: "power3.inOut"
          }, midProgress)
          .to(upcomingCard, {
            borderRadius: "0px",
            duration: step * 0.6,
            ease: "power3.inOut"
          }, midProgress)
          .to(upcomingDetails, {
            opacity: 1,
            y: 0,
            duration: step * 0.5,
            ease: "power2.out"
          }, midProgress + step * 0.1)
          .to(currentSlide, {
            scale: 0.98,
            opacity: 0,
            duration: step * 0.6,
            ease: "power3.inOut"
          }, midProgress)
          .to(currentCard, {
            borderRadius: "48px",
            duration: step * 0.6,
            ease: "power3.inOut"
          }, midProgress);

          // Change section background color smoothly
          tl.to(sectionRef.current, {
            backgroundColor: bgColors[i + 1],
            duration: step,
            ease: "power2.inOut"
          }, startProgress);
        }
      }
    }, sectionRef);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    // Initial trigger
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      ctx.revert();
      clearTimeout(timer);
    };
  }, [isMobile, slidesData.length]);

  // Smooth mobile color transition based on scroll position
  useEffect(() => {
    if (!isMobile) return;

    const handleMobileScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const infos = container.querySelectorAll('.mobile-project-card');
      let activeIdx = 0;
      let minDiff = Infinity;
      const centerY = window.innerHeight / 2;

      infos.forEach((info, idx) => {
        const rect = info.getBoundingClientRect();
        const diff = Math.abs((rect.top + rect.height / 2) - centerY);
        if (diff < minDiff) {
          minDiff = diff;
          activeIdx = idx;
        }
      });

      if (sectionRef.current) {
        sectionRef.current.style.backgroundColor = bgColors[activeIdx % bgColors.length];
      }
    };

    window.addEventListener('scroll', handleMobileScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleMobileScroll);
  }, [isMobile]);

  // Go to a specific slide by smoothly scrolling the viewport to the slide's range index
  const goTo = (index) => {
    if (isMobile) return;

    const cardTop = 3 * window.innerHeight;
    const rangeStart = cardTop + 5800;
    
    // Calculate the target scroll position inside the 2200px scrollable space
    const targetScroll = rangeStart + (index * 2200 / slidesData.length) + 15;

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  };

  const navigate = (direction) => {
    const nextIndex = direction === 1
      ? (activeIndex < slidesData.length - 1 ? activeIndex + 1 : 0)
      : (activeIndex > 0 ? activeIndex - 1 : slidesData.length - 1);

    goTo(nextIndex);
  };

  // Keyboard navigation
  useEffect(() => {
    if (isMobile) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        navigate(1);
      } else if (e.key === "ArrowLeft") {
        navigate(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, isMobile]);

  // Generate dynamic wave lines indicator heights using mathematical spacing
  const totalLines = 60;
  const activeCenterIndex = hoverIndex !== null ? hoverIndex : activeIndex;
  
  const renderDragLines = () => {
    const lines = [];
    for (let i = 0; i < totalLines; i++) {
      const thumbWidth = totalLines / slidesData.length;
      const centerPosition = (activeCenterIndex + 0.5) * thumbWidth;
      const distFromCenter = Math.abs(i - centerPosition);
      const maxDistance = thumbWidth * 0.7;
      
      let waveHeight = 0;
      if (distFromCenter <= maxDistance) {
        const normalizedDist = distFromCenter / maxDistance;
        waveHeight = Math.cos((normalizedDist * Math.PI) / 2);
      }
      
      const height = 15 + waveHeight * 35; // base 15px, peak 50px
      const opacity = 0.3 + waveHeight * 0.4;
      
      lines.push(
        <div 
          key={i} 
          className="drag-line" 
          style={{ 
            height: `${height.toFixed(2)}px`, 
            backgroundColor: `rgba(255, 255, 255, ${opacity.toFixed(2)})` 
          }} 
        />
      );
    }
    return lines;
  };

  if (isMobile) {
    return (
      <section 
        id="projects" 
        className="w-full relative bg-[#000000] py-16 px-6 overflow-y-auto select-none"
      >
        <div className="max-w-2xl mx-auto flex flex-col gap-12 pt-8">
          <div className="flex flex-col gap-10">
            {activeProjects.map((project, i) => {
              const color = accentColors[(i + 1) % accentColors.length];
              return (
                <div 
                  key={project.title} 
                  className="mobile-project-card flex flex-col gap-6 bg-white/[0.02] border border-white/5 p-6 rounded-3xl"
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/40 mb-3 block font-bold">
                      ★ Build {i + 1}
                    </span>
                    
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white font-sans uppercase">
                      {project.title}
                    </h3>
                    
                    <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed my-4">
                      {project.description}
                    </p>

                    {/* Skills/Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="px-3 py-1 text-[10px] font-mono rounded-full border border-white/5 bg-white/[0.01] text-slate-400 uppercase tracking-wider font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Button */}
                    <a 
                      href={project.href} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-6 py-3.5 rounded-full text-black font-sans font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all duration-300" 
                      style={{ backgroundColor: color }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" className="shrink-0">
                        <path fill="#121212" d="M5 2c0 1.105-1.895 2-3 2a2 2 0 1 1 0-4c1.105 0 3 .895 3 2ZM11 3.5c0 1.105-.895 3-2 3s-2-1.895-2-3a2 2 0 1 1 4 0ZM6 9a2 2 0 1 1-4 0c0-1.105.895-3 2-3s2 1.895 2 3Z" />
                      </svg> 
                      <span>Walkthrough</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className="w-full relative bg-[#000000] h-[100vh] flex flex-col justify-start select-none overflow-hidden"
    >
      <style>{`
        #projects .slides {
          width: 100%;
          height: 100vh;
          overflow: hidden;
          display: grid;
          grid-template-rows: 100%;
          grid-template-columns: 100%;
          place-items: center;
          position: absolute;
          inset: 0;
          z-index: 10;
        }

        #projects .slide {
          width: 100%;
          height: 100%;
          grid-area: 1 / 1 / -1 / -1;
          pointer-events: none;
          opacity: 0;
          overflow: hidden;
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          will-change: transform, opacity;
        }

        #projects .slides > div:first-child {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }

        #projects .slide--current {
          pointer-events: auto;
          opacity: 1;
        }

        #projects .project-card-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 0px;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 48px;
          will-change: transform, opacity;
        }


        /* Bottom UI container */
        #projects .bottom-ui-container {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 720px;
          max-width: 100%;
          z-index: 100;
          padding-bottom: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        #projects .slide-counter {
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: space-between;
          color: #fff;
          font-size: 0.825rem;
          margin-bottom: 24px;
          font-family: monospace;
        }

        #projects .counter-display {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        #projects .counter-divider {
          opacity: 0.6;
          font-size: 0.8rem;
        }

        #projects .slide-title-container {
          width: 100%;
          text-align: center;
          height: 30px;
          overflow: hidden;
          margin-bottom: 16px;
          position: relative;
        }

        #projects .slide-title {
          position: absolute;
          width: 100%;
          color: #fff;
          font-size: 1.2rem;
          opacity: 0.8;
          transition: transform 0.5s ease, opacity 0.5s ease;
          left: 0;
        }

        #projects .drag-indicator {
          width: 100%;
          height: 50px;
          pointer-events: none;
          margin-bottom: 8px;
          position: relative;
        }

        #projects .lines-container {
          display: flex;
          height: 100%;
          width: 100%;
          position: relative;
          align-items: flex-end;
          justify-content: space-between;
        }

        #projects .drag-line {
          width: 2px;
          background-color: rgba(255, 255, 255, 0.3);
          height: 15px;
          transform-origin: bottom center;
          transition: height 0.6s cubic-bezier(0.25, 0.1, 0.25, 1),
            background-color 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        #projects .thumbs-container {
          width: 100%;
          background: rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        #projects .slide-thumbs {
          display: flex;
          position: relative;
          background: transparent;
          padding: 0;
          z-index: 11;
          gap: 0;
        }

        #projects .slide-thumb {
          flex: 1;
          height: 80px;
          cursor: pointer;
          opacity: 0.5;
          transition: opacity 0.3s;
          border: none;
          outline: none;
          box-shadow: none;
          margin: 0;
          position: relative;
          z-index: 12;
          background: rgba(255, 255, 255, 0.02);
          border-left: 1px solid rgba(255, 255, 255, 0.05);
        }

        #projects .slide-thumb:first-child {
          border-left: none;
        }

        #projects .slide-thumb:hover {
          opacity: 0.8;
          background: rgba(255, 255, 255, 0.04);
        }

        #projects .slide-thumb.active {
          opacity: 1;
          background: rgba(255, 255, 255, 0.08);
          border-top: 1px solid var(--thumb-accent);
          box-shadow: inset 0 4px 10px var(--thumb-accent-glow);
        }
      `}</style>


      {/* Main Slides Stacked Viewport */}
      <div className="slides">
        {slidesData.map((project, idx) => {
          if (project.isIntro) {
            // Render highly interactive philosophical dashboard for the landing slide!
            return (
              <div
                key="intro"
                ref={el => slideRefs.current[idx] = el}
                className="slide"
              >
                <div
                  ref={el => cardRefs.current[idx] = el}
                  className="project-card-overlay"
                  style={{ backgroundColor: cardBgColors[0] }}
                >

                  {/* Full-bleed typography */}
                  <div className="absolute inset-0 flex flex-col justify-start pt-16 px-8 lg:px-16 pointer-events-none overflow-hidden">
                    <div
                      className="font-black uppercase leading-[0.82] tracking-[-0.04em] text-white font-sans select-none"
                      style={{ fontSize: 'clamp(5rem, 14vw, 13rem)' }}
                    >
                      CRAFTED
                    </div>
                    <div
                      className="font-black uppercase leading-[0.82] tracking-[-0.04em] font-sans select-none"
                      style={{
                        fontSize: 'clamp(5rem, 14vw, 13rem)',
                        WebkitTextStroke: '2px rgba(255,255,255,0.55)',
                        color: 'transparent',
                      }}
                    >
                      WITH CODE
                    </div>
                    <div
                      className="font-black uppercase leading-[0.82] tracking-[-0.04em] text-white font-sans select-none"
                      style={{ fontSize: 'clamp(5rem, 14vw, 13rem)' }}
                    >
                      &amp; PURPOSE
                    </div>
                  </div>

                  {/* Bottom project index strip */}
                  <div
                    ref={el => detailRefs.current[idx] = el}
                    className="absolute bottom-0 left-0 right-0 border-t border-white/[0.06] pointer-events-auto"
                    style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)' }}
                  >
                    <div className="flex">
                      {activeProjects.map((proj, pIdx) => (
                        <div
                          key={proj.title}
                          onClick={() => goTo(pIdx + 1)}
                          className="group flex-1 flex flex-col gap-1 px-5 py-4 border-r border-white/[0.05] last:border-r-0 cursor-pointer hover:bg-white/[0.03] transition-all duration-300"
                        >
                          <span
                            className="text-[9px] font-mono tabular-nums font-bold"
                            style={{ color: accentColors[pIdx + 1] }}
                          >
                            0{pIdx + 1}
                          </span>
                          <span className="text-[11px] font-sans font-semibold text-white/70 group-hover:text-white transition-colors duration-300 uppercase tracking-wide truncate select-none">
                            {proj.title}
                          </span>
                          <span className="text-[9px] font-mono text-white/20 group-hover:text-white/40 transition-colors duration-300 uppercase tracking-widest select-none">
                            View ➔
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Standard Symmetrical Frosted Glass Project Build Card
          return (
            <div 
              key={project.title} 
              ref={el => slideRefs.current[idx] = el}
              className="slide"
            >
              <div
                ref={el => cardRefs.current[idx] = el}
                className="project-card-overlay"
                style={{
                  backgroundColor: cardBgColors[idx % cardBgColors.length],
                  borderColor: activeIndex === idx ? `${accentColors[idx % accentColors.length]}44` : 'rgba(255, 255, 255, 0.06)',
                }}
              >
                {/* Corner tech highlights */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20 pointer-events-none" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20 pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20 pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20 pointer-events-none" />

                {/* Build number & Project Title (ALWAYS visible in all stages!) */}
                <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/40 mb-3 block font-bold select-none">
                  ★ Build {idx}
                </span>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-white font-sans uppercase">
                  {project.title}
                </h2>

                {/* Hidden details container that slides & fades in during Step 2 */}
                <div 
                  ref={el => detailRefs.current[idx] = el}
                  className="flex flex-col items-center justify-center"
                >
                  <p className="text-sm sm:text-base md:text-lg text-slate-300 font-medium tracking-wide leading-relaxed max-w-2xl mt-5 font-sans">
                    {project.description}
                  </p>

                  {/* Skills/Tags strip */}
                  <div className="flex flex-wrap justify-center gap-2 mt-7 max-w-xl">
                    {project.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="px-3 py-1.5 text-[9px] font-mono rounded-full border border-white/5 bg-white/[0.01] text-slate-400 uppercase tracking-wider font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Accent Walkthrough button */}
                  <div className="mt-9">
                    <a 
                      href={project.href} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-6.5 py-3.5 rounded-full text-black font-sans font-bold text-xs uppercase tracking-widest hover:scale-105 hover:shadow-lg transition-all duration-300 pointer-events-auto" 
                      style={{ 
                        backgroundColor: accentColors[idx % accentColors.length],
                        boxShadow: `0 0 20px ${thumbAccents[idx % thumbAccents.length].glow}`
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" className="shrink-0">
                        <path fill="#121212" d="M5 2c0 1.105-1.895 2-3 2a2 2 0 1 1 0-4c1.105 0 3 .895 3 2ZM11 3.5c0 1.105-.895 3-2 3s-2-1.895-2-3a2 2 0 1 1 4 0ZM6 9a2 2 0 1 1-4 0c0-1.105.895-3 2-3s2 1.895 2 3Z" />
                      </svg> 
                      <span>Walkthrough</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom Cosmic Slide UI Control Container */}
      <div className="bottom-ui-container">
        {/* Dynamic Slide Counter (Centrally Focused, No Arrow Nav Buttons!) */}
        <div className="slide-counter select-none justify-center">
          <div className="counter-display">
            <span className="current-slide">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="counter-divider">//</span>
            <span className="total-slides">
              {String(slidesData.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Slide Title Indicator */}
        <div className="slide-title-container select-none">
          <div className="slide-title">
            {slidesData[activeIndex]?.title}
          </div>
        </div>

        {/* Dynamic Drag/Wave Indicator */}
        <div className="drag-indicator">
          <div className="lines-container">
            {renderDragLines()}
          </div>
        </div>

        {/* Frosted Glass Thumbnails Navigation */}
        <div 
          className="thumbs-container"
          onMouseEnter={() => setHoverIndex(activeIndex)}
          onMouseLeave={() => {
            setHoverIndex(null);
          }}
        >
          <div className="slide-thumbs">
            {slidesData.map((project, idx) => (
              <div
                key={project.title}
                onClick={() => goTo(idx)}
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
                className={`slide-thumb ${activeIndex === idx ? 'active' : ''}`}
                style={{
                  '--thumb-accent': thumbAccents[idx % thumbAccents.length].color,
                  '--thumb-accent-glow': thumbAccents[idx % thumbAccents.length].glow,
                }}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-[10px] font-mono opacity-50 select-none">
                    {idx === 0 ? "ARCHIVE" : `BUILD 0${idx}`}
                  </span>
                  <span className="text-[9px] font-mono tracking-widest uppercase font-bold mt-1 select-none text-white">
                    {idx === 0 ? "INDEX" : project.title.split(' ')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
