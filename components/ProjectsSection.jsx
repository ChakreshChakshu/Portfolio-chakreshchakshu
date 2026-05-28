'use client';

import React, { useState, useEffect, useRef } from 'react';
import { projectsData } from '@/data/projects';
import { gsap } from 'gsap';

export function ProjectsSection() {
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const timelineRef = useRef(null);

  // Check screen width for mobile responsive layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Extract actual projects with images (excluding overview cards)
  const activeProjects = projectsData.filter(p => !p.isIntro && p.imageSrc);

  // Map 4 accent colors and deep dark backgrounds for theme transitions
  const accentColors = ["#7DD6FF", "#D5FF37", "#FFA0B0", "#FFA17B"];
  const bgColors = ["#000a1f", "#001509", "#0f021f", "#1b0a00"];

  // Scroll listener for desktop (drives the GSAP timeline manually)
  const handleScroll = () => {
    const cardTop = 3 * window.innerHeight;

    // ProjectsSection starts pinning at cardTop + 5800
    // Scrolling occurs over exactly 2200px
    const rangeStart = cardTop + 5800;
    const rangeEnd = rangeStart + 2200;

    const currentScroll = window.scrollY;
    let progress = 0;

    if (currentScroll < rangeStart) {
      progress = 0;
    } else if (currentScroll > rangeEnd) {
      progress = 1;
    } else {
      progress = (currentScroll - rangeStart) / (rangeEnd - rangeStart);
    }

    if (timelineRef.current) {
      // Scrub the timeline directly based on scroll progress
      timelineRef.current.progress(progress);
    }
  };

  // Setup GSAP scroll scrubbing on desktop
  useEffect(() => {
    if (isMobile) return;

    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;
    if (!leftCol || !rightCol) return;

    const leftItems = leftCol.querySelectorAll('.arch__info');
    const imgs = rightCol.querySelectorAll('.img-wrapper img');
    if (leftItems.length === 0 || imgs.length === 0) return;

    // Set initial layout and styling
    gsap.set(leftCol, { yPercent: 0 });
    gsap.set(imgs, { clipPath: "inset(0% 0% 0%)", objectPosition: "0px 0%" });
    gsap.set(leftItems, { opacity: 0.15, scale: 0.95 });
    gsap.set(leftItems[0], { opacity: 1, scale: 1 });

    const tl = gsap.timeline({ paused: true });
    timelineRef.current = tl;

    // 4 items -> 3 transition steps.
    const step = 1 / 3;

    for (let i = 0; i < 3; i++) {
      const startTime = i * step;

      // 1. Reveal next image by clipping current image upwards
      tl.to(imgs[i], {
        clipPath: "inset(0% 0% 100%)",
        objectPosition: "0px 60%",
        duration: step,
        ease: "none"
      }, startTime);

      // 2. Shift next image object position slightly
      if (imgs[i + 1]) {
        tl.to(imgs[i + 1], {
          objectPosition: "0px 40%",
          duration: step,
          ease: "none"
        }, startTime);
      }

      // 3. Shift the left column up to show the next text block
      tl.to(leftCol, {
        yPercent: -25 * (i + 1),
        duration: step,
        ease: "power2.inOut"
      }, startTime);

      // 4. Fade out current text and fade in next text block
      tl.to(leftItems[i], {
        opacity: 0.15,
        scale: 0.95,
        duration: step * 0.5,
        ease: "power2.inOut"
      }, startTime);

      tl.to(leftItems[i + 1], {
        opacity: 1,
        scale: 1,
        duration: step * 0.5,
        ease: "power2.inOut"
      }, startTime + step * 0.5);

      // 5. Change section background color smoothly to theme coding
      tl.to(sectionRef.current, {
        backgroundColor: bgColors[i + 1],
        duration: step,
        ease: "power2.inOut"
      }, startTime);
    }

    // Run initial calculation
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [isMobile]);

  // Smooth mobile color transition based on scroll position
  useEffect(() => {
    if (!isMobile) return;

    const handleMobileScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const infos = container.querySelectorAll('.arch__info');
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
        sectionRef.current.style.backgroundColor = bgColors[activeIdx];
      }
    };

    window.addEventListener('scroll', handleMobileScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleMobileScroll);
  }, [isMobile]);

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className="w-full relative bg-[#000a1f] h-[100vh] flex flex-col justify-start select-none overflow-hidden transition-colors duration-1000"
    >
      <style>{`
        .arch {
          display: flex;
          gap: 60px;
          justify-content: space-between;
          max-width: 1100px;
          margin-inline: auto;
          width: 100%;
          height: 100%;
        }
        .arch__left-wrapper {
          width: 45%;
          min-width: 320px;
          height: 100%;
          overflow: hidden;
          position: relative;
        }
        .arch__left {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 400%; /* 4 items, each 100% of wrapper height */
        }
        .arch__right {
          flex-shrink: 0;
          height: 100%;
          width: 50%;
          max-width: 540px;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .img-wrapper {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          height: 400px;
          width: 100%;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.08);
          background-color: #0b0f19;
        }
        .img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          will-change: clip-path, object-position;
        }
        @media (max-width: 768px) {
          .arch {
            flex-direction: column;
            gap: 20px;
            height: auto;
            overflow-y: auto;
          }
          .arch__left-wrapper {
            width: 100%;
            height: auto;
            overflow: visible;
          }
          .arch__left {
            height: auto;
          }
          .arch__right {
            height: auto;
            max-width: 100%;
            width: 100%;
            display: contents;
          }
          .arch__right .img-wrapper {
            position: static;
            transform: none;
            height: 300px;
            width: 100%;
            margin-bottom: 24px;
            background-color: #0b0f19;
          }
          .arch__left .arch__info {
            height: auto;
            padding: 24px 0;
          }
        }
      `}</style>

      {/* Header Block (Positioned Absolute Top to prevent shifting layout) */}
      <div className="absolute top-8 left-0 right-0 text-center z-40 hidden md:block select-none pointer-events-none">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans uppercase">
          Selected Builds
        </h2>
        <div className="h-1 w-12 bg-[#fca311] mt-3 rounded-full mx-auto" />
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-6 md:px-12 max-w-6xl w-full flex flex-col h-full relative z-10 pt-20 md:pt-0" ref={containerRef}>
        
        <div className="arch items-center">
          
          {/* Left Column: Mask-Shifted Project Info Blocks */}
          <div className="arch__left-wrapper">
            <div className="arch__left" ref={leftColRef}>
              {activeProjects.map((project, i) => {
                const color = accentColors[i % accentColors.length];
                return (
                  <div 
                    key={project.title}
                    className="arch__info w-full h-1/4 md:h-full flex flex-col justify-center items-start text-left py-12 md:py-0 select-none"
                    style={{ order: isMobile ? i * 2 : undefined }}
                  >
                    <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/40 mb-3 block font-bold">
                      ★ Build {i + 1}
                    </span>
                    
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white font-sans uppercase">
                      {project.title}
                    </h2>
                    
                    <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed my-5 max-w-md">
                      {project.description}
                    </p>

                    {/* Skills/Tags strip */}
                    <div className="flex flex-wrap gap-2 mb-8 max-w-md">
                      {project.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="px-3 py-1 text-[10px] font-mono rounded-full border border-white/5 bg-white/[0.01] text-slate-400 uppercase tracking-wider font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Custom Accent Link Button */}
                    <a 
                      href={project.href} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-6 py-3.5 rounded-full text-black font-sans font-bold text-xs uppercase tracking-widest hover:scale-105 hover:shadow-lg transition-all duration-300 pointer-events-auto" 
                      style={{ backgroundColor: color }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" className="shrink-0">
                        <path fill="#121212" d="M5 2c0 1.105-1.895 2-3 2a2 2 0 1 1 0-4c1.105 0 3 .895 3 2ZM11 3.5c0 1.105-.895 3-2 3s-2-1.895-2-3a2 2 0 1 1 4 0ZM6 9a2 2 0 1 1-4 0c0-1.105.895-3 2-3s2 1.895 2 3Z" />
                      </svg> 
                      <span>Learn More</span>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Absolute Stacked Image Reveal */}
          <div className="arch__right" ref={rightColRef}>
            {activeProjects.map((project, i) => (
              <div 
                key={project.title}
                className="img-wrapper" 
                data-index={4 - i}
                style={{ 
                  order: isMobile ? i * 2 + 1 : undefined,
                  zIndex: 4 - i 
                }}
              >
                <img 
                  src={project.imageSrc} 
                  alt={project.title}
                  draggable="false"
                />
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
