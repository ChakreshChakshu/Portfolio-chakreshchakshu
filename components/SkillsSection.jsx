'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { skillsData } from '@/data/skills';
import { IconCloud } from '@/components/ui/icon-cloud';

const cloudImages = [
  'https://cdn.simpleicons.org/react',
  'https://cdn.simpleicons.org/nextdotjs/white',
  'https://cdn.simpleicons.org/typescript',
  'https://cdn.simpleicons.org/tailwindcss',
  'https://cdn.simpleicons.org/greensock',
  'https://cdn.simpleicons.org/framer',
  'https://cdn.simpleicons.org/nodedotjs',
  'https://cdn.simpleicons.org/postgresql',
  'https://cdn.simpleicons.org/mongodb',
  'https://cdn.simpleicons.org/express/white',
  'https://cdn.simpleicons.org/prisma/white',
  'https://cdn.simpleicons.org/redis',
  'https://cdn.simpleicons.org/git',
  'https://cdn.simpleicons.org/docker',
  'https://cdn.simpleicons.org/figma',
  'https://cdn.simpleicons.org/vercel/white',
  'https://cdn.simpleicons.org/amazonaws',
  'https://cdn.simpleicons.org/visualstudiocode',
  'https://cdn.simpleicons.org/javascript',
  'https://cdn.simpleicons.org/html5',
  'https://cdn.simpleicons.org/css3',
  'https://cdn.simpleicons.org/python',
];

const CONNECT_RADIUS = 150;

function SkillPill({ skill, setHoveredSkill, registerRef }) {
  return (
    <div
      ref={(el) => registerRef(skill.name, el)}
      onMouseEnter={() => setHoveredSkill(skill.name)}
      onMouseLeave={() => setHoveredSkill(null)}
      className="group relative px-4 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:border-[#fca311]/40 hover:bg-[#fca311]/5 transition-all duration-300 cursor-default"
    >
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 group-hover:h-[60%] bg-[#fca311] rounded-full transition-all duration-300" />
      <span className="text-sm font-medium text-white/70 group-hover:text-white font-sans tracking-wide transition-colors duration-300 pl-1">
        {skill.name}
      </span>
    </div>
  );
}

function SkillColumn({ title, skills, align, setHoveredSkill, registerRef }) {
  return (
    <div className={`flex flex-col gap-2.5 ${align === 'right' ? 'items-end' : 'items-start'}`}>
      <h3 className={`text-xs font-bold tracking-[0.3em] text-[#fca311] uppercase mb-2 ${align === 'right' ? 'text-right' : 'text-left'}`}>
        {title}
      </h3>
      {skills.map((skill) => (
        <SkillPill key={skill.name} skill={skill} setHoveredSkill={setHoveredSkill} registerRef={registerRef} />
      ))}
    </div>
  );
}

export function SkillsSection() {
  const containerRef = useRef(null);
  const cloudRef = useRef(null);
  const pillRefs = useRef({});
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [wires, setWires] = useState([]);

  const registerRef = useCallback((name, el) => {
    if (el) pillRefs.current[name] = el;
  }, []);

  const recalcWires = useCallback(() => {
    const container = containerRef.current;
    const cloud = cloudRef.current;
    if (!container || !cloud) return;

    const cRect = container.getBoundingClientRect();
    const kRect = cloud.getBoundingClientRect();
    const cx = kRect.left + kRect.width / 2 - cRect.left;
    const cy = kRect.top + kRect.height / 2 - cRect.top;

    const newWires = [];
    Object.entries(pillRefs.current).forEach(([name, el]) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = r.left + r.width / 2 - cRect.left;
      const py = r.top + r.height / 2 - cRect.top;
      const dx = px - cx;
      const dy = py - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1) return;

      const connectRadius = kRect.width * 0.42;
      const ex = cx + (dx / dist) * connectRadius;
      const ey = cy + (dy / dist) * connectRadius;
      const offset = Math.min(dist * 0.12, 35);
      const cpX = (px + ex) / 2 - (dy / dist) * offset;
      const cpY = (py + ey) / 2 + (dx / dist) * offset;

      newWires.push({
        name,
        d: `M ${px.toFixed(1)} ${py.toFixed(1)} Q ${cpX.toFixed(1)} ${cpY.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`,
        dist,
      });
    });
    setWires(newWires);
  }, []);

  useEffect(() => {
    const t = setTimeout(recalcWires, 150);
    const ro = new ResizeObserver(recalcWires);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', recalcWires);
    return () => { clearTimeout(t); ro.disconnect(); window.removeEventListener('resize', recalcWires); };
  }, [recalcWires]);

  return (
    <section
      id="skills"
      ref={containerRef}
      className="w-full relative bg-transparent min-h-[100dvh] flex items-center overflow-hidden"
    >
      <style>{`
        @keyframes wirePulse {
          0%   { stroke-dashoffset: 600; opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { stroke-dashoffset: 0;   opacity: 0; }
        }
      `}</style>

      {/* SVG Wire Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]">
        <defs>
          <filter id="wglow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="wglow-strong" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {wires.map(({ name, d, dist }) => {
          const lit = hoveredSkill === name;
          const dashLen = Math.ceil(dist) + 80;
          return (
            <g key={name}>
              {/* Base dim wire — always visible */}
              <path
                d={d} fill="none"
                stroke={lit ? 'rgba(252,163,17,0.45)' : 'rgba(252,163,17,0.08)'}
                strokeWidth={lit ? 1.4 : 0.7}
                strokeLinecap="round"
                style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
                filter={lit ? 'url(#wglow)' : undefined}
              />
              {/* Traveling pulse on hover */}
              {lit && (
                <path
                  d={d} fill="none"
                  stroke="#fca311"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`6 ${dashLen}`}
                  filter="url(#wglow-strong)"
                  style={{ animation: 'wirePulse 1.4s ease-in-out infinite' }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Ambient blurs */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-[#fca311]/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-10 max-w-7xl w-full pt-10 pb-10">

        {/* Heading */}
        <div className="mb-8 text-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-sans">
            Skills &amp; Expertise
          </h2>
          <div className="h-1 w-24 bg-[#fca311] mt-5 rounded-full mx-auto" />
        </div>

        {/* 3-Column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-center relative z-10">

          <SkillColumn title="Frontend" skills={skillsData.frontend} align="left"
            setHoveredSkill={setHoveredSkill} registerRef={registerRef} />

          {/* Center cloud */}
          <div ref={cloudRef} className="flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] rounded-full border border-[#fca311]/8 pointer-events-none max-w-full" />
              <div className="absolute w-[250px] h-[250px] sm:w-[360px] sm:h-[360px] lg:w-[450px] lg:h-[450px] rounded-full border border-dashed border-white/5 pointer-events-none max-w-full" />
              <IconCloud images={cloudImages} />
            </div>
          </div>

          <SkillColumn title="Backend" skills={skillsData.backend} align="right"
            setHoveredSkill={setHoveredSkill} registerRef={registerRef} />
        </div>

        {/* Tools row */}
        <div className="mt-6 flex flex-col items-center gap-4 relative z-10">
          <h3 className="text-xs font-bold tracking-[0.3em] text-[#fca311] uppercase">Tools &amp; Infra</h3>
          <div className="flex flex-wrap justify-center gap-2.5">
            {skillsData.tools.map((skill) => (
              <SkillPill key={skill.name} skill={skill}
                setHoveredSkill={setHoveredSkill} registerRef={registerRef} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
