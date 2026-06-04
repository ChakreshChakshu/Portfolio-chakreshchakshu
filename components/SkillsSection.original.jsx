'use client';

import { useState, useRef, useEffect } from 'react';
import { skillsData } from '@/data/skills';
import { gsap } from 'gsap';
import TechIcon from './TechIcon';

const accentColors = ["#7DD6FF", "#D5FF37", "#FFA17B"];

const scenes = [
  { id: 'frontend', name: 'Frontend Engineering', skills: skillsData.frontend, accent: '#7DD6FF', glow: 'rgba(125,214,255,0.06)', radius: 420, icon: '⚛️' },
  { id: 'backend', name: 'Backend & Databases', skills: skillsData.backend, accent: '#D5FF37', glow: 'rgba(213,255,55,0.06)', radius: 400, icon: '🟢' },
  { id: 'tools', name: 'Tools & AI Platforms', skills: skillsData.tools, accent: '#FFA17B', glow: 'rgba(255,161,123,0.06)', radius: 440, icon: '⚡' }
];

export function SkillsSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeScene, setActiveScene] = useState(0);

  const containerRef = useRef(null);
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

  const progressRef = useRef(0);
  const autoRotationRef = useRef(0);
  const requestRef = useRef();
  const headerRevealedRef = useRef(false);

  // Scroll listener for desktop (drives scene transitions)
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

    progressRef.current = progress;

    // Trigger holographic header reveal when user scrolls into the section
    if (progress > 0.05 && !headerRevealedRef.current) {
      headerRevealedRef.current = true;
      gsap.fromTo('.skills-header-reveal',
        { opacity: 0, y: -20, filter: 'blur(10px)' },
        { 
          opacity: 1, 
          y: 0, 
          filter: 'blur(0px)', 
          duration: 1.0, 
          ease: "power3.out",
          overwrite: "auto"
        }
      );
    }

    const relativeScroll = progress * 1600;

    // Determine active scene based on progress segments
    let activeIdx = 0;
    if (relativeScroll < 350) {
      activeIdx = 0;
    } else if (relativeScroll < 600) {
      activeIdx = 0;
    } else if (relativeScroll < 950) {
      activeIdx = 1;
    } else if (relativeScroll < 1200) {
      activeIdx = 1;
    } else {
      activeIdx = 2;
    }

    setActiveScene(activeIdx);

    // Map relativeScroll to timeline progress
    let timelineProgress = 0;
    if (relativeScroll < 150) {
      timelineProgress = (relativeScroll / 150) * 0.22;
    } else if (relativeScroll < 350) {
      timelineProgress = 0.22;
    } else if (relativeScroll < 600) {
      timelineProgress = 0.22 + ((relativeScroll - 350) / 250) * 0.33;
    } else if (relativeScroll < 950) {
      timelineProgress = 0.55;
    } else if (relativeScroll < 1200) {
      timelineProgress = 0.55 + ((relativeScroll - 950) / 250) * 0.35;
    } else if (relativeScroll < 1550) {
      timelineProgress = 0.9;
    } else {
      timelineProgress = 0.9 + ((relativeScroll - 1550) / 50) * 0.1;
    }

    // Scrub the vertical scene transition timeline
    if (timelineRef.current) {
      timelineRef.current.progress(timelineProgress);
    }

    // Rotate and translate grid backdrop floor slightly on scroll (Spatial Flight Parallax)
    const grid = containerRef.current?.querySelector('.grid-backdrop');
    if (grid) {
      const gridRotZ = progress * -35; // rotate grid slowly
      const gridShiftY = progress * 120; // translate grid forward
      gsap.to(grid, {
        transform: `rotateX(72deg) rotateZ(${gridRotZ}deg) translateZ(-220px) translateY(${gridShiftY}px)`,
        duration: 0.4,
        ease: "power1.out",
        overwrite: "auto"
      });
    }
  };

  // Update trigonometric 3D billboarding positions for all scenes (called in requestAnimationFrame loop)
  const updateCylinderPositions = () => {
    const relativeScroll = progressRef.current * 1600;

    scenes.forEach((scene, sIdx) => {
      let sceneProgress = 0;
      if (sIdx === 0) {
        if (relativeScroll < 350) {
          sceneProgress = relativeScroll / 350;
        } else {
          sceneProgress = 1;
        }
      } else if (sIdx === 1) {
        if (relativeScroll < 600) {
          sceneProgress = 0;
        } else if (relativeScroll < 950) {
          sceneProgress = (relativeScroll - 600) / 350;
        } else {
          sceneProgress = 1;
        }
      } else {
        if (relativeScroll < 1200) {
          sceneProgress = 0;
        } else {
          sceneProgress = Math.min(1, (relativeScroll - 1200) / 350);
        }
      }

      // One full round on scroll = 360 degrees!
      const scrollRotation = sceneProgress * 360; 
      const autoRotation = autoRotationRef.current; // gentle background drift

      const currentRotation = scrollRotation + autoRotation;
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

  // Continuous background auto-rotation animation loop
  useEffect(() => {
    if (isMobile) return;

    const animate = () => {
      // Extremely slow gentle drift: 0.04 degrees per frame (perfect readability)
      autoRotationRef.current = (autoRotationRef.current + 0.04) % 360;

      updateCylinderPositions();

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isMobile]);

  // Trigger holographic header reveal immediately on mobile/mount if already scrolled
  useEffect(() => {
    if (isMobile) {
      gsap.fromTo('.skills-header-reveal',
        { opacity: 0, y: -20, filter: 'blur(10px)' },
        { 
          opacity: 1, 
          y: 0, 
          filter: 'blur(0px)', 
          duration: 1.0, 
          ease: "power3.out",
          overwrite: "auto"
        }
      );
      headerRevealedRef.current = true;
    }
  }, [isMobile]);

  // Stagger or slide reveal the module text on scene changes
  useEffect(() => {
    const element = containerRef.current?.querySelector('.active-module-text');
    if (element) {
      gsap.fromTo(element,
        { y: 12, opacity: 0, filter: 'blur(3px)' },
        { y: 0, opacity: 0.8, filter: 'blur(0px)', duration: 0.45, ease: "power2.out" }
      );
    }
  }, [activeScene]);

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

    // Initial state: Aperture covered, Scenes container minimized & transparent
    gsap.set('.aperture-img', { scale: 1, opacity: 1 });
    gsap.set('.skills-cylinders-wrapper', { scale: 0.65, opacity: 0 });
    gsap.set(sceneWrappers, { yPercent: 120, opacity: 0, scale: 0.75, pointerEvents: 'none' });
    gsap.set(sceneWrappers[0], { yPercent: 0, opacity: 1, scale: 1, pointerEvents: 'auto' });

    // Phase 1: Aperture Zoom Reveal (0 -> 0.22 progress)
    tl.to('.aperture-img', {
      scale: 12,
      opacity: 0,
      duration: 0.22,
      ease: "power2.inOut"
    }, 0);

    tl.to('.skills-cylinders-wrapper', {
      scale: 1,
      opacity: 1,
      duration: 0.22,
      ease: "power2.inOut"
    }, 0);

    // Phase 2: Scene 0 -> Scene 1 (from progress 0.22 to 0.55)
    tl.to(sceneWrappers[0], {
      yPercent: -120,
      opacity: 0,
      scale: 0.75,
      pointerEvents: 'none',
      duration: 0.33,
      ease: "power2.inOut"
    }, 0.22);
    
    tl.to(sceneWrappers[1], {
      yPercent: 0,
      opacity: 1,
      scale: 1,
      pointerEvents: 'auto',
      duration: 0.33,
      ease: "power2.inOut"
    }, 0.22);

    // Phase 3: Scene 1 -> Scene 2 (from progress 0.55 to 0.9)
    tl.to(sceneWrappers[1], {
      yPercent: -120,
      opacity: 0,
      scale: 0.75,
      pointerEvents: 'none',
      duration: 0.35,
      ease: "power2.inOut"
    }, 0.55);

    tl.to(sceneWrappers[2], {
      yPercent: 0,
      opacity: 1,
      scale: 1,
      pointerEvents: 'auto',
      duration: 0.35,
      ease: "power2.inOut"
    }, 0.55);

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
          background: transparent;
          border: none;
          box-shadow: none;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          will-change: transform, opacity;
        }
        .carousel-panel:hover {
          /* Hover effects are managed cleanly on the child elements */
        }
        .aperture-zoom-overlay {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 45;
          perspective: 600px;
          overflow: hidden;
          pointer-events: none;
        }
        .aperture-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          will-change: transform, opacity;
          -webkit-mask: radial-gradient(circle at 50% 51%, transparent 20.5%, black 21.5%);
          mask: radial-gradient(circle at 50% 51%, transparent 20.5%, black 21.5%);
        }
        .skills-cylinders-wrapper {
          will-change: transform, opacity;
        }
        @media (max-width: 1023px) {
          .aperture-zoom-overlay {
            display: none;
          }
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

      {/* Cinematic Cyber Aperture Zoom Portal */}
      <div className="aperture-zoom-overlay">
        <img 
          src="/cyber_aperture.png" 
          alt="aperture portal" 
          className="aperture-img" 
        />
      </div>

      {/* Ambient background accent light leak (soft glow under the grid) */}
      <div 
        className="absolute inset-0 transition-all duration-1000 opacity-20 pointer-events-none z-0 blur-[130px]"
        style={{
          background: `radial-gradient(circle at center, ${accentColors[activeScene]} 0%, transparent 60%)`
        }}
      />



      {/* Cylindrical 3D Scenes Wrapper */}
      <div className="skills-cylinders-wrapper relative w-full h-[65vh] flex items-center justify-center">
        
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
                    className="carousel-panel group animate-none"
                    style={{
                      '--panel-accent': scene.accent,
                      '--panel-glow': scene.glow
                    }}
                  >
                    {/* Logo Focus Area */}
                    <div className="w-22 h-22 rounded-full bg-white/[0.01] border border-white/5 flex items-center justify-center shadow-inner group-hover:scale-115 group-hover:bg-white/[0.04] group-hover:border-white/10 transition-all duration-300">
                      <TechIcon
                        name={skill.name}
                        className="w-12 h-12 select-none filter drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] group-hover:drop-shadow-[0_0_12px_var(--panel-accent)] transition-all duration-300"
                      />
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
