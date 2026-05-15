# Chakresh Chakshu - Portfolio Overview

This project is a premium, high-performance portfolio website built with Next.js 15+, React 19, and Tailwind CSS 4. It focuses on rich aesthetics, smooth animations (Framer Motion & GSAP), and a data-driven content architecture.

## 🛠 Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS 4, Radix UI
- **Animations**: Framer Motion, GSAP
- **Icons**: Lucide React
- **Type Safety**: TypeScript

## 🚀 Core Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Run production build
- `npm run lint`: Run ESLint checks

## 📂 Project Structure
- `app/`: Next.js App Router directory (Routes: Home, About, Projects, Contact).
- `components/`:
  - `ui/`: Reusable primitive components (shadcn-inspired, but customized).
  - `NavBar.jsx`: Complex interactive navigation component.
- `data/`: Centralized content repository (TypeScript files). Update these files to change site content without touching JSX.
- `lib/`: Utility functions and shared helpers.
- `public/`: Static assets (images, icons, etc.).

## 🏗 Coding Standards
- **Component Pattern**: Use Functional Components with TypeScript. Use `"use client"` directive only when necessary for interactivity.
- **Styling**: Prefer Tailwind CSS classes. Use `cn()` utility for conditional classes.
- **Animations**: Use Framer Motion for most UI transitions. Use GSAP for complex timeline-based animations.
- **Icons**: Use `Lucide` icons for consistency.
- **Data First**: Always check `data/` directory before hardcoding text in components.

## 🎨 UI/UX & Design Principles
- **Aesthetics**: Premium, dark-themed, glassmorphism, and vibrant gradients.
- **Responsiveness**: Mobile-first design.
- **Performance**: Optimize images and use `LazyMotion` for Framer Motion if possible.
- **SEO**: Every page should have proper metadata, semantic HTML, and alt tags for images.

## 🤖 Guide for AI Agents
- **Context**: This is a professional developer portfolio.
- **Content Updates**: To update projects or bio, look into the `data/` folder first.
- **New Components**: Place reusable UI components in `components/ui` and page-specific components in `components/`.
- **Styling**: Tailwind 4 is used, so use modern utility classes and avoid deprecated ones.
- **Animations**: Maintain the "smooth and premium" feel when adding new features.
