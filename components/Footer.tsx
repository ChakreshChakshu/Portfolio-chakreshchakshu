'use client';

import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-transparent py-8 border-t border-[#fca311]/20 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-foreground/60 font-sans">
        <p>&copy; {currentYear} Chakresh Chakshu. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="https://github.com/chakresh" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          <a href="https://linkedin.com/in/chakresh" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a>
          <a href="https://twitter.com/chakresh" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  );
}
