"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Sparkle, 
  Cpu, 
  Gear,
  CheckCircle
} from '@phosphor-icons/react';
import { TerminalUI } from '@/components/TerminalUI';

export function AboutSection() {
  // Default to 'neutral' mode where toggle stays centered
  const [viewMode, setViewMode] = useState('neutral'); // 'neutral' | 'dev' | 'recruiter'
  
  // Load saved viewmode on mount
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-view-mode');
    if (saved === 'dev' || saved === 'recruiter') {
      setViewMode(saved);
    }
  }, []);

  const selectMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem('portfolio-view-mode', mode);
  };

  return (
    <div className={cn(
      "w-full h-full flex flex-col items-center justify-start text-white relative overflow-hidden bg-gradient-to-br from-[#020202] via-[#0b0f19] to-[#000000] transition-all duration-500 pt-12 md:pt-16 pb-6",
      viewMode === 'dev' ? "px-2 md:px-4 lg:px-6" : "px-6 md:px-12"
    )}>
      
      {/* Background Symmetrical Aura Blurs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#fca311]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      
      {/* Tech grid texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(252, 163, 17, 0.2) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(252, 163, 17, 0.2) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* ==================== A. SHARED STATIC HEADER BLOCK ==================== */}
      <div className="z-30 flex flex-col items-center text-center select-none mb-6 shrink-0">
        <span className="text-[10px] font-mono tracking-[0.35em] text-[#fca311]/80 uppercase mb-2">
          02 / ENVIRONMENT PERSPECTIVE
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-sans bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_0_24px_rgba(255,255,255,0.05)]">
          About Me
        </h1>
      </div>

      {/* ==================== B. SELECTOR SLIDE TOGGLE SWITCH ==================== */}
      <div className="z-40 bg-[#07090e]/60 border border-white/10 p-1.5 rounded-full backdrop-blur-md shadow-2xl transition-all duration-300 mb-6 shrink-0">
        <div className="relative w-[88px] h-7 rounded-full bg-white/5 border border-white/10 flex items-center">
          
          {/* Symmetrical Tap Zones */}
          <button 
            onClick={() => selectMode('dev')}
            className="absolute left-0 w-[28px] h-full z-20 cursor-pointer"
            aria-label="Switch to Developer Mode"
          />
          <button 
            onClick={() => selectMode('neutral')}
            className="absolute left-[28px] w-[32px] h-full z-20 cursor-pointer"
            aria-label="Switch to Neutral Mode"
          />
          <button 
            onClick={() => selectMode('recruiter')}
            className="absolute right-0 w-[28px] h-full z-20 cursor-pointer"
            aria-label="Switch to Recruiter Mode"
          />

          {/* Sliding Pill */}
          <div 
            className={cn(
              "absolute w-5 h-5 rounded-full transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) pointer-events-none",
              viewMode === 'dev' && "left-1 bg-[#fca311] shadow-[0_0_12px_#fca311]",
              viewMode === 'neutral' && "left-[33px] bg-white/70 shadow-[0_0_10px_rgba(255,255,255,0.4)] animate-pulse",
              viewMode === 'recruiter' && "left-[65px] bg-blue-400 shadow-[0_0_12px_#60a5fa]"
            )}
          />
        </div>
      </div>

      {/* ==================== C. DYNAMIC NEUTRAL VIEWMODE INSTRUCTION GUIDE ==================== */}
      {viewMode === 'neutral' && (
        <div className="text-center pointer-events-none select-none z-30 animate-fadeIn transition-all duration-500 mb-4 shrink-0">
          <p className="text-[10px] font-mono tracking-[0.25em] text-[#e5e5e5]/40 uppercase mb-3 drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]">
            SELECT VIEWMODE PERSPECTIVE
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-[9px] font-mono text-gray-500 justify-center">
            <span className="flex items-center gap-1.5 text-white/30 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fca311] shadow-[0_0_8px_#fca311] animate-pulse" />
              ARE YOU A DEVELOPER? TOGGLE LEFT
            </span>
            <span className="hidden sm:inline text-white/10">|</span>
            <span className="flex items-center gap-1.5 text-white/30 tracking-wider">
              ARE YOU A RECRUITER? TOGGLE RIGHT
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa] animate-pulse" />
            </span>
          </div>
        </div>
      )}

      {/* ==================== D. LOWER DASHBOARD WORKSPACE FOOTPRINT ==================== */}
      <div className="w-full flex-grow flex items-center justify-center min-h-0 z-10">
        
        {/* Dynamic Neutral view mode height placeholder */}
        {viewMode === 'neutral' && (
          <div className="w-full h-[60vh] z-0 pointer-events-none" />
        )}

        {/* Developer Dashboard (Full-Screen Terminal) */}
        {viewMode === 'dev' && (
          <div className="w-full max-w-[95vw] flex flex-col h-[60vh] animate-fadeIn">
            <TerminalUI />
          </div>
        )}

        {/* Recruiter / Creative Overview */}
        {viewMode === 'recruiter' && (
          <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-fadeIn items-center h-[60vh] py-2">
            
            {/* Left Block: Portrait Card Details */}
            <div className="flex flex-col h-full min-h-[260px] border-l-2 border-blue-500/30 pl-6 md:pl-8 text-left py-2 justify-center">
              <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-blue-400 uppercase mb-4 opacity-90 flex items-center gap-2">
                <Sparkle size={14} className="animate-spin duration-[4s]" /> PROFESSIONAL IDENTITY
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight font-sans mb-4">
                Crafting Premium Digital Experiences
              </h2>
              <p className="text-sm text-gray-300 font-sans leading-relaxed mb-6 font-light">
                I am Chakresh Chakshu, a full-stack interaction engineer dedicated to designing production-grade, immersive frontend architectures. I combine software scalability with interactive detailing to make systems feel beautiful, robust, and alive.
              </p>
              
              {/* Elegant highlights grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                  <CheckCircle size={16} className="text-blue-400 shrink-0" weight="fill" />
                  <span className="text-xs font-sans font-medium text-[#e5e5e5]">User-Centered Details</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                  <CheckCircle size={16} className="text-blue-400 shrink-0" weight="fill" />
                  <span className="text-xs font-sans font-medium text-[#e5e5e5]">Production-Ready Scale</span>
                </div>
              </div>
            </div>

            {/* Right Block: Core Highlight Cards */}
            <div className="grid grid-cols-1 gap-4 w-full h-full max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
              
              {/* Card 1 */}
              <div className="p-5 rounded-2xl border border-white/5 bg-[#07090e]/60 backdrop-blur-md flex gap-4 transition-all duration-300 hover:border-blue-500/25">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                  <Cpu size={20} weight="fill" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase font-sans tracking-wide mb-1">
                    High Performance Engineering
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    Deeply passionate about speed and response times. Minimizes code sizes, optimizes asset loadings, and anchors components symmetrically to ensure instant performance under heavy loads.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-5 rounded-2xl border border-white/5 bg-[#07090e]/60 backdrop-blur-md flex gap-4 transition-all duration-300 hover:border-blue-500/25">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                  <Gear size={20} weight="fill" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase font-sans tracking-wide mb-1">
                    Interaction Architecture
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    Believes that premium animations build trust. Architects custom transitions, layered parallax, and responsive hover reactions that make products feel highly premium, reliable, and smooth.
                  </p>
                </div>
              </div>
              
            </div>
            
          </div>
        )}

      </div>

    </div>
  );
}
