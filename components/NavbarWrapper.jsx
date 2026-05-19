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
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Skills', href: '/skills' },
        { label: 'Projects', href: '/projects' },
        { label: 'Contact', href: '/contact' }
      ]}
      activeHref={pathname}
      className="custom-nav"
      ease="power2.easeOut"
      baseColor="#000000"
      hoverBgColor="#e5e5e5"
      pillColor="#14213d"
      hoveredPillTextColor="#000000"
      pillTextColor="#ffffff"
      initialLoadAnimation={false}
    />
  );
}
