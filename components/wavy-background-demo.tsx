"use client";
import React, { useEffect, useRef } from "react";
import { WavyBackground } from "@/components/ui/wavy-background";

export default function WavyBackgroundDemo() {
  const outerContainerRef = useRef<HTMLDivElement>(null);
  const skillsContainerRef = useRef<HTMLDivElement>(null);
  const skillsTitleRef = useRef<HTMLHeadingElement>(null);
  
  const frontendContainerRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLSpanElement>(null);
  const endRef = useRef<HTMLSpanElement>(null);
  const feSubRef = useRef<HTMLDivElement>(null);
  
  const backendContainerRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLSpanElement>(null);
  const backEndRef = useRef<HTMLSpanElement>(null);
  const beSubRef = useRef<HTMLDivElement>(null);
  
  const toolsContainerRef = useRef<HTMLDivElement>(null);
  const toSubRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth < 1024;
      let progress = 0;

      if (!isMobile) {
        const currentScroll = window.scrollY;
        
        const card = document.getElementById('skills')?.closest('.scroll-stack-card');
        if (!card) return;
        
        const cards = Array.from(document.querySelectorAll('.scroll-stack-card'));
        const cardIndex = cards.indexOf(card as HTMLElement);
        if (cardIndex === -1) return;
        
        const cardTop = (card as HTMLElement).offsetTop;
        
        let delayOffset = 0;
        for (let j = 0; j < cardIndex; j++) {
          const c = cards[j] as HTMLElement;
          const attr = c ? c.getAttribute('data-extra-delay') : null;
          const extraDelay = attr ? (parseFloat(attr) || 0) : 0;
          delayOffset += 1100 + extraDelay;
        }

        const rangeStart = cardTop + delayOffset;
        const rangeEnd = rangeStart + 1100;
        
        if (currentScroll < rangeStart) {
          progress = 0;
        } else if (currentScroll > rangeEnd) {
          progress = 1;
        } else {
          progress = (currentScroll - rangeStart) / (rangeEnd - rangeStart);
        }
      } else {
        if (!outerContainerRef.current) return;
        const rect = outerContainerRef.current.getBoundingClientRect();
        const containerHeight = rect.height;
        const windowHeight = window.innerHeight;
        const totalScrollableDistance = containerHeight - windowHeight;

        if (totalScrollableDistance > 0) {
          const scrolled = -rect.top;
          if (scrolled < 0) {
            progress = 0;
          } else if (scrolled > totalScrollableDistance) {
            progress = 1;
          } else {
            progress = scrolled / totalScrollableDistance;
          }
        }
      }

      // 1. "SKILLS" scaling -> persistent across entire scroll
      if (skillsTitleRef.current) {
        if (progress <= 0.20) {
          const p = progress / 0.20;
          const scale = 1 - p * 0.70; // Scale from 1.0 down to 0.30
          const translateY = p * -28; // Move up to -28vh
          skillsTitleRef.current.style.transform = `translate3d(0, ${translateY}vh, 0) scale(${scale})`;
        } else {
          skillsTitleRef.current.style.transform = `translate3d(0, -28vh, 0) scale(0.30)`;
        }
      }

      // 2. "FRONTEND" -> active 0.10 to 0.60
      if (frontendContainerRef.current && frontRef.current && endRef.current && feSubRef.current) {
        if (progress > 0.10 && progress <= 0.60) {
          frontendContainerRef.current.style.display = 'flex';
          
          if (progress <= 0.25) {
            // Entry phase (whole container slides up from bottom to center)
            const p = (progress - 0.10) / 0.15;
            frontendContainerRef.current.style.transform = `translate3d(0, ${(1 - p) * 120}vh, 0)`;
            frontRef.current.style.transform = 'translate3d(0, 0, 0)';
            endRef.current.style.transform = 'translate3d(0, 0, 0)';
            feSubRef.current.style.transform = 'translate3d(0, 0, 0)';
          } else if (progress <= 0.45) {
            // Resting phase
            frontendContainerRef.current.style.transform = 'translate3d(0, 0, 0)';
            frontRef.current.style.transform = 'translate3d(0, 0, 0)';
            endRef.current.style.transform = 'translate3d(0, 0, 0)';
            feSubRef.current.style.transform = 'translate3d(0, 0, 0)';
          } else {
            // Exit phase (splitting apart horizontally, sub-skills slide down)
            const p = (progress - 0.45) / 0.15;
            frontendContainerRef.current.style.transform = 'translate3d(0, 0, 0)';
            frontRef.current.style.transform = `translate3d(${p * -120}vw, 0, 0)`;
            endRef.current.style.transform = `translate3d(${p * 120}vw, 0, 0)`;
            feSubRef.current.style.transform = `translate3d(0, ${p * 120}vh, 0)`;
          }
        } else {
          frontendContainerRef.current.style.display = 'none';
        }
      }

      // 3. "BACKEND" -> active 0.45 to 0.90
      if (backendContainerRef.current && backRef.current && backEndRef.current && beSubRef.current) {
        if (progress > 0.45 && progress <= 0.90) {
          backendContainerRef.current.style.display = 'flex';
          
          if (progress <= 0.60) {
            // Entry phase (whole container slides up from bottom to center)
            const p = (progress - 0.45) / 0.15;
            backendContainerRef.current.style.transform = `translate3d(0, ${(1 - p) * 120}vh, 0)`;
            backRef.current.style.transform = 'translate3d(0, 0, 0)';
            backEndRef.current.style.transform = 'translate3d(0, 0, 0)';
            beSubRef.current.style.transform = 'translate3d(0, 0, 0)';
          } else if (progress <= 0.80) {
            // Resting phase
            backendContainerRef.current.style.transform = 'translate3d(0, 0, 0)';
            backRef.current.style.transform = 'translate3d(0, 0, 0)';
            backEndRef.current.style.transform = 'translate3d(0, 0, 0)';
            beSubRef.current.style.transform = 'translate3d(0, 0, 0)';
          } else {
            // Exit phase (splitting apart horizontally, sub-skills slide down)
            const p = (progress - 0.80) / 0.10;
            backendContainerRef.current.style.transform = 'translate3d(0, 0, 0)';
            backRef.current.style.transform = `translate3d(${p * -120}vw, 0, 0)`;
            backEndRef.current.style.transform = `translate3d(${p * 120}vw, 0, 0)`;
            beSubRef.current.style.transform = `translate3d(0, ${p * 120}vh, 0)`;
          }
        } else {
          backendContainerRef.current.style.display = 'none';
        }
      }

      // 4. "TOOLS" -> active 0.80 to 1.0
      if (toolsContainerRef.current && toSubRef.current) {
        if (progress > 0.80) {
          toolsContainerRef.current.style.display = 'flex';
          if (progress <= 0.95) {
            // Entry phase
            const p = (progress - 0.80) / 0.15;
            toolsContainerRef.current.style.transform = `translate3d(0, ${(1 - p) * 120}vh, 0)`;
          } else {
            // Resting phase
            toolsContainerRef.current.style.transform = 'translate3d(0, 0, 0)';
          }
        } else {
          toolsContainerRef.current.style.display = 'none';
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll(); // Trigger initial state
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div ref={outerContainerRef} className="w-full h-[250vh] lg:h-full flex flex-col relative overflow-visible lg:overflow-hidden select-none">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden z-10">
        <WavyBackground className="max-w-6xl mx-auto flex flex-col items-center justify-center h-full relative">
          <div className="flex flex-col items-center justify-center text-center relative w-full h-[60vh] select-none overflow-visible">
            
            {/* 1. SKILLS (Persistent & Scaling) */}
            <div ref={skillsContainerRef} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <h2 ref={skillsTitleRef} className="text-5xl sm:text-9xl lg:text-[12rem] font-black tracking-tighter leading-none text-white uppercase font-sans drop-shadow-[0_0_35px_rgba(255,255,255,0.15)] whitespace-nowrap transition-transform duration-75 will-change-transform">
                SKILLS
              </h2>
            </div>

            {/* 2. FRONTEND */}
            <div ref={frontendContainerRef} className="absolute inset-0 flex flex-col items-center justify-center">
              <h2 className="text-5xl sm:text-9xl lg:text-[12rem] font-black tracking-tighter leading-none text-[#7DD6FF] uppercase font-sans drop-shadow-[0_0_35px_rgba(125,214,255,0.25)] whitespace-nowrap">
                <span ref={frontRef} className="inline-block transition-transform duration-75 will-change-transform">FRONT</span>
                <span ref={endRef} className="inline-block transition-transform duration-75 will-change-transform">END</span>
              </h2>
              <div 
                ref={feSubRef} 
                className="absolute bottom-[2rem] text-xs sm:text-sm md:text-base font-mono tracking-[0.2em] text-slate-300 font-semibold transition-transform duration-75 will-change-transform whitespace-nowrap"
              >
                React &nbsp;•&nbsp; Next.js &nbsp;•&nbsp; TypeScript &nbsp;•&nbsp; Tailwind &nbsp;•&nbsp; GSAP
              </div>
            </div>

            {/* 3. BACKEND */}
            <div ref={backendContainerRef} className="absolute inset-0 flex flex-col items-center justify-center">
              <h2 className="text-5xl sm:text-9xl lg:text-[12rem] font-black tracking-tighter leading-none text-[#FF312E] uppercase font-sans drop-shadow-[0_0_35px_rgba(255,49,46,0.25)] whitespace-nowrap">
                <span ref={backRef} className="inline-block transition-transform duration-75 will-change-transform">BACK</span>
                <span ref={backEndRef} className="inline-block transition-transform duration-75 will-change-transform">END</span>
              </h2>
              <div 
                ref={beSubRef} 
                className="absolute bottom-[2rem] text-xs sm:text-sm md:text-base font-mono tracking-[0.2em] text-slate-300 font-semibold transition-transform duration-75 will-change-transform whitespace-nowrap"
              >
                Node.js &nbsp;•&nbsp; PostgreSQL &nbsp;•&nbsp; MongoDB &nbsp;•&nbsp; REST APIs
              </div>
            </div>

            {/* 4. TOOLS */}
            <div ref={toolsContainerRef} className="absolute inset-0 flex flex-col items-center justify-center">
              <h2 className="text-5xl sm:text-9xl lg:text-[12rem] font-black tracking-tighter leading-none text-[#10B981] uppercase font-sans drop-shadow-[0_0_35px_rgba(16,185,129,0.25)] whitespace-nowrap">
                TOOLS
              </h2>
              <div 
                ref={toSubRef} 
                className="absolute bottom-[2rem] text-xs sm:text-sm md:text-base font-mono tracking-[0.2em] text-slate-300 font-semibold whitespace-nowrap"
              >
                Git &nbsp;•&nbsp; Docker &nbsp;•&nbsp; Figma &nbsp;•&nbsp; Vercel &nbsp;•&nbsp; AI Agents
              </div>
            </div>

          </div>
        </WavyBackground>
      </div>
    </div>
  );
}
