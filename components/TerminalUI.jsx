"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ArrowClockwise, Terminal as TermIcon, Cpu } from '@phosphor-icons/react';

export function TerminalUI() {
  const [loading, setLoading] = useState(false);
  const [aboutData, setAboutData] = useState(null);
  const [error, setError] = useState(null);
  const [terminalHistory, setTerminalHistory] = useState([
    { text: "ChakshuOS v1.0.4 - System Environment Booted.", type: "system" },
    { text: "Type 'help' to review available console commands.", type: "prompt" }
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const scrollContainerRef = useRef(null);
  const inputRef = useRef(null);
  const touchStartRef = useRef(0);

  // Dynamic Scroll Boundary Handler: Passes scrolling to ScrollStack once boundary is reached
  const handleTerminalWheel = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
    const isAtTop = scrollTop <= 0;

    if (e.deltaY > 0 && isAtBottom) return; // Scroll down bubbles up at bottom
    if (e.deltaY < 0 && isAtTop) return;    // Scroll up bubbles up at top
    e.stopPropagation();                     // Rest remains local
  };

  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const touchY = e.touches[0].clientY;
    const deltaY = touchStartRef.current - touchY; // Swipe up (scroll down) is positive

    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
    const isAtTop = scrollTop <= 0;

    if (deltaY > 0 && isAtBottom) return; // Bubble touch swipe up at bottom
    if (deltaY < 0 && isAtTop) return;    // Bubble touch swipe down at top
    e.stopPropagation();                  // Rest remains local
  };

  // Core API fetch routine
  const fetchAboutData = async (isRequery = false) => {
    setLoading(true);
    setError(null);
    
    // Build baseline terminal logs
    const initialLogs = isRequery ? [
      { text: "user@chakresh:~$ curl -X GET /api/about", type: "user" },
      { text: "Re-initiating HTTP request connection...", type: "system" }
    ] : [
      { text: "ChakshuOS v1.0.4 - System Environment Booting...", type: "system" },
      { text: "user@chakresh:~$ curl -X GET /api/about", type: "user" },
      { text: "Establishing connection to local host [127.0.0.1:3000]...", type: "system" }
    ];

    setTerminalHistory(initialLogs);

    try {
      // Simulate real-world low latency/network buffer for cinematic animation
      await new Promise(resolve => setTimeout(resolve, 800));

      const res = await fetch('/api/about');
      if (!res.ok) throw new Error(`HTTP Error Status: ${res.status}`);
      const data = await res.json();
      
      setAboutData(data);
      setLoading(false);

      // Append success logs
      setTerminalHistory(prev => [
        ...prev,
        { text: `HTTP/1.1 200 OK - Handshake Established`, type: "success" },
        { text: `Response Size: ${JSON.stringify(data).length} bytes | Latency: ${data.meta.responseTime}`, type: "system" },
        { text: `------------------------------------------------`, type: "prompt" },
        { text: `System Hydration Complete:`, type: "success" },
        { text: `  Name:       ${data.profile.name}`, type: "success" },
        { text: `  Role:       ${data.profile.role}`, type: "text" },
        { text: `  Location:   ${data.profile.location}`, type: "text" },
        { text: `  Experience: ${data.profile.experience}`, type: "text" },
        { text: `  Core Stack: ${data.tech_stack.core.join(', ')}`, type: "success" },
        { text: `  Availability: ${data.profile.availability}`, type: "system" },
        { text: `------------------------------------------------`, type: "prompt" },
        { text: "Type 'help' to review advanced commands, or 'json' to print raw API payload.", type: "prompt" }
      ]);

    } catch (err) {
      setError(err.message);
      setLoading(false);
      setTerminalHistory(prev => [
        ...prev,
        { text: `[fail] HTTP REQUEST FAILD: ${err.message}`, type: "error" },
        { text: "Please try again by typing 'curl' or clicking the reload button.", type: "prompt" }
      ]);
    }
  };


  // Scroll terminal logs to bottom on update
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [terminalHistory]);

  // Terminal input interpreter
  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...terminalHistory, { text: `user@chakresh:~$ ${terminalInput}`, type: "user" }];
    
    switch (cmd) {
      case 'help':
        newHistory.push(
          { text: "Available bash utility commands:", type: "system" },
          { text: "  cat     - Print narrative paragraphs returned by /api/about.", type: "command" },
          { text: "  json    - Output raw colorized API JSON payload.", type: "command" },
          { text: "  curl    - Re-issue a GET request to /api/about route.", type: "command" },
          { text: "  clear   - Clear active console buffer records.", type: "command" }
        );
        break;
      case 'cat':
        if (aboutData?.narrative?.paragraphs) {
          newHistory.push({ text: `READING NARRATIVE BIO: "${aboutData.narrative.headline}"`, type: "system" });
          aboutData.narrative.paragraphs.forEach((paragraph, idx) => {
            newHistory.push({ text: `[Paragraph ${idx + 1}]: ${paragraph}`, type: "text" });
          });
        } else {
          newHistory.push({ text: "Error: No data available. Type 'curl' to fetch.", type: "error" });
        }
        break;
      case 'json':
        if (aboutData) {
          newHistory.push(
            { text: "API RAW JSON INSTANCE:", type: "system" },
            { text: JSON.stringify(aboutData, null, 2), type: "success" }
          );
        } else {
          newHistory.push({ text: "Error: No data loaded yet. Type 'curl' to query.", type: "error" });
        }
        break;
      case 'curl':
        fetchAboutData(true);
        setTerminalInput("");
        return;
      case 'clear':
        setTerminalHistory([]);
        setTerminalInput("");
        return;
      default:
        newHistory.push({ text: `bash: command not found: '${cmd}'. Type 'help' for options.`, type: "error" });
    }

    setTerminalHistory(newHistory);
    setTerminalInput("");
  };

  const focusTerminalInput = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="flex flex-col w-full h-full min-h-[420px] rounded-xl border border-[#fca311]/25 bg-[#07090e]/95 shadow-2xl backdrop-blur-md overflow-hidden relative group/term">
      
      {/* Symmetrical Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0b0f19] border-b border-[#fca311]/15 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-[#fca311]/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-[10px] font-mono tracking-widest text-[#e5e5e5]/40 uppercase flex items-center gap-1.5">
          <TermIcon size={12} className="text-[#fca311]" /> API: /api/about
        </span>
        <button
          onClick={() => fetchAboutData(true)}
          disabled={loading}
          className="text-gray-500 hover:text-[#fca311] active:scale-95 transition-colors disabled:opacity-30 cursor-pointer"
          title="Re-query API Endpoint"
        >
          <ArrowClockwise size={13} className={cn(loading && "animate-spin")} />
        </button>
      </div>
      
      {/* Terminal Content Shell */}
      <div 
        ref={scrollContainerRef}
        onClick={focusTerminalInput}
        onWheel={handleTerminalWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className="flex-grow p-5 overflow-y-auto font-mono text-xs md:text-sm space-y-2 cursor-text select-text scrollbar-thin scrollbar-thumb-[#fca311]/20"
      >
        {terminalHistory.map((item, idx) => (
          <div 
            key={idx} 
            className={cn(
              "leading-relaxed whitespace-pre-wrap",
              item.type === "system" && "text-blue-400/90",
              item.type === "prompt" && "text-[#e5e5e5]/40",
              item.type === "user" && "text-white font-semibold",
              item.type === "command" && "text-[#fca311] font-bold pl-4",
              item.type === "success" && "text-green-400 font-bold",
              item.type === "error" && "text-red-400 font-medium",
              item.type === "text" && "text-[#e5e5e5]/80 pl-4"
            )}
          >
            {item.text}
          </div>
        ))}
        
        {loading ? (
          <div className="flex items-center gap-2 text-blue-400 animate-pulse font-mono text-xs pt-1">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            Querying `/api/about`...
          </div>
        ) : (
          /* Symmetrical Inline Terminal Command Prompt Input */
          <form 
            onSubmit={handleTerminalSubmit}
            className="flex items-center pt-1"
          >
            <span className="text-[#fca311] font-mono font-bold mr-2 text-xs md:text-sm shrink-0 select-none">
              user@chakresh:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="Type 'help'..."
              className="flex-grow bg-transparent border-none outline-none focus:ring-0 text-white font-mono text-xs md:text-sm p-0 placeholder-[#e5e5e5]/20 select-text"
              autoComplete="off"
            />
          </form>
        )}
      </div>
    </div>
  );
}
