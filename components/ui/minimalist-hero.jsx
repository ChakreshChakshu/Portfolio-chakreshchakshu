'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { heroData } from '@/data/hero';
import { ElegantShape } from '@/components/ui/shape-landing-hero';
import { 
  GithubLogo, 
  LinkedinLogo, 
  TwitterLogo, 
  Envelope 
} from '@phosphor-icons/react';

// Premium metadata specs for the portfolio dashboard
const specsData = {
  name: "Chakresh Chakshu",
  role: "Full Stack Developer",
  coreStack: "React / Next.js / Node",
  specialization: "Frontend Systems & Interaction Design",
  currentUpgrade: "System Design + DSA",
};

export function MinimalistHero({ className }) {
  const {
    imageSrc,
    imageAlt,
    socialLinks,
    locationText,
  } = heroData;

  const {
    name,
    role,
    coreStack,
    specialization,
    currentUpgrade,
  } = specsData;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  // Scroll Listener: Activates layout symmetrically and triggers orbital explosion burst on first scroll down
  useEffect(() => {
    const handleScroll = () => {
      const threshold = 20;
      const scrolled = window.scrollY > threshold;
      
      if (scrolled) {
        setIsExpanded(prev => {
          if (!prev) {
            setIsExploding(true);
            setTimeout(() => {
              setIsExploding(false);
            }, 1200);
          }
          return true;
        });
      } else {
        setIsExpanded(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial scroll state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      id="home"
      className={cn(
        'relative flex h-full w-full flex-col items-center justify-between bg-[#000000] p-8 font-sans md:p-12 overflow-hidden select-none',
        className
      )}
    >
      {/* 1. Cyber-Beams Grid Background */}
      <div 
        className={cn(
          "absolute inset-0 z-0 pointer-events-none transition-opacity duration-[2000ms] ease-out",
          isExpanded ? "opacity-100" : "opacity-40"
        )}
      >
        {/* Soft elegant geometric shapes - mounts on scroll */}
        {isExpanded && (
          <div className="absolute inset-0 overflow-hidden z-0">
            <ElegantShape
              delay={0.3}
              width={600}
              height={140}
              rotate={12}
              gradient="from-indigo-500/[0.12]"
              className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
            />

            <ElegantShape
              delay={0.5}
              width={500}
              height={120}
              rotate={-15}
              gradient="from-rose-500/[0.12]"
              className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
            />

            <ElegantShape
              delay={0.4}
              width={300}
              height={80}
              rotate={-8}
              gradient="from-violet-500/[0.12]"
              className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
            />

            <ElegantShape
              delay={0.6}
              width={200}
              height={60}
              rotate={20}
              gradient="from-amber-500/[0.12]"
              className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
            />

            <ElegantShape
              delay={0.7}
              width={150}
              height={40}
              rotate={-25}
              gradient="from-cyan-500/[0.12]"
              className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
            />
          </div>
        )}

        <div 
          className="absolute inset-0 opacity-[0.08] z-1"
          style={{
            backgroundImage: `linear-gradient(rgba(252, 163, 17, 0.08) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(252, 163, 17, 0.08) 1px, transparent 1px)`,
            backgroundSize: '45px 45px',
          }}
        />
        {/* Soft atmospheric gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.95)_100%)] z-1" />
        {/* Centered gold ambient blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-[#fca311]/5 blur-[160px] animate-pulse duration-[10000ms] z-1" />
      </div>



      {/* Symmetrical 3-Column Grid Layout */}
      <div className="relative grid w-full flex-grow grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 z-10 max-w-7xl mx-auto my-auto items-center">
        
        {/* Column 1: Left specs content panel (Glides in from Left) */}
        <div 
          className={cn(
            "order-2 md:order-1 flex flex-col items-start justify-center text-left max-w-sm py-6 md:py-12 transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1)",
            isExpanded 
              ? "opacity-100 translate-x-0 scale-100 pointer-events-auto" 
              : "opacity-0 -translate-x-8 scale-95 pointer-events-none hidden md:flex md:h-0 md:py-0 md:overflow-hidden"
          )}
        >
          <div className="flex flex-col justify-center h-full min-h-[220px] md:min-h-[260px] border-l-2 border-[#fca311]/30 pl-6 md:pl-8">
            <h2 className="text-3xl md:text-[35px] font-extrabold tracking-tight text-white leading-[1.45] font-sans">
              I engineer <span className="text-[#fca311] font-semibold underline decoration-[#fca311]/25 decoration-2 underline-offset-[6px]">interfaces</span>, systems and interactive product experiences.
            </h2>
          </div>

        </div>

        {/* Column 2: Empty Spacer for the Centered Avatar System */}
        <div className="order-1 md:order-2 flex justify-center items-center h-full min-h-[400px]" />

        {/* Column 3: Right specs content panel (Glides in from Right) */}
        <div 
          className={cn(
            "order-3 flex flex-col items-start md:items-end justify-center text-left md:text-right max-w-sm py-6 md:py-12 ml-auto transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1)",
            isExpanded 
              ? "opacity-100 translate-x-0 scale-100 pointer-events-auto" 
              : "opacity-0 translate-x-8 scale-95 pointer-events-none hidden md:flex md:h-0 md:py-0 md:overflow-hidden"
          )}
        >
          {/* Symmetrical Right Specs Table Container */}
          <div className="flex flex-col justify-center h-full w-full min-h-[220px] md:min-h-[260px] border-r-2 border-[#fca311]/30 pr-6 md:pr-8 text-left md:text-right">
            <div className="w-full pt-2 border-b md:border-b-0 md:border-t border-[#e5e5e5]/10 md:pt-6">
              <div className="grid grid-cols-2 md:grid-cols-1 gap-y-6 gap-x-8 md:gap-x-0">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#fca311] font-sans font-bold tracking-wider uppercase mb-1.5 opacity-90">
                    Role
                  </span>
                  <span className="text-sm text-white font-sans font-medium tracking-wide">
                    {role}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#fca311] font-sans font-bold tracking-wider uppercase mb-1.5 opacity-90">
                    Core Stack
                  </span>
                  <span className="text-sm text-white font-sans font-medium tracking-wide">
                    {coreStack}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#fca311] font-sans font-bold tracking-wider uppercase mb-1.5 opacity-90">
                    Specialization
                  </span>
                  <span className="text-sm text-[#e5e5e5] font-sans font-medium tracking-wide leading-relaxed">
                    {specialization}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#fca311] font-sans font-bold tracking-wider uppercase mb-1.5 opacity-90">
                    Current Upgrade
                  </span>
                  <span className="text-sm text-[#e5e5e5] font-sans font-medium tracking-wide">
                    {currentUpgrade}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Permanently Centered Portrait Core Engine --- */}
      <div 
        onMouseEnter={() => setIsAvatarHovered(true)}
        onMouseLeave={() => setIsAvatarHovered(false)}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[340px] md:max-w-[420px] lg:max-w-[480px] aspect-square overflow-visible shrink-0 flex justify-center items-center z-30 group pointer-events-none"
      >
        
        {/* Ambient Background Aura Glow (Reacts to group hover) */}
        <div className="absolute w-[110%] h-[110%] rounded-full bg-[radial-gradient(circle_at_center,rgba(252,163,17,0.12)_0%,rgba(252,163,17,0)_65%)] blur-3xl z-0 pointer-events-none transition-all duration-700 group-hover:scale-110 group-hover:opacity-100 opacity-80" />

        {/* --- Explosion Shockwave Rings --- */}
        {isExploding && (
          <>
            <div 
              className="absolute w-[60%] h-[60%] rounded-full border-4 border-[#fca311]/50 pointer-events-none z-50 animate-ping"
              style={{ animationDuration: '0.8s' }}
            />
            <div 
              className="absolute w-[60%] h-[60%] rounded-full border-2 border-white/30 pointer-events-none z-50 animate-ping blur-[2px]"
              style={{ animationDuration: '1.2s' }}
            />
          </>
        )}

        {/* --- Central Premium Portrait Base --- */}
        <div 
          className={cn(
            "absolute w-[58%] h-[58%] rounded-full shadow-[0_0_40px_rgba(252,163,17,0.12)] border-2 border-[#fca311]/45 pointer-events-auto z-35 flex justify-center items-center overflow-hidden transition-all duration-500",
            !isExpanded 
              ? "hover:border-[#fca311] hover:shadow-[0_0_30px_rgba(252,163,17,0.25)] hover:scale-[1.03]" 
              : "group-hover:border-[#fca311] group-hover:shadow-[0_0_35px_rgba(252,163,17,0.3)] group-hover:scale-[1.03]"
          )}
        >
          {/* Layered Background Base */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#0b0f19] via-[#14213d] to-[#1a2d54] overflow-hidden">
            
            {/* Tech grid texture overlay */}
            <div 
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `linear-gradient(rgba(252, 163, 17, 0.2) 1px, transparent 1px), 
                                  linear-gradient(90deg, rgba(252, 163, 17, 0.2) 1px, transparent 1px)`,
                backgroundSize: '12px 12px',
              }}
            />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(252,163,17,0.3)_0%,transparent_65%)]" />
            <div className="absolute inset-2 rounded-full border border-[#fca311]/10 pointer-events-none" />

            {/* Portrait Crop Base */}
            {imageSrc && (
              <img
                src={imageSrc}
                alt={imageAlt}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 h-auto w-[82%] max-w-none object-cover origin-bottom scale-115 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                onError={(e) => {
                  const target = e.target;
                  target.onerror = null;
                  target.src = `https://placehold.co/400x600/eab308/ffffff?text=Image+Not+Found`;
                }}
              />
            )}
          </div>
        </div>

        {/* --- Floating 3D Pop-out Portrait Overlay --- */}
        {imageSrc && (
          <div
            className="absolute w-[58%] h-[58%] pointer-events-none z-40 flex justify-center items-end transition-all duration-500 group-hover:scale-[1.03]"
            style={{ 
              clipPath: "inset(-500% -500% 50% -500%)"
            }}
          >
            <img
              src={imageSrc}
              alt={imageAlt}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-auto w-[82%] max-w-none object-cover origin-bottom scale-115 drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
          </div>
        )}

        {/* --- Concentric Orbit Rings System (Permanent & responsive to hover) --- */}
        <div className="absolute inset-0 flex justify-center items-center overflow-visible z-20 transition-all duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1) scale-[0.88] group-hover:scale-[0.96] opacity-90 group-hover:opacity-100">
          
          {/* Ring 1: Orbit Guide Path for Socials (Outer) */}
          <div 
            className="absolute w-[96%] h-[96%] rounded-full border border-dashed border-[#fca311]/30 pointer-events-none z-0 animate-[spin_100s_linear_infinite]"
          />

          {/* Ring 2: HUD Accent Ring with gaps (Middle-Outer) */}
          <div 
            className="absolute w-[82%] h-[82%] rounded-full border-2 border-[#fca311]/40 border-t-transparent border-b-transparent animate-[spin_35s_linear_infinite] pointer-events-none z-0"
          />

          {/* Ring 3: Concentric Dotted Ring (Middle) */}
          <div 
            className="absolute w-[72%] h-[72%] rounded-full border border-dotted border-[#e5e5e5]/35 animate-[spin_45s_linear_infinite_reverse] pointer-events-none z-0"
          />

          {/* Ring 4: Fine Accent Ring (Inner-Middle) */}
          <div 
            className="absolute w-[64%] h-[64%] rounded-full border border-[#e5e5e5]/20 pointer-events-none z-0"
          />

          {/* --- Social Icons Fly-out Deploy (Revealed only when active, underneath in orbit crescent) --- */}
          {socialLinks.map((link, index) => {
            const total = socialLinks.length;
            const startAngle = 45;
            const endAngle = 135;
            const angle = startAngle + (index * (endAngle - startAngle)) / (total - 1);
            
            return (
              <div
                key={index}
                className={cn(
                  "absolute z-30 flex items-center justify-center transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto",
                  isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"
                    )}
                    style={{
                      left: `${50 + Math.cos((angle * Math.PI) / 180) * 48}%`,
                      top: `${50 + Math.sin((angle * Math.PI) / 180) * 48}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="group/icon relative">
                      {/* Gold ring ambient glow on hover */}
                      <div className="absolute -inset-1.5 rounded-full bg-[#fca311]/25 opacity-0 blur transition-all duration-300 group-hover/icon:opacity-100 group-hover/icon:scale-110" />
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#fca311]/25 bg-[#0b0f19]/90 text-[#e5e5e5] shadow-lg backdrop-blur-md transition-all duration-300 hover:border-[#fca311] hover:text-[#fca311] hover:shadow-[0_0_12px_rgba(252,163,17,0.35)] hover:scale-115"
                      >
                        <link.icon className="h-5 w-5" weight="fill" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>


          </div>

      {/* Top Center Symmetrical Header Area */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center pointer-events-none z-30 w-full max-w-2xl px-4">
        {/* A. Symmetrical Centered Welcome Text (displays initially, fades on hover or scroll) */}
        <div 
          className={cn(
            "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col items-center justify-center",
            (isExpanded || isAvatarHovered)
              ? "opacity-0 -translate-y-4" 
              : "opacity-100 translate-y-0"
          )}
        >
          <span className="text-[15px] md:text-[18px] font-mono tracking-[0.5em] text-[#fca311] font-bold uppercase drop-shadow-[0_0_12px_rgba(252,163,17,0.45)]">
            WELCOME
          </span>
          <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] text-[#e5e5e5]/40 uppercase mt-2.5 whitespace-nowrap">
            Scroll to explore
          </span>
        </div>

        {/* B. Symmetrical Centered Name Header (appears on scroll, replacing welcome text) */}
        <div 
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1)",
            isExpanded 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-4"
          )}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-none font-sans drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            {name}
          </h1>
          <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-[#fca311] uppercase mt-2">
            Systems Architect
          </span>
        </div>
      </div>

      {/* Bottom Description: Symmetrical Absolute Center Anchor */}
      <div 
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl text-center px-4 pointer-events-none transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1)",
          isExpanded 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-6"
        )}
      >
        <p className="text-sm md:text-base text-[#e5e5e5]/75 leading-relaxed font-sans font-medium tracking-wide">
          Full stack developer focused on frontend systems, interaction engineering, and production-grade user experience architectures.
        </p>
      </div>

      {/* Bottom Right Location Anchor */}
      <footer 
        className={cn(
          "absolute bottom-8 right-8 md:right-12 z-30 pointer-events-none transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1)",
          isExpanded 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-6"
        )}
      >
        <div className="text-xs md:text-sm font-medium text-[#e5e5e5]/40 font-mono tracking-wider">
          {locationText}
        </div>
      </footer>

      {/* Standard CSS Keyframe Injector */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
