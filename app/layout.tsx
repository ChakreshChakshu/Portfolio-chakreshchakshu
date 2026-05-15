import type { Metadata } from "next";
import { inter, generalSans, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";
import NavbarWrapper from "../components/NavbarWrapper";

export const metadata: Metadata = {
  title: "Chakresh Chakshu | Frontend Engineer",
  description: "Crafting modern web experiences with clean code and smooth interactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${generalSans.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <NavbarWrapper />
        <main className="grow pt-24">{children}</main>
      </body>
    </html>
  );
}
