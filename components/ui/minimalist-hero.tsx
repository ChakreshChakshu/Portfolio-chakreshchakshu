"use client";

import { motion } from 'framer-motion';
import { Icon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { FloatingPaths } from '@/components/ui/background-paths';
import { heroData } from '@/data/hero';
import TrueFocus from './TrueFocus';

const SocialIcon = ({ href, icon: IconComponent }: { href: string; icon: Icon }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-foreground/60 transition-colors hover:text-foreground">
    <IconComponent className="h-5 w-5" weight="fill" />
  </a>
);

export const MinimalistHero = ({
  className,
}: { className?: string }) => {
  const {
    mainText,
    readMoreLink,
    imageSrc,
    imageAlt,
    overlayText,
    socialLinks,
    locationText,
  } = heroData;

  return (
    <div
      id="home"
      className={cn(
        'relative flex h-full w-full flex-col items-center justify-between bg-background p-8 font-sans md:p-12',
        className
      )}
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative grid w-full flex-grow grid-cols-1 items-center md:grid-cols-2 gap-8 lg:gap-12">
        {/* Removed right-side content per user request */}

        <div className="relative order-1 md:order-2 flex justify-center items-center h-full min-h-[400px] py-12 md:py-0">
          <div className="relative w-full max-w-[280px] md:max-w-[350px] lg:max-w-[450px] aspect-square shrink-0 mt-8 md:mt-0">
            {/* Back half: Circle container with overflow hidden */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="absolute inset-0 rounded-full bg-yellow-400/90 shadow-xl overflow-hidden flex justify-center items-end"
            >
              {imageSrc && (
                <motion.img
                  src={imageSrc}
                  alt={imageAlt}
                  className="relative z-10 h-auto w-[110%] max-w-none object-cover origin-bottom scale-110"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `https://placehold.co/400x600/eab308/ffffff?text=Image+Not+Found`;
                  }}
                />
              )}
            </motion.div>

            {/* Front half: Popping out top with clip-path */}
            {imageSrc && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="absolute inset-0 flex justify-center items-end pointer-events-none"
                style={{ clipPath: "inset(-500% -500% 50% -500%)" }}
              >
                <motion.img
                  src={imageSrc}
                  alt={imageAlt}
                  className="relative z-20 h-auto w-[110%] max-w-none object-cover origin-bottom scale-110 drop-shadow-2xl"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                />
              </motion.div>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="z-20 order-2 md:order-1 flex flex-col items-start justify-start text-left self-start pt-8 md:pt-16 lg:pt-24"
        >
          <h1 className="text-3xl font-heading font-bold text-foreground md:text-4xl lg:text-5xl xl:text-6xl">
            <TrueFocus
              sentence={`${overlayText.part1} ${overlayText.part2}`}
              manualMode={false}
              blurAmount={5}
              borderColor="hsl(var(--primary))"
              glowColor="hsl(var(--primary) / 0.5)"
              animationDuration={0.3}
              pauseBetweenAnimations={0.2}
            />
          </h1>
          <div className="mt-8 w-full max-w-xl rounded-xl border border-border/40 bg-card/40 p-4 backdrop-blur-sm shadow-lg">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-destructive/80"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
              <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
            </div>
            <p className="font-mono text-sm leading-relaxed text-foreground/80 md:text-base">
              <span className="text-primary font-bold mr-2">~</span>
              {mainText}
            </p>
          </div>
        </motion.div>
      </div>

      <footer className="z-30 flex w-full items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex items-center space-x-4"
        >
          {socialLinks.map((link, index) => (
            <SocialIcon key={index} href={link.href} icon={link.icon} />
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.3 }}
          className="text-sm font-medium text-foreground/80"
        >
          {locationText}
        </motion.div>
      </footer>
    </div>
  );
};
