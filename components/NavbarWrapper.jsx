"use client";

import { usePathname } from 'next/navigation';
import PillNav from './NavBar';

export default function NavbarWrapper() {
  const pathname = usePathname();

  return (
    <PillNav
      logo="/next.svg"
      logoAlt="Company Logo"
      items={[
        { label: 'Home', href: '#home' },
        { label: 'About', href: '#about' },
        { label: 'Projects', href: '#projects' },
        { label: 'Contact', href: '#contact' }
      ]}
      activeHref={pathname}
      className="custom-nav"
      ease="power2.easeOut"
      baseColor="#0c1e2b"
      hoverBgColor="#f1f4f5"
      pillColor="#132e43"
      hoveredPillTextColor="#0c1e2b"
      pillTextColor="#f1f4f5"
      theme="dark"
      initialLoadAnimation={false}
    />
  );
}
