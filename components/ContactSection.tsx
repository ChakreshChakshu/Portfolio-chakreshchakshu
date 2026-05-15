'use client';

import React from 'react';

export function ContactSection() {
  return (
    <section id="contact" className="w-full h-full relative bg-background py-12 flex flex-col justify-center items-center">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-5xl md:text-7xl font-heading font-bold text-foreground mb-6">
          Let's build something.
        </h2>
        <p className="text-xl text-foreground/70 font-sans mb-12 max-w-2xl mx-auto">
          Currently open for new opportunities. Whether you have a question or just want to say hi, 
          I'll try my best to get back to you!
        </p>
        
        <a 
          href="mailto:hello@chakresh.com" 
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold font-heading text-background bg-foreground rounded-full transition-transform hover:scale-105 active:scale-95"
        >
          Say Hello
        </a>
      </div>
    </section>
  );
}
