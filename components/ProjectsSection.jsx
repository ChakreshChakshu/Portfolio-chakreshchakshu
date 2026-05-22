'use client';

import React, { useState, useEffect, useRef } from 'react';
import { projectsData } from '@/data/projects';
import { cn } from '@/lib/utils';
import { Terminal, Cpu, Play, CheckCircle, ArrowRight } from '@phosphor-icons/react';

// Live simulated terminal build log list
const BUILD_LOGS = [
  { text: "$ npm run build:portfolio", type: "cmd" },
  { text: "▶ next build --turbo", type: "info" },
  { text: "▲ Next.js v15.1.0 - Core Engine Initialization", type: "system" },
  { text: "○ compiling / (static route)...", type: "info" },
  { text: "✓ compiled / successfully", type: "success" },
  { text: "○ syncing database schema layers...", type: "info" },
  { text: "✓ PostgreSQL connected - 14 models synchronized", type: "success" },
  { text: "✓ MongoDB connected - collections verified", type: "success" },
  { text: "○ auditing GSAP scroll timeline curves...", type: "info" },
  { text: "✓ motion layouts verified", type: "success" },
  { text: "● generating static paths...", type: "info" },
  { text: "✓ static pages generated (5/5)", type: "success" },
  { text: "★ deploy: vercel edge route handshake established", type: "success" },
  { text: "✓ hosting live at https://chakresh.dev [PORT 3000]", type: "success" },
  { text: "[re-initiating build cycle...]", type: "prompt" }
];

export function ProjectsSection() {
  const [logs, setLogs] = useState([]);
  const [logIndex, setLogIndex] = useState(0);
  const logContainerRef = useRef(null);

  // Cycle logs to simulate real-time compiling
  useEffect(() => {
    // Initial logs load
    setLogs([BUILD_LOGS[0]]);
    setLogIndex(1);
  }, []);

  useEffect(() => {
    if (logIndex === 0) return;
    
    const interval = setInterval(() => {
      setLogs(prev => {
        const nextIndex = logIndex % BUILD_LOGS.length;
        // If looping, clear logs to simulate refresh
        if (nextIndex === 0) {
          setTimeout(() => {
            setLogs([BUILD_LOGS[0]]);
            setLogIndex(1);
          }, 1500);
          clearInterval(interval);
          return [...prev, { text: "✓ System Ready. Re-initiating...", type: "success" }];
        }
        
        setLogIndex(prevIdx => prevIdx + 1);
        return [...prev, BUILD_LOGS[nextIndex]];
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [logIndex]);

  // Keep terminal logs scrolled to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTo({
        top: logContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [logs]);

  return (
    <section id="projects" className="w-full relative bg-transparent py-16 md:py-24 min-h-[100dvh] flex flex-col justify-center select-none overflow-hidden">
      
      <div className="container mx-auto px-6 md:px-12 max-w-6xl w-full">
        
        {/* Header Block */}
        <div className="mb-10 text-left shrink-0">
          <span className="text-[10px] font-mono tracking-[0.35em] text-[#fca311]/80 uppercase mb-2 block">
            04 / SOURCE CONTROL & DEPLOYS
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans">
            Selected Builds
          </h2>
          <div className="h-1 w-20 bg-[#fca311] mt-4 rounded-full"></div>
        </div>

        {/* ==================== HORIZONTAL BUILD CAROUSEL SCROLLER ==================== */}
        <div className="flex overflow-x-auto gap-6 py-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#fca311]/20 pb-8 focus:outline-none select-text">
          
          {/* A. LIVE BUILD TERMINAL CARD (Head of the scroller) */}
          <div className="min-w-[300px] sm:min-w-[360px] md:min-w-[420px] snap-center aspect-[4/3] rounded-2xl bg-[#07090e]/80 border border-white/10 relative overflow-hidden flex flex-col shadow-2xl p-5 shrink-0 transition-all duration-300 hover:border-[#fca311]/20">
            {/* Symmetrical Window Header Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <Terminal size={12} className="text-[#fca311]" /> build_terminal.sh
              </span>
            </div>

            {/* Console Log Area */}
            <div 
              ref={logContainerRef}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="flex-grow overflow-y-auto font-mono text-[10px] sm:text-xs text-[#e5e5e5]/80 space-y-1.5 pr-2 scrollbar-thin scrollbar-thumb-white/5 cursor-text select-text"
            >
              {logs.map((log, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "leading-relaxed",
                    log.type === "cmd" && "text-[#fca311] font-semibold",
                    log.type === "info" && "text-gray-400 pl-2",
                    log.type === "system" && "text-blue-400 pl-2",
                    log.type === "success" && "text-green-400 pl-2 font-medium",
                    log.type === "prompt" && "text-[#e5e5e5]/30 pl-2 italic"
                  )}
                >
                  {log.text}
                </div>
              ))}
              <div className="inline-block w-1.5 h-3.5 bg-white/70 animate-pulse ml-2" />
            </div>

            {/* Console Footer Status */}
            <div className="border-t border-white/10 pt-3 mt-3 flex items-center justify-between text-[10px] font-mono text-gray-500 shrink-0">
              <span className="flex items-center gap-1">
                <Cpu size={12} className="text-[#fca311]" /> CPU: 4.2%
              </span>
              <span className="flex items-center gap-1.5 text-green-400/90">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                ENVIRONMENT LIVE
              </span>
            </div>
          </div>

          {/* B. DETAILED WORK BUILDS (Mapped list) */}
          {projectsData.map((project) => (
            <a
              key={project.title}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-[300px] sm:min-w-[360px] md:min-w-[420px] snap-center aspect-[4/3] rounded-2xl bg-[#07090e]/60 border border-white/5 relative overflow-hidden group flex flex-col justify-end p-6 hover:border-[#fca311]/25 transition-all duration-500 shadow-xl shrink-0"
            >
              {/* Blur gradient background overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#14213d]/10 via-[#07090e]/80 to-[#000000] z-0" />

              {/* Dynamic decorative backdrop shape */}
              <div className="absolute top-1/4 right-1/4 w-[180px] h-[180px] rounded-full bg-[#fca311]/5 blur-[60px] pointer-events-none transition-all duration-700 group-hover:scale-125" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3 opacity-90">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2.5 py-0.5 text-[10px] font-mono font-medium bg-[#fca311]/10 border border-[#fca311]/15 text-[#fca311] rounded-full uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title and Arrow */}
                <h3 className="text-xl font-bold font-sans text-white mb-2 flex items-center justify-between">
                  {project.title}
                  <ArrowRight size={18} className="text-gray-500 group-hover:text-[#fca311] group-hover:translate-x-1.5 transition-all duration-300" />
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-400 font-sans leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Interactive Launch Button (Reveals on Hover) */}
                <div className="w-full h-[1px] bg-white/5 group-hover:bg-[#fca311]/10 transition-colors duration-500 mb-3" />
                <div className="flex items-center gap-1 text-[10px] font-mono text-gray-500 group-hover:text-white transition-colors duration-300">
                  <Play size={10} className="text-[#fca311]" /> PREVIEW LIVE DEPLOY
                </div>
              </div>
            </a>
          ))}

        </div>

      </div>

    </section>
  );
}
