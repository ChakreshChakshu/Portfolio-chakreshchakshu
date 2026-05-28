'use client';

import { useState, useRef, useEffect } from 'react';
import { skillsData } from '@/data/skills';
import { gsap } from 'gsap';

export function SkillsSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeScene, setActiveScene] = useState(0);

  const containerRef = useRef(null);
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

  // Scroll listener for desktop (drives scene transitions & cylinder spin)
  const handleScroll = () => {
    if (isMobile) return;

    const cardTop = 2 * window.innerHeight;

    // SkillsSection triggers between cardTop + 4200
    // Scrolling spans exactly 1600px of scrolling space to transition 3 scenes
    const rangeStart = cardTop + 4200;
    const rangeEnd = rangeStart + 1600;

    const currentScroll = window.scrollY;
    let progress = 0;

    if (currentScroll < rangeStart) {
      progress = 0;
    } else if (currentScroll > rangeEnd) {
      progress = 1;
    } else {
      progress = (currentScroll - rangeStart) / (rangeEnd - rangeStart);
    }

    // Determine active scene based on progress
    let activeIdx = 0;

    if (progress < 0.33) {
      activeIdx = 0;
    } else if (progress < 0.66) {
      activeIdx = 1;
    } else {
      activeIdx = 2;
    }

    setActiveScene(activeIdx);

    // Scrub the vertical scene transition timeline
    if (timelineRef.current) {
      timelineRef.current.progress(progress);
    }

    // Rotate and translate grid backdrop floor slightly on scroll (Spatial Flight Parallax)
    const grid = containerRef.current?.querySelector('.grid-backdrop');
    if (grid) {
      const gridRotZ = progress * -35; // rotate grid slowly
      const gridShiftY = progress * 120; // translate grid forward
      gsap.to(grid, {
        transform: `rotateX(72deg) rotateZ(${gridRotZ}deg) translateZ(-220px) translateY(${gridShiftY}px)`,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto"
      });
    }

    // Update trigonometric 3D billboarding positions for all scenes
    scenes.forEach((scene, sIdx) => {
      let sceneProgress = 0;
      if (sIdx === 0) {
        sceneProgress = Math.min(1, progress / 0.33);
      } else if (sIdx === 1) {
        sceneProgress = progress < 0.33 ? 0 : Math.min(1, (progress - 0.33) / 0.33);
      } else {
        sceneProgress = progress < 0.66 ? 0 : Math.min(1, (progress - 0.66) / 0.34);
      }

      const currentRotation = sceneProgress * -180; // in degrees
      const angleStep = 360 / scene.skills.length;

      const sceneWrapper = containerRef.current?.querySelectorAll(`.scene-container`)[sIdx];
      const cards = sceneWrapper?.querySelectorAll('.carousel-panel');
      if (!cards) return;

      cards.forEach((card, i) => {
        const angleDeg = i * angleStep + currentRotation;
        const rad = angleDeg * Math.PI / 180;

        // Trigonometric orbital coordinates (billboarding X and Z)
        const x = Math.sin(rad) * scene.radius;
        const z = Math.cos(rad) * scene.radius; // Front is +radius, back is -radius

        // Depth calculations for 100% readable billboards
        const normalizedDepth = (z + scene.radius) / (2 * scene.radius); // 0 (back) to 1 (front)
        
        const scale = 0.62 + normalizedDepth * 0.38; // scale between 62% and 100%
        const opacity = 0.22 + normalizedDepth * 0.78; // opacity between 22% and 100%
        const zIndex = Math.round(50 + z); // dynamic layering based on Z coordinate

        // Apply transforms directly to style for frame-rate efficiency
        card.style.transform = `translate3d(${x}px, 0px, ${z}px) scale(${scale})`;
        card.style.opacity = opacity;
        card.style.zIndex = zIndex;
      });
    });
  };

  // Set up the scene transitions timeline
  useEffect(() => {
    if (isMobile) return;

    const sceneWrappers = containerRef.current?.querySelectorAll('.scene-container');
    if (!sceneWrappers || sceneWrappers.length === 0) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline({ paused: true });
    timelineRef.current = tl;

    // Initial state: Scene 1 active, others translated below & transparent
    gsap.set(sceneWrappers, { yPercent: 120, opacity: 0, scale: 0.75, pointerEvents: 'none' });
    gsap.set(sceneWrappers[0], { yPercent: 0, opacity: 1, scale: 1, pointerEvents: 'auto' });

    const step = 1 / 2; // Two gaps between three scenes

    // Scene 0 -> Scene 1
    tl.to(sceneWrappers[0], {
      yPercent: -120,
      opacity: 0,
      scale: 0.75,
      pointerEvents: 'none',
      duration: step,
      ease: "power2.inOut"
    }, 0);
    
    tl.to(sceneWrappers[1], {
      yPercent: 0,
      opacity: 1,
      scale: 1,
      pointerEvents: 'auto',
      duration: step,
      ease: "power2.inOut"
    }, 0);

    // Scene 1 -> Scene 2
    tl.to(sceneWrappers[1], {
      yPercent: -120,
      opacity: 0,
      scale: 0.75,
      pointerEvents: 'none',
      duration: step,
      ease: "power2.inOut"
    }, step);

    tl.to(sceneWrappers[2], {
      yPercent: 0,
      opacity: 1,
      scale: 1,
      pointerEvents: 'auto',
      duration: step,
      ease: "power2.inOut"
    }, step);

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

  const accentColors = ["#7DD6FF", "#D5FF37", "#FFA17B"];

  const scenes = [
    { id: 'frontend', name: 'Frontend Engineering', skills: skillsData.frontend, accent: '#7DD6FF', glow: 'rgba(125,214,255,0.06)', radius: 420, icon: '⚛️' },
    { id: 'backend', name: 'Backend & Databases', skills: skillsData.backend, accent: '#D5FF37', glow: 'rgba(213,255,55,0.06)', radius: 400, icon: '🟢' },
    { id: 'tools', name: 'Tools & AI Platforms', skills: skillsData.tools, accent: '#FFA17B', glow: 'rgba(255,161,123,0.06)', radius: 440, icon: '⚡' }
  ];

  return (
    <section
      id="skills"
      ref={containerRef}
      className="w-full relative bg-[#000000] h-[100vh] flex flex-col justify-center items-center overflow-hidden select-none"
    >
      <style>{`
        .grid-backdrop {
          position: absolute;
          inset: -30%; /* extra overflow to prevent grid clipping during large tilts */
          background-size: 60px 60px;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.012) 1px, transparent 1px);
          transform: rotateX(72deg) translateZ(-220px);
          transform-origin: center center;
          pointer-events: none;
          z-index: 0;
          opacity: 0.85;
          will-change: transform;
        }
        .scene-container {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1200px;
          z-index: 10;
        }
        .carousel-3d {
          width: 190px;
          height: 230px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .carousel-panel {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 50%;
          top: 50%;
          margin-left: -95px; /* Centered layout offset */
          margin-top: -115px;  /* Centered layout offset */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.015);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35);
          transition: border-color 0.4s, box-shadow 0.4s;
          will-change: transform, opacity;
        }
        .carousel-panel:hover {
          border-color: var(--panel-accent);
          box-shadow: 0 0 35px var(--panel-glow);
        }
        @media (max-width: 768px) {
          .grid-backdrop {
            display: none;
          }
          .scene-container {
            perspective: none;
            position: relative;
            height: auto;
            overflow-x: auto;
            justify-content: flex-start;
            padding: 20px;
            gap: 16px;
            scroll-snap-type: x mandatory;
            opacity: 1 !important;
            transform: none !important;
          }
          .carousel-3d {
            display: flex;
            width: 100%;
            height: auto;
            gap: 16px;
          }
          .carousel-panel {
            position: relative;
            transform: none !important;
            width: 130px;
            height: 160px;
            margin: 0 !important;
            left: auto !important;
            top: auto !important;
            flex-shrink: 0;
            scroll-snap-align: center;
            opacity: 1 !important;
          }
        }
      `}</style>

      {/* Cyberpunk spatial perspective grid backdrop */}
      <div className="grid-backdrop" />

      {/* Ambient background accent light leak (soft glow under the grid) */}
      <div 
        className="absolute inset-0 transition-all duration-1000 opacity-20 pointer-events-none z-0 blur-[130px]"
        style={{
          background: `radial-gradient(circle at center, ${accentColors[activeScene]} 0%, transparent 60%)`
        }}
      />

      {/* Symmetrical Core Header */}
      <div className="skills-header text-center absolute top-12 z-40 select-none pointer-events-none transition-all duration-500">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans uppercase">
          Skills &amp; Expertise
        </h2>
        <div className="h-1 w-16 bg-[#fca311] mt-3 rounded-full mx-auto" />
      </div>

      {/* Cylindrical 3D Scenes Wrapper */}
      <div className="relative w-full h-[65vh] flex items-center justify-center">
        
        {/* Static Glowing Central Category Text (Minimal, Floating) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none select-none text-center z-0">
          <h3 
            className="text-3xl md:text-4xl font-black font-sans tracking-[0.25em] uppercase transition-all duration-500 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            style={{ color: accentColors[activeScene] }}
          >
            {scenes[activeScene].name.split(' ')[0]}
          </h3>
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.3em] mt-2 font-bold block">
            Core System
          </span>
        </div>

        {scenes.map((scene, idx) => {
          return (
            <div 
              key={scene.id} 
              className="scene-container"
              style={{ display: isMobile && activeScene !== idx ? 'none' : undefined }}
            >
              <div 
                className="carousel-3d"
              >
                {scene.skills.map((skill, i) => (
                  <div
                    key={skill.name}
                    className="carousel-panel animate-none"
                    style={{
                      '--panel-accent': scene.accent,
                      '--panel-glow': scene.glow
                    }}
                  >
                    {/* Logo Focus Area */}
                    <div className="w-22 h-22 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center shadow-inner group-hover:scale-110 transition-all duration-300">
                      <span className="text-5xl select-none filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">
                        {skill.icon}
                      </span>
                    </div>

                    {/* Info Area */}
                    <div className="text-center mt-4 flex flex-col items-center">
                      <h4 className="text-sm font-black font-sans tracking-wide text-white uppercase truncate max-w-[150px]">
                        {skill.name}
                      </h4>
                      <span 
                        className="text-xs font-mono font-bold mt-1 tracking-wider"
                        style={{ color: scene.accent }}
                      >
                        {skill.level}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
