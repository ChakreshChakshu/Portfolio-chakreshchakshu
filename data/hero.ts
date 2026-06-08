import { Icon, GithubLogo, LinkedinLogo, Envelope } from '@phosphor-icons/react';

export const heroData: {
  mainText: string;
  readMoreLink: string;
  imageSrc: string;
  imageAlt: string;
  overlayText: { part1: string; part2: string };
  socialLinks: { icon: Icon; href: string }[];
  locationText: string;
} = {
  mainText: "Crafting modern web experiences that combine clean engineering, fluid interactions, thoughtful motion, and visually polished user interfaces.",
  readMoreLink: "/about",
  imageSrc: "/images/chakresh.png",
  imageAlt: "Chakresh Chakshu Portfolio Image",
  overlayText: {
    part1: "Frontend Focused",
    part2: "Full Stack Developer",
  },
  socialLinks: [
    { icon: GithubLogo, href: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/chakreshchakshu" },
    { icon: LinkedinLogo, href: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/in/chakreshchakshu" },
    { icon: Envelope, href: `mailto:${process.env.NEXT_PUBLIC_EMAIL || "[EMAIL_ADDRESS]"}` },
  ],
  locationText: "Based in India",
};
