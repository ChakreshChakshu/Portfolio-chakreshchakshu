"use client";

import React, { useState, useEffect, useRef } from 'react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

export function AboutSection({ isActive }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (!isActive) return;

      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      const innerScroller = container.querySelector('.scroll-stack-scroller');
      if (!innerScroller) return;

      const isInnerScrollActive =
        (scrollingDown && activeIndex < 2) || (scrollingUp && activeIndex > 0);

      if (isInnerScrollActive) {
        e.preventDefault();
        innerScroller.scrollTop += e.deltaY;
      }
    };

    let touchStart = 0;
    const handleTouchStart = (e) => {
      touchStart = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!isActive) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStart - touchY;

      const scrollingDown = deltaY > 0;
      const scrollingUp = deltaY < 0;

      const innerScroller = container.querySelector('.scroll-stack-scroller');
      if (!innerScroller) return;

      const isInnerScrollActive =
        (scrollingDown && activeIndex < 2) || (scrollingUp && activeIndex > 0);

      if (isInnerScrollActive) {
        e.preventDefault();
        innerScroller.scrollTop += deltaY;
      }

      touchStart = touchY;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isActive, activeIndex]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-transparent text-white relative overflow-hidden select-none">
      
      {/* Cinematic Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#fca311]/4 blur-[200px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] rounded-full bg-blue-500/4 blur-[150px] pointer-events-none z-0" />

      {/* Borderless Screen ScrollStack Wrapper */}
      <div className="w-full h-full z-10 relative">
        <ScrollStack
          useWindowScroll={false}
          itemDistance={450}
          itemStackDistance={0}
          stackPosition="0%" // Center layout perfectly
          scaleEndPosition="0%"
          baseScale={1.0}
          itemScale={0.0}
          blurAmount={12} // Rich camera-lens focus blur
          showDots={false}
          className="h-screen w-full overflow-y-auto scrollbar-none"
          onActiveIndexChange={(idx) => setActiveIndex(idx)}
        >
          
          {/* Slide 1: Heading + Interfaces & Experiences */}
          <ScrollStackItem>
            <div className={`w-full h-screen flex flex-col justify-center items-center text-center px-6 md:px-16 bg-transparent transition-all duration-1000 ease-out select-none ${
              activeIndex === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}>
              
              {/* Centered Symmetrical "About me" Header (Embedded in Slide 1) */}
              <div className="mb-10 text-center transition-all duration-1000">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white font-sans">
                  About me
                </h2>
                <div className="h-1 w-16 bg-[#fca311] mt-4 rounded-full mx-auto" />
              </div>

              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.15] text-white font-sans max-w-6xl">
                I don't just build <br />
                <span className="text-white/40 font-bold italic select-none">interfaces.</span>
              </h2>
              
              <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight font-sans mt-10">
                I <span className="bg-gradient-to-r from-[#ffe169] via-[#fca311] to-[#d97706] bg-clip-text text-transparent underline decoration-[#fca311]/25 decoration-[3px] underline-offset-[16px] md:underline-offset-[24px]">engineer experiences.</span>
              </h3>
            </div>
          </ScrollStackItem>

          {/* Slide 2: Systems, Interaction & Execution */}
          <ScrollStackItem>
            <div className={`w-full h-screen flex flex-col justify-center items-center text-center px-6 md:px-16 bg-transparent transition-all duration-1000 ease-out select-none ${
              activeIndex === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}>
              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.15] text-white/50 font-sans max-w-6xl">
                I approach development through
              </h2>
              
              <div className="mt-14 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white font-sans">
                <span className="text-[#fca311] hover:scale-105 transition-transform duration-300">systems,</span>
                <span className="hidden md:inline w-3 h-3 rounded-full bg-white/20" />
                <span className="text-white hover:scale-105 transition-transform duration-300">interaction,</span>
                <span className="hidden md:inline w-3 h-3 rounded-full bg-[#fca311]/50 shadow-[0_0_12px_#fca311]" />
                <span className="bg-gradient-to-r from-indigo-300 via-violet-400 to-purple-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">execution.</span>
              </div>
              <span className="text-[10px] font-mono text-gray-500 tracking-[0.4em] uppercase mt-12 block opacity-70">
                and intentional pathing
              </span>
            </div>
          </ScrollStackItem>

          {/* Slide 3: Full Stack Integrity */}
          <ScrollStackItem>
            <div className={`w-full h-screen flex flex-col justify-center items-center text-center px-6 md:px-16 bg-transparent transition-all duration-1000 ease-out select-none ${
              activeIndex === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}>
              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] text-white font-sans max-w-6xl">
                I build <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">full stack products</span>
              </h2>
              
              <p className="text-xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-400 font-semibold tracking-wide leading-[1.5] max-w-5xl mt-14 font-sans">
                focused on <span className="text-white font-bold underline decoration-emerald-400/35 decoration-2 underline-offset-8">clean architecture</span>, <br className="hidden md:inline" />
                <span className="text-white font-bold underline decoration-indigo-400/35 decoration-2 underline-offset-8">strong user experiences</span>, and software <br className="hidden md:inline" />
                that feels <span className="bg-gradient-to-r from-[#ffe169] to-[#fca311] bg-clip-text text-transparent font-black">engineered</span>, not assembled.
              </p>
            </div>
          </ScrollStackItem>

        </ScrollStack>
      </div>

    </div>
  );
}
