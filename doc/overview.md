# Chakresh Chakshu Portfolio | Project Overview

A premium, highly interactive, and cinematically designed developer portfolio built with a state-of-the-art interactive layer, scroll-driven mechanics, and real-time mock terminal diagnostics. 

---

## 🚀 Technology Stack

### Core Frameworks & Runtime
- **Next.js 16.2.6 (App Router)**: Optimized page routing, Server Components, and dynamic API route handlers.
- **React 19.2.4**: Modern functional component architecture with advanced state and hook lifecycles.
- **TypeScript & JSX**: Type-safe development for core components and utilities.

### Design, Layout & Fluid Dynamics
- **Tailwind CSS v4 & PostCSS 4**: Advanced typography, utility-first styling, and HSL custom colors.
- **Framer Motion & Motion.js**: Smooth physics-based scaling, transitions, and hover-triggered glass effects.
- **GSAP (GreenSock)**: Micro-interaction curves, precise timelines, and custom animation hooks.
- **Lenis**: Buttery smooth inertial scrolling across modern browsers.
- **Radix UI**: Accessible primitives and headless components.

---

## 🏛 Architectural Structure & Components

The application is structured around a single-page **ScrollStack** architecture. Instead of default document flow scrolling, sections are stacked and transition fluidly with deep ambient lighting overlays and layered z-index styling.

### 📂 Directory Map
```
Portfolio-chakreshchakshu/
├── app/
│   ├── api/about/route.ts   # Core GET API endpoint supplying portfolio details
│   ├── layout.jsx           # Global HTML shell and root styling
│   ├── globals.css          # CSS custom variables and theme declarations
│   └── page.jsx             # Main router rendering the ScrollStack
├── components/
│   ├── AboutSection.jsx     # Multi-slide cinematic narrative
│   ├── ContactSection.jsx   # Structured contact submission zone
│   ├── SkillsSection.jsx    # Interactive 3D pill cloud & category grids
│   ├── ProjectsSection.jsx  # Skeuomorphic horizontal project carousel
│   ├── TerminalUI.jsx       # Interactive bash simulator querying /api/about
│   ├── ScrollStack.jsx      # Scroll-stack core logic
│   └── ui/                  # Tailored micro-components (TrueFocus, Shape Landing, etc.)
└── data/
    ├── skills.ts            # Tech stack lists, levels, and icons
    └── projects.ts          # Curated live builds database
```

---

## 🎨 Page-by-Page Feature Walkthrough

### 1. Minimalist Hero Section
- Centered layout built upon dynamic decorative shapes (`shape-landing-hero`).
- Sleek typography emphasizing professional background and modern alignment.
- Initiates the visual baseline with dark modes and absolute clarity.

### 2. About Section (Cinematic Narrative Scroll)
- **Multi-Slide Scroll-Scrubbing**: The view is pinned while the user scrolls. Transitions between 3 distinct slides over exactly `1600px` of scrolling range:
  - **Slide 1**: Primary intro highlighting experience engineering ("I don't just build interfaces. I engineer experiences.") with amber/gold gradients.
  - **Slide 2**: Architectural focus showcasing workflow values ("systems, interaction, execution.").
  - **Slide 3**: Engineering philosophy focusing on clean code structures, rich client experiences, and full-stack software.
- **Ambient Aura**: Golden-amber radial back-glow overlays (`#fca311/4` opacity with a `200px` blur radius) which move/transition dynamically.

### 3. Interactive Terminal & API Diagnostics
- A mock terminal (`TerminalUI.jsx`) styled as `ChakshuOS v1.0.4`.
- **API Hydration**: Communicates with the Next.js Route Handler `/api/about` to fetch real-time JSON payloads.
- **Wheel & Touch Boundary Event Interceptors**: Captures local scroll events to enable inner-terminal browsing. Passes scrolling controls back to the parent `ScrollStack` only when boundaries (top/bottom scroll margins) are met.
- **Integrated Command Interpreter**: Supports command executions for:
  - `help`: Print all console capabilities.
  - `cat`: Print formatted narrative paragraphs.
  - `json`: Display colorized, syntactically-formatted API JSON structure.
  - `curl`: Send and visualize a network GET request to the local API endpoint.
  - `clear`: Purge history lines in the active screen buffer.

### 4. Interactive Skills Section
- **3D Icon Cloud**: The visual centerpiece (`icon-cloud.tsx`) displaying spinning, interactive skills spheres.
- **Categorized Grids**: Three distinct skill columns mapping **Frontend**, **Backend**, and **Tools** with visual badge lists, progress values, and custom emojis.
- High-fidelity wireframe styling with dynamic grid highlights and deep indigo hues.

### 5. Selected Projects Carousel (Horizontal Scrubbing)
- **Scroll-Scrubbed Scroller**: Pin-locks the section while translating cards horizontally using `useMotionValue` and custom track width scaling.
- **Skeuomorphic Glassmorphism**: Cards feature high-transparency frosted backdrops (`backdrop-blur-2xl`), radiant glass borders, and glowing diagonal reflections.
- **Dynamic Content Reveals**: Hovering a project card activates an interactive card expansion, lifting structured descriptions, custom tags (`Badge`), and preview actions.
- **Interactive SVG Mockups**: Custom SVGs illustrating app actions (E-Commerce credit cards, Analytics graphs, Social chat panels, CMS wireframes) animate in response to hover mouse coordinates.
- **GitHub Portal**: Final visual card serving as a direct path to exploratory repositories.

### 6. Contact & Footers
- Streamlined form components paired with social connection anchors (GitHub, LinkedIn, Email).
- Deep indigo aesthetics blended with a sleek, clean layout.

---

## 📡 Core API Specification (`/api/about`)

The portfolio is fully self-documenting. The active state is backed by the local JSON API serving detailed diagnostics:

### `GET /api/about`

#### Example Response Body
```json
{
  "status": "success",
  "meta": {
    "api_name": "Chakresh Dev API",
    "version": "v1.4.2",
    "environment": "Production",
    "uptime": "99.99%",
    "responseTime": "120ms"
  },
  "profile": {
    "name": "Chakresh Chakshu",
    "role": "Frontend Engineer (Full Stack Expertise)",
    "experience": "3+ Years Professional",
    "location": "India",
    "availability": "Open to High-Impact Opportunities"
  },
  "tech_stack": {
    "core": ["Next.js", "React.js", "Node.js", "PostgreSQL", "MongoDB"],
    "frontend": ["TypeScript", "GSAP", "TailwindCSS", "Framer Motion", "CSS Grid/Flexbox"],
    "backend": ["Express.js", "RESTful APIs", "Next.js Route Handlers"],
    "databases": ["PostgreSQL", "MongoDB", "Redis", "Prisma ORM"],
    "tools": ["Git", "Docker", "Figma", "VS Code", "Vercel / AWS"]
  },
  "diagnostics": {
    "coffee_level": "94%",
    "operating_system": "Linux Bash / macOS",
    "favorite_editor": "VS Code / Vim Mode",
    "tabs_vs_spaces": "Spaces (2)",
    "current_focus": "High-performance interface systems & fluid motion dynamics"
  },
  "narrative": {
    "headline": "Crafting High-Performance Interactive Architectures for the Modern Web",
    "paragraphs": [
      "I am a full-stack interaction engineer dedicated to designing production-grade, immersive frontend architectures. I combine software scalability with interactive detailing to make systems feel beautiful, robust, and alive.",
      "I care deeply about speed, loading states, and response times. By optimizing code sizes, loading assets asynchronously, and utilizing Next.js Server Components, I build web structures that feel instantaneous and buttery smooth.",
      "I specialize in creating fluid interactive experiences that bridge the gap between design and engineering, combining structural clean practices with robust database foundations."
    ]
  },
  "contact": {
    "email": "chakreshchakshu@gmail.com",
    "github": "https://github.com/chakreshchakshu",
    "linkedin": "https://linkedin.com/in/chakreshchakshu"
  }
}
```

---

## 🛠 Setup & Run Instructions

```bash
# Clone the repository
git clone <repository-url>

# Install packages
npm install

# Run the development environment
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to interact with the system live.
