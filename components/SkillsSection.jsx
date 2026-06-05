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
    <div className="flex flex-col items-center gap-2 select-none">
      {/* Icon Container */}
      <div 
        className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center"
        style={{
          '--glow-color': color
        }}
      >
        <TechIcon
          name={skill.name}
          className="w-9 h-9 md:w-11 md:h-11 filter drop-shadow-[0_0_6px_rgba(255,255,255,0.15)]"
        />
      </div>

      {/* Title */}
      <span className="text-[8px] md:text-[9px] font-bold font-mono tracking-widest text-slate-400 uppercase text-center truncate max-w-full px-1">
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

  const renderCategoryFrame = (title, skills, color) => (
    <div className="relative flex flex-col items-center max-w-[280px] md:max-w-[310px] w-full select-none pt-28">
      {/* Hanging Wire SVG representing steel rope holding the frame */}
      <svg 
        className="absolute top-0 left-0 w-full h-28 pointer-events-none overflow-visible" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`nailMetal-${title}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#d1d5db" />
            <stop offset="70%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
          <filter id={`shadow-${title}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="2" dy="4" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* Suspended fine steel wires with drop shadow */}
        <g filter={`url(#shadow-${title})`}>
          <line 
            x1="50" 
            y1="10" 
            x2="15" 
            y2="96" 
            stroke="#52525b" 
            strokeWidth="1.2" 
          />
          <line 
            x1="50" 
            y1="10" 
            x2="85" 
            y2="96" 
            stroke="#52525b" 
            strokeWidth="1.2" 
          />
        </g>

        {/* Hanger Nail / Pin with shadow */}
        <g filter={`url(#shadow-${title})`}>
          {/* Subtle background glow from nail hole */}
          <circle cx="50" cy="10" r="5" stroke={color} strokeWidth="0.5" fill="none" className="opacity-25" />
          {/* Real metallic nail head */}
          <circle cx="50" cy="10" r="3" fill={`url(#nailMetal-${title})`} stroke="#1f2937" strokeWidth="0.5" />
          <circle cx="49" cy="9" r="0.6" fill="#ffffff" className="opacity-90" />
        </g>
      </svg>

      {/* Realistic Beveled Picture Frame (Opaque Glass) */}
      <div 
        className="relative flex flex-col items-center bg-[#09090b]/40 backdrop-blur-[2px] border-[12px] border-[#18181b] rounded-lg p-5 md:p-6 w-full flex-1"
        style={{
          boxShadow: `
            0 35px 55px -15px rgba(0,0,0,0.95), 
            0 0 40px -15px ${color}15, 
            inset 0 1px 1px rgba(255,255,255,0.1),
            inset 0 -1px 1px rgba(0,0,0,0.8)
          `,
        }}
      >
        {/* Inner wood highlight and passepartout */}
        <div 
          className="absolute inset-0.5 border border-white/5 pointer-events-none rounded" 
        />
        <div 
          className="absolute inset-2 border border-dashed pointer-events-none rounded opacity-15" 
          style={{ borderColor: color }}
        />
        
        {/* Section Header */}
        <div className="text-center mb-6 z-10">
          <h3 
            className="text-xs md:text-sm font-black font-mono tracking-widest uppercase"
            style={{ color }}
          >
            {title}
          </h3>
          <div 
            className="w-8 h-[1.5px] mx-auto mt-2 rounded-full opacity-35" 
            style={{ backgroundColor: color }}
          />
        </div>

        {/* Grid of icons inside the frame */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-6 w-full justify-items-center z-10">
          {skills.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>
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

      {/* Giant Wall Typography Watermark (Painted/Projected effect) */}
      <div 
        className="absolute top-[8%] md:top-[10%] left-1/2 -translate-x-1/2 text-[7vw] font-black font-mono tracking-[0.2em] text-white/[0.025] uppercase select-none pointer-events-none whitespace-nowrap z-0 mix-blend-overlay"
        style={{
          textShadow: '0 0 40px rgba(255,255,255,0.01)',
        }}
      >
        Skills Showcase
      </div>

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

      {/* Hanging Frames Wrapper */}
      <div 
        ref={framesRef}
        className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-8 lg:gap-10 justify-center items-center lg:items-stretch overflow-y-auto lg:overflow-visible max-h-[85vh] py-8 no-scrollbar"
        style={{
          opacity: isMobile ? 1 : 0,
          transform: isMobile ? 'none' : 'scale(0.75)'
        }}
      >
        {renderCategoryFrame('Frontend', leftSkills, getCategoryColor('frontend'))}
        {renderCategoryFrame('Backend', midSkills, getCategoryColor('backend'))}
        {renderCategoryFrame('Tools', rightSkills, getCategoryColor('tools'))}
      </div>
    </section>
  );
}
