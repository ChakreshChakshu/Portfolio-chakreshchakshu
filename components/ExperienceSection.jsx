"use client";

import React, { useState, useEffect, useRef } from "react";
import { experienceData } from "@/data/experience";
import { gsap } from "gsap";
import SplitText from "./SplitText";

export function ExperienceSection() {
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef(null);
  
  // Section refs for Desktop timeline steps
  const stage1Ref = useRef(null);
  const stage2Ref = useRef(null);
  const stage3Ref = useRef(null);
  const stage4Ref = useRef(null);
  const stage5Ref = useRef(null);
  
  const contributionTextsRef = useRef([]);
  const metricValuesRef = useRef([]);

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

    // Create the master timeline (using 100 duration to represent percentage mapping)
    const tl = gsap.timeline({ paused: true });

    // Initial resets
    gsap.set(stage1Ref.current, { opacity: 1, yPercent: 0 });
    gsap.set(stage2Ref.current, { opacity: 0, yPercent: 120 });
    gsap.set(stage3Ref.current, { opacity: 0 });
    gsap.set(stage4Ref.current, { opacity: 0, yPercent: 120 });
    gsap.set(stage5Ref.current, { opacity: 0, yPercent: 120 });

    // ==========================================
    // STAGE 1: HERO (Effect 17 - 3D Bottom Emerge & Top Out)
    // ==========================================
    const s1Chars = stage1Ref.current.querySelectorAll(".stage1-title .char");
    if (s1Chars.length > 0) {
      tl.fromTo(s1Chars, 
        { 
          opacity: 0, 
          y: 70,
          rotateX: -50, 
          rotateY: -15,
          z: -100
        },
        { 
          opacity: 1, 
          y: 0,
          rotateX: 0, 
          rotateY: 0,
          z: 0, 
          stagger: 0.1,
          ease: "power2.out",
          duration: 5
        },
        0
      );
    }

    // Stage 1 Subtitle & Paragraphs (staggered slide-up from bottom)
    const s1TextElements = stage1Ref.current.querySelectorAll(".stage1-fade-in");
    if (s1TextElements.length > 0) {
      tl.fromTo(s1TextElements,
        { opacity: 0, y: 40, letterSpacing: "0.1em" },
        { opacity: 1, y: 0, letterSpacing: "0.25em", stagger: 1.0, ease: "power2.out", duration: 5 },
        1.5
      );
    }

    // Stage 1 Exit (Slide up & out at top)
    tl.to(stage1Ref.current, { opacity: 0, yPercent: -120, duration: 8, ease: "power2.inOut" }, 12);
    tl.set(stage1Ref.current, { pointerEvents: "none" }, 20);

    // ==========================================
    // STAGE 2: COMPANY & ROLE (Effect 28 - Blur, Scale, Emerge Bottom, Exit Top)
    // ==========================================
    tl.set(stage2Ref.current, { pointerEvents: "auto" }, 20);
    tl.fromTo(stage2Ref.current, 
      { opacity: 0, yPercent: 120 }, 
      { opacity: 1, yPercent: 0, duration: 8, ease: "power2.out" }, 
      20
    );

    const s2Chars = stage2Ref.current.querySelectorAll(".stage2-company .char");
    if (s2Chars.length > 0) {
      tl.fromTo(s2Chars,
        { filter: "blur(12px)", opacity: 0, scale: 1.25, y: 45, rotateX: -30 },
        { filter: "blur(0px)", opacity: 1, scale: 1, y: 0, rotateX: 0, duration: 6, stagger: 0.08, ease: "power2.out" },
        20.5
      );
    }

    // Stage 2 Fade In elements
    const s2TextElements = stage2Ref.current.querySelectorAll(".stage2-fade-in");
    if (s2TextElements.length > 0) {
      tl.fromTo(s2TextElements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 1.2, ease: "power2.out", duration: 5 },
        22.5
      );
    }

    // Stage 2 Exit (Slide up & out at top)
    tl.to(stage2Ref.current, { opacity: 0, yPercent: -120, duration: 8, ease: "power2.inOut" }, 32);
    tl.set(stage2Ref.current, { pointerEvents: "none" }, 40);

    // ==========================================
    // STAGE 3: CORE CONTRIBUTIONS (Effect 18 - 3D Word Emerge Bottom, Exit Top)
    // ==========================================
    tl.set(stage3Ref.current, { pointerEvents: "auto" }, 38);
    tl.to(stage3Ref.current, { opacity: 1, duration: 2, ease: "power2.out" }, 38);

    // Animate each contribution sequentially
    experienceData.contributions.forEach((con, idx) => {
      const el = contributionTextsRef.current[idx];
      if (!el) return;

      const start = 40 + idx * 8;
      const exitStart = start + 4;

      const titleEl = el.querySelector(".stage3-title");
      const words = el.querySelector(".stage3-explanation") ? el.querySelectorAll(".stage3-word") : [];

      // Initial reset of contribution element
      gsap.set(el, { opacity: 0, yPercent: 120 });

      // Enter (Emerge from bottom)
      tl.set(el, { pointerEvents: "auto" }, start);
      tl.fromTo(el, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 3, ease: "power2.out" }, start);
      
      if (titleEl) {
        tl.fromTo(titleEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, start + 0.5);
      }
      if (words.length > 0) {
        tl.fromTo(words,
          { 
            opacity: 0, 
            y: 40, 
            rotateX: -35 
          },
          { 
            opacity: 1, 
            y: 0, 
            rotateX: 0, 
            stagger: 0.08, 
            ease: "back.out(1.2)", 
            duration: 3 
          },
          start + 0.8
        );
      }

      // Exit (Exit to top)
      tl.to(el, { opacity: 0, yPercent: -120, duration: 3, ease: "power2.in" }, exitStart);
      if (titleEl) {
        tl.to(titleEl, { opacity: 0, y: -20, duration: 2, ease: "power2.in" }, exitStart);
      }
      if (words.length > 0) {
        tl.to(words,
          { 
            opacity: 0, 
            y: -40, 
            rotateX: 35, 
            stagger: 0.04, 
            ease: "power2.in", 
            duration: 2.5 
          },
          exitStart
        );
      }
      tl.set(el, { pointerEvents: "none" }, exitStart + 3);
    });

    // Stage 3 Exit
    tl.to(stage3Ref.current, { opacity: 0, duration: 3, ease: "power2.inOut" }, 78);
    tl.set(stage3Ref.current, { pointerEvents: "none" }, 80);

    // ==========================================
    // STAGE 4: IMPACT METRICS (Effect 22 - 3D Perspective Card Emerge Bottom, Exit Top)
    // ==========================================
    tl.set(stage4Ref.current, { pointerEvents: "auto" }, 80);
    tl.fromTo(stage4Ref.current, 
      { opacity: 0, yPercent: 120 }, 
      { opacity: 1, yPercent: 0, duration: 8, ease: "power2.out" }, 
      80
    );

    // Title 3D rotate and slide up
    const s4Chars = stage4Ref.current.querySelectorAll(".stage4-title .char");
    if (s4Chars.length > 0) {
      tl.fromTo(s4Chars,
        { rotateX: -90, y: 40, opacity: 0 },
        { rotateX: 0, y: 0, opacity: 1, duration: 5, stagger: 0.08, ease: "power2.out" },
        80.5
      );
    }

    // Metric Columns X-axis tilt and slide up
    const s4Cols = stage4Ref.current.querySelectorAll(".stage4-metric-col");
    if (s4Cols.length > 0) {
      tl.fromTo(s4Cols,
        { rotateX: -45, y: 60, opacity: 0 },
        { rotateX: 0, y: 0, opacity: 1, duration: 6, stagger: 0.3, ease: "back.out(1.3)" },
        81
      );
    }

    // Stage 4 Exit (Slide up & out at top)
    tl.to(stage4Ref.current, { opacity: 0, yPercent: -120, duration: 8, ease: "power2.inOut" }, 90);
    tl.set(stage4Ref.current, { pointerEvents: "none" }, 98);

    // ==========================================
    // STAGE 5: CLOSING MOMENT (Effect 29 - Zoom Blur, Emerge Bottom)
    // ==========================================
    tl.set(stage5Ref.current, { pointerEvents: "auto" }, 96);
    tl.fromTo(stage5Ref.current, 
      { opacity: 0, yPercent: 120 }, 
      { opacity: 1, yPercent: 0, duration: 6, ease: "power2.out" }, 
      96
    );

    // Quote Super-Scale Blur Reveal from below
    const s5Chars = stage5Ref.current.querySelectorAll(".stage5-title .char");
    if (s5Chars.length > 0) {
      tl.fromTo(s5Chars,
        { filter: "blur(12px)", opacity: 0, scale: 1.3, y: 40, rotateX: -30 },
        { filter: "blur(0px)", opacity: 1, scale: 1, y: 0, rotateX: 0, duration: 6, stagger: 0.03, ease: "power3.out" },
        96.5
      );
    }

    // Subtext slide up from below
    const s5Subtext = stage5Ref.current.querySelector(".stage5-subtext");
    if (s5Subtext) {
      tl.fromTo(s5Subtext,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 5, ease: "power2.out" },
        98.5
      );
    }

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

      // Scrub the master timeline with GSAP (smooth transition)
      gsap.to(tl, { 
        progress: progress, 
        duration: 0.25, 
        ease: "power2.out", 
        overwrite: "auto" 
      });

      // Metric count-up trigger
      if (progress >= 0.71 && progress < 0.86) {
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
        if (progress < 0.66 || progress > 0.88) {
          hasCountedUp = false;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(timer);
      tl.kill();
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
        
        <div className="max-w-xl mx-auto flex flex-col gap-16 text-left relative z-10">
          {/* Hero Statement */}
          <div className="flex flex-col">
            <span className="text-[10px] font-mono tracking-[0.45em] text-[#fca311] font-bold uppercase mb-2">
              ★ SYSTEM LOG
            </span>
            <h2 className="text-4xl font-black tracking-tight text-white uppercase font-sans">
              EXPERIENCE
            </h2>
            <p className="text-lg text-slate-400 font-sans leading-relaxed mt-4">
              Building production systems.<br />Shipping products.<br />Solving real problems.
            </p>
          </div>

          {/* Company Details */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#fca311] uppercase mb-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#fca311] animate-pulse" />
              SYSTEM ACTIVE // {experienceData.duration}
            </div>
            <h3 className="text-3xl font-black tracking-tight text-white uppercase font-sans">
              {experienceData.company}
            </h3>
            <p className="text-xs font-mono text-[#fca311] tracking-wider">
              {experienceData.role}
            </p>
            <p className="text-sm text-slate-400 leading-relaxed font-sans mt-2">
              {experienceData.summary}
            </p>
          </div>

          {/* Contributions */}
          <div className="flex flex-col gap-8">
            <span className="text-[10px] font-mono tracking-[0.3em] text-slate-500 uppercase font-bold">
              ENGINEERING MODULES
            </span>
            
            {experienceData.contributions.map((con, idx) => (
              <div 
                key={con.id} 
                className="flex flex-col gap-2 relative text-left"
              >
                <div className="flex justify-between items-center border-b border-white/5 pb-1">
                  <h4 className="text-xs font-mono tracking-wider text-white uppercase">
                    // MOD-0{idx + 1} : {con.title}
                  </h4>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {con.explanation}
                </p>
              </div>
            ))}
          </div>

          {/* Impact Metrics */}
          <div className="flex flex-col gap-6">
            <span className="text-[10px] font-mono tracking-[0.3em] text-slate-500 uppercase font-bold">
              METRIC HIGHLIGHTS
            </span>
            <div className="grid grid-cols-3 gap-6">
              {experienceData.metrics.map((metric, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col items-center justify-center text-center select-none"
                >
                  <span className="text-4xl font-black text-white font-sans tracking-tight">
                    {metric.value}{metric.suffix}
                  </span>
                  <span className="text-[8px] font-mono text-slate-500 tracking-wider mt-2 leading-tight uppercase">
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
        <h2 className="text-7xl md:text-8xl font-black font-sans tracking-tight text-white uppercase leading-none py-2 select-none stage1-title">
          <SplitText text="EXPERIENCE" />
        </h2>
        
        <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-[#fca311] to-transparent mt-4 mb-10 shadow-[0_0_15px_rgba(252,163,17,0.3)] stage1-fade-in" />

        <div className="flex flex-col gap-3.5 max-w-xl stage1-fade-in">
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

      {/* -------------------- STAGE 2: COMPANY & ROLE -------------------- */}
      <div 
        ref={stage2Ref}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 w-full opacity-0 pointer-events-none"
      >
        <h3 className="text-5xl md:text-6xl font-black font-sans tracking-tight text-white uppercase leading-none mb-4 stage2-company">
          <SplitText text={experienceData.company} />
        </h3>
        <span className="text-md font-mono font-bold tracking-[0.25em] text-slate-400 uppercase mb-8 stage2-fade-in">
          {experienceData.role} // {experienceData.duration}
        </span>
        <p className="text-xl md:text-2xl text-slate-300 font-sans leading-relaxed max-w-2xl stage2-fade-in">
          {experienceData.summary}
        </p>
      </div>

      {/* -------------------- STAGE 3: CORE CONTRIBUTIONS -------------------- */}
      <div 
        ref={stage3Ref}
        className="absolute inset-0 z-10 flex flex-col justify-center px-12 md:px-24 w-full opacity-0 pointer-events-none"
      >
        <div className="relative w-full max-w-6xl mx-auto h-[60vh] flex items-center justify-center">
          {experienceData.contributions.map((con, idx) => {
            const alignment = idx % 3;
            let alignClasses = "";
            if (alignment === 0) {
              // Left
              alignClasses = "items-start text-left left-0 max-w-2xl";
            } else if (alignment === 1) {
              // Right
              alignClasses = "items-end text-right right-0 max-w-2xl ml-auto";
            } else {
              // Center (Middle)
              alignClasses = "items-center text-center left-1/2 -translate-x-1/2 max-w-2xl";
            }

            return (
              <div
                key={con.id}
                ref={el => contributionTextsRef.current[idx] = el}
                className={`absolute flex flex-col justify-center opacity-0 pointer-events-none ${alignClasses}`}
              >
                <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase mb-2 stage3-title">
                  // MODULE 0{idx + 1} : {con.title}
                </span>
                <h4 className="text-3xl md:text-4xl font-extrabold font-sans text-white uppercase tracking-tight leading-snug stage3-explanation">
                  <SplitText text={con.explanation} charClassName="stage3-char" wordClassName="stage3-word" />
                </h4>
              </div>
            );
          })}
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
        <h3 className="text-3xl font-black font-sans tracking-tight text-white uppercase leading-none mb-16 stage4-title">
          <SplitText text="ENGINEERING IMPACT" />
        </h3>

        <div className="flex gap-20 max-w-4xl justify-center items-center w-full">
          {experienceData.metrics.map((metric, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-center select-none stage4-metric-col"
            >
              <span 
                ref={el => metricValuesRef.current[idx] = el}
                className="text-7xl lg:text-8xl font-black font-sans tracking-tight leading-none text-white select-none bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent"
              >
                0{metric.suffix}
              </span>
              <span className="text-[10px] font-mono text-slate-500 tracking-[0.2em] uppercase mt-4 text-center font-bold leading-relaxed max-w-[150px]">
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
        <h2 className="text-4xl sm:text-5xl font-black font-sans tracking-tight text-white uppercase max-w-4xl leading-tight stage5-title">
          <SplitText text="“Engineering products from architecture to experience.”" />
        </h2>
        <p className="text-xs font-mono text-slate-500 tracking-[0.3em] uppercase mt-6 select-none stage5-subtext">
          SYSTEM STACK LOADED // NEXT SECTION JUMP
        </p>
      </div>

    </section>
  );
}
