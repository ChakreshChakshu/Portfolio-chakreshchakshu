"use client";

import { cn } from '@/lib/utils';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { heroData } from '@/data/hero';

export const MinimalistHero = ({
  className,
}) => {
  const {
    imageSrc,
    imageAlt,
    socialLinks,
    locationText,
  } = heroData;

  return (
    <div
      id="home"
      className={cn(
        'relative flex h-full w-full flex-col items-center justify-between bg-transparent p-8 font-sans md:p-12',
        className
      )}
    >
      <BackgroundBeams className="absolute inset-0 z-0" />

      <div className="relative grid w-full flex-grow grid-cols-1 items-center md:grid-cols-2 gap-8 lg:gap-12 z-10">
        
        {/* Left side: Empty / removed content */}
        <div className="order-2 md:order-1" />

        {/* Right side: Premium Avatar Picture + Floating Social Icons */}
        <div className="relative order-1 md:order-2 flex justify-center items-center h-full min-h-[400px] py-12 md:py-0">
          <div className="relative w-full max-w-[350px] md:max-w-[450px] lg:max-w-[550px] aspect-square overflow-visible shrink-0 mt-2 md:mt-0">
            <div
              className="absolute inset-0 rounded-full bg-[#fca311] shadow-xl overflow-hidden border-2 border-[#fca311] flex justify-center items-end"
            >
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="relative z-10 h-auto w-[80%] max-w-none object-cover origin-bottom scale-120"
                  onError={(e) => {
                    const target = e.target;
                    target.onerror = null;
                    target.src = `https://placehold.co/400x600/eab308/ffffff?text=Image+Not+Found`;
                  }}
                />
              )}
            </div>

            {imageSrc && (
              <div
                className="absolute inset-0 flex justify-center items-end pointer-events-none"
                style={{ clipPath: "inset(-500% -500% 50% -500%)" }}
              >
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="relative z-20 h-auto w-[80%] max-w-none object-cover origin-bottom scale-120 drop-shadow-2xl"
                />
              </div>
            )}
            
            {socialLinks.map((link, index) => {
              const total = socialLinks.length;
              const startAngle = 45;
              const endAngle = 135;
              const angle = startAngle + (index * (endAngle - startAngle)) / (total - 1);
              
              return (
                <div
                  key={index}
                  className="absolute z-30 flex items-center justify-center transition-all duration-500"
                  style={{
                    left: `${50 + Math.cos((angle * Math.PI) / 180) * 48}%`,
                    top: `${50 + Math.sin((angle * Math.PI) / 180) * 48}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="group relative">
                    <div className="absolute -inset-2 rounded-full bg-[#fca311]/20 opacity-0 blur transition-opacity group-hover:opacity-100" />
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#fca311]/30 bg-[#14213d]/80 text-[#e5e5e5] shadow-sm backdrop-blur-md transition-all hover:border-[#fca311] hover:text-[#fca311] hover:scale-110"
                    >
                      <link.icon className="h-5 w-5" weight="fill" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <footer className="absolute bottom-8 left-8 right-8 z-30 flex items-center justify-between md:bottom-12 md:left-12 md:right-12">
        <div />
        <div
          className="text-sm font-medium text-foreground/80 font-mono"
        >
          {locationText}
        </div>
      </footer>
    </div>
  );
};
