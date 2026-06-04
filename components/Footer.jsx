'use client';

import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-[#14213d] py-8 border-t border-[#fca311]/20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-foreground/60 font-sans">
        <p>&copy; {currentYear} Chakresh Chakshu. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href={process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/chakresh"} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          <a href={process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/in/chakresh"} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
