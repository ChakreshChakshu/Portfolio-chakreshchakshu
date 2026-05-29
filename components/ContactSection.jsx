'use client';

import { useState, useEffect } from 'react';
import gsap from 'gsap';

export function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Update current time in India (IST) dynamically
  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      setCurrentTime(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('chakreshchakshu@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    
    // Simulate premium transmission sequence
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Animate success checkmark with GSAP
      setTimeout(() => {
        const check = document.querySelector('.success-circle');
        const checkPath = document.querySelector('.success-check');
        if (check && checkPath) {
          gsap.fromTo(check, 
            { scale: 0, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
          );
          gsap.fromTo(checkPath,
            { strokeDasharray: 50, strokeDashoffset: 50 },
            { strokeDashoffset: 0, duration: 0.4, delay: 0.3, ease: 'power2.out' }
          );
        }
      }, 50);
    }, 1500);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitted(false);
  };

  return (
    <section id="contact" className="w-full relative bg-transparent py-16 flex flex-col justify-center items-center select-none">
      <style>{`
        .contact-glass-card {
          background: rgba(255, 255, 255, 0.015);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.7);
        }
        .glow-input {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .glow-input:focus {
          border-color: #fca311;
          background: rgba(252, 163, 17, 0.02);
          box-shadow: 0 0 20px rgba(252, 163, 17, 0.1);
        }
        .neon-pill {
          background: rgba(77, 214, 255, 0.04);
          border: 1px solid rgba(77, 214, 255, 0.15);
          box-shadow: 0 0 15px rgba(77, 214, 255, 0.05);
        }
        .social-pill {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }
        .social-pill:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-3px);
        }
      `}</style>

      {/* Floating Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#fca311]/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#4dd6ff]/5 blur-[120px] pointer-events-none z-0" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10 w-full">
        {/* Contact Glass Panel */}
        <div className="contact-glass-card rounded-[32px] p-8 lg:p-12 w-full flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Column: Form or Success */}
          <div className="flex-1 flex flex-col justify-center">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#fca311] block mb-2 font-bold">
                    [ CONNECTION TERMINAL ]
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white font-sans uppercase">
                    Initialize Contact
                  </h3>
                </div>

                {/* Name field */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono tracking-wider text-slate-400 uppercase font-semibold">
                    Identifier (Name)
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl text-white font-sans text-sm glow-input outline-none"
                  />
                </div>

                {/* Email field */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono tracking-wider text-slate-400 uppercase font-semibold">
                    Return Route (Email)
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl text-white font-sans text-sm glow-input outline-none"
                  />
                </div>

                {/* Message field */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono tracking-wider text-slate-400 uppercase font-semibold">
                    Transmission (Message)
                  </label>
                  <textarea 
                    rows="4"
                    required
                    placeholder="Type your message details here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl text-white font-sans text-sm glow-input outline-none resize-none"
                  />
                </div>

                {/* Submit button */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4.5 rounded-2xl text-black font-sans font-bold text-xs uppercase tracking-widest bg-[#fca311] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_15px_30px_rgba(252,163,17,0.15)] flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 14 14" className="shrink-0">
                        <path fill="#000" d="M13.5.5a.5.5 0 0 0-.62-.48l-12 3a.5.5 0 0 0-.07.93l4.5 1.8 1.8 4.5a.5.5 0 0 0 .93-.07l3-12A.5.5 0 0 0 13.5.5ZM5.28 7.66l-3.23-1.29 9.38-2.35-6.15 3.64Z" />
                      </svg>
                      <span>Transmit Message</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Transmission Success Panel */
              <div className="flex flex-col items-center justify-center text-center py-10 w-full gap-6">
                {/* Custom Pulsing Holographic Success Checkmark */}
                <div className="success-circle w-20 h-20 rounded-full bg-[#fca311]/10 border border-[#fca311]/30 flex items-center justify-center shadow-[0_0_30px_rgba(252,163,17,0.15)]">
                  <svg className="w-10 h-10 text-[#fca311]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path className="success-check" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#4dd6ff] block font-bold">
                    [ TRANSMISSION STATUS: 200 OK ]
                  </span>
                  <h3 className="text-3xl font-black tracking-tight uppercase text-white font-sans">
                    Message Dispatched
                  </h3>
                  <p className="text-sm text-slate-400 font-sans max-w-sm mx-auto mt-2 leading-relaxed">
                    Connection confirmed. Your transmission has been successfully routed and securely buffered. 
                  </p>
                </div>

                {/* Metadata details block */}
                <div className="w-full max-w-xs p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col gap-1.5 font-mono text-[10px] text-left text-slate-500">
                  <div><span className="text-slate-400">PAYLOAD:</span> ENCRYPTED_GCM</div>
                  <div><span className="text-slate-400">CHANNEL:</span> SECURE_PORT_443</div>
                  <div><span className="text-slate-400">TIMESTAMP:</span> {new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC</div>
                </div>

                <button 
                  onClick={resetForm}
                  className="px-6 py-3 rounded-full text-[#fca311] font-mono font-semibold text-[10px] uppercase tracking-widest border border-[#fca311]/20 bg-[#fca311]/5 hover:bg-[#fca311]/10 hover:border-[#fca311]/40 transition-all duration-300 cursor-pointer mt-2"
                >
                  Send Another Transmission
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Profile and Coordinates Card */}
          <div className="lg:w-[380px] flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/5 pt-12 lg:pt-0 lg:pl-16">
            
            {/* Header info */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 font-bold">
                  Active & Available
                </span>
              </div>

              <div>
                <h4 className="text-xl font-bold tracking-tight text-white font-sans uppercase">
                  Chakresh Chakshu
                </h4>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  Frontend Architect & Full-Stack Developer
                </p>
              </div>

              <p className="text-xs text-slate-400 font-sans leading-relaxed mt-2">
                Have a project idea, integration layout, optimization bottleneck, or just want to collaborate? Initialize the terminal or reach out directly.
              </p>
            </div>

            {/* Middle coordinates */}
            <div className="flex flex-col gap-6 my-10">
              {/* Interactive Email copy panel */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
                  Direct Line
                </span>
                <div 
                  onClick={handleCopyEmail}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300 cursor-pointer group"
                >
                  <span className="text-xs font-mono text-slate-300 select-all">
                    chakreshchakshu@gmail.com
                  </span>
                  <button className="text-[#fca311] hover:scale-110 transition-transform">
                    {copied ? (
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#4dd6ff] font-bold">Copied!</span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="group-hover:text-white transition-colors">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Dynamic Local Clock */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
                  Coordinates (IST)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-mono text-slate-300 font-semibold">
                    India (GMT+5:30)
                  </span>
                  <span className="text-[10px] font-mono text-[#fca311] tabular-nums tracking-wider">
                    {currentTime || '--:--:-- --'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom socials */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
                Digital Node Network
              </span>
              <div className="flex gap-2">
                <a 
                  href="https://github.com/chakreshchakshu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-pill px-4 py-2.5 rounded-full text-xs font-sans text-slate-400 hover:text-white flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 24 24" className="shrink-0">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" clipRule="evenodd" />
                  </svg>
                  <span>GitHub</span>
                </a>
                
                <a 
                  href="https://linkedin.com/in/chakreshchakshu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-pill px-4 py-2.5 rounded-full text-xs font-sans text-slate-400 hover:text-white flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 24 24" className="shrink-0">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
