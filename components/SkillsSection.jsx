'use client';

import { useState } from 'react';
import { skillsData } from '@/data/skills';

const categories = [
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'tools', label: 'Tools' },
];

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState('frontend');
  const skills = skillsData[activeCategory];

  return (
    <section id="skills" className="w-full relative bg-transparent py-24 min-h-[100dvh] flex items-center">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
            Skills & Expertise
          </h2>
          <div className="h-1 w-20 bg-[#fca311] mt-4"></div>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-6 py-2 rounded-full text-sm font-mono transition-all duration-300 ${
                activeCategory === cat.key
                  ? 'bg-[#fca311] text-[#000000] font-bold'
                  : 'bg-[#14213d]/30 text-foreground/60 border border-[#14213d]/50 hover:border-[#fca311]/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="group bg-[#14213d]/20 border border-[#14213d]/40 rounded-xl p-5 hover:border-[#fca311]/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{skill.icon}</span>
                  <span className="text-lg font-heading font-semibold text-foreground">{skill.name}</span>
                </div>
                <span className="text-sm font-mono text-[#fca311]">{skill.level}%</span>
              </div>
              <div className="w-full h-2 bg-[#14213d]/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fca311] to-[#fca311]/70 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
