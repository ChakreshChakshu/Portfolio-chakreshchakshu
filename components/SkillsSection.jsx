'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { skillsData } from '@/data/skills';
import { gsap } from 'gsap';
import TechIcon from './TechIcon';

const getCategoryColor = (category) => {
  if (category === 'frontend') return '#7DD6FF';
  if (category === 'backend') return '#D5FF37';
  return '#FFA17B';
};

const getCategoryGlow = (category) => {
  if (category === 'frontend') return 'rgba(125,214,255,0.08)';
  if (category === 'backend') return 'rgba(213,255,55,0.08)';
  return 'rgba(255,161,123,0.08)';
};

// Skill type mapping
const leftSkills = skillsData.frontend.map(skill => ({ ...skill, category: 'frontend' }));
const midSkills = skillsData.backend.map(skill => ({ ...skill, category: 'backend' }));
const rightSkills = skillsData.tools.map(skill => ({ ...skill, category: 'tools' }));

const allSkills = [...leftSkills, ...midSkills, ...rightSkills];

export function SkillCard({ skill, onClick }) {
  const color = getCategoryColor(skill.category);
  const glow = getCategoryGlow(skill.category);

  return (
    <div
      onClick={onClick}
      className="skill-card group relative w-28 h-28 md:w-36 md:h-36 rounded-2xl border border-white/5 bg-slate-950/45 backdrop-blur-md cursor-pointer transition-all duration-300 select-none flex flex-col items-center justify-center p-3 flex-shrink-0"
      style={{
        '--card-accent': color,
        '--card-glow': glow,
      }}
      title={skill.name}
    >
      {/* Cyber Glow Border on Hover */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `0 0 25px -4px ${color}20`,
          border: `1px solid ${color}30`,
        }}
      />

      {/* Tech Icon Container */}
      <div className="group-hover:scale-105 transition-transform duration-300 flex items-center justify-center mt-1">
        <TechIcon
          name={skill.name}
          className="w-12 h-12 md:w-16 md:h-16 select-none filter drop-shadow-[0_0_6px_rgba(255,255,255,0.15)] group-hover:drop-shadow-[0_0_12px_var(--card-accent)] transition-all duration-300"
        />
      </div>

      {/* Tech Name */}
      <span className="text-[9px] md:text-[11px] font-bold font-mono tracking-widest text-slate-400 group-hover:text-white transition-colors uppercase mt-4 text-center truncate max-w-full px-1">
        {skill.name}
      </span>
    </div>
  );
}

export function SkillsSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [clickedCardRect, setClickedCardRect] = useState(null);
  const [activeTab, setActiveTab] = useState('frontend'); // Mobile tab control
  
  const containerRef = useRef(null);
  const leftColRef = useRef(null);
  const midColRef = useRef(null);
  const rightColRef = useRef(null);
  
  const apertureRef = useRef(null);
  const columnsContainerRef = useRef(null);
  
  // Ref pointers for detail animation
  const overlayRef = useRef(null);
  const targetCardRef = useRef(null);
  const clonedCardRef = useRef(null);
  const detailTextRef = useRef(null);
  const backBtnRef = useRef(null);
  const thumbNavRef = useRef(null);

  // Check screen width for mobile layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll listener for desktop (drives ColumnScroll parallax + Aperture Zoom)
  useEffect(() => {
    if (isMobile || selectedSkill) return;

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

      setScrollProgress(progress);

      // 1. Aperture Zoom Transition (progress 0.0 -> 0.5)
      const apertureImg = apertureRef.current;
      const columnsContainer = columnsContainerRef.current;

      if (apertureImg && columnsContainer) {
        if (progress <= 0.5) {
          const subProgress = progress / 0.5;
          gsap.set(apertureImg, {
            scale: 1 + subProgress * 11,
            opacity: 1 - subProgress,
            display: 'block'
          });
          gsap.set(columnsContainer, {
            scale: 0.65 + subProgress * 0.35,
            opacity: subProgress
          });
        } else {
          gsap.set(apertureImg, { 
            opacity: 0, 
            display: 'none'
          });
          gsap.set(columnsContainer, { 
            scale: 1, 
            opacity: 1
          });
        }
      }

      // 2. Alternate Column Translation (progress 0.4 -> 1.0)
      if (progress > 0.4) {
        const colProgress = (progress - 0.4) / 0.6;
        const leftCol = leftColRef.current;
        const midCol = midColRef.current;
        const rightCol = rightColRef.current;
        const columnsContainer = columnsContainerRef.current;

        if (leftCol && midCol && rightCol && columnsContainer) {
          const containerHeight = columnsContainer.clientHeight;

          const getTranslateY = (colEl, dir) => {
            const colHeight = colEl.scrollHeight;
            const maxScroll = Math.max(80, colHeight - containerHeight) * 0.25;
            if (dir === 'down') {
              return -colProgress * maxScroll;
            } else {
              return -(1 - colProgress) * maxScroll;
            }
          };

          gsap.to(leftCol, { y: getTranslateY(leftCol, 'down'), duration: 1.2, ease: "power2.out", overwrite: "auto" });
          gsap.to(midCol, { y: getTranslateY(midCol, 'up'), duration: 1.2, ease: "power2.out", overwrite: "auto" });
          gsap.to(rightCol, { y: getTranslateY(rightCol, 'down'), duration: 1.2, ease: "power2.out", overwrite: "auto" });
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
  }, [isMobile, selectedSkill]);

  // Card click trigger (captures position & sets active state)
  const handleCardClick = (skill, cardElement) => {
    if (!cardElement) return;
    const rect = cardElement.getBoundingClientRect();
    setClickedCardRect({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    });
    setSelectedSkill(skill);
    window.lenis?.stop(); // Pause page scroll stack
  };

  // Switch skill directly within the details overlay (uses crossfade transition)
  const handleThumbnailClick = (skill) => {
    if (selectedSkill?.name === skill.name) return;

    const detailText = detailTextRef.current;
    const targetCard = targetCardRef.current;

    // Pulse transition
    if (detailText && targetCard) {
      gsap.timeline()
        .to([detailText, targetCard], { opacity: 0, scale: 0.95, duration: 0.2, ease: "power2.in" })
        .call(() => setSelectedSkill(skill))
        .to([detailText, targetCard], { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" });
    } else {
      setSelectedSkill(skill);
    }
  };

  // Close detail panel
  const handleCloseDetail = () => {
    if (!clickedCardRect) {
      setSelectedSkill(null);
      window.lenis?.start();
      return;
    }

    const clonedCard = clonedCardRef.current;
    const detailText = detailTextRef.current;
    const backBtn = backBtnRef.current;
    const thumbNav = thumbNavRef.current;
    const columnsContainer = columnsContainerRef.current;
    const overlay = overlayRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        setSelectedSkill(null);
        setClickedCardRect(null);
        window.lenis?.start(); // Resume page scroll stack
      }
    });

    tl.to(backBtn, { opacity: 0, scale: 0.8, duration: 0.3, ease: "power2.in" }, 0)
      .to(thumbNav, { opacity: 0, y: 30, duration: 0.3, ease: "power2.in" }, 0)
      .to(detailText, { xPercent: 100, duration: 0.5, ease: "power3.in" }, 0)
      .to(clonedCard, {
        left: clickedCardRect.left,
        top: clickedCardRect.top,
        width: clickedCardRect.width,
        height: clickedCardRect.height,
        duration: 0.6,
        ease: "expo.inOut"
      }, 0.05)
      .to(columnsContainer, { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }, 0.05)
      .to(overlay, { opacity: 0, duration: 0.4 }, 0.25);
  };

  // FLIP transition effect on open detail panel
  useLayoutEffect(() => {
    if (!selectedSkill || !clickedCardRect || isMobile) return;

    const clonedCard = clonedCardRef.current;
    const targetCard = targetCardRef.current;
    const detailText = detailTextRef.current;
    const backBtn = backBtnRef.current;
    const thumbNav = thumbNavRef.current;
    const columnsContainer = columnsContainerRef.current;
    const overlay = overlayRef.current;

    if (!clonedCard || !targetCard || !detailText || !overlay) return;

    // Get final card rect dynamically
    const targetRect = targetCard.getBoundingClientRect();

    // 1. Initial State Settings
    gsap.set(clonedCard, {
      position: 'fixed',
      left: clickedCardRect.left,
      top: clickedCardRect.top,
      width: clickedCardRect.width,
      height: clickedCardRect.height,
      zIndex: 110,
      pointerEvents: 'none'
    });

    gsap.set(overlay, { opacity: 0 });
    gsap.set(detailText, { xPercent: 100 });
    gsap.set(backBtn, { opacity: 0, scale: 0.8 });
    gsap.set(thumbNav, { opacity: 0, y: 30 });

    // 2. Play Animations
    const tl = gsap.timeline();
    tl.to(overlay, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0)
      .to(columnsContainer, { opacity: 0.05, scale: 0.9, duration: 0.6, ease: "power2.out" }, 0)
      .to(clonedCard, {
        left: targetRect.left,
        top: targetRect.top,
        width: targetRect.width,
        height: targetRect.height,
        duration: 0.7,
        ease: "expo.out"
      }, 0.05)
      .to(detailText, { xPercent: 0, duration: 0.7, ease: "power3.out" }, 0.1)
      .to(backBtn, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" }, 0.35)
      .to(thumbNav, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.4);

  }, [selectedSkill, clickedCardRect, isMobile]);

  // Mobile drawer close utility
  const closeMobileDrawer = () => {
    setSelectedSkill(null);
  };

  return (
    <section
      id="skills"
      ref={containerRef}
      className="w-full relative bg-[#000000] h-screen flex flex-col justify-center items-center overflow-hidden select-none"
    >
      {/* CSS Utilities */}
      <style>{`
        .skills-grid-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
          will-change: transform;
          justify-content: flex-start;
          align-items: center;
        }
        .skills-grid-col::-webkit-scrollbar {
          display: none;
        }
        .skills-detail-tag {
          font-family: monospace;
          font-weight: bold;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 6px 14px;
          border-radius: 9999px;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
        }
        .skills-detail-tag:hover {
          color: white;
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
        }
      `}</style>

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

      {/* Ambient glowing backdrop */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none z-0 blur-[140px] transition-all duration-1000"
        style={{
          background: selectedSkill 
            ? `radial-gradient(circle at center, ${getCategoryColor(selectedSkill.category)} 0%, transparent 55%)`
            : scrollProgress > 0.8 
              ? 'radial-gradient(circle at center, #FFA17B 0%, transparent 55%)'
              : scrollProgress > 0.4
                ? 'radial-gradient(circle at center, #D5FF37 0%, transparent 55%)'
                : 'radial-gradient(circle at center, #7DD6FF 0%, transparent 55%)'
        }}
      />

      {/* Desktop ColumnScroll View */}
      {!isMobile && (
        <div className="relative w-full max-w-3xl mx-auto px-6 flex flex-col items-stretch z-10">
          {/* Column Headers */}
          <div className="relative w-full flex justify-between items-center text-center mb-8 mt-4 select-none">
            {/* Frontend */}
            <div className="flex-1 flex flex-col items-center">
              <h3 className="text-xs md:text-sm font-black font-mono tracking-widest text-[#7DD6FF] uppercase">
                Frontend
              </h3>
              <div className="w-10 h-0.5 bg-[#7DD6FF]/20 mt-2 rounded-full" />
            </div>

            {/* Backend */}
            <div className="flex-1 flex flex-col items-center">
              <h3 className="text-xs md:text-sm font-black font-mono tracking-widest text-[#D5FF37] uppercase">
                Backend
              </h3>
              <div className="w-10 h-0.5 bg-[#D5FF37]/20 mt-2 rounded-full" />
            </div>

            {/* Tools */}
            <div className="flex-1 flex flex-col items-center">
              <h3 className="text-xs md:text-sm font-black font-mono tracking-widest text-[#FFA17B] uppercase">
                Tools
              </h3>
              <div className="w-10 h-0.5 bg-[#FFA17B]/20 mt-2 rounded-full" />
            </div>
          </div>

          {/* Scrolling Grid Area */}
          <div 
            ref={columnsContainerRef}
            className="relative w-full h-[52vh] flex justify-center gap-12 items-stretch overflow-hidden"
          >
            {/* Top and Bottom Fade Gradients */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#000000] to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#000000] to-transparent z-20 pointer-events-none" />

            {/* Column 1: Left */}
            <div ref={leftColRef} className="skills-grid-col flex-1 py-8">
              {leftSkills.map((skill) => (
                <SkillCard 
                  key={skill.name} 
                  skill={skill} 
                  onClick={(e) => handleCardClick(skill, e.currentTarget)}
                />
              ))}
            </div>

            {/* Column 2: Middle */}
            <div ref={midColRef} className="skills-grid-col flex-1 py-8">
              {midSkills.map((skill) => (
                <SkillCard 
                  key={skill.name} 
                  skill={skill} 
                  onClick={(e) => handleCardClick(skill, e.currentTarget)}
                />
              ))}
            </div>

            {/* Column 3: Right */}
            <div ref={rightColRef} className="skills-grid-col flex-1 py-8">
              {rightSkills.map((skill) => (
                <SkillCard 
                  key={skill.name} 
                  skill={skill} 
                  onClick={(e) => handleCardClick(skill, e.currentTarget)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Grid Layout & Category Selector */}
      {isMobile && (
        <div className="relative w-full max-w-md mx-auto px-6 flex flex-col h-full justify-center z-10 pt-16">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold font-mono tracking-widest text-[#7DD6FF] uppercase">
              Skills Catalog
            </h3>
            <span className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest mt-1 block">
              Tap for system details
            </span>
          </div>

          {/* Tab buttons */}
          <div className="grid grid-cols-3 gap-2 bg-white/[0.02] border border-white/5 p-1 rounded-xl mb-6">
            {['frontend', 'backend', 'tools'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 text-[10px] font-bold font-mono uppercase tracking-widest rounded-lg transition-all ${
                  activeTab === tab 
                    ? 'bg-white/10 text-white border-white/10 border' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                style={{
                  color: activeTab === tab ? getCategoryColor(tab) : undefined
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab contents */}
          <div className="flex-1 overflow-y-auto max-h-[58vh] pr-1 pb-10 flex justify-center">
            <div className="grid grid-cols-3 gap-4 auto-rows-max justify-items-center">
              {allSkills
                .filter(s => s.category === activeTab)
                .map((skill) => (
                  <SkillCard 
                    key={skill.name} 
                    skill={skill} 
                    onClick={() => setSelectedSkill(skill)}
                  />
                ))
              }
            </div>
          </div>
        </div>
      )}

      {/* Desktop Detail Overlay (FLIP) */}
      {!isMobile && selectedSkill && (
        <div 
          ref={overlayRef}
          className="fixed inset-0 w-full h-full bg-[#000000]/40 backdrop-blur-sm z-[100] flex pointer-events-auto"
        >
          {/* Back button */}
          <button 
            ref={backBtnRef}
            onClick={handleCloseDetail}
            className="absolute top-10 left-10 text-white/50 hover:text-white transition-colors flex items-center gap-3 font-mono text-xs uppercase tracking-widest group z-30"
          >
            <svg 
              className="w-8 h-3 stroke-current group-hover:-translate-x-1.5 transition-transform" 
              viewBox="0 0 50 9" 
              fill="none"
              strokeWidth="1.5"
            >
              <path d="M0 4.5l5-3M0 4.5l5 3M50 4.5h-50" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Grid
          </button>

          {/* Left panel: holds the target card and thumbnail nav */}
          <div className="flex-1 h-full flex flex-col items-center justify-center relative select-none">
            <div 
              ref={targetCardRef}
              className="w-28 h-28 md:w-36 md:h-36 rounded-2xl border border-white/5 bg-transparent relative opacity-0"
            />

            {/* Thumbnail track navigation inside left workspace */}
            <div 
              ref={thumbNavRef}
              className="absolute bottom-10 flex justify-center items-center pointer-events-auto"
            >
              <div className="flex gap-4 p-2 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                {allSkills
                  .filter(s => s.category === selectedSkill.category)
                  .map((skill) => {
                    const isActive = skill.name === selectedSkill.name;
                    const color = getCategoryColor(skill.category);
                    return (
                      <button
                        key={skill.name}
                        onClick={() => handleThumbnailClick(skill)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-900 border transition-all duration-300 ${
                          isActive 
                            ? 'scale-115 border-white/20' 
                            : 'opacity-40 hover:opacity-80 border-transparent'
                        }`}
                        style={{
                          boxShadow: isActive ? `0 0 15px -2px ${color}` : undefined,
                          borderColor: isActive ? color : undefined
                        }}
                        title={skill.name}
                      >
                        <TechIcon name={skill.name} className="w-5 h-5 filter drop-shadow-[0_0_2px_rgba(255,255,255,0.1)]" />
                      </button>
                    );
                  })
                }
              </div>
            </div>
          </div>

          {/* Right panel: covers the whole right side of the screen */}
          <div 
            ref={detailTextRef}
            className="w-[45vw] md:w-[40vw] max-w-[550px] min-w-[400px] h-full bg-slate-950/70 border-l border-white/5 backdrop-blur-2xl flex flex-col justify-center px-12 md:px-16 text-left relative z-20 select-none"
          >
            {/* Category */}
            <span 
              className="text-[10px] font-bold font-mono tracking-[0.3em] uppercase mb-2"
              style={{ color: getCategoryColor(selectedSkill.category) }}
            >
              {selectedSkill.category} System
            </span>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-sans tracking-tight text-white uppercase leading-none filter drop-shadow-[0_0_15px_rgba(255,255,255,0.06)]">
              {selectedSkill.name}
            </h2>

            {/* Years of Experience */}
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mt-3">
              {selectedSkill.years} Years of Hands-on Experience
            </span>

            {/* Tag Cloud */}
            <div className="flex flex-wrap gap-2 mt-6">
              {selectedSkill.tags.map((tag) => (
                <span key={tag} className="skills-detail-tag">
                  {tag}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div className="w-24 h-0.5 bg-white/10 my-6" />

            {/* Description */}
            <p className="text-sm md:text-base text-slate-400 leading-relaxed font-sans">
              {selectedSkill.description}
            </p>

            {/* Dynamic Level Meter */}
            <div className="w-full mt-8">
              <div className="flex justify-between font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                <span>System Proficiency</span>
                <span style={{ color: getCategoryColor(selectedSkill.category) }}>{selectedSkill.level}%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ 
                    width: `${selectedSkill.level}%`,
                    backgroundColor: getCategoryColor(selectedSkill.category),
                    boxShadow: `0 0 10px ${getCategoryColor(selectedSkill.category)}`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Cloned card that FLIPs over targetCard */}
          {clickedCardRect && (
            <div 
              ref={clonedCardRef}
              className="pointer-events-none animate-none"
            >
              <SkillCard skill={selectedSkill} />
            </div>
          )}
        </div>
      )}

      {/* Mobile Detail Bottom Drawer */}
      {isMobile && selectedSkill && (
        <div 
          className="fixed inset-0 w-full h-full bg-black/85 z-[150] flex items-end justify-center pointer-events-auto"
          onClick={closeMobileDrawer}
        >
          {/* Drawer Body */}
          <div 
            className="w-full bg-[#0a0a0c] border-t border-white/10 rounded-t-[32px] p-6 pb-12 flex flex-col items-stretch max-h-[75vh] overflow-y-auto select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer handle */}
            <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6" />

            <div className="flex items-center gap-4 mb-5">
              {/* Icon */}
              <div 
                className="w-16 h-16 rounded-2xl bg-white/[0.01] border flex items-center justify-center shadow-inner"
                style={{ borderColor: `${getCategoryColor(selectedSkill.category)}20` }}
              >
                <TechIcon 
                  name={selectedSkill.name} 
                  className="w-10 h-10"
                />
              </div>

              {/* Title Area */}
              <div>
                <span 
                  className="text-[9px] font-bold font-mono tracking-widest uppercase"
                  style={{ color: getCategoryColor(selectedSkill.category) }}
                >
                  {selectedSkill.category} System
                </span>
                <h3 className="text-2xl font-black text-white uppercase font-sans mt-0.5 leading-none">
                  {selectedSkill.name}
                </h3>
                <span className="text-[10px] font-mono text-slate-500 font-bold block mt-1">
                  {selectedSkill.years} Years XP
                </span>
              </div>
            </div>

            {/* Proficiency Bar */}
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl mb-5">
              <div className="flex justify-between font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                <span>Proficiency</span>
                <span style={{ color: getCategoryColor(selectedSkill.category) }}>{selectedSkill.level}%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${selectedSkill.level}%`,
                    backgroundColor: getCategoryColor(selectedSkill.category),
                    boxShadow: `0 0 10px ${getCategoryColor(selectedSkill.category)}`
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-400 leading-relaxed font-sans mb-6">
              {selectedSkill.description}
            </p>

            {/* Tag Cloud */}
            <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest mb-3">
              Sub-systems & Frameworks
            </span>
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedSkill.tags.map((tag) => (
                <span key={tag} className="skills-detail-tag">
                  {tag}
                </span>
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={closeMobileDrawer}
              className="w-full py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-widest rounded-xl transition-all font-bold mt-auto"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
