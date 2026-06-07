'use client';

import React from 'react';

export default function TechIcon({ name, className = "w-10 h-10" }) {
  const normalized = name.toLowerCase().replace(/[\s\.\-]/g, '');

  switch (normalized) {
    case 'react':
      return (
        <svg className={className} viewBox="-11.5 -10.23 23 20.46" fill="none">
          <circle cx="0" cy="0" r="2.05" fill="#7DD6FF" />
          <g stroke="#7DD6FF" strokeWidth="1">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );
    case 'nextjs':
      return (
        <svg className={className} viewBox="0 0 180 180" fill="none">
          <circle cx="90" cy="90" r="85" fill="black" stroke="white" strokeWidth="6" />
          <path d="M140 148 L68 54 H54 v72 h14 V68 l62 80 c2.5-2.2 4.8-4.6 6-6z" fill="white" />
          <path d="M115 54 h14 v72 h-14 z" fill="white" />
        </svg>
      );
    case 'typescript':
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="12" fill="#3178C6" />
          <text x="50" y="74" fill="white" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="42" textAnchor="middle">TS</text>
        </svg>
      );
    case 'tailwindcss':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M12 6C12 6 7.2 10.8 4.8 10.8 C2.4 10.8 1.2 9.6 1.2 9.6 C1.2 9.6 2.4 4.8 4.8 4.8 C7.2 4.8 12 9.6 12 9.6 C12 9.6 16.8 4.8 19.2 4.8 C21.6 4.8 22.8 6 22.8 6 C22.8 6 21.6 10.8 19.2 10.8 C16.8 10.8 12 6 12 6Z" fill="#38BDF8" fillOpacity="0.8" />
          <path d="M12 14.4C12 14.4 7.2 19.2 4.8 19.2 C2.4 19.2 1.2 18 1.2 18 C1.2 18 2.4 13.2 4.8 13.2 C7.2 13.2 12 18 12 18 C12 18 16.8 13.2 19.2 13.2 C21.6 13.2 22.8 14.4 22.8 14.4 C22.8 14.4 21.6 19.2 19.2 19.2 C16.8 19.2 12 14.4 12 14.4Z" fill="#38BDF8" fillOpacity="0.8" />
        </svg>
      );
    case 'gsap':
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" stroke="#88CE02" strokeWidth="4" strokeDasharray="6 6" />
          <path d="M50 20 L30 55 L48 55 L40 80 L70 45 L52 45 Z" fill="#88CE02" />
        </svg>
      );
    case 'framermotion':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M0 0 h24 v12 H12 L0 0 z" fill="#F024B6" />
          <path d="M0 12 h12 l12 12 H0 V12 z" fill="#F024B6" fillOpacity="0.75" />
          <path d="M24 12 H12 l12-12 v12 z" fill="#F024B6" fillOpacity="0.5" />
        </svg>
      );
    case 'nodejs':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M12 1.5 L3.34 6.5 v10 L12 21.5 l8.66-5 v-10 L12 1.5 z" stroke="#5FA04E" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="4.5" fill="#5FA04E" fillOpacity="0.4" />
        </svg>
      );
    case 'postgresql':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#4169E1" strokeWidth="1.5">
          <path d="M4 7 h16 M4 12 h16 M4 17 h16" />
          <rect x="2" y="3" width="20" height="18" rx="3" />
          <circle cx="17" cy="7" r="1.5" fill="#4169E1" />
          <circle cx="17" cy="12" r="1.5" fill="#4169E1" />
          <circle cx="17" cy="17" r="1.5" fill="#4169E1" />
        </svg>
      );
    case 'mongodb':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M12 2 C9.5 5.5 8 9.5 8 13.5 C8 17.5 10 20 12 22 C14 20 16 17.5 16 13.5 C16 9.5 14.5 5.5 12 2 Z" fill="#47A248" fillOpacity="0.25" stroke="#47A248" strokeWidth="1.5" />
          <path d="M12 2 V22" stroke="#47A248" strokeWidth="1.5" />
        </svg>
      );
    case 'restapis':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 7 h8 M8 12 h8 M8 17 h8 M4 3 h16 a2 2 0 0 1 2 2 v14 a2 2 0 0 1-2 2 H4 a2 2 0 0 1-2-2 V5 a2 2 0 0 1 2-2 z" />
        </svg>
      );
    case 'git':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#F05032" strokeWidth="1.5">
          <circle cx="18" cy="6" r="3" fill="#F05032" fillOpacity="0.1" />
          <circle cx="6" cy="18" r="3" fill="#F05032" fillOpacity="0.1" />
          <circle cx="6" cy="6" r="3" fill="#F05032" fillOpacity="0.1" />
          <path d="M6 9 v6 M18 9 c0 4.5-12 4.5-12 9" />
        </svg>
      );
    case 'docker':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#2496ED" strokeWidth="1.5">
          <path d="M2 13.5 h20 M2 13.5 c0 4 3 6.5 10 6.5 s10-2.5 10-6.5" />
          <rect x="5" y="8" width="3" height="3" rx="0.5" fill="#2496ED" fillOpacity="0.2" />
          <rect x="9" y="8" width="3" height="3" rx="0.5" fill="#2496ED" fillOpacity="0.2" />
          <rect x="13" y="8" width="3" height="3" rx="0.5" fill="#2496ED" fillOpacity="0.2" />
          <rect x="9" y="4" width="3" height="3" rx="0.5" fill="#2496ED" fillOpacity="0.2" />
        </svg>
      );
    case 'figma':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M12 2 a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4 z" fill="#EA4C1D" />
          <path d="M8 10 a4 4 0 0 0 4 4 4 4 0 0 0 4-4 H8 z" fill="#F24E1E" />
          <path d="M8 14 a4 4 0 0 0 4 4 c2.2 0 4-1.8 4-4 H8 z" fill="#A259FF" />
          <path d="M8 18 a4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4 4 4 0 0 0-4 4 z" fill="#1ABCFE" />
          <path d="M12 10 a4 4 0 0 0 4 4 4 4 0 0 0 4-4 h-8 z" fill="#0ACF83" />
        </svg>
      );
    case 'vercel':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="white" strokeWidth="1">
          <path d="M12 2 L2 22 h20 L12 2 z" />
        </svg>
      );
    case 'claudecode':
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" stroke="#D97706" strokeWidth="2" />
          <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="#D97706" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="12" fill="#D97706" fillOpacity="0.4" />
        </svg>
      );
    case 'codex':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="1.5">
          <circle cx="12" cy="12" r="3.5" fill="#E11D48" />
          <circle cx="4" cy="6" r="2.2" fill="#E11D48" fillOpacity="0.1" />
          <circle cx="20" cy="6" r="2.2" fill="#E11D48" fillOpacity="0.1" />
          <circle cx="4" cy="18" r="2.2" fill="#E11D48" fillOpacity="0.1" />
          <circle cx="20" cy="18" r="2.2" fill="#E11D48" fillOpacity="0.1" />
          <path d="M6 7.5 l4.5 3 M18 7.5 l-4.5 3 M6 16.5 l4.5-3 M18 16.5 l-4.5-3" />
        </svg>
      );
    case 'agenticai':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#FFA17B" strokeWidth="1.5">
          <path d="M13 2 L3 14 h9 l-1 8 10-12 h-9 l1-8 z" fill="#FFA17B" fillOpacity="0.2" />
        </svg>
      );
    default:
      return (
        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-lg text-slate-300 select-none">
          {name.charAt(0)}
        </div>
      );
  }
}
