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

  // Interactive Neural Constellation & Warp Beams Canvas Animation
  useEffect(() => {
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Resize handler
    const resizeCanvas = () => {
      const rect = containerRef.current?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Fixed vertical ambient beams that slide and pulse with scroll parallax and follow cursor
    const ambientBeams = [
      { xPercent: 0.15, width: 100, speed: 0.15, maxAlpha: 0.08, phase: 0, mouseParallax: 40 },
      { xPercent: 0.38, width: 180, speed: -0.25, maxAlpha: 0.12, phase: 2, mouseParallax: -60 },
      { xPercent: 0.55, width: 130, speed: 0.2, maxAlpha: 0.09, phase: 4, mouseParallax: 30 },
      { xPercent: 0.72, width: 220, speed: -0.15, maxAlpha: 0.11, phase: 1.5, mouseParallax: -50 },
      { xPercent: 0.90, width: 90, speed: 0.25, maxAlpha: 0.07, phase: 6, mouseParallax: 20 }
    ];

    // Animation loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;
      const scrollProgress = scrollProgressRef.current;
      
      // Decay scroll velocity smoothly
      scrollVelocityRef.current *= 0.93;
      const velocity = scrollVelocityRef.current;

      // Draw Scroll-Parallax & Mouse-Move Ambient Vertical Beams
      ambientBeams.forEach((beam) => {
        // Calculate offset from cursor horizontal position
        const mouseXOffset = mouse.x !== null ? (mouse.x - canvas.width / 2) : 0;
        
        // Final horizontal center of the beam (merges scroll progress and mouse position)
        const currentX = (beam.xPercent * canvas.width) + 
                         (scrollProgress * canvas.width * beam.speed) + 
                         (mouseXOffset * (beam.mouseParallax / 300));
        
        // Slowly pulse beam alpha
        beam.phase += 0.006;
        const pulse = Math.sin(beam.phase);
        
        // Brighten slightly on scroll speed (velocity)
        const currentAlpha = beam.maxAlpha * (0.6 + pulse * 0.4) * (1.0 + Math.min(1.5, velocity / 10));
        const currentWidth = beam.width * (0.95 + pulse * 0.05);

        // Draw vertical linear gradient column (light beam)
        const grad = ctx.createLinearGradient(currentX - currentWidth / 2, 0, currentX + currentWidth / 2, 0);
        grad.addColorStop(0, "rgba(252, 163, 17, 0)");
        grad.addColorStop(0.5, `rgba(252, 163, 17, ${currentAlpha})`);
        grad.addColorStop(1, "rgba(252, 163, 17, 0)");

        ctx.fillStyle = grad;
        ctx.fillRect(currentX - currentWidth / 2, 0, currentWidth, canvas.height);
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  // GSAP scroll listener for driving desktop storytelling steps
  useEffect(() => {
    if (isMobile) return;

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

    // Animate each contribution sequentially
    experienceData.contributions.forEach((con, idx) => {
      const el = contributionTextsRef.current[idx];
      if (!el) return;

      const start = 40 + idx * 8;
      const exitStart = start + 5.5;

      const card = el;
      const header = el.querySelector(".stage3-header");
      const titleChars = el.querySelectorAll(".stage3-explanation .char");

      // Initial reset of card to 3D skewed state completely below the viewport
      gsap.set(card, { 
        opacity: 0, 
        yPercent: 180, 
        rotateY: idx % 2 === 0 ? 20 : -20, 
        rotateX: 10 
      });

      // Enter (Emerge completely from below to center)
      tl.set(card, { pointerEvents: "auto" }, start);
      tl.fromTo(card, 
        { 
          opacity: 0, 
          yPercent: 180, 
          rotateY: idx % 2 === 0 ? 20 : -20, 
          rotateX: 10 
        }, 
        { 
          opacity: 1, 
          yPercent: 0, 
          rotateY: idx % 2 === 0 ? 5 : -5, 
          rotateX: 2, 
          duration: 4.5, 
          ease: "power3.out" 
        }, 
        start
      );
      
      if (header) {
        tl.fromTo(header, { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 2.5, ease: "power2.out" }, start + 0.5);
      }
      
      if (titleChars.length > 0) {
        tl.fromTo(titleChars,
          { 
            opacity: 0,
          },
          { 
            opacity: 1, 
            stagger: 0.03,
            ease: "none", 
            duration: 0.001
          },
          start + 0.8
        );
      }

      // Exit (Slide completely up out of the viewport)
      tl.to(card, { 
        opacity: 0, 
        yPercent: -180, 
        rotateY: idx % 2 === 0 ? -20 : 20,
        rotateX: -10,
        duration: 4.5, 
        ease: "power3.in" 
      }, exitStart);
      
      tl.set(card, { pointerEvents: "none" }, exitStart + 4.5);
    });

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

    // Initialize counts for count-up
    const metricsArr = [0, 0, 0];
    let hasCountedUp = false;

    // Capture scroll speed to drive background warp beams
    lastScrollYRef.current = window.scrollY;
    lastScrollTimeRef.current = Date.now();

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

      // Calculate scroll velocity
      const now = Date.now();
      const dt = Math.max(1, now - lastScrollTimeRef.current);
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

  // Mobile layout: Minimalist vertical layout with high design quality
  if (isMobile) {
    return (
      <section
        id="experience"
        className="w-full relative bg-[#020204] py-20 px-6 overflow-y-auto select-none font-sans"
      >
        <div 
          className="absolute inset-0 bg-[linear-gradient(rgba(252,163,17,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(252,163,17,0.06)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"
          style={{ opacity: 0.5 }}
        />
        
        <div className="max-w-xl mx-auto flex flex-col gap-16 text-left relative z-10">
          {/* Hero Statement */}
          <div className="flex flex-col">
            <span className="text-[11px] font-mono tracking-[0.45em] text-accent font-bold uppercase mb-2">
              ★ SYSTEM LOG
            </span>
            <h2 className="text-5xl font-extrabold tracking-tight text-white uppercase font-heading">
              EXPERIENCE
            </h2>
            <div className="h-[1px] w-28 bg-accent/50 mt-4 mb-6" />
            <p className="text-xl text-slate-400 font-sans leading-relaxed mt-4">
              Building production systems.<br />Shipping products.<br />Solving real problems.
            </p>
          </div>

          {/* Company Details */}
          <div className="flex flex-col gap-3 p-6 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-accent uppercase mb-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              SYSTEM ACTIVE {"//"} {experienceData.duration}
            </div>
            <h3 className="text-4xl font-extrabold tracking-tight text-white uppercase font-heading">
              {experienceData.company}
            </h3>
            <p className="text-sm font-mono text-slate-400 tracking-wider">
              {experienceData.role}
            </p>
            <p className="text-base text-slate-300 leading-relaxed font-sans font-light mt-4">
              {experienceData.summary}
            </p>
          </div>

          {/* Contributions */}
          <div className="flex flex-col gap-8">
            <span className="text-[11px] font-mono tracking-[0.3em] text-slate-500 uppercase font-bold">
              ENGINEERING MODULES
            </span>
            
            <div className="flex flex-col gap-6">
              {experienceData.contributions.map((con) => (
                <div 
                  key={con.id} 
                  className="flex flex-col gap-3 p-6 rounded-xl border border-white/5 bg-black/40 backdrop-blur-sm relative text-left"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                    <h4 className="text-sm font-mono tracking-wider text-accent uppercase">
                      {con.title}
                    </h4>
                  </div>
                  <p className="text-base text-slate-300 leading-relaxed font-sans font-light">
                    {con.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="flex flex-col gap-6">
            <span className="text-[11px] font-mono tracking-[0.3em] text-slate-500 uppercase font-bold">
              METRIC HIGHLIGHTS
            </span>
            <div className="grid grid-cols-3 gap-4">
              {experienceData.metrics.map((metric, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col items-center justify-center p-5 rounded-lg border border-white/5 bg-black/40 text-center select-none"
                >
                  <span className="text-3xl font-bold text-white font-heading tracking-tighter">
                    {metric.value}{metric.suffix}
                  </span>
                  <span className="text-[8px] font-mono text-slate-500 tracking-wider mt-2.5 leading-tight uppercase">
                    {metric.label.replace('Production ', '').replace('Reusable ', '')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Closing Statement */}
          <div className="py-8 border-t border-white/5 text-center mt-4">
            <p className="text-xl font-light tracking-wider text-accent italic font-sans">
              “Engineering products from architecture to experience.”
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="experience"
      ref={containerRef}
      className="w-full relative bg-background h-screen flex flex-col justify-center items-center overflow-hidden select-none"
    >
      {/* Interactive Constellation & Warp Beams Canvas Background */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Subtle HUD tech accents framing the viewport */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-16 left-16 w-8 h-8 border-t border-l border-accent/20" />
        <div className="absolute top-16 right-16 w-8 h-8 border-t border-r border-accent/20" />
        <div className="absolute bottom-16 left-16 w-8 h-8 border-b border-l border-accent/20" />
        <div className="absolute bottom-16 right-16 w-8 h-8 border-b border-r border-accent/20" />
      </div>

      {/* Dynamic backdrop lighting flare - Follows cursor and transforms intensity/color by active stage (high contrast amber glow) */}
      <div 
        ref={bgLightRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/[0.08] blur-[150px] pointer-events-none z-0 transition-all duration-700" 
      />

      {/* -------------------- STAGE 1: HERO STATEMENT -------------------- */}
      <div 
        ref={stage1Ref}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 w-full opacity-1"
      >
        <h2 className="text-8xl md:text-9xl lg:text-[10rem] font-extrabold font-heading tracking-tight text-white uppercase leading-none py-2 select-none stage1-title">
          <SplitText text="EXPERIENCE" />
        </h2>
        
        <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-accent to-transparent mt-6 mb-8 stage1-line" />

        <div className="flex flex-col gap-5 max-w-2xl stage1-fade-in mt-6">
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-slate-300 tracking-tight leading-none uppercase">
            Building production systems.
          </p>
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-accent/85 tracking-tight leading-none uppercase">
            Shipping products.
          </p>
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-slate-300 tracking-tight leading-none uppercase">
            Solving real problems.
          </p>
        </div>
      </div>

      {/* -------------------- STAGE 2: COMPANY & ROLE -------------------- */}
      <div 
        ref={stage2Ref}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 w-full opacity-0 pointer-events-none"
      >
        <div className="relative max-w-5xl w-full px-16 py-20 border border-white/5 rounded-2xl bg-black/45 backdrop-blur-md shadow-[0_30px_100px_rgba(0,0,0,0.85)] overflow-hidden stage2-card">
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/[0.015] to-transparent pointer-events-none" />
          
          <h3 className="text-6xl md:text-7xl lg:text-8xl font-extrabold font-heading tracking-tight text-white leading-none mb-6 stage2-company">
            <SplitText text={experienceData.company} />
          </h3>
          
          <div className="text-xs md:text-sm lg:text-base font-mono tracking-widest text-slate-400 uppercase mb-8 stage2-fade-in font-bold">
            {experienceData.role} // {experienceData.duration}
          </div>
          
          <p className="text-lg md:text-xl lg:text-2xl text-slate-300 font-sans leading-relaxed max-w-3xl mx-auto stage2-fade-in font-light">
            {experienceData.summary}
          </p>
        </div>
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
              alignClasses = "items-start text-left left-0 max-w-3xl";
            } else if (alignment === 1) {
              // Right
              alignClasses = "items-end text-right right-0 max-w-3xl ml-auto";
            } else {
              // Center (Middle)
              alignClasses = "items-center text-center left-1/2 -translate-x-1/2 max-w-3xl";
            }

            return (
              <div
                key={con.id}
                ref={el => contributionTextsRef.current[idx] = el}
                className={`absolute flex flex-col justify-center opacity-0 pointer-events-none p-12 rounded-2xl border border-white/5 bg-black/60 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.65)] ${alignClasses} stage3-card`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl pointer-events-none" />
                
                <div className="flex items-center gap-3 mb-6 stage3-header">
                  <span className="text-xs md:text-sm lg:text-base font-mono text-accent tracking-[0.25em] uppercase font-bold">
                    {con.title}
                  </span>
                </div>
                
                <h4 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-heading text-white uppercase tracking-tight leading-snug stage3-explanation mb-4">
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
        <span className="text-xs md:text-sm font-mono tracking-[0.45em] text-slate-500 font-bold uppercase mb-6">
          ★ SYSTEM PERFORMANCE
        </span>
        
        <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight text-white uppercase leading-none mb-20 stage4-title">
          <SplitText text="ENGINEERING IMPACT" />
        </h3>

        <div className="grid grid-cols-3 gap-10 max-w-6xl justify-center items-center w-full">
          {experienceData.metrics.map((metric, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-center p-12 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md relative select-none stage4-metric-col group overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/[0.015] to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <span 
                ref={el => metricValuesRef.current[idx] = el}
                className="text-7xl md:text-8xl lg:text-[7rem] font-bold font-heading tracking-tighter leading-none text-white select-none bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent mb-4"
              >
                0{metric.suffix}
              </span>
              
              <span className="text-xs md:text-sm font-mono text-slate-400 tracking-[0.2em] uppercase mt-4 text-center font-bold leading-relaxed max-w-[200px]">
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
        {/* Lens flare */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-radial from-accent/[0.04] to-transparent blur-[130px] pointer-events-none stage5-flare" />
        
        <h2 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-light tracking-wide text-white max-w-6xl leading-tight stage5-title italic font-sans">
          <SplitText text="“Engineering products from architecture to experience.”" />
        </h2>
        
        <p className="text-sm md:text-base font-mono text-slate-500 tracking-[0.3em] uppercase mt-10 select-none stage5-subtext">
          SYSTEM STACK LOADED {"//"} NEXT SECTION JUMP
        </p>
      </div>

    </section>
  );
}
