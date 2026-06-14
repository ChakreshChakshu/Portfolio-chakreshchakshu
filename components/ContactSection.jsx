'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "motion/react";

export function ContactSection() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', message: '' });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setIsSubmitting(false);

      if (response.ok && result.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          const check = document.querySelector('.success-circle');
          const checkPath = document.querySelector('.success-check');
          if (check && checkPath) {
            gsap.fromTo(check, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' });
            gsap.fromTo(checkPath, { strokeDasharray: 50, strokeDashoffset: 50 }, { strokeDashoffset: 0, duration: 0.4, delay: 0.3, ease: 'power2.out' });
          }
        }, 50);
      } else {
        alert(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setIsSubmitting(false);
      alert('Network error. Please try again later.');
    }
  };

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', email: '', message: '' });
    setIsSubmitted(false);
  };

  return (
    <section
      id="contact"
      className="w-full relative bg-background overflow-hidden select-none group"
    >
      {/* Volumetric White Spotlight effect from section top left to form */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18)_0%,transparent_70%)] blur-[70px] pointer-events-none select-none hidden lg:block z-0" />
      <div className="absolute top-0 left-0 w-[950px] h-[350px] bg-gradient-to-r from-white/[0.12] via-white/[0.03] to-transparent origin-top-left rotate-[28deg] blur-[35px] pointer-events-none select-none hidden lg:block z-0 transition-all duration-1000 ease-out group-hover:rotate-[30deg] group-hover:from-white/[0.16]" />
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
          border-bottom-color: var(--accent);
        }
        #contact .field-line:focus::placeholder {
          color: rgba(255, 49, 46, 0.3);
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
          box-shadow: 0 12px 40px rgba(255, 49, 46, 0.25);
        }
        #contact .email-row {
          transition: all 0.25s ease;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        #contact .email-row:hover {
          border-bottom-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>


      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 pt-8 pb-12">

        {/* Top label row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="w-5 h-px bg-white/20" />
            <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-white/35 font-bold">
              Contact
            </span>
          </div>
        </div>

        {/* Giant heading */}
        <div ref={headingRef} className="mb-2">
          <h2 className="text-[clamp(3.5rem,10vw,8.5rem)] font-black tracking-[-0.03em] leading-[0.9] text-white uppercase font-heading">
            Let&apos;s Build
          </h2>
          <h2 className="text-[clamp(3.5rem,10vw,8.5rem)] font-black tracking-[-0.03em] leading-[0.9] uppercase font-heading"
            style={{ color: 'var(--accent)', WebkitTextStroke: '0px', textShadow: '0 0 80px rgba(255,49,46,0.15)' }}
          >
            Together
          </h2>
        </div>

        {/* Horizontal rule */}
        <div className="w-full h-px bg-white/8 mt-6 mb-8" />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 lg:gap-20">

          {/* LEFT: Form */}
          <div className="relative group">
            {!isSubmitted ? (
              <form className="my-8 flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <LabelInputContainer>
                    <Label htmlFor="firstname" className="text-[10px] font-mono tracking-[0.2em] text-slate-400 font-bold uppercase">First name</Label>
                    <Input
                      id="firstname"
                      placeholder="Tyler"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="lastname" className="text-[10px] font-mono tracking-[0.2em] text-slate-400 font-bold uppercase">Last name</Label>
                    <Input
                      id="lastname"
                      placeholder="Durden"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </LabelInputContainer>
                </div>
                <LabelInputContainer>
                  <Label htmlFor="email" className="text-[10px] font-mono tracking-[0.2em] text-slate-400 font-bold uppercase">Email Address</Label>
                  <Input
                    id="email"
                    placeholder="projectmayhem@fc.com"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="message" className="text-[10px] font-mono tracking-[0.2em] text-slate-400 font-bold uppercase">Your Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project, idea, or collaboration..."
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </LabelInputContainer>

                <div className="flex items-center gap-6 pt-4">
                  <button
                    className="group/btn relative block h-12 w-full max-w-xs rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Send Message &rarr;
                      </span>
                    )}
                    <BottomGradient />
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
                  style={{ background: 'rgba(255,49,46,0.08)', border: '1px solid rgba(255,49,46,0.25)' }}>
                  <svg className="w-8 h-8" fill="none" stroke="var(--accent)" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path className="success-check" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <span className="text-[9px] font-mono tracking-[0.35em] uppercase font-bold block mb-3" style={{ color: 'var(--accent)' }}>
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


            {/* Avatar image standing with support of the form */}
            <div className="absolute bottom-[-10px] -left-[200px] w-[360px] h-[360px] pointer-events-none select-none hidden lg:block z-20">
              <img
                src="/images/character-Photoroom.png"
                alt="Developer Avatar"
                className="w-full h-full object-contain filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.6)]"
              />
            </div>
          </div>

          {/* RIGHT: Info panel */}
          <div className="flex flex-col justify-between gap-10 border-t lg:border-t-0 lg:border-l border-white/[0.06] pt-10 lg:pt-0 lg:pl-14">

            {/* Description */}
            <div className="flex flex-col gap-5">
              <p className="text-base text-slate-400 font-sans leading-relaxed font-medium">
                Have a project idea, want to collaborate, or just want to talk tech? I&apos;m open to freelance work, full-time roles, and interesting conversations.
              </p>
 
              {/* Email row */}
              <div
                onClick={handleCopyEmail}
                className="email-row flex items-center justify-between py-4 cursor-pointer group"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-mono tracking-[0.35em] uppercase text-slate-500 font-bold">
                    Email
                  </span>
                  <span className="text-sm font-mono text-white/90 group-hover:text-white transition-colors font-medium">
                    {process.env.NEXT_PUBLIC_EMAIL || "chakreshchakshu@gmail.com"}
                  </span>
                </div>
                <div className="text-white/30 group-hover:text-white/70 transition-colors">
                  {copied ? (
                    <span className="text-[9px] font-mono uppercase tracking-widest font-bold" style={{ color: 'var(--accent)' }}>
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
                  <span className="text-[9px] font-mono tracking-[0.35em] uppercase text-slate-500 font-bold">
                    Location
                  </span>
                  <span className="text-sm font-sans text-white/80 font-medium">
                    India — GMT +5:30
                  </span>
                </div>
                <span className="text-xs font-mono tabular-nums tracking-widest font-semibold" style={{ color: 'var(--accent)', opacity: 0.8 }}>
                  {currentTime || '--:--:--'}
                </span>
              </div>
            </div>
 
            {/* Socials */}
            <div className="flex flex-col gap-4">
              <span className="text-[9px] font-mono tracking-[0.35em] uppercase text-slate-500 font-bold">
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

            {/* Copyright */}
            <div className="pt-8 border-t border-white/[0.06] text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-8">
              &copy; {new Date().getFullYear()} Chakresh Chakshu. All rights reserved.
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  const radius = 100;
  const [visible, setVisible] = React.useState(false);

  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <motion.div
      style={{
        background: useMotionTemplate`
      radial-gradient(
        ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
        #3b82f6,
        transparent 80%
      )
    `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="group/input rounded-lg p-[2px] transition duration-300"
    >
      <textarea
        className={cn(
          `shadow-input dark:placeholder-text-neutral-600 flex w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black transition duration-400 group-hover/input:shadow-none placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-neutral-600 resize-none min-h-[100px]`,
          className,
        )}
        ref={ref}
        {...props}
      />
    </motion.div>
  );
});
Textarea.displayName = "Textarea";
