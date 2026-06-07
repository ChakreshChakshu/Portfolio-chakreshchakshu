'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

export function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const headingRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setCurrentTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(process.env.NEXT_PUBLIC_EMAIL || 'chakreshchakshu@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        const check = document.querySelector('.success-circle');
        const checkPath = document.querySelector('.success-check');
        if (check && checkPath) {
          gsap.fromTo(check, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' });
          gsap.fromTo(checkPath, { strokeDasharray: 50, strokeDashoffset: 50 }, { strokeDashoffset: 0, duration: 0.4, delay: 0.3, ease: 'power2.out' });
        }
      }, 50);
    }, 1500);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitted(false);
  };

  return (
    <section
      id="contact"
      className="w-full relative bg-background overflow-hidden select-none"
    >
      <style>{`
        #contact .field-line {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0;
          color: #fff;
          font-size: 0.9rem;
          padding: 14px 0;
          outline: none;
          width: 100%;
          transition: border-color 0.3s ease;
          font-family: inherit;
        }
        #contact .field-line::placeholder {
          color: rgba(255,255,255,0.2);
          font-size: 0.85rem;
        }
        #contact .field-line:focus {
          border-bottom-color: #D5FF37;
        }
        #contact .field-line:focus::placeholder {
          color: rgba(213, 255, 55, 0.3);
        }
        #contact textarea.field-line {
          resize: none;
          min-height: 100px;
        }
        #contact .social-link {
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.25s ease;
        }
        #contact .social-link:hover {
          border-color: rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.04);
          transform: translateY(-2px);
        }
        #contact .submit-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        #contact .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.15);
          transform: translateX(-101%);
          transition: transform 0.4s ease;
        }
        #contact .submit-btn:hover::before {
          transform: translateX(0);
        }
        #contact .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(213, 255, 55, 0.25);
        }
        #contact .email-row {
          transition: all 0.25s ease;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        #contact .email-row:hover {
          border-bottom-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>

      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 pt-20 pb-24">

        {/* Top label row */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <span className="w-5 h-px bg-white/20" />
            <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-white/35 font-bold">
              Contact
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-400 font-bold">
              Available
            </span>
          </div>
        </div>

        {/* Giant heading */}
        <div ref={headingRef} className="mb-2">
          <h2 className="text-[clamp(3.5rem,10vw,8.5rem)] font-black tracking-[-0.03em] leading-[0.9] text-white uppercase font-sans">
            Let&apos;s Build
          </h2>
          <h2 className="text-[clamp(3.5rem,10vw,8.5rem)] font-black tracking-[-0.03em] leading-[0.9] uppercase font-sans"
            style={{ color: '#D5FF37', WebkitTextStroke: '0px', textShadow: '0 0 80px rgba(213,255,55,0.15)' }}
          >
            Together
          </h2>
        </div>

        {/* Horizontal rule */}
        <div className="w-full h-px bg-white/8 mt-12 mb-14" />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 lg:gap-20">

          {/* LEFT: Form */}
          <div>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-mono tracking-[0.35em] uppercase text-white/30 font-bold">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="field-line"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-mono tracking-[0.35em] uppercase text-white/30 font-bold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="field-line"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-mono tracking-[0.35em] uppercase text-white/30 font-bold">
                    Your Message
                  </label>
                  <textarea
                    required
                    placeholder="Tell me about your project, idea, or collaboration..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="field-line"
                    rows={4}
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="submit-btn px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest text-black font-sans cursor-pointer flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#D5FF37' }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-black shrink-0" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 14 14" className="shrink-0">
                          <path fill="#000" d="M13.5.5a.5.5 0 0 0-.62-.48l-12 3a.5.5 0 0 0-.07.93l4.5 1.8 1.8 4.5a.5.5 0 0 0 .93-.07l3-12A.5.5 0 0 0 13.5.5ZM5.28 7.66l-3.23-1.29 9.38-2.35-6.15 3.64Z" />
                        </svg>
                      </>
                    )}
                  </button>
                  <span className="text-[10px] font-mono text-white/20 tracking-wider hidden sm:block">
                    Usually respond within 24h
                  </span>
                </div>
              </form>
            ) : (
              /* Success state */
              <div className="flex flex-col gap-8 py-4">
                <div className="success-circle w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(213,255,55,0.08)', border: '1px solid rgba(213,255,55,0.25)' }}>
                  <svg className="w-8 h-8" fill="none" stroke="#D5FF37" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path className="success-check" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <span className="text-[9px] font-mono tracking-[0.35em] uppercase font-bold block mb-3" style={{ color: '#D5FF37' }}>
                    Message sent
                  </span>
                  <h3 className="text-4xl font-black tracking-tight uppercase text-white font-sans leading-tight">
                    Got it.<br />I&apos;ll be in touch.
                  </h3>
                  <p className="text-sm text-slate-400 font-sans mt-4 leading-relaxed max-w-sm">
                    Your message is received. Expect a reply within 24 hours.
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="self-start px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-widest text-white/60 border border-white/10 hover:border-white/25 hover:text-white transition-all duration-300 cursor-pointer"
                >
                  Send another
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Info panel */}
          <div className="flex flex-col justify-between gap-10 border-t lg:border-t-0 lg:border-l border-white/[0.06] pt-10 lg:pt-0 lg:pl-14">

            {/* Description */}
            <div className="flex flex-col gap-5">
              <p className="text-base text-slate-400 font-sans leading-relaxed">
                Have a project idea, want to collaborate, or just want to talk tech? I&apos;m open to freelance work, full-time roles, and interesting conversations.
              </p>

              {/* Email row */}
              <div
                onClick={handleCopyEmail}
                className="email-row flex items-center justify-between py-4 cursor-pointer group"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-mono tracking-[0.35em] uppercase text-white/25 font-bold">
                    Email
                  </span>
                  <span className="text-sm font-mono text-white/80 group-hover:text-white transition-colors">
                    {process.env.NEXT_PUBLIC_EMAIL || "chakreshchakshu@gmail.com"}
                  </span>
                </div>
                <div className="text-white/30 group-hover:text-white/70 transition-colors">
                  {copied ? (
                    <span className="text-[9px] font-mono uppercase tracking-widest font-bold" style={{ color: '#D5FF37' }}>
                      Copied!
                    </span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Location + time */}
              <div className="flex items-center justify-between py-3 border-t border-white/[0.06]">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-mono tracking-[0.35em] uppercase text-white/25 font-bold">
                    Location
                  </span>
                  <span className="text-sm font-sans text-white/70">
                    India — GMT +5:30
                  </span>
                </div>
                <span className="text-xs font-mono tabular-nums tracking-wider" style={{ color: '#D5FF37', opacity: 0.8 }}>
                  {currentTime || '--:--:--'}
                </span>
              </div>
            </div>

            {/* Socials */}
            <div className="flex flex-col gap-4">
              <span className="text-[9px] font-mono tracking-[0.35em] uppercase text-white/25 font-bold">
                Find me on
              </span>
              <div className="flex gap-3">
                <a
                  href={process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/chakreshchakshu"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link flex items-center gap-2.5 px-5 py-3 rounded-full text-xs font-sans text-slate-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 24 24" className="shrink-0">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" clipRule="evenodd" />
                  </svg>
                  <span>GitHub</span>
                </a>
                <a
                  href={process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/in/chakreshchakshu"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link flex items-center gap-2.5 px-5 py-3 rounded-full text-xs font-sans text-slate-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 24 24" className="shrink-0">
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
