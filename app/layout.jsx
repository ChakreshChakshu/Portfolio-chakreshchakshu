import { plusJakartaSans, outfit, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";
import NavbarWrapper from "../components/NavbarWrapper";

export const metadata = {
  metadataBase: new URL("https://chakreshchakshu.github.io"),
  title: {
    default: "Chakresh Chakshu | Frontend Focused Full Stack Developer",
    template: "%s | Chakresh Chakshu",
  },
  description: "Portfolio of Chakresh Chakshu, a Frontend Focused Full Stack Developer specializing in crafting interactive, high-performance web experiences with clean code and smooth animations.",
  keywords: [
    "Chakresh Chakshu",
    "Frontend Focused Full Stack Developer",
    "Full Stack Developer",
    "Creative Developer",
    "React Developer",
    "Next.js Portfolio",
    "JavaScript Developer",
    "UI/UX Designer",
    "Web Developer"
  ],
  authors: [{ name: "Chakresh Chakshu" }],
  creator: "Chakresh Chakshu",
  openGraph: {
    title: "Chakresh Chakshu | Frontend Focused Full Stack Developer",
    description: "Crafting modern web experiences with clean code and smooth animations.",
    url: "https://chakreshchakshu.github.io",
    siteName: "Chakresh Chakshu Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/chakresh.png",
        width: 1200,
        height: 630,
        alt: "Chakresh Chakshu Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chakresh Chakshu | Frontend Focused Full Stack Developer",
    description: "Crafting modern web experiences with clean code and smooth animations.",
    images: ["/images/chakresh.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Chakresh Chakshu",
    "url": "https://chakreshchakshu.github.io",
    "image": "https://chakreshchakshu.github.io/images/chakresh.png",
    "jobTitle": "Frontend Focused Full Stack Developer",
    "sameAs": [
      process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/chakreshchakshu",
      process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/in/chakreshchakshu"
    ],
    "email": process.env.NEXT_PUBLIC_EMAIL || "chakshuchakresh@gmail.com",
    "description": "Portfolio of Chakresh Chakshu, a Frontend Focused Full Stack Developer specializing in crafting interactive, high-performance web experiences."
  };

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${outfit.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NavbarWrapper />
        <main className="grow">{children}</main>
      </body>
    </html>
  );
}
