'use client';

import { useState, useRef, useEffect } from 'react';
import { skillsData } from '@/data/skills';
import { gsap } from 'gsap';
import TechIcon from './TechIcon';
import OrbitImages from './OrbitImages';
import SplitText from './SplitText';

const getCategoryColor = (category) => {
  if (category === 'frontend') return '#7DD6FF';
  if (category === 'backend') return '#D5FF37';
  return '#FFA17B';
};

const leftSkills = skillsData.frontend.map(skill => ({ ...skill, category: 'frontend' }));
const midSkills = skillsData.backend.map(skill => ({ ...skill, category: 'backend' }));
const rightSkills = skillsData.tools.map(skill => ({ ...skill, category: 'tools' }));

export function SkillsSection() {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const apertureRef = useRef(null);
  const framesRef = useRef(null);
  const feOrbitRef = useRef(null);
  const beOrbitRef = useRef(null);
  const toOrbitRef = useRef(null);

  // Check screen width for mobile layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll listener for desktop (drives Aperture Zoom, orbits, and 3D watermark)
  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      const cards = Array.from(document.querySelectorAll('.scroll-stack-card'));
      const getElementOffset = (el) => {
        return el ? el.offsetTop : 0;
      };

      const card2Top = cards[2] ? getElementOffset(cards[2]) : (2 * window.innerHeight);
      const rangeStart = card2Top + 3200;
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

      const apertureImg = apertureRef.current;
      const framesEl = framesRef.current;

      if (apertureImg && framesEl) {
        if (progress <= 0.5) {
          const subProgress = progress / 0.5;
          gsap.set(apertureImg, {
            scale: 1 + subProgress * 11,
            opacity: 1 - subProgress,
            display: 'block'
          });
          gsap.set(framesEl, {
            scale: 0.75 + subProgress * 0.25,
            opacity: subProgress
          });
        } else {
          gsap.set(apertureImg, { 
            opacity: 0, 
            display: 'none'
          });
          gsap.set(framesEl, { 
            scale: 1, 
            opacity: 1
          });
        }
      }

      // Additive orbital reveal based on progress
      const feEl = feOrbitRef.current;
      const beEl = beOrbitRef.current;
      const toEl = toOrbitRef.current;

      if (feEl && beEl && toEl) {
        let feOp = 0;
        let beOp = 0;
        let toOp = 0;

        let feScale = 0.85;
        let beScale = 0.85;
        let toScale = 0.85;

        // Frontend fades in between progress 0.05 and 0.35
        if (progress < 0.05) {
          feOp = 0;
          feScale = 0.85;
        } else if (progress > 0.35) {
          feOp = 1;
          feScale = 1;
        } else {
          const ratio = (progress - 0.05) / 0.30;
          feOp = ratio;
          feScale = 0.85 + ratio * 0.15;
        }

        // Backend fades in between progress 0.38 and 0.68
        if (progress < 0.38) {
          beOp = 0;
          beScale = 0.85;
        } else if (progress > 0.68) {
          beOp = 1;
          beScale = 1;
        } else {
          const ratio = (progress - 0.38) / 0.30;
          beOp = ratio;
          beScale = 0.85 + ratio * 0.15;
        }

        // Tools fades in between progress 0.70 and 0.98
        if (progress < 0.70) {
          toOp = 0;
          toScale = 0.85;
        } else if (progress > 0.98) {
          toOp = 1;
          toScale = 1;
        } else {
          const ratio = (progress - 0.70) / 0.28;
          toOp = ratio;
          toScale = 0.85 + ratio * 0.15;
        }

        gsap.set(feEl, { opacity: feOp, scale: feScale });
        gsap.set(beEl, { opacity: beOp, scale: beScale });
        gsap.set(toEl, { opacity: toOp, scale: toScale });
      }

      // 3D Watermark Typography Reveal
      const chars = containerRef.current ? containerRef.current.querySelectorAll('.skills-watermark .char') : [];
      if (chars.length > 0) {
        chars.forEach((char, idx) => {
          const charProgressStart = (idx / chars.length) * 0.5;
          const charProgressEnd = charProgressStart + 0.35;
          
          let charProgress = 0;
          if (progress < charProgressStart) {
            charProgress = 0;
          } else if (progress > charProgressEnd) {
            charProgress = 1;
          } else {
            charProgress = (progress - charProgressStart) / (charProgressEnd - charProgressStart);
          }

          const rotateX = (1 - charProgress) * -90;
          const rotateY = (1 - charProgress) * 45;
          const z = (1 - charProgress) * -150;
          const opacity = charProgress * 0.035; 
          const blur = (1 - charProgress) * 12;

          gsap.set(char, {
            rotateX: rotateX,
            rotateY: rotateY,
            z: z,
            opacity: opacity,
            filter: `blur(${blur}px)`,
            transformPerspective: 1000
          });
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    // Initial trigger
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isMobile]);

  // Create custom components for OrbitImages
  const createOrbitItems = (skills, color, sizeClass, iconSizeClass) => {
    return skills.map((skill) => (
      <div 
        key={skill.name}
        className="flex flex-col items-center justify-center select-none cursor-pointer group pointer-events-auto"
      >
        <div 
          className={`${sizeClass} flex items-center justify-center rounded-full bg-[#030303]/95 border border-white/10 transition-all duration-300 relative`}
          style={{
            boxShadow: `0 0 12px rgba(0, 0, 0, 0.85)`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            e.currentTarget.style.boxShadow = `0 0 20px rgba(255, 255, 255, 0.15)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 0, 0, 0.85)';
          }}
        >
          <TechIcon
            name={skill.name}
            className={`${iconSizeClass} filter drop-shadow-[0_0_3px_rgba(255,255,255,0.15)] group-hover:scale-110 transition-transform duration-300`}
          />
          
          {/* Tooltip */}
          <div 
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#040406]/98 border px-3 py-1 rounded-md text-[10px] font-extrabold font-mono tracking-[0.18em] text-white uppercase opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-[0_4px_25px_rgba(0,0,0,0.95)]"
            style={{ 
              borderColor: color,
              textShadow: `0 0 8px ${color}60`,
              boxShadow: `0 0 15px ${color}30, inset 0 0 4px ${color}20`
            }}
          >
            {skill.name}
          </div>
        </div>
      </div>
    ));
  };

  const frontendItems = createOrbitItems(leftSkills, getCategoryColor('frontend'), 'w-14 h-14', 'w-8 h-8');
  const backendItems = createOrbitItems(midSkills, getCategoryColor('backend'), 'w-16 h-16', 'w-10 h-10');
  const toolsItems = createOrbitItems(rightSkills, getCategoryColor('tools'), 'w-20 h-20', 'w-12 h-12');

  return (
    <section
      id="skills"
      ref={containerRef}
      className="w-full relative bg-[#000000] h-screen flex flex-col justify-center items-center overflow-hidden select-none"
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .stars-layer {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(1px 1px at 20px 30px, #ffffff, transparent),
            radial-gradient(1px 1px at 150px 80px, #ffffff, transparent),
            radial-gradient(1.5px 1.5px at 80px 240px, #ffffff, transparent),
            radial-gradient(1px 1px at 300px 180px, #ffffff, transparent),
            radial-gradient(1.5px 1.5px at 250px 350px, #ffffff, transparent),
            radial-gradient(1px 1px at 450px 10px, #ffffff, transparent),
            radial-gradient(2px 2px at 400px 290px, #ffffff, transparent);
          background-size: 550px 550px;
          opacity: 0.35;
        }
        .stars-layer-2 {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(1px 1px at 10px 100px, #ffffff, transparent),
            radial-gradient(1.5px 1.5px at 90px 40px, #ffffff, transparent),
            radial-gradient(1px 1px at 220px 290px, #ffffff, transparent),
            radial-gradient(2px 2px at 310px 120px, #ffffff, transparent),
            radial-gradient(1px 1px at 420px 410px, #ffffff, transparent);
          background-size: 450px 450px;
          opacity: 0.2;
          animation: spaceTwinkle 8s ease-in-out infinite alternate;
        }
        @keyframes spaceTwinkle {
          0% { opacity: 0.15; }
          50% { opacity: 0.45; }
          100% { opacity: 0.2; }
        }
        .shooting-stars-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        .shooting-star {
          position: absolute;
          height: 1.5px;
          background: linear-gradient(-45deg, #ffffff, rgba(0, 0, 0, 0));
          filter: drop-shadow(0 0 5px #ffffff);
          opacity: 0;
          transform: rotate(-45deg);
          animation: shooting-effect 12s ease-in-out infinite;
        }
        @keyframes shooting-effect {
          0% {
            transform: translate(0, 0) rotate(-45deg) scale(0);
            opacity: 0;
          }
          1% {
            opacity: 1;
            transform: translate(0, 0) rotate(-45deg) scale(1);
          }
          8% {
            opacity: 0;
            transform: translate(-600px, 600px) rotate(-45deg) scale(0.5);
          }
          100% {
            transform: translate(-600px, 600px) rotate(-45deg) scale(0);
            opacity: 0;
          }
        }
      `}</style>

      {/* Deep Space Background with Starfield */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none select-none"
        style={{
          background: 'radial-gradient(circle at center, #06050b 0%, #010102 80%, #000000 100%)'
        }}
      >
        <div className="stars-layer" style={{ opacity: 0.12 }} />
      </div>

      {/* Spatial Perspective Cyberpunk Grid Floor */}
      <div 
        className="absolute inset-0 bg-size-[60px_60px] opacity-4 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          transform: 'perspective(1000px) rotateX(75deg) translateZ(-150px) translateY(10%)',
          transformOrigin: 'top center'
        }}
      />

      {/* Ambient glowing backdrop */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none z-0 blur-[140px]"
        style={{
          background: 'radial-gradient(circle at center, #7DD6FF 0%, transparent 60%)'
        }}
      />

      {/* Giant Wall Typography Watermark (Painted/Projected effect with 3D reveal) */}
      {!isMobile && (
        <div 
          className="absolute top-[8%] md:top-[10%] left-1/2 -translate-x-1/2 text-[7vw] font-black font-mono tracking-[0.2em] text-white/[0.035] uppercase select-none pointer-events-none whitespace-nowrap z-0 mix-blend-overlay skills-watermark"
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        >
          <SplitText text="SKILLS SHOWCASE" />
        </div>
      )}

      {/* Cinematic Cyber Aperture Zoom Portal (Desktop only) */}
      {!isMobile && (
        <div className="absolute inset-0 w-full h-full z-40 perspective-[600px] overflow-hidden pointer-events-none">
          <img 
            ref={apertureRef}
            src="/minimal_aperture.png" 
            alt="minimal aperture portal" 
            className="w-full h-full object-cover object-center will-change-transform-opacity"
            style={{
              transformOrigin: '50% 49.3%'
            }}
          />
        </div>
      )}

      {/* Mobile-only content wrapper */}
      {isMobile && (
        <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col justify-center items-center h-full pt-16">
          {/* Mobile Title Header */}
          <div className="text-center mb-6">
            <h2 className="text-sm font-bold font-mono tracking-[0.3em] text-white uppercase">
              SKILLS ARCHITECTURE
            </h2>
            <div className="w-12 h-[1.5px] bg-gradient-to-r from-transparent via-[#7DD6FF] to-transparent mx-auto mt-2 opacity-45" />
          </div>

          {/* Mobile Friendly Grid Layout */}
          <div className="w-full flex flex-col gap-6 max-h-[60vh] overflow-y-auto no-scrollbar py-2">
            {[
              { title: 'Frontend', skills: leftSkills, color: getCategoryColor('frontend') },
              { title: 'Backend', skills: midSkills, color: getCategoryColor('backend') },
              { title: 'Tools', skills: rightSkills, color: getCategoryColor('tools') }
            ].map((cat) => (
              <div key={cat.title} className="flex flex-col gap-2.5">
                <h3 className="text-[10px] font-bold font-mono tracking-widest uppercase border-b border-white/5 pb-1" style={{ color: cat.color }}>
                  // {cat.title}
                </h3>
                <div className="grid grid-cols-4 gap-2.5">
                  {cat.skills.map((skill) => (
                    <div 
                      key={skill.name}
                      className="flex flex-col items-center gap-1.5 p-2 bg-white/[0.02] border border-white/5 rounded-lg active:bg-white/[0.06] active:border-white/15 transition-all"
                    >
                      <TechIcon name={skill.name} className="w-7 h-7" />
                      <span className="text-[7.5px] font-bold font-mono tracking-wider text-slate-400 uppercase text-center truncate w-full">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Concentric Elliptical Orbit Visualization */}
      {!isMobile && (
        <div 
          ref={framesRef}
          className="absolute inset-0 w-full h-full flex items-center justify-center overflow-visible pointer-events-none"
          style={{
            opacity: 0,
            transform: 'scale(0.75)'
          }}
        >
          {/* Orbit 1: Frontend */}
          <div 
            ref={feOrbitRef}
            className="absolute inset-0 z-10 flex items-center justify-center transition-all duration-300 ease-out"
            style={{
              opacity: 0,
              transform: 'scale(0.85)',
              pointerEvents: 'none'
            }}
          >
            <OrbitImages
              customItems={frontendItems}
              shape="ellipse"
              baseWidth={1920}
              radiusX={350}
              radiusY={130}
              duration={30}
              itemSize={56}
              showPath={true}
              pathColor="rgba(255, 255, 255, 0.04)"
              pathWidth={1.2}
              width="100%"
              height="100%"
              responsive={true}
            />
          </div>

          {/* Orbit 2: Backend */}
          <div 
            ref={beOrbitRef}
            className="absolute inset-0 z-15 flex items-center justify-center transition-all duration-300 ease-out"
            style={{
              opacity: 0,
              transform: 'scale(0.85)',
              pointerEvents: 'none'
            }}
          >
            <OrbitImages
              customItems={backendItems}
              shape="ellipse"
              baseWidth={1920}
              radiusX={650}
              radiusY={230}
              duration={36}
              direction="reverse"
              itemSize={64}
              showPath={true}
              pathColor="rgba(255, 255, 255, 0.04)"
              pathWidth={1.2}
              width="100%"
              height="100%"
              responsive={true}
            />
          </div>

          {/* Orbit 3: Tools */}
          <div 
            ref={toOrbitRef}
            className="absolute inset-0 z-20 flex items-center justify-center transition-all duration-300 ease-out"
            style={{
              opacity: 0,
              transform: 'scale(0.85)',
              pointerEvents: 'none'
            }}
          >
            <OrbitImages
              customItems={toolsItems}
              shape="ellipse"
              baseWidth={1920}
              radiusX={920}
              radiusY={330}
              duration={42}
              itemSize={80}
              showPath={true}
              pathColor="rgba(255, 255, 255, 0.04)"
              pathWidth={1.2}
              width="100%"
              height="100%"
              responsive={true}
            />
          </div>

          {/* Shared Center Hub */}
          <div 
            className="absolute z-30 pointer-events-auto flex flex-col items-center justify-center p-6 bg-[#040406]/95 backdrop-blur-[10px] border border-white/10 rounded-[50%] w-36 h-20 md:w-48 md:h-26 shadow-[0_0_50px_rgba(0,0,0,0.95)] select-none"
            style={{
              background: 'radial-gradient(ellipse, #0e0e12 0%, #040406 100%)'
            }}
          >
            <div className="absolute inset-2 border border-white/[0.03] rounded-[50%] pointer-events-none" />
            <div className="absolute inset-4 border border-dashed border-white/[0.02] rounded-[50%] pointer-events-none animate-[spin_40s_linear_infinite]" />
            
            <span className="text-xl md:text-2xl font-black font-mono tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 leading-none py-1">
              SKILLS
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
