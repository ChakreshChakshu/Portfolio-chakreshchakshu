'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { EncryptedText } from '@/components/ui/encrypted-text';

type TerminalLine = {
  id: string;
  type: 'command' | 'system' | 'json' | 'error' | 'success';
  content: string;
};

const INITIAL_HISTORY: TerminalLine[] = [
  { id: '1', type: 'system', content: 'Portfolio Terminal v2.0.1' },
  { id: '2', type: 'system', content: 'Type "help" to see available commands.' }
];

export function AboutSection() {
  const [history, setHistory] = useState<TerminalLine[]>(INITIAL_HISTORY);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom and check scrollability
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setIsScrollable(scrollRef.current.scrollHeight > scrollRef.current.clientHeight);
    }
  }, [history]);

  // Focus input on click anywhere in terminal
  const handleTerminalClick = () => {
    if (!isProcessing && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCommand = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || !input.trim() || isProcessing) return;

    const cmd = input.trim();
    setInput('');
    setIsProcessing(true);

    const newCmdLine: TerminalLine = { id: Date.now().toString(), type: 'command', content: cmd };
    setHistory((prev) => [...prev, newCmdLine]);

    // Parse command
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

    // Invalid command
    setTimeout(() => {
      setHistory((prev) => [
        ...prev,
        { id: Date.now().toString() + 'e', type: 'error', content: `command not found: ${cmd.split(' ')[0]}` }
      ]);
      setIsProcessing(false);
    }, 300);
  };

  const simulateApiFetch = async () => {
    // 1. Initializing
    await delay(300);
    appendHistory('system', '> Initializing request...');
    
    // 2. Connecting
    await delay(400);
    appendHistory('system', '> Connecting to API...');
    
    // 3. Fetching
    await delay(500);
    appendHistory('system', '> Fetching developer profile...');
    
    try {
      const res = await fetch('/api/about');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      
      await delay(400);
      appendHistory('system', '> Rendering response...');
      
      await delay(300);
      // Format JSON nicely
      const jsonString = JSON.stringify(data, null, 2);
      appendHistory('json', jsonString);
      
    } catch (error) {
      appendHistory('error', 'Error: Failed to connect to backend.');
    } finally {
      setIsProcessing(false);
    }
  };

  const appendHistory = (type: TerminalLine['type'], content: string) => {
    setHistory((prev) => [...prev, { id: Date.now().toString() + Math.random(), type, content }]);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <section id="about" className="w-full relative flex items-center p-4 md:p-12 min-h-[100dvh]">
      <div className="absolute inset-0 bg-background/50 backdrop-blur-3xl z-0 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 w-full md:w-3/5 lg:w-1/2 ml-auto rounded-2xl border border-border/50 bg-[#0a0a0a]/90 shadow-[0_0_80px_rgba(0,0,0,0.5)] backdrop-blur-xl overflow-hidden flex flex-col font-mono"
        style={{ height: '75vh', minHeight: '550px' }}
        onClick={handleTerminalClick}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.03]">
          <div className="flex gap-2 w-20">
            <div className="w-3.5 h-3.5 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
          </div>
          
          <div className="flex-1 text-center font-heading font-bold text-lg tracking-wide text-foreground">
            Get to know about me
          </div>

          <div className="w-20 text-right text-xs text-foreground/40 font-medium select-none">
            bash ~
          </div>
        </div>

        {/* Terminal Body */}
        <div 
          ref={scrollRef}
          {...(isScrollable ? { 'data-lenis-prevent': 'true' } : {})}
          onWheel={(e) => { if (isScrollable) e.stopPropagation(); }}
          className="flex-1 overflow-y-auto p-6 md:p-8 text-sm md:text-base leading-relaxed scroll-smooth custom-scrollbar"
        >
          {history.map((line) => (
            <AnimatedLine key={line.id} line={line} />
          ))}

          {/* Active Input Line */}
          <div className="flex items-center mt-2">
            <span className="text-green-400 mr-3 shrink-0">visitor@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              disabled={isProcessing}
              className="flex-1 bg-transparent border-none outline-none text-foreground caret-transparent font-mono text-base"
              spellCheck={false}
              autoComplete="off"
            />
            <span className="w-2.5 h-5 bg-foreground animate-pulse ml-1 inline-block shrink-0 -translate-x-[calc(100%+0.25rem)] pointer-events-none" 
                  style={{ transform: `translateX(-${(input.length - (inputRef.current?.selectionStart || input.length)) * 9}px)` }}>
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// Sub-component to handle GSAP line animation
function AnimatedLine({ line }: { line: TerminalLine }) {
  const lineRef = useRef<HTMLDivElement>(null);

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
      <div ref={lineRef} className="flex mb-3 text-foreground font-mono">
        <span className="text-green-400 mr-3">visitor@portfolio:~$</span>
        <span>{line.content}</span>
      </div>
    );
  }

  if (line.type === 'json') {
    return (
      <div ref={lineRef} className="mb-6 mt-3">
        <pre className="font-mono text-sm md:text-base whitespace-pre-wrap leading-relaxed">
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
      <div ref={lineRef} className="mb-3 text-red-400 font-mono">
        {line.content}
      </div>
    );
  }
  
  if (line.type === 'success') {
    return (
      <div ref={lineRef} className="mb-3 text-green-300 font-mono">
        {line.content}
      </div>
    );
  }

  return (
    <div ref={lineRef} className="mb-2 text-foreground/70 whitespace-pre-wrap font-mono">
      {line.content}
    </div>
  );
}
