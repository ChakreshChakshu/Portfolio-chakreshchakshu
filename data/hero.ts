import { Icon, GithubLogo, LinkedinLogo, TwitterLogo, Envelope } from '@phosphor-icons/react';

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
    part1: "Frontend Engineer",
    part2: "with full stack expertise",
  },
  socialLinks: [
    { icon: GithubLogo, href: "https://github.com/chakresh" },
    { icon: LinkedinLogo, href: "https://linkedin.com/in/chakresh" },
    { icon: TwitterLogo, href: "https://twitter.com/chakresh" },
    { icon: Envelope, href: "mailto:hello@chakresh.com" },
  ],
  locationText: "Based in India",
};
