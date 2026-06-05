"use client";

import React, { useState, useEffect, useRef } from "react";
import { experienceData } from "@/data/experience";
import { gsap } from "gsap";
import { 
  Layout, 
  TerminalWindow, 
  Database, 
  QrCode, 
  ShieldCheck, 
  Briefcase 
} from "@phosphor-icons/react";

const getIcon = (iconName) => {
  switch (iconName) {
    case "layout": return <Layout size={20} weight="duotone" />;
    case "terminal": return <TerminalWindow size={20} weight="duotone" />;
    case "database": return <Database size={20} weight="duotone" />;
    case "qrcode": return <QrCode size={20} weight="duotone" />;
    case "shield": return <ShieldCheck size={20} weight="duotone" />;
    default: return <Briefcase size={20} weight="duotone" />;
  }
};

const CornerBracket = ({ color = "border-white/10" }) => (
  <>
    <span className={`absolute top-0 left-0 w-2.5 h-2.5 border-t border-l ${color} pointer-events-none transition-colors duration-300`} />
    <span className={`absolute top-0 right-0 w-2.5 h-2.5 border-t border-r ${color} pointer-events-none transition-colors duration-300`} />
    <span className={`absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l ${color} pointer-events-none transition-colors duration-300`} />
    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r ${color} pointer-events-none transition-colors duration-300`} />
  </>
);

export function ExperienceSection() {
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef(null);
  
  // Section refs for Desktop timeline steps
  const stage1Ref = useRef(null);
  const stage23Ref = useRef(null);
  const companyCardRef = useRef(null);
  const contributionCardsRef = useRef([]);
  const stage4Ref = useRef(null);
  const metricValuesRef = useRef([]);
  const stage5Ref = useRef(null);

  // Check screen width for mobile layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // GSAP scroll listener for driving desktop storytelling steps
  useEffect(() => {
    if (isMobile) return;

    // Initialize counts to 0 for count-up triggers
    const metricsArr = [0, 0, 0];
    let hasCountedUp = false;

    const handleScroll = () => {
      const cards = Array.from(document.querySelectorAll(".scroll-stack-card"));
      const getElementOffset = (el) => {
        return el ? el.offsetTop : 0;
      };

      // Experience is the 4th section (index 3)
      const card3Top = cards[3] ? getElementOffset(cards[3]) : 3 * window.innerHeight;
      const rangeStart = card3Top + 4800; // 3 preceding cards * 1600 scroll space = 4800
      const rangeEnd = rangeStart + 1600;
      const scroll = window.scrollY;

      let progress = 0;
      if (scroll < rangeStart) {
        progress = 0;
      } else if (scroll > rangeEnd) {
        progress = 1;
      } else {
        progress = (scroll - rangeStart) / (rangeEnd - rangeStart);
      }

      // Step mapping:
      // 0.0 - 0.22: Stage 1 (Hero Statement)
      // 0.22 - 0.40: Stage 2 (Company & Role Reveal)
      // 0.40 - 0.72: Stage 3 (Contributions Reveal)
      // 0.72 - 0.90: Stage 4 (Impact Metrics)
      // 0.90 - 1.0: Stage 5 (Closing Moment)

      // Stage 1 (Hero Statement)
      // Active in [0.0, 0.22], fades out in [0.15, 0.22]
      let s1Opacity = 0;
      let s1Y = 0;
      if (progress < 0.22) {
        s1Opacity = progress < 0.15 ? 1 : 1 - (progress - 0.15) / 0.07;
        s1Y = (progress / 0.22) * -45;
      }
      gsap.to(stage1Ref.current, {
        opacity: s1Opacity,
        y: s1Y,
        pointerEvents: s1Opacity > 0.1 ? "auto" : "none",
        duration: 0.25,
        overwrite: "auto"
      });

      // Stage 2 & 3 (Company Card + Contributions)
      // Active in [0.18, 0.72]
      let s23Opacity = 0;
      if (progress >= 0.18 && progress < 0.72) {
        if (progress < 0.25) {
          s23Opacity = (progress - 0.18) / 0.07;
        } else if (progress > 0.65) {
          s23Opacity = 1 - (progress - 0.65) / 0.07;
        } else {
          s23Opacity = 1;
        }
      }
      
      // Company Card X-Translation & Scale
      let companyX = 0;
      let companyScale = 1;
      
      if (progress >= 0.18 && progress < 0.72) {
        // Stage 2 (Centered): progress 0.18 to 0.35
        if (progress < 0.35) {
          companyX = 0;
          companyScale = 0.96 + ((progress - 0.18) / 0.17) * 0.04;
        } 
        // Stage 3 (Slides Left): progress 0.35 to 0.50
        else if (progress >= 0.35 && progress < 0.50) {
          const slideProgress = (progress - 0.35) / 0.15;
          companyX = -240 * slideProgress;
          companyScale = 1;
        } 
        // Pinned Left: progress 0.50 to 0.72
        else {
          companyX = -240;
          companyScale = 1;
        }
      }

      gsap.to(stage23Ref.current, {
        opacity: s23Opacity,
        pointerEvents: s23Opacity > 0.1 ? "auto" : "none",
        duration: 0.25,
        overwrite: "auto"
      });

      gsap.to(companyCardRef.current, {
        x: companyX,
        scale: companyScale,
        duration: 0.3,
        overwrite: "auto"
      });

      // Contributions stagger
      contributionCardsRef.current.forEach((card, idx) => {
        if (!card) return;
        // The contributions reveal staggered during progress 0.43 to 0.66
        const revealStart = 0.40 + idx * 0.055;
        const revealEnd = revealStart + 0.06;
        
        let cardOpacity = 0;
        let cardY = 35;
        let cardScale = 0.95;
        
        if (progress >= revealStart) {
          if (progress >= revealEnd) {
            cardOpacity = 1;
            cardY = 0;
            cardScale = 1;
          } else {
            const cardProg = (progress - revealStart) / 0.06;
            cardOpacity = cardProg;
            cardY = (1 - cardProg) * 35;
            cardScale = 0.95 + cardProg * 0.05;
          }
        }
        
        gsap.to(card, {
          opacity: cardOpacity,
          y: cardY,
          scale: cardScale,
          duration: 0.25,
          overwrite: "auto"
        });
      });

      // Stage 4 (Impact Metrics)
      // Active in [0.70, 0.90]
      let s4Opacity = 0;
      let s4Y = 35;
      if (progress >= 0.70 && progress < 0.90) {
        if (progress < 0.76) {
          s4Opacity = (progress - 0.70) / 0.06;
          s4Y = (1 - s4Opacity) * 35;
        } else if (progress > 0.84) {
          s4Opacity = 1 - (progress - 0.84) / 0.06;
          s4Y = ((progress - 0.84) / 0.06) * -35;
        } else {
          s4Opacity = 1;
          s4Y = 0;
        }
      }
      
      gsap.to(stage4Ref.current, {
        opacity: s4Opacity,
        y: s4Y,
        pointerEvents: s4Opacity > 0.1 ? "auto" : "none",
        duration: 0.25,
        overwrite: "auto"
      });

      // Metric count-up trigger
      if (progress >= 0.73 && progress < 0.88) {
        if (!hasCountedUp) {
          hasCountedUp = true;
          experienceData.metrics.forEach((metric, mIdx) => {
            const el = metricValuesRef.current[mIdx];
            if (!el) return;
            
            const targetVal = metric.value;
            metricsArr[mIdx] = 0;

            gsap.to(metricsArr, {
              [mIdx]: targetVal,
              duration: 1.1,
              ease: "power2.out",
              onUpdate: () => {
                if (el) {
                  el.innerText = Math.floor(metricsArr[mIdx]) + metric.suffix;
                }
              }
            });
          });
        }
      } else {
        if (progress < 0.68 || progress > 0.90) {
          hasCountedUp = false;
        }
      }

      // Stage 5 (Closing Moment)
      // Active in [0.88, 1.0]
      let s5Opacity = 0;
      let s5Y = 35;
      if (progress >= 0.88) {
        s5Opacity = progress < 0.94 ? (progress - 0.88) / 0.06 : 1;
        s5Y = (1 - s5Opacity) * 35;
      }
      
      gsap.to(stage5Ref.current, {
        opacity: s5Opacity,
        y: s5Y,
        pointerEvents: s5Opacity > 0.1 ? "auto" : "none",
        duration: 0.25,
        overwrite: "auto"
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(timer);
    };
  }, [isMobile]);

  // Mobile layout: Simple, gorgeous vertical structure
  if (isMobile) {
    return (
      <section
        id="experience"
        className="w-full relative bg-[#020204] py-20 px-6 overflow-y-auto select-none"
      >
        <div 
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"
          style={{ opacity: 0.5 }}
        />
        
        <div className="max-w-xl mx-auto flex flex-col gap-12 text-left relative z-10">
          {/* Hero Statement */}
          <div className="flex flex-col">
            <span className="text-[10px] font-mono tracking-[0.4em] text-[#fca311] font-bold uppercase mb-2">
              ★ SYSTEM LOG
            </span>
            <h2 className="text-4xl font-black tracking-tight text-white uppercase font-sans">
              EXPERIENCE
            </h2>
            <p className="text-lg text-slate-400 font-sans leading-relaxed mt-4">
              Building production systems.<br />Shipping products.<br />Solving real problems.
            </p>
          </div>

          {/* Company Card */}
          <div className="border border-white/5 bg-[#050508]/90 p-7 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[2.5px] h-full bg-[#fca311]" />
            <CornerBracket color="border-white/5" />
            
            <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#fca311] uppercase mb-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#fca311] animate-pulse" />
              SYSTEM ACTIVE // {experienceData.duration}
            </div>
            
            <h3 className="text-2xl font-black tracking-tight text-white uppercase font-sans">
              {experienceData.company}
            </h3>
            
            <p className="text-xs font-mono text-slate-400 tracking-wider mt-1">
              {experienceData.role}
            </p>
            
            <p className="text-xs text-slate-500 leading-relaxed font-sans mt-4">
              {experienceData.summary}
            </p>
          </div>

          {/* Contributions */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-mono tracking-[0.3em] text-slate-500 uppercase font-bold mb-1">
              ENGINEERING MODULES
            </span>
            
            {experienceData.contributions.map((con, idx) => (
              <div 
                key={con.id} 
                className="bg-white/[0.01] border border-white/5 p-5 rounded-xl flex gap-4 items-start relative overflow-hidden"
              >
                <CornerBracket color="border-white/5" />
                <div className="w-10 h-10 rounded-lg bg-[#fca311]/5 border border-[#fca311]/10 flex items-center justify-center text-[#fca311] shrink-0 mt-0.5">
                  {getIcon(con.iconName)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-bold tracking-wider text-white uppercase font-sans">
                      {con.title}
                    </h4>
                    <span className="text-[8.5px] font-mono text-slate-600">
                      [MOD-0{idx + 1}]
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {con.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Impact Metrics */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-mono tracking-[0.3em] text-slate-500 uppercase font-bold mb-1">
              METRIC HIGHLIGHTS
            </span>
            <div className="grid grid-cols-3 gap-3">
              {experienceData.metrics.map((metric, idx) => (
                <div 
                  key={idx} 
                  className="bg-white/[0.01] border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center text-center relative overflow-hidden"
                >
                  <CornerBracket color="border-white/5" />
                  <span className="text-3xl font-black text-white font-sans tracking-tight">
                    {metric.value}{metric.suffix}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 tracking-wider mt-1.5 leading-tight uppercase">
                    {metric.label.replace('Production ', '').replace('Reusable ', '')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Closing Statement */}
          <div className="py-8 border-t border-white/5 text-center mt-4">
            <p className="text-sm font-black font-sans tracking-widest text-[#fca311]/80 uppercase">
              “Engineering products from architecture to experience.”
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Desktop storytelling presentation
  return (
    <section
      id="experience"
      ref={containerRef}
      className="w-full relative bg-[#020204] h-screen flex flex-col justify-center items-center overflow-hidden select-none"
    >
      {/* Background lines pattern */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0"
        style={{ opacity: 0.6 }}
      />

      {/* Subtle backdrop lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#fca311]/[0.01] blur-[220px] pointer-events-none z-0" />

      {/* -------------------- STAGE 1: HERO STATEMENT -------------------- */}
      <div 
        ref={stage1Ref}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 w-full opacity-1"
      >
        <span className="text-[10px] font-mono tracking-[0.45em] text-[#fca311] font-bold uppercase mb-4">
          ★ SYSTEM ARCHIVE // EXPERIENCE
        </span>
        <h2 className="text-7xl md:text-8xl font-black font-sans tracking-tight text-white uppercase leading-none py-2 select-none">
          EXPERIENCE
        </h2>
        
        <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-[#fca311] to-transparent mt-4 mb-10 shadow-[0_0_15px_rgba(252,163,17,0.3)]" />

        <div className="flex flex-col gap-3.5 max-w-xl">
          <p className="text-2xl font-bold font-sans text-slate-300 tracking-tight leading-none uppercase">
            Building production systems.
          </p>
          <p className="text-2xl font-bold font-sans text-[#fca311]/85 tracking-tight leading-none uppercase">
            Shipping products.
          </p>
          <p className="text-2xl font-bold font-sans text-slate-300 tracking-tight leading-none uppercase">
            Solving real problems.
          </p>
        </div>
      </div>

      {/* -------------------- STAGE 2 & 3: COMPANY & MODULES -------------------- */}
      <div 
        ref={stage23Ref}
        className="absolute inset-0 z-10 flex justify-center items-center px-16 w-full opacity-0 pointer-events-none"
      >
        <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center">
          
          {/* Pinned Company Card (Stages 2 and 3) */}
          <div
            ref={companyCardRef}
            className="absolute w-[440px] p-8 rounded-2xl border border-white/[0.06] bg-[#050508]/85 backdrop-blur-[12px] text-left select-none left-50% -translate-x-1/2"
            style={{
              boxShadow: "0 20px 45px rgba(0, 0, 0, 0.95), inset 0 0 15px rgba(255, 255, 255, 0.01)"
            }}
          >
            <CornerBracket />
            
            {/* Top highlight bar */}
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#fca311] via-[#fca311]/60 to-transparent" />
            
            {/* Pulsing indicator */}
            <div className="flex items-center gap-2 mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fca311] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fca311]"></span>
              </span>
              <span className="text-[9px] font-mono tracking-[0.25em] text-[#fca311] font-bold">
                SYSTEM ONLINE // 2025 - PRESENT
              </span>
            </div>

            <h3 className="text-3xl font-black font-sans tracking-tight text-white uppercase leading-none mb-1.5">
              {experienceData.company}
            </h3>

            <span className="text-xs font-mono font-bold tracking-[0.18em] text-slate-400 uppercase">
              {experienceData.role}
            </span>

            <div className="h-[1px] w-full bg-white/[0.05] my-6" />

            <p className="text-[13.5px] text-slate-400 font-sans leading-relaxed font-normal">
              {experienceData.summary}
            </p>

            <div className="absolute bottom-4 right-4 text-[8.5px] font-mono text-slate-700 tracking-widest">
              [SKYD-SYS-01]
            </div>
          </div>

          {/* Staggered Contributions (Stage 3 Right Side) */}
          <div className="absolute right-0 w-[470px] h-full flex flex-col justify-center gap-3.5 z-10">
            {experienceData.contributions.map((con, idx) => (
              <div
                key={con.id}
                ref={el => contributionCardsRef.current[idx] = el}
                className="bg-[#050508]/80 border border-white/[0.04] p-4.5 rounded-xl flex gap-4 items-start select-none transition-all duration-300 hover:border-[#fca311]/30 hover:bg-[#07070a] hover:-translate-x-1 group relative overflow-hidden opacity-0"
                style={{
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)"
                }}
              >
                <CornerBracket color="border-white/5 group-hover:border-[#fca311]/30" />
                <div className="w-10 h-10 rounded-lg bg-[#fca311]/5 border border-[#fca311]/12 flex items-center justify-center text-[#fca311] shrink-0 mt-0.5 group-hover:bg-[#fca311]/10 transition-colors duration-300">
                  {getIcon(con.iconName)}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-[13.5px] font-black tracking-wider text-white uppercase font-sans">
                      {con.title}
                    </h4>
                    <span className="text-[8.5px] font-mono text-slate-600 group-hover:text-slate-400 transition-colors duration-300">
                      [MOD-0{idx + 1}]
                    </span>
                  </div>
                  <p className="text-[11.5px] text-slate-400 leading-relaxed font-sans">
                    {con.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* -------------------- STAGE 4: IMPACT METRICS -------------------- */}
      <div 
        ref={stage4Ref}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-12 w-full opacity-0 pointer-events-none"
      >
        <span className="text-[10px] font-mono tracking-[0.45em] text-slate-500 font-bold uppercase mb-4">
          ★ SYSTEM PERFORMANCE
        </span>
        <h3 className="text-3xl font-black font-sans tracking-tight text-white uppercase leading-none mb-16">
          ENGINEERING IMPACT
        </h3>

        <div className="grid grid-cols-3 gap-16 max-w-4xl w-full">
          {experienceData.metrics.map((metric, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-center p-8 border border-white/[0.04] bg-white/[0.005] rounded-2xl relative overflow-hidden group hover:border-[#fca311]/20 transition-all duration-300"
              style={{
                boxShadow: "0 15px 35px rgba(0, 0, 0, 0.4)"
              }}
            >
              <CornerBracket color="border-white/5 group-hover:border-[#fca311]/25" />

              <span 
                ref={el => metricValuesRef.current[idx] = el}
                className="text-7xl lg:text-8xl font-black font-sans tracking-tight leading-none text-white select-none bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent group-hover:text-[#fca311] transition-colors duration-300"
                style={{
                  textShadow: "0 10px 30px rgba(252, 163, 17, 0.02)"
                }}
              >
                0{metric.suffix}
              </span>
              <span className="text-[10px] font-mono text-slate-500 tracking-[0.2em] uppercase mt-4 text-center select-none font-bold leading-relaxed max-w-[150px] group-hover:text-slate-300 transition-colors duration-300">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* -------------------- STAGE 5: CLOSING MOMENT -------------------- */}
      <div 
        ref={stage5Ref}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-12 w-full opacity-0 pointer-events-none"
      >
        <span className="text-[10px] font-mono tracking-[0.45em] text-[#fca311] font-bold uppercase mb-4">
          ★ SYSTEM DISPATCH
        </span>
        <h2 className="text-4xl sm:text-5xl font-black font-sans tracking-tight text-white uppercase max-w-4xl leading-tight">
          “Engineering products from architecture to experience.”
        </h2>
        <p className="text-xs font-mono text-slate-500 tracking-[0.3em] uppercase mt-6 select-none">
          SYSTEM STACK LOADED // NEXT SECTION JUMP
        </p>
      </div>

    </section>
  );
}
