# Chakresh Chakshu Portfolio | Technical Interview Prep Guide

This guide compiles high-frequency technical interview questions and detailed answers based on the architecture, implementation patterns, and design systems used in the portfolio repository.

---

## 🏛 1. Core Architecture: ScrollStack & Smooth Scrolling

### Q1: Explain the "ScrollStack" architecture. How does it differ from traditional document scrolling?
**Answer:**
Traditional websites use the standard document flow where sections follow one another vertically, and the browser handles scrolling natively by moving the viewport. 

The **ScrollStack** architecture implements a custom layout where:
1. All main sections (`ScrollStackItem` wrappers) are stacked directly on top of each other using CSS positioning (e.g., `position: sticky` or absolute stack layers).
2. Desktop viewports pin the current section in place, while scroll progress drives internal animations (e.g., multi-slide narratives, horizontal carousels, 3D zoom fades) rather than traditional page movement.
3. In `ScrollStack.jsx`, transforms (`translate3d`, `scale`, and `rotate`) are calculated programmatically for each card based on the viewport's current scroll position.
4. Smooth scroll interpolation is integrated via **Lenis**, providing a fluid, inertial scroll feeling.

---

### Q2: How is the scroll progress calculated programmatically inside `ScrollStack.jsx` without causing layout thrashing?
**Answer:**
Layout thrashing occurs when JavaScript repeatedly reads layout properties (like `offsetHeight` or `offsetTop`) and then writes style changes, forcing the browser to recalculate the layout on every frame.

To prevent this:
- **Cached Dimensions:** The component calculates and caches vertical offsets (`offsetTop` and container heights) inside a ref (`dimensionsRef.current`) during initial mount (`useLayoutEffect`) and updates them only on window resize events.
- **Scroll Event Listener:** On scroll, the handler only reads the current scroll position (`window.scrollY`) and performs mathematical calculations relative to the cached dimensions.
- **Transform Caching:** To avoid redundant DOM updates, last applied styles (scale, translate, rotate, blur) are stored in a cache (`lastTransformsRef.current`). A DOM update is executed *only* if the difference between the new transform values and cached values exceeds a specific threshold (e.g., `translateY` diff > 0.1px, `scale` diff > 0.001).
- **GPU Acceleration:** Transforms use `translate3d(0, y, 0)` to offload rendering to the GPU.

Here is the logic in `ScrollStack.jsx`:
```javascript
const newTransform = {
  translateY: Math.round(translateY * 100) / 100,
  scale: Math.round(scale * 1000) / 1000,
  rotation: Math.round(rotation * 100) / 100,
};

const lastTransform = lastTransformsRef.current.get(i);
const hasChanged = !lastTransform ||
  Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
  Math.abs(lastTransform.scale - newTransform.scale) > 0.001;

if (hasChanged) {
  card.style.transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale})`;
  lastTransformsRef.current.set(i, newTransform);
}
```

---

### Q3: Why is Lenis used in this project, and how is it configured differently for desktop vs. mobile?
**Answer:**
**Lenis** is a lightweight, smooth-scroll library that provides consistent scroll easing across different browsers and input devices (trackpad vs. mouse wheel).

**Desktop vs. Mobile configuration:**
- **Desktop:** Enabled to synchronize scroll inputs with GSAP timelines. It is configured with customized easing (e.g., `t => Math.min(1, 1.001 - Math.pow(2, -10 * t))`), a duration of 1.5s to 2.0s, and a touch/wheel multiplier to create a fluid, cinematic experience.
- **Mobile (Width < 1024px):** Lenis is disabled or bypassed. Complex scroll-scrubbed transformations are removed (`card.style.transform = 'none'`), and standard vertical mobile scrolling is enforced. This prevents performance degradation on low-power mobile GPUs and respects native mobile touch gestures.

---

## 🎬 2. Animation Engineering: GSAP & Video Scrubbing

### Q4: Inside `ExperienceSection.jsx`, how is scroll-scrubbed video playback achieved smoothly? Why doesn't setting `video.currentTime = scrollProgress * duration` directly inside a scroll listener work?
**Answer:**
Directly assigning `video.currentTime` in a scroll listener causes severe performance issues (lag, stuttering, and dropped frames) because:
1. Scroll events fire rapidly, far exceeding the browser's video decoding rate.
2. Direct seek requests are asynchronous operations. Flooding the decoder with consecutive seek commands triggers a pipeline bottleneck where the browser tries to seek, gets interrupted, and starts seeking again.

**The Solution (RequestAnimationFrame Interpolation):**
The project uses a target-current interpolation approach powered by `requestAnimationFrame` (RAF):
1. **Scroll Listener:** The scroll event listener only updates a light numeric value in a ref (`targetTimeRef.current = progress * video.duration`). It does *not* touch the video element.
2. **RAF Loop:** A continuous frame loop runs independently:
   - It reads the target time and compares it to the video's current time.
   - It computes a smooth delta step: `video.currentTime + (targetTime - video.currentTime) * 0.15`.
   - It updates the video player *only* if the delta is significant (e.g., `> 0.02s`) and the video player is not currently in a seeking state (`!video.seeking`).

```javascript
// Inside RAF Loop
const updateVideoFrame = () => {
  const video = videoRef.current;
  if (video && !isNaN(video.duration) && video.duration > 0) {
    const targetTime = targetTimeRef.current;
    const diff = targetTime - video.currentTime;
    
    if (Math.abs(diff) > 0.02 && !video.seeking) {
      video.currentTime = video.currentTime + diff * 0.15; // Smooth interpolation
    }
  }
  animFrameId = requestAnimationFrame(updateVideoFrame);
};
```

---

### Q5: How do you structure a scroll-driven timeline with GSAP? How are triggers and indices synchronized?
**Answer:**
A scroll-driven timeline binds GSAP progress values `[0, 1]` to a specific range of scroll coordinates.
In `AboutSection.jsx` and `ProjectsSection.jsx`:
1. **Timeline Creation:** A GSAP timeline is initialized as paused: `gsap.timeline({ paused: true })`.
2. **Relative Tweens:** Tweens are mapped to the timeline with relative times (e.g., a duration of 1.0 per slide transition), establishing sequential steps.
3. **Scroll Range Mapping:** On scroll, the scroll event listener computes the current scroll position relative to the element's offset and total scroll distance:
   ```javascript
   const progress = (currentScroll - rangeStart) / (rangeEnd - rangeStart);
   ```
4. **Scrubbing:** The calculated progress is set on the timeline using `timeline.progress(progress)`.
5. **Index Tracking:** The active slide index is calculated by dividing the progress ratio across the number of slides:
   ```javascript
   const activeIdx = Math.min(Math.floor(progress * totalSlides), totalSlides - 1);
   setActiveIndex(activeIdx);
   ```

---

### Q6: What is the benefit of using `useLayoutEffect` over `useEffect` when initializing GSAP scroll timelines in Next.js?
**Answer:**
- `useEffect` fires asynchronously *after* the browser paints the screen. If layout changes or animations rely on measuring DOM properties (like `offsetTop`), initializing them here can cause a visual layout flash (FOUC - Flash of Unstyled Content) because the initial paint is done before styles or positions are calculated.
- `useLayoutEffect` fires synchronously *after* all DOM mutations but *before* the browser paints. This ensures that element positions are measured and initial animated states (like setting scale or opacity inside GSAP) are applied in the same frame, preventing any visible jumps or layout flashes.
- *Note:* Since this is Next.js, `useLayoutEffect` produces warnings during Server-Side Rendering (SSR) because the DOM is not available on the server. The project addresses this by declaring `"use client"` and ensuring layout measuring code only runs client-side.

---

## ⚡ 3. Three.js & WebGL Performance

### Q7: The `AboutSection` features dynamic Three.js `MagicRings`. How do you optimize Three.js render loops in React to avoid memory leaks?
**Answer:**
Three.js handles low-level GPU objects (geometries, materials, textures, and render targets) which are not managed by the browser's JavaScript garbage collector. If a component unmounts and these objects are not explicitly destroyed, it leads to memory leaks.

**Best Practices implemented for cleanup:**
1. **Disposal of Geometries and Materials:** Iterate through the scene graph, and call `.dispose()` on all geometries and materials.
2. **WebGLRenderer Cleanup:** Call `renderer.dispose()` and remove the canvas DOM element from the parent wrapper.
3. **Cancel Animation Frame:** Store the `requestAnimationFrame` ID in a reference and call `cancelAnimationFrame(frameId)` upon unmounting.
4. **Event Listeners Removal:** Remove window resize and mouse movement listeners attached to the canvas context.

```javascript
// Cleanup example inside useEffect:
return () => {
  cancelAnimationFrame(animationId);
  window.removeEventListener('resize', resizeHandler);
  
  // Traverse scene
  scene.traverse((object) => {
    if (!object.isMesh) return;
    object.geometry.dispose();
    
    if (Array.isArray(object.material)) {
      object.material.forEach(mat => mat.dispose());
    } else {
      object.material.dispose();
    }
  });
  
  renderer.dispose();
  container.removeChild(renderer.domElement);
};
```

---

## 🌐 4. Next.js 15+ & Backend Integration

### Q8: Explain how Route Handlers are used in this project for the contact form. How are they structured?
**Answer:**
Next.js Route Handlers allow developers to create custom request handlers for a given route using the Web Request and Response APIs.
In this portfolio, `app/api/contact/route.js` handles form submissions:
1. **API Endpoint:** Exports an `async function POST(req)` that listens for incoming POST requests.
2. **Input Validation:** Zod is used to define a schema and parse the payload on the server-side to prevent malicious, malformed, or empty requests:
   ```javascript
   const parsedData = contactSchema.safeParse(await req.json());
   if (!parsedData.success) {
     return new Response(JSON.stringify({ error: errorMsg }), { status: 400 });
   }
   ```
3. **Email SDK Integration:** Interacts with the **Resend SDK** to dispatch email notifications containing the name, email, and message to the administrator.
4. **HTTP Status Codes:** Returns a unified JSON response with appropriate status codes (`200 OK`, `400 Bad Request`, or `500 Server Error`).

---

### Q9: How is runtime environment variable handling configured between Client and Server Components in Next.js?
**Answer:**
- **Server Components / API Routes:** Can access all environment variables defined in `.env` using standard Node.js syntax (e.g., `process.env.RESEND_API_KEY`). These variables remain secure on the server and are never bundled into the client browser build.
- **Client Components:** Cannot access plain environment variables for security reasons. To expose a variable to the client, it must be prefixed with `NEXT_PUBLIC_` (e.g., `NEXT_PUBLIC_EMAIL`). During build time, Next.js inline replaces references to `process.env.NEXT_PUBLIC_...` with their literal string values.

---

### Q10: What is the benefit of structuring the Skillyards suite (Platform, Admin Panel, CMS) in a unified workflow? How does this project reflect that?
**Answer:**
The projects showcase data references a monorepo setup consisting of three distinct portals:
1. **Skillyards Platform:** The customer-facing, conversion-driven course landing and application site built with Next.js and Tailwind CSS.
2. **Skillyards Admin Panel:** The internal operational dashboard using **shadcn/ui** and **Radix UI** to manage courses, leads, layouts, and configurations.
3. **Skillyards CMS Platform:** A headless Content Management System powered by **Sanity Studio v3** and **GROQ (Graph Relation Object Queries)**, which coordinates workflows and updates the live platform.

By separating these systems, the project maintains separation of concerns:
- Custom code and complex layout frameworks are kept isolated.
- The Admin panel remains fast and secure.
- The CMS uses native Sanity pipelines, while the client fetches static pages with edge optimization.

---

## 🎨 5. Responsive UX Design & Animation Math

### Q11: How is the dynamic wave/drag indicator in the projects slide computed math-wise?
**Answer:**
The indicator displays 60 visual lines representing progress. When a slide is active, lines adjacent to the active slide index dynamically warp and grow to look like a physical wave.

The mathematics is calculated in `ProjectsSection.jsx`:
1. **Center Calculation:** Determines the center point of the active thumbnail/slide relative to the total number of lines.
2. **Distance Calculation:** Measures the absolute distance (`distFromCenter`) between each individual line index `i` and the calculated active center.
3. **Cosine Easing:** Normalizes the distance within a specific wave radius boundary and computes a cosine interpolation:
   ```javascript
   const normalizedDist = distFromCenter / maxDistance;
   waveHeight = Math.cos((normalizedDist * Math.PI) / 2); // Result: 1 at center, 0 at boundary edge
   ```
4. **Style Mapping:** Maps this value to height (15px to 50px) and opacity (0.3 to 0.7):
   ```javascript
   const height = 15 + waveHeight * 35;
   const opacity = 0.3 + waveHeight * 0.4;
   ```

---

### Q12: How are accessibility (a11y) standards maintained when building complex custom interfaces like the Projects carousel and the Navigation bar?
**Answer:**
Building custom scroll-driven features often breaks keyboard navigation and reader outline structures. This codebase ensures accessibility through:
1. **Semantic HTML5 Elements:** Using `<section>`, `<nav>`, `<header>`, and `<footer>` tags to define content outlines.
2. **Aria Attributes:** Custom interactive elements (like the scroll dots or slide thumbnails) are configured with `aria-label` tags detailing their action (e.g., `aria-label="Scroll to next section"`).
3. **Radix Headless Components:** Reusing accessible primitive layers (such as Radix UI's Form labels or Input controls) to handle keyboard focusing, focus rings, and screen reader feedback out of the box.

---

## 🔍 6. SEO, Crawler Indexation & Performance

### Q13: How does Next.js handle dynamic sitemaps and robots.txt generation? What is the difference between static files in `/public` vs. dynamic files like `sitemap.js`?
**Answer:**
- **Static files (`/public/sitemap.xml`)**: Hardcoded XML. Hard to maintain, dynamic routes cannot be automatically updated when changes happen, and environment variables cannot be read.
- **Dynamic configurations (`app/sitemap.js` and `app/robots.js`)**: Next.js App Router intercepts these file routes. It evaluates the exported function and returns standard XML / TXT formats. This allows:
  1. Dynamically generating URLs based on active backend databases or routes.
  2. Accessing environment variables (like base URL configuration).
  3. Specifying caching and headers.
  This project implements `sitemap.js` and `robots.js` under `/app` to dynamically construct URLs using the base URL context.

---

### Q14: Why is it bad to have multiple `<h1>` tags on a page from an SEO perspective? How did you fix it in the portfolio?
**Answer:**
- **The SEO Issue**: Search crawlers use heading tags to understand the semantic hierarchy of a document. The `<h1>` tag defines the primary subject of a page. Having multiple `<h1>` tags dilutes the primary topic keyword and confuses crawling spiders about what page represents.
- **The Fix**: The homepage had `<h1>` tags in the Hero (the developer name) and in the About section ("Who I Am"). We changed the About section to `<h2>`, leaving a single, unique `<h1>` containing the primary search target: **"Chakresh Chakshu"** to focus PageRank authority on the developer's name entity.

---

### Q15: How do you handle metadata inheritance in Next.js App Router for sub-pages to prevent duplicate title tag penalties?
**Answer:**
- In Next.js, metadata declared in the root `layout.jsx` is inherited by default by all subpages.
- If subpages (`/about`, `/skills`, `/experience`, etc.) do not override their metadata, search engines see duplicate titles and descriptions, harming SEO rankings.
- **The Fix**:
  1. We configured a title template in `app/layout.jsx`:
     ```javascript
     title: {
       default: "Chakresh Chakshu | Developer",
       template: "%s | Chakresh Chakshu"
     }
     ```
  2. We exported a route-specific `metadata` object from each sub-page (e.g. `app/about/page.jsx`). Setting `title: "About Me"` automatically resolves to `"About Me | Chakresh Chakshu"`.

---

### Q16: How do you optimize client-side-heavy GSAP websites (like a ScrollStack single page) so search engines can index their text content even if JavaScript execution is delayed?
**Answer:**
- **The Issue**: Search engine crawlers (especially non-Google crawlers) do not always execute client-side JavaScript. If critical text content (like work experience details) is generated solely on client-side state after JS loads, bots will index an empty page.
- **The Solution**: 
  1. Leverage Next.js SSR to pre-render the initial HTML on the server. The raw HTML sent to the browser already contains the text content of all sections inside standard semantic wrappers (`<section>`, `<article>`, `<p>`).
  2. GSAP animations are initialized only on client-side components using `"use client"`. Even if JS is disabled or slow, the crawler parses the raw server-rendered HTML containing headings and descriptions, ensuring indexability.

