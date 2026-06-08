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
  const activeIndexRef = useRef(0);

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

  const accentColors = ["#FFFFFA", "#FF312E", "#515052", "#FFFFFA", "#FF312E"];
  const cardBgColors = ["#333138", "#333138", "#333138", "#333138", "#333138"];
  const bgColors = ["#000103", "#000103", "#000103", "#000103", "#000103"];
  const thumbAccents = [
    { color: '#FFFFFA', glow: 'rgba(255, 255, 250, 0.2)' },
    { color: '#FF312E', glow: 'rgba(255, 49, 46, 0.2)' },
    { color: '#515052', glow: 'rgba(81, 80, 82, 0.2)' },
    { color: '#FFFFFA', glow: 'rgba(255, 255, 250, 0.2)' },
    { color: '#FF312E', glow: 'rgba(255, 49, 46, 0.2)' }
  ];

  const playTransition = (fromIdx, toIdx) => {
    const prevSlide   = slideRefs.current[fromIdx];
    const prevDetails = detailRefs.current[fromIdx];
    const nextSlide   = slideRefs.current[toIdx];
    const nextCard    = cardRefs.current[toIdx];
    const nextDetails = detailRefs.current[toIdx];

    if (!nextSlide) return;

    gsap.killTweensOf([prevSlide, prevDetails, nextSlide, nextCard, nextDetails].filter(Boolean));

    const getSlideDirection = (idx) => {
      const directions = [
        { xPercent: -100, yPercent: 0 },  // Left
        { xPercent: 100, yPercent: 0 },   // Right
        { xPercent: 0, yPercent: -100 },  // Top
        { xPercent: 0, yPercent: 100 }    // Bottom
      ];
      return directions[idx % directions.length];
    };

    const dir = getSlideDirection(toIdx);

    // Dynamic zIndex layering: active slide on top, previous slide right below, others underneath
    slidesData.forEach((_, idx) => {
      if (slideRefs.current[idx]) {
        slideRefs.current[idx].style.zIndex = idx === toIdx ? '20' : idx === fromIdx ? '15' : '10';
      }
    });

    // Reset next slide to enter from its respective direction, full viewport coverage
    gsap.set(nextSlide, { 
      visibility: 'visible', 
      xPercent: dir.xPercent, 
      yPercent: dir.yPercent, 
      scale: 1.0, 
      opacity: 1 
    });
    if (nextCard) {
      gsap.set(nextCard, { borderRadius: '0px' });
    }
    if (nextDetails) {
      gsap.set(nextDetails, { opacity: 0, y: 20 });
    }

    const tl = gsap.timeline();

    // Slide incoming project card into center (covering full viewport)
    tl.to(nextSlide, {
      xPercent: 0,
      yPercent: 0,
      duration: 0.9,
      ease: 'power3.inOut'
    });

    // Fade/rise project details into view
    if (nextDetails) {
      tl.to(nextDetails, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.25');
    }

    // Shift previous slide slightly in the opposite direction and fade it
    if (prevSlide) {
      tl.to(prevSlide, {
        xPercent: -dir.xPercent * 0.25,
        yPercent: -dir.yPercent * 0.25,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.inOut'
      }, 0);
    }
    if (prevDetails) {
      tl.to(prevDetails, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in'
      }, 0);
    }

    // Smooth background color blend
    gsap.to(sectionRef.current, {
      backgroundColor: bgColors[toIdx % bgColors.length],
      duration: 0.8,
      ease: 'power2.inOut',
    });
  };

  // Scroll listener — dynamically tracks index progression relative to parent card pinning
  const handleScroll = () => {
    if (isMobile) return;

    const cards = Array.from(document.querySelectorAll('.scroll-stack-card'));
    const myCardIndex = cards.findIndex(card => card.querySelector('#projects'));
    if (myCardIndex === -1) return;

    const myCard = cards[myCardIndex];
    const myCardTop = myCard ? myCard.offsetTop : 0;

    const itemDistance = 1600;
    
    // Dynamically calculate cumulative delays for all cards
    const cardDelays = cards.map((card, idx) => {
      let delay = 0;
      for (let i = 0; i < idx; i++) {
        const c = cards[i];
        const extraDelay = c ? (parseFloat(c.getAttribute('data-extra-delay')) || 0) : 0;
        delay += itemDistance + extraDelay;
      }
      return delay;
    });

    const pinStart = myCardTop + cardDelays[myCardIndex];

    const endElement = document.querySelector('.scroll-stack-end');
    const endTop = endElement ? endElement.offsetTop : (myCardTop + cardDelays[myCardIndex] + 2000);

    const rangeStart = pinStart + 200;
    
    // Dynamically calculate the end of the slide transition range
    const nextCard = cards[myCardIndex + 1];
    let rangeEnd;
    if (nextCard) {
      // If there is a subsequent section, finish transition before it pins
      const nextPinStart = nextCard.offsetTop + cardDelays[myCardIndex + 1];
      rangeEnd = nextPinStart - 400;
    } else {
      // If this is the final section, use the end of the scroll container
      rangeEnd = endTop - window.innerHeight - 200;
    }
    rangeEnd = Math.max(rangeStart + 100, rangeEnd);

    const scroll = window.scrollY;

    let newIndex = 0;
    if (scroll >= rangeStart && scroll <= rangeEnd) {
      const progress = (scroll - rangeStart) / (rangeEnd - rangeStart);
      newIndex = Math.min(
        Math.floor(progress * slidesData.length),
        slidesData.length - 1
      );
    } else if (scroll > rangeEnd) {
      newIndex = slidesData.length - 1;
    }

    const prev = activeIndexRef.current;
    if (newIndex !== prev) {
      activeIndexRef.current = newIndex;
      setActiveIndex(newIndex);
      playTransition(prev, newIndex);
    }
  };

  // Initial GSAP state setup
  useEffect(() => {
    if (isMobile) return;

    const getSlideDirection = (idx) => {
      const directions = [
        { xPercent: -100, yPercent: 0 },  // Left
        { xPercent: 100, yPercent: 0 },   // Right
        { xPercent: 0, yPercent: -100 },  // Top
        { xPercent: 0, yPercent: 100 }    // Bottom
      ];
      return directions[idx % directions.length];
    };

    slidesData.forEach((_, idx) => {
      const slide   = slideRefs.current[idx];
      const card    = cardRefs.current[idx];
      const details = detailRefs.current[idx];
      if (!slide) return;

      if (idx === 0) {
        gsap.set(slide,   { scale: 1.0, opacity: 1, xPercent: 0, yPercent: 0, visibility: 'visible', zIndex: 20 });
        if (card)    gsap.set(card,    { borderRadius: '0px' });
        if (details) gsap.set(details, { opacity: 1, y: 0 });
      } else {
        const dir = getSlideDirection(idx);
        gsap.set(slide,   { scale: 1.0, opacity: 0, xPercent: dir.xPercent, yPercent: dir.yPercent, visibility: 'hidden', zIndex: 10 });
        if (card)    gsap.set(card,    { borderRadius: '0px' });
        if (details) gsap.set(details, { opacity: 0, y: 20 });
      }
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
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
        className="w-full relative bg-background py-16 px-6 overflow-y-auto select-none"
      >
        <div className="max-w-2xl mx-auto flex flex-col gap-12 pt-8">
          <div className="flex flex-col gap-10">
            {activeProjects.map((project, i) => {
              const color = accentColors[(i + 1) % accentColors.length];
              return (
                <div 
                  key={project.title} 
                  className="mobile-project-card flex flex-col gap-6 bg-white/[0.02] border border-white/5 p-6 rounded-3xl relative overflow-hidden min-h-[340px] justify-end"
                >
                  {/* Background Image on mobile card */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center z-0 scale-105"
                    style={{ 
                      backgroundImage: `url(${project.imageSrc})`,
                      filter: 'brightness(0.35)'
                    }}
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-transparent z-5 pointer-events-none" />

                  <div className="relative z-10 flex flex-col items-start text-left">
                    <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/40 mb-3 block font-bold">
                      ★ Build {i + 1}
                    </span>
                    
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white font-sans uppercase">
                      {project.title}
                    </h3>
                    
                    <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed my-4">
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
      className="w-full relative bg-background h-[100vh] flex flex-col justify-start select-none overflow-hidden"
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
          border-radius: 0px;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          text-align: left;
          padding: 48px 10%;
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
                className="project-card-overlay relative overflow-hidden"
              >
                {/* Parallax/Static background image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center z-0 scale-105 transition-transform duration-700 ease-out"
                  style={{ 
                    backgroundImage: `url(${project.imageSrc})`,
                    filter: 'brightness(0.65)'
                  }}
                />
                {/* Horizontal gradient overlay to fade to black on the left for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30 z-5 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-start max-w-2xl text-left">
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
                    className="flex flex-col items-start text-left"
                  >
                    <p className="text-sm sm:text-base md:text-lg text-slate-300 font-medium tracking-wide leading-relaxed mt-5 font-sans">
                      {project.description}
                    </p>

                    {/* Skills/Tags strip */}
                    <div className="flex flex-wrap gap-2 mt-7">
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
