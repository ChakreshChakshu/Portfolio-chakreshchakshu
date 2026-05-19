// @ts-nocheck
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { EncryptedText } from '@/components/ui/encrypted-text';

const INITIAL_HISTORY = [
  { id: '1', type: 'system', content: 'Portfolio Terminal v2.0.1' },
  { id: '2', type: 'system', content: 'Type "help" to see available commands.' }
];

const TECH_STACK = [
  'Next.js', 'React', 'TypeScript', 'Tailwind CSS',
  'GSAP', 'Framer Motion', 'Node.js', 'MongoDB'
];

const HIGHLIGHT_CARDS = [
  { label: 'Frontend-Focused', icon: '⚛️' },
  { label: 'Performance-Driven', icon: '⚡' },
  { label: 'Scalable UI Systems', icon: '🧱' },
  { label: 'Motion & Interaction', icon: '✨' },
  { label: '1+ Years Experience', icon: '🚀' },
];

const PHILOSOPHY = "I believe great frontend development is where engineering, design, and user experience work together seamlessly.";

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export function AboutSection() {
  const [isDeveloper, setIsDeveloper] = useState(true);
  const [bioData, setBioData] = useState(null);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(data => setBioData(data))
      .catch(err => console.error("Failed to load bio data", err));
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setIsScrollable(scrollRef.current.scrollHeight > scrollRef.current.clientHeight);
    }
  }, [history]);

  const handleTerminalClick = () => {
    if (isDeveloper && !isProcessing && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCommand = async (e) => {
    if (e.key !== 'Enter' || !input.trim() || isProcessing) return;

    const cmd = input.trim();
    setInput('');
    setIsProcessing(true);

    const newCmdLine = { id: Date.now().toString(), type: 'command', content: cmd };
    setHistory((prev) => [...prev, newCmdLine]);

    if (cmd.toLowerCase() === 'help') {
      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          { id: Date.now().toString() + 'h', type: 'system', content: 'Available commands:\n  curl /api/about   - Fetch developer profile\n  clear             - Clear terminal\n  whoami            - Print current user' }
        ]);
        setIsProcessing(false);
      }, 300);
      return;
    }

    if (cmd.toLowerCase() === 'clear') {
      setHistory([]);
      setIsProcessing(false);
      return;
    }

    if (cmd.toLowerCase() === 'whoami') {
      setTimeout(() => {
        setHistory((prev) => [...prev, { id: Date.now().toString() + 'w', type: 'success', content: 'visitor' }]);
        setIsProcessing(false);
      }, 300);
      return;
    }

    if (cmd.toLowerCase() === 'curl /api/about' || cmd.toLowerCase() === 'curl https://portfolio.dev/api/about') {
      await simulateApiFetch();
      return;
    }

    setTimeout(() => {
      setHistory((prev) => [
        ...prev,
        { id: Date.now().toString() + 'e', type: 'error', content: `command not found: ${cmd.split(' ')[0]}` }
      ]);
      setIsProcessing(false);
    }, 300);
  };

  const simulateApiFetch = async () => {
    await delay(300);
    appendHistory('system', '> Initializing request...');
    await delay(400);
    appendHistory('system', '> Connecting to API...');
    await delay(500);
    appendHistory('system', '> Fetching developer profile...');

    try {
      const data = bioData || await (await fetch('/api/about')).json();
      await delay(400);
      appendHistory('system', '> Rendering response...');
      await delay(300);
      const jsonString = JSON.stringify(data, null, 2);
      appendHistory('json', jsonString);
    } catch (error) {
      appendHistory('error', 'Error: Failed to connect to backend.');
    } finally {
      setIsProcessing(false);
    }
  };

  const appendHistory = (type, content) => {
    setHistory((prev) => [...prev, { id: Date.now().toString() + Math.random(), type, content }]);
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <section id="about" className="w-full h-full relative flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#14213d] via-[#14213d] to-[#0d1a30] z-0" />

      <div className="container mx-auto flex flex-col lg:flex-row w-full relative z-10 gap-8 lg:gap-12 px-6 md:px-12 py-8 h-full">
        
        <motion.div 
          className="w-full lg:w-[45%] flex flex-col justify-center gap-6 shrink-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.span 
            variants={fadeUp}
            className="text-[#fca311] text-xs font-mono tracking-[0.2em] uppercase"
          >
            About Me
          </motion.span>

          <motion.h2 
            variants={fadeUp}
            className="text-xl md:text-2xl lg:text-[1.65rem] font-heading font-bold text-[#ffffff] leading-snug tracking-tight max-w-lg"
          >
            Building modern interfaces with a strong focus on performance, usability, and scalable frontend architecture.
          </motion.h2>

          <motion.div variants={fadeUp} className="h-px w-16 bg-[#fca311]/40" />

          <motion.p 
            variants={fadeUp}
            className="text-sm leading-relaxed text-[#e5e5e5]/70 font-sans max-w-lg"
          >
            I&apos;m Chakresh Chakshu, a frontend engineer with full stack expertise focused on building modern, scalable, and performance-driven web experiences. I specialize in creating polished interfaces that combine clean architecture, intuitive interactions, and thoughtful motion design.
          </motion.p>

          <motion.blockquote 
            variants={fadeUp}
            className="border-l-2 border-[#fca311]/30 pl-4 text-xs italic text-[#e5e5e5]/50 font-sans max-w-md leading-relaxed"
          >
            {PHILOSOPHY}
          </motion.blockquote>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-2 max-w-lg">
            {TECH_STACK.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
                viewport={{ once: true }}
                className="px-3 py-1.5 text-xs font-mono rounded-full border border-[#fca311]/15 bg-[#fca311]/5 text-[#e5e5e5]/80 hover:border-[#fca311]/40 hover:bg-[#fca311]/10 transition-all duration-300 cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          viewport={{ once: true, margin: "-50px" }}
          className="w-full lg:w-[55%] flex flex-col gap-4 min-h-0"
        >
          <div 
            className="flex-1 rounded-2xl border border-[#ffffff]/5 bg-[#000000]/60 shadow-[0_0_60px_rgba(0,0,0,0.4)] backdrop-blur-xl overflow-hidden flex flex-col min-h-0"
            onClick={handleTerminalClick}
          >
            {isDeveloper ? (
              <div className="flex flex-col h-full font-mono">
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#ffffff]/5 bg-[#ffffff]/[0.02] shrink-0">
                  <div className="flex gap-2 w-16">
                    <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                    <div className="w-3 h-3 rounded-full bg-[#fca311]/70"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                  </div>
                  <div className="flex-1 text-center font-mono text-[10px] text-[#e5e5e5]/30 tracking-widest uppercase">
                    chakresh@portfolio:~
                  </div>
                  <div className="w-16 text-right text-[10px] text-[#e5e5e5]/20 font-medium select-none">
                    bash
                  </div>
                </div>

                <div 
                  ref={scrollRef}
                  {...(isScrollable ? { 'data-lenis-prevent': 'true' } : {})}
                  onWheel={(e) => { if (isScrollable) e.stopPropagation(); }}
                  className="flex-1 overflow-y-auto p-5 md:p-6 text-sm leading-relaxed scroll-smooth custom-scrollbar min-h-0"
                >
                  {history.map((line) => (
                    <AnimatedLine key={line.id} line={line} />
                  ))}

                  <div className="flex items-center mt-2">
                    <span className="text-[#fca311] mr-3 shrink-0 text-sm">visitor@portfolio:~$</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleCommand}
                      disabled={isProcessing}
                      className="flex-1 bg-transparent border-none outline-none text-[#e5e5e5] caret-transparent font-mono text-sm"
                      spellCheck={false}
                      autoComplete="off"
                    />
                    <span className="w-2 h-4 bg-[#e5e5e5] animate-pulse ml-1 inline-block shrink-0 pointer-events-none" />
                  </div>
                </div>
              </div>
            ) : (
              <div 
                className="flex flex-col h-full overflow-y-auto p-6 md:p-8 custom-scrollbar"
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-heading font-bold text-[#ffffff] mb-4 pb-3 border-b border-[#ffffff]/5">
                  About Me
                </h3>
                <div className="flex flex-col gap-4 text-[#e5e5e5]/70 font-sans text-sm leading-relaxed">
                  {bioData ? (
                    bioData.bio.map((paragraph, i) => (
                      <EncryptedText 
                        key={i}
                        text={paragraph}
                        revealDelayMs={3 + i * 2}
                        flipDelayMs={30}
                        encryptedClassName="text-neutral-600"
                        revealedClassName="text-[#e5e5e5]/80"
                      />
                    ))
                  ) : (
                    <div className="animate-pulse flex flex-col gap-3">
                      <div className="h-3 bg-[#ffffff]/5 rounded w-full"></div>
                      <div className="h-3 bg-[#ffffff]/5 rounded w-5/6"></div>
                      <div className="h-3 bg-[#ffffff]/5 rounded w-4/6"></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <motion.div 
            className="flex flex-wrap gap-2 shrink-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
          {HIGHLIGHT_CARDS.map((card) => (
            <motion.div
              key={card.label}
              variants={fadeUp}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#ffffff]/5 bg-[#000000]/30 backdrop-blur-sm hover:border-[#fca311]/20 hover:bg-[#fca311]/5 transition-all duration-300 cursor-default group"
              >
                <span className="text-sm group-hover:scale-110 transition-transform duration-300">{card.icon}</span>
                <span className="text-xs font-medium text-[#e5e5e5]/70 group-hover:text-[#e5e5e5] transition-colors duration-300">{card.label}</span>
            </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedLine({ line }) {
  const lineRef = useRef(null);

  useEffect(() => {
    if (!lineRef.current) return;
    gsap.fromTo(
      lineRef.current,
      { opacity: 0, y: 5 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
    );
  }, []);

  if (line.type === 'command') {
    return (
      <div ref={lineRef} className="flex mb-3 text-[#e5e5e5] font-mono text-sm">
        <span className="text-[#fca311] mr-3">visitor@portfolio:~$</span>
        <span>{line.content}</span>
      </div>
    );
  }

  if (line.type === 'json') {
    return (
      <div ref={lineRef} className="mb-6 mt-3">
        <pre className="font-mono text-xs md:text-sm whitespace-pre-wrap leading-relaxed">
          <EncryptedText 
            text={line.content} 
            revealDelayMs={5} 
            flipDelayMs={30}
            encryptedClassName="text-neutral-500 opacity-50"
            revealedClassName="text-blue-300 font-medium drop-shadow-[0_0_8px_rgba(147,197,253,0.3)]"
          />
        </pre>
      </div>
    );
  }

  if (line.type === 'error') {
    return (
      <div ref={lineRef} className="mb-3 text-red-400 font-mono text-sm">
        {line.content}
      </div>
    );
  }
  
  if (line.type === 'success') {
    return (
      <div ref={lineRef} className="mb-3 text-green-300 font-mono text-sm">
        {line.content}
      </div>
    );
  }

  return (
    <div ref={lineRef} className="mb-2 text-[#e5e5e5]/50 whitespace-pre-wrap font-mono text-sm">
      {line.content}
    </div>
  );
}
