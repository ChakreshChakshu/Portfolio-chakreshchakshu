'use client';

import { useState, useRef, useEffect } from 'react';
import { skillsData } from '@/data/skills';
import { gsap } from 'gsap';
import TechIcon from './TechIcon';

const getCategoryColor = (category) => {
  if (category === 'frontend') return '#7DD6FF';
  if (category === 'backend') return '#D5FF37';
  return '#FFA17B';
};

const leftSkills = skillsData.frontend.map(skill => ({ ...skill, category: 'frontend' }));
const midSkills = skillsData.backend.map(skill => ({ ...skill, category: 'backend' }));
const rightSkills = skillsData.tools.map(skill => ({ ...skill, category: 'tools' }));

export function SkillCard({ skill }) {
  const color = getCategoryColor(skill.category);

  return (
    <div
      className="group relative w-28 h-28 md:w-32 md:h-32 rounded-2xl border border-white/5 bg-slate-950/45 backdrop-blur-md transition-all duration-500 flex flex-col items-center justify-center p-3 hover:border-white/10 hover:bg-slate-950/55 hover:scale-105 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
      style={{
        boxShadow: `0 10px 25px -6px ${color}08`,
      }}
    >
      {/* Top glowing wire/highlight */}
      <div 
        className="absolute top-0 left-6 right-6 h-[1.5px] blur-[0.5px]" 
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`
        }}
      />
      
      {/* Icon Container */}
      <div className="transition-transform duration-300 group-hover:scale-105 flex items-center justify-center mb-2">
        <TechIcon
          name={skill.name}
          className="w-9 h-9 md:w-11 md:h-11 filter drop-shadow-[0_0_6px_rgba(255,255,255,0.15)] group-hover:drop-shadow-[0_0_10px_var(--glow-color)]"
          style={{ '--glow-color': color }}
        />
      </div>

      {/* Title */}
      <span className="text-[8px] md:text-[9px] font-bold font-mono tracking-widest text-slate-400 group-hover:text-white transition-colors uppercase text-center truncate max-w-full px-1">
        {skill.name}
      </span>
    </div>
  );
}

export function SkillsSection() {
  const [isMobile, setIsMobile] = useState(false);
  const apertureRef = useRef(null);
  const framesRef = useRef(null);

  // Check screen width for mobile layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll listener for desktop (drives Aperture Zoom and board reveals)
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

  const renderCategory = (title, skills, color) => (
    <div className="flex flex-col items-center w-full max-w-sm">
      {/* Category Heading */}
      <div className="text-center mb-6">
        <h3 
          className="text-xs md:text-sm font-black font-mono tracking-widest uppercase"
          style={{ color }}
        >
          {title}
        </h3>
        <div 
          className="w-10 h-[2px] mx-auto mt-2 rounded-full opacity-35" 
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Grid of individual card frames */}
      <div className="grid grid-cols-2 gap-4 justify-items-center w-full">
        {skills.map((skill) => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
      </div>
    </div>
  );

  return (
    <section
      id="skills"
      className="w-full relative bg-[#000000] h-screen flex flex-col justify-center items-center overflow-hidden select-none"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <img 
          src="/images/SkillsBG.webp" 
          alt="Skills Background" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
      </div>

      {/* Spatial Perspective Cyberpunk Grid Floor */}
      <div 
        className="absolute inset-0 bg-size-[60px_60px] opacity-10 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
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

      {/* Cinematic Cyber Aperture Zoom Portal (Desktop only) */}
      {!isMobile && (
        <div className="absolute inset-0 w-full h-full z-40 perspective-[600px] overflow-hidden pointer-events-none">
          <img 
            ref={apertureRef}
            src="/cyber_aperture.png" 
            alt="cyber aperture portal" 
            className="w-full h-full object-cover object-center will-change-transform-opacity"
            style={{
              maskImage: 'radial-gradient(circle at 50% 50%, transparent 20%, black 21.5%)',
              WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 20%, black 21.5%)'
            }}
          />
        </div>
      )}

      {/* Hanging Frames Grid Wrapper */}
      <div 
        ref={framesRef}
        className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col lg:flex-row gap-8 lg:gap-12 justify-center items-center lg:items-start overflow-y-auto lg:overflow-visible max-h-[85vh] py-8 no-scrollbar"
        style={{
          opacity: isMobile ? 1 : 0,
          transform: isMobile ? 'none' : 'scale(0.75)'
        }}
      >
        {renderCategory('Frontend', leftSkills, getCategoryColor('frontend'))}
        {renderCategory('Backend', midSkills, getCategoryColor('backend'))}
        {renderCategory('Tools', rightSkills, getCategoryColor('tools'))}
      </div>
    </section>
  );
}
