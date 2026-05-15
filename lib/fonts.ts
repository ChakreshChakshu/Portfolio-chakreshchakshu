import { Inter, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const generalSans = localFont({
  src: '../public/fonts/GeneralSans-Variable.woff2',
  display: 'swap',
  variable: '--font-heading',
});
