'use client';

import React from 'react';
import { projectsData } from '@/data/projects';

export function ProjectsSection() {
  return (
    <section id="projects" className="w-full relative bg-transparent py-24 min-h-[100dvh] flex items-center">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
            Selected Work
          </h2>
          <div className="h-1 w-20 bg-[#fca311] mt-4"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projectsData.map((project) => (
            <a
              key={project.title}
              href={project.href}
              className="group relative overflow-hidden bg-[#14213d]/30 border border-[#14213d]/50 rounded-2xl aspect-[4/3] shadow-lg block no-underline"
            >
              <div className="absolute inset-0 bg-[#14213d]/20 transition-colors group-hover:bg-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-[#000000]/90 to-transparent">
                <h3 className="text-2xl font-bold font-heading mb-2 text-foreground">{project.title}</h3>
                <p className="text-foreground/80 font-sans mb-4 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  {project.description}
                </p>
                <div className="flex gap-2 opacity-0 transform translate-y-4 transition-all duration-300 delay-75 group-hover:opacity-100 group-hover:translate-y-0">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 text-xs font-mono bg-[#fca311]/20 text-[#fca311] rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
