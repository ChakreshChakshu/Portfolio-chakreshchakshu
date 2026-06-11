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

  // Background interactive elements
  const canvasRef = useRef(null);
  const bgLightRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null });
  const scrollProgressRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const lastScrollTimeRef = useRef(0);

  // Check screen width for mobile layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Track mouse coordinates relative to container
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile]);



  // GSAP scroll listener for driving desktop storytelling steps
  useEffect(() => {
    // Create the master timeline (using 100 duration to represent percentage mapping)
    const tl = gsap.timeline({ paused: true });

    // Initial resets
    gsap.set(stage1Ref.current, { opacity: 1, yPercent: 0 });
    gsap.set(stage2Ref.current, { opacity: 0 });
    gsap.set(stage3Ref.current, { opacity: 0 });
    gsap.set(stage4Ref.current, { opacity: 0 });
    gsap.set(stage5Ref.current, { opacity: 0 });

    // ==========================================
    // STAGE 1: HERO
    // ==========================================
    const s1Chars = stage1Ref.current.querySelectorAll(".stage1-title .char");
    if (s1Chars.length > 0) {
      tl.fromTo(s1Chars, 
        { 
          opacity: 0, 
          filter: "blur(15px)",
          scale: 1.4,
          y: 30,
        },
        { 
          opacity: 1, 
          filter: "blur(0px)",
          scale: 1,
          y: 0,
          stagger: 0.08,
          ease: "power3.out",
          duration: 6
        },
        0
      );
    }

    const s1Line = stage1Ref.current.querySelector(".stage1-line");
    if (s1Line) {
      tl.fromTo(s1Line, { scaleX: 0 }, { scaleX: 1, duration: 4, ease: "power2.inOut" }, 1.5);
    }

    const s1TextElements = stage1Ref.current.querySelectorAll(".stage1-fade-in p");
    if (s1TextElements.length > 0) {
      tl.fromTo(s1TextElements,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 1.0, ease: "power2.out", duration: 5 },
        2.5
      );
    }

    // Stage 1 Exit (Slide up, scale, and blur-out)
    tl.to(stage1Ref.current, { opacity: 0, scale: 0.95, filter: "blur(12px)", yPercent: -150, duration: 8, ease: "power3.inOut" }, 12);
    tl.set(stage1Ref.current, { pointerEvents: "none" }, 20);

    // ==========================================
    // STAGE 2: COMPANY & ROLE
    // ==========================================
    tl.set(stage2Ref.current, { pointerEvents: "auto" }, 20);
    tl.to(stage2Ref.current, { opacity: 1, duration: 0.5 }, 20);
    
    const s2Card = stage2Ref.current.querySelector(".stage2-card");
    tl.fromTo(s2Card,
      { opacity: 0, yPercent: 180, scale: 0.95, filter: "blur(8px)" },
      { opacity: 1, yPercent: 0, scale: 1, filter: "blur(0px)", duration: 8, ease: "power3.out" },
      20
    );

    const s2Chars = stage2Ref.current.querySelectorAll(".stage2-company .char");
    if (s2Chars.length > 0) {
      tl.fromTo(s2Chars,
        { opacity: 0, rotateY: 90, z: -50 },
        { opacity: 1, rotateY: 0, z: 0, duration: 6, stagger: 0.06, ease: "power2.out" },
        21
      );
    }

    const s2Fades = stage2Ref.current.querySelectorAll(".stage2-fade-in");
    if (s2Fades.length > 0) {
      tl.fromTo(s2Fades,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.8, ease: "power2.out", duration: 5 },
        22.5
      );
    }

    // Stage 2 Exit (Full scroll up transition)
    tl.to(s2Card, { opacity: 0, scale: 0.95, filter: "blur(8px)", yPercent: -180, duration: 8, ease: "power3.in" }, 32);
    tl.to(stage2Ref.current, { opacity: 0, duration: 2, ease: "power2.in" }, 38);
    tl.set(stage2Ref.current, { pointerEvents: "none" }, 40);

    // ==========================================
    // STAGE 3: CORE CONTRIBUTIONS
    // ==========================================
    tl.set(stage3Ref.current, { pointerEvents: "auto" }, 38);
    tl.to(stage3Ref.current, { opacity: 1, duration: 2, ease: "power2.out" }, 38);

    const s3Cards = stage3Ref.current.querySelectorAll(".stage3-card");
    if (s3Cards.length > 0) {
      gsap.set(s3Cards, { 
        opacity: 0, 
        yPercent: 120, 
        rotateX: 10 
      });

      tl.fromTo(s3Cards, 
        { 
          opacity: 0, 
          yPercent: 120, 
          rotateX: 10 
        }, 
        { 
          opacity: 1, 
          yPercent: 0, 
          rotateX: 0, 
          duration: 8, 
          stagger: 0.15, 
          ease: "power3.out" 
        }, 
        40
      );

      tl.to(s3Cards, { 
        opacity: 0, 
        yPercent: -120, 
        rotateX: -10,
        duration: 8, 
        stagger: 0.1, 
        ease: "power3.in" 
      }, 70);
    }

    // Stage 3 Exit
    tl.to(stage3Ref.current, { opacity: 0, duration: 3, ease: "power2.inOut" }, 78);
    tl.set(stage3Ref.current, { pointerEvents: "none" }, 80);

    // ==========================================
    // STAGE 4: IMPACT METRICS
    // ==========================================
    tl.set(stage4Ref.current, { pointerEvents: "auto" }, 80);
    tl.fromTo(stage4Ref.current, 
      { opacity: 0, yPercent: 180, filter: "blur(8px)" }, 
      { opacity: 1, yPercent: 0, filter: "blur(0px)", duration: 8, ease: "power3.out" }, 
      80
    );

    // Title rotate and slide up
    const s4TitleChars = stage4Ref.current.querySelectorAll(".stage4-title .char");
    if (s4TitleChars.length > 0) {
      tl.fromTo(s4TitleChars,
        { rotateX: -90, y: 20, opacity: 0 },
        { rotateX: 0, y: 0, opacity: 1, duration: 5, stagger: 0.05, ease: "back.out(1.2)" },
        80.5
      );
    }

    // Metric Cards slide up + 3D pop
    const s4Cols = stage4Ref.current.querySelectorAll(".stage4-metric-col");
    if (s4Cols.length > 0) {
      tl.fromTo(s4Cols,
        { opacity: 0, y: 40, rotateX: -15, scale: 0.95 },
        { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 5.5, stagger: 0.2, ease: "back.out(1.3)" },
        81
      );
    }

    // Stage 4 Exit (Slide completely up & out)
    tl.to(stage4Ref.current, { opacity: 0, scale: 0.95, filter: "blur(10px)", yPercent: -180, duration: 8, ease: "power3.in" }, 90);
    tl.set(stage4Ref.current, { pointerEvents: "none" }, 98);

    // ==========================================
    // STAGE 5: CLOSING MOMENT
    // ==========================================
    tl.set(stage5Ref.current, { pointerEvents: "auto" }, 96);
    tl.fromTo(stage5Ref.current, 
      { opacity: 0, yPercent: 150 }, 
      { opacity: 1, yPercent: 0, duration: 6, ease: "power3.out" }, 
      96
    );

    const s5Flare = stage5Ref.current.querySelector(".stage5-flare");
    if (s5Flare) {
      tl.fromTo(s5Flare, { scale: 0.6, opacity: 0 }, { scale: 1.8, opacity: 1, duration: 6, ease: "power2.out" }, 96);
    }

    // Quote Blur Reveal
    const s5TitleChars = stage5Ref.current.querySelectorAll(".stage5-title .char");
    if (s5TitleChars.length > 0) {
      tl.fromTo(s5TitleChars,
        { filter: "blur(10px)", opacity: 0, scale: 1.15 },
        { filter: "blur(0px)", opacity: 1, scale: 1, duration: 6.5, stagger: 0.03, ease: "power2.out" },
        96.5
      );
    }

    // Capture scroll speed to drive background warp beams
    lastScrollYRef.current = window.scrollY;
    lastScrollTimeRef.current = Date.now();

    const handleScroll = () => {
      const cards = Array.from(document.querySelectorAll(".scroll-stack-card"));
      const getElementOffset = (el) => {
        return el ? el.offsetTop : 0;
      };

      const isMobileViewport = window.innerWidth < 1024;
      let progress = 0;

      if (!isMobileViewport) {
        const card = containerRef.current?.closest('.scroll-stack-card');
        if (!card) return;

        const cardIndex = cards.indexOf(card);
        if (cardIndex === -1) return;

        const cardTop = card.offsetTop;
        const itemDistance = 1100;

        let delayOffset = 0;
        for (let j = 0; j < cardIndex; j++) {
          const c = cards[j];
          const attr = c ? c.getAttribute('data-extra-delay') : null;
          const extraDelay = attr ? (parseFloat(attr) || 0) : 0;
          delayOffset += itemDistance + extraDelay;
        }

        const rangeStart = cardTop + delayOffset;
        const rangeEnd = rangeStart + itemDistance;
        const scroll = window.scrollY;

        if (scroll < rangeStart) {
          progress = 0;
        } else if (scroll > rangeEnd) {
          progress = 1;
        } else {
          progress = (scroll - rangeStart) / (rangeEnd - rangeStart);
        }
      } else {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
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

      // Calculate scroll velocity
      const now = Date.now();
      const dt = Math.max(1, now - lastScrollTimeRef.current);
      const scroll = window.scrollY;
      const dy = Math.abs(scroll - lastScrollYRef.current);
      const velocity = dy / dt; // pixels per ms
      scrollVelocityRef.current = Math.min(25, velocity * 15); // cap at 25 speed

      lastScrollYRef.current = scroll;
      lastScrollTimeRef.current = now;
      scrollProgressRef.current = progress;

      // Scrub timeline smoothly
      gsap.to(tl, { 
        progress: progress, 
        duration: 0.25, 
        ease: "power2.out", 
        overwrite: "auto" 
      });

      // Scroll-aware metric count-up
      const metricStart = 0.80;
      const metricEnd = 0.88;
      let metricP = 0;
      if (progress < metricStart) {
        metricP = 0;
      } else if (progress > metricEnd) {
        metricP = 1;
      } else {
        metricP = (progress - metricStart) / (metricEnd - metricStart);
      }

      experienceData.metrics.forEach((metric, mIdx) => {
        const el = metricValuesRef.current[mIdx];
        if (el) {
          const currentVal = Math.floor(metricP * metric.value);
          el.innerText = currentVal + metric.suffix;
        }
      });
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

  return (
    <section
      id="experience"
      ref={containerRef}
      className="w-full h-[250vh] lg:h-screen relative bg-transparent flex flex-col overflow-visible lg:overflow-hidden select-none"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden z-10">
        
        {/* -------------------- STAGE 1: HERO STATEMENT -------------------- */}
        <div 
          ref={stage1Ref}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 w-full opacity-1"
        >
          <h2 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-extrabold font-heading tracking-tight text-white uppercase leading-none py-2 select-none stage1-title">
            <SplitText text="EXPERIENCE" />
          </h2>
          
          <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-accent to-transparent mt-6 mb-8 stage1-line" />

          <div className="flex flex-col gap-3 sm:gap-5 max-w-2xl stage1-fade-in mt-4 sm:mt-6">
            <p className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-slate-300 tracking-tight leading-none uppercase">
              Building production systems.
            </p>
            <p className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-accent/85 tracking-tight leading-none uppercase">
              Shipping products.
            </p>
            <p className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-slate-300 tracking-tight leading-none uppercase">
              Solving real problems.
            </p>
          </div>
        </div>

        {/* -------------------- STAGE 2: COMPANY & ROLE -------------------- */}
        <div 
          ref={stage2Ref}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 w-full opacity-0 pointer-events-none"
        >
          <div className="relative max-w-5xl w-full px-6 sm:px-16 py-12 sm:py-20 border border-white/5 rounded-2xl bg-black/45 backdrop-blur-md shadow-[0_30px_100px_rgba(0,0,0,0.85)] overflow-hidden stage2-card">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/[0.015] to-transparent pointer-events-none" />
            
            <h3 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold font-heading tracking-tight text-white leading-none mb-4 sm:mb-6 stage2-company">
              <SplitText text={experienceData.company} />
            </h3>
            
            <div className="text-[10px] sm:text-xs md:text-sm lg:text-base font-mono tracking-widest text-slate-400 uppercase mb-6 sm:mb-8 stage2-fade-in font-bold">
              {experienceData.role} // {experienceData.duration}
            </div>
            
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-slate-300 font-sans leading-relaxed max-w-3xl mx-auto stage2-fade-in font-light">
              {experienceData.summary}
            </p>
          </div>
        </div>

        {/* -------------------- STAGE 3: CORE CONTRIBUTIONS -------------------- */}
        <div 
          ref={stage3Ref}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 md:px-12 w-full opacity-0 pointer-events-none"
        >
          <span className="text-[10px] sm:text-xs md:text-sm font-mono tracking-[0.45em] text-slate-500 font-bold uppercase mb-4 sm:mb-6">
            ★ CAPABILITIES & SOLUTIONS
          </span>
          <h3 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight text-white uppercase leading-none mb-6 sm:mb-12 text-center">
            CORE CONTRIBUTIONS
          </h3>
          
          <div className="flex lg:grid overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 max-w-[95rem] w-full justify-start lg:justify-center items-stretch stage3-grid pb-6 lg:pb-0 px-6 lg:px-0 scrollbar-none">
            {experienceData.contributions.map((con, idx) => (
              <div
                key={con.id}
                ref={el => contributionTextsRef.current[idx] = el}
                className="relative flex flex-col p-6 lg:p-8 rounded-2xl border border-white/[0.08] bg-[#0A0A0C]/80 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] stage3-card h-full min-w-[280px] sm:min-w-[320px] lg:min-w-0 snap-center justify-start text-left group hover:border-accent/30 transition-all duration-300"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent rounded-2xl pointer-events-none" />
                
                <div className="flex flex-col mb-3 sm:mb-4 stage3-header">
                  <h4 className="text-lg md:text-2xl font-black font-heading text-white uppercase tracking-tight leading-none">
                    {con.title}
                  </h4>
                </div>
                
                <p className="text-xs sm:text-base text-slate-300 font-sans font-medium leading-relaxed tracking-wide stage3-explanation">
                  {con.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* -------------------- STAGE 4: IMPACT METRICS -------------------- */}
        <div 
          ref={stage4Ref}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 md:px-12 w-full opacity-0 pointer-events-none"
        >
          <span className="text-[10px] sm:text-xs md:text-sm font-mono tracking-[0.45em] text-slate-500 font-bold uppercase mb-4 sm:mb-6">
            ★ SYSTEM PERFORMANCE
          </span>
          
          <h3 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight text-white uppercase leading-none mb-10 sm:mb-20 stage4-title">
            <SplitText text="ENGINEERING IMPACT" />
          </h3>

          <div className="grid grid-cols-3 gap-3 md:gap-10 max-w-6xl justify-center items-center w-full px-2 md:px-0">
            {experienceData.metrics.map((metric, idx) => (
              <div 
                key={idx}
                className="flex flex-col items-center p-4 md:p-12 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md relative select-none stage4-metric-col group overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/[0.015] to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <span 
                  ref={el => metricValuesRef.current[idx] = el}
                  className="text-3xl sm:text-7xl md:text-8xl lg:text-[7rem] font-bold font-heading tracking-tighter leading-none text-white select-none bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent mb-2 sm:mb-4"
                >
                  0{metric.suffix}
                </span>
                
                <span className="text-[8px] sm:text-xs md:text-sm font-mono text-slate-400 tracking-[0.2em] uppercase mt-2 sm:mt-4 text-center font-bold leading-relaxed max-w-[200px]">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* -------------------- STAGE 5: CLOSING MOMENT -------------------- */}
        <div 
          ref={stage5Ref}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 sm:px-12 w-full opacity-0 pointer-events-none"
        >
          {/* Lens flare */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-radial from-accent/[0.04] to-transparent blur-[130px] pointer-events-none stage5-flare" />
          
          <h2 className="text-2xl sm:text-5xl lg:text-[5.5rem] font-light tracking-wide text-white max-w-6xl leading-tight stage5-title italic font-sans">
            <SplitText text="“Engineering products from architecture to experience.”" />
          </h2>
        </div>

      </div>
    </section>
  );
}
