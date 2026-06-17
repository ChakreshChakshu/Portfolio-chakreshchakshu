# Portfolio Tech Stack & Libraries Report

This report outlines the third-party libraries and modules utilized in the portfolio codebase, detailing their specific functionality and structural rationale.

---

## 1. Core Runtime & Infrastructure

| Library | Version | Purpose | Why We Use It |
| :--- | :--- | :--- | :--- |
| **Next.js** | `^16.2.6` | React Framework | Provides Server-Side Rendering (SSR) for fast loading times and initial HTML delivery, static site export, page routing via App Router, and optimization of assets (fonts, scripts). |
| **React** | `19.2.4` | Component Library | Core JavaScript framework using UI state reconciliation. React 19 provides Server Components, actions support, and concurrent rendering features. |
| **TypeScript** | `^5` | Typed JavaScript | Enforces compilation safety, type checking, and explicit interface specs across layout files and data objects. |

---

## 2. Animation & 3D Engineering (Interactive Layer)

These libraries power the portfolio's cinematic, high-performance interactions:

* **GSAP (GreenSock Animation Platform) (`^3.14.2`)**:
  * *Purpose*: Drives the scroll-scrubbed timeline engine in `ScrollStack`, kinetic text animations in `AboutSection`, sliding triggers in `ExperienceSection`, and the 3D depth slide transitions in `ProjectsSection`.
  * *Why*: GSAP is the industry standard for precise scroll-linked performance, allowing timeline calculations independent of browser render-loops. Unlike simple CSS transforms, it allows scrubbing animations directly linked to scroll progress with high frame-rate smoothness.
* **Three.js (`^0.167.1`)**:
  * *Purpose*: Renders the dynamic 3D WebGL rotating orbital rings background (`MagicRings.jsx` / `AboutSection.jsx`).
  * *Why*: Standard CSS or 2D canvas elements cannot perform hardware-accelerated 3D vector maths with complex lighting/opacity shading. Three.js leverages the device's GPU via WebGL to render thousands of dynamic vertexes smoothly without locking up main thread logic.
* **Lenis (`^1.3.23`)**:
  * *Purpose*: Smooth scroll coordinator.
  * *Why*: Standard browser scrolling is abrupt and uneven across different OS platforms (e.g., trackpads vs. mousewheels). Lenis smooths scroll inputs, delivering a consistent stream of coordinates that prevents GSAP scroll animations from lagging or stuttering.
* **Framer Motion / Motion (`^12.40.0`)**:
  * *Purpose*: Controls layout changes, entrance springs, and micro-hover states (like the 3D-aware cursor highlights on input fields).
  * *Why*: Provides spring-based animation physics and simple declarative markup for individual interactive components. It works in tandem with GSAP by handling isolated component animations, while GSAP manages complex page-level timelines.

---

## 3. Styling, Theme & UI Utilities

* **Tailwind CSS (`^4`)**:
  * *Purpose*: Utility-first styling framework.
  * *Why*: Enables rapid, compile-time styling, responsive layouts using tailwind breakpoints (e.g., `lg:overflow-hidden`), dark/light theme management, and avoids unused CSS delivery to improve page weight.
* **class-variance-authority (CVA) (`^0.7.1`)**:
  * *Purpose*: Declares component variants.
  * *Why*: Standardizes design-system token configurations. Allows creating UI components with clean, type-safe variant classes (e.g., size, color, active state).
* **clsx (`^2.1.1`) & tailwind-merge (`^3.5.0`)**:
  * *Purpose*: Clean className manipulation and merging.
  * *Why*: Prevents Tailwind class conflicts. When merging base styles with custom styles (e.g., `bg-red-500` overriding `bg-blue-500`), `tailwind-merge` intelligently overrides the class instead of appending both.
* **Simplex Noise (`^4.0.3`)**:
  * *Purpose*: Math-driven procedural value generator.
  * *Why*: Generates continuous, smooth coordinate variance used for fluid wave structures in WebGL shapes and canvas backgrounds.
* **tw-animate-css (`^1.4.0`)**:
  * *Purpose*: Pre-made animation helper classes for Tailwind.
  * *Why*: Provides rapid utilities for quick keyframe entries.

---

## 4. Icons, Utilities & Services

* **Resend (`^6.12.4`)**:
  * *Purpose*: Email delivery service integration.
  * *Why*: Used in contact form API (`app/api/contact/route.js`). Enables simple, secure delivery of contact form submissions to the developer's mailbox via a REST endpoint.
* **Zod (`^4.4.3`)**:
  * *Purpose*: Type-safe data schema validation.
  * *Why*: Validates incoming contact form requests on both client and server sides. Ensures names, emails, and messages meet security constraints (length, characters, email format) before calling the Resend API.
* **@phosphor-icons/react (`^2.1.10`) & Lucide React (`^1.16.0`)**:
  * *Purpose*: SVG vector icons.
  * *Why*: Provides scalable, accessible vector icon fonts, keeping the visual style consistent across sections and social links.
