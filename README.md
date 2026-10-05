# Mohamad Ammar — Portfolio

A responsive React and TypeScript portfolio for Mohamad Ammar Mohamad Hassan, a Data Science undergraduate at AIU pursuing AI engineering through retrieval, voice AI, multi-agent systems, and applied machine learning.

## Run locally

- `npm install`
- `npm run dev`
- `npm run build` for a TypeScript check and production build.
- `npm run preview` to review the production build.

## Deploy to Vercel

Import this repository into Vercel. The Vite defaults are appropriate:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

No environment variables or custom Vercel configuration are required. Once Vercel assigns the production URL, use it to complete the canonical URL and social preview image metadata described in [`docs/deployment-seo.md`](docs/deployment-seo.md).

## Update portfolio content

- `src/content.ts`: CV-based profile, eight CV projects, skills, education, experience, training, and FAQs.
- `src/App.tsx`: main page, navigation, section layout, and interactions.
- `src/components/ProjectDetail.tsx`: self-contained project details with repository and live-preview links where available.
- `src/components/Primitives.tsx`: shared scroll-reveal and section components.
- `src/hooks/useInView.ts`: scroll-triggered reveal observer.
- `src/index.css`: colours, layout, responsive styling, and animation.
- `public/images/`: locally hosted portrait and project imagery.
- `docs/project-image-sources.md`: sources for the original project images and application screenshot.
- `src/components/ProjectVisual.tsx`: authentic asset rendering with typographic covers for projects without published imagery.
- `public/favicon.svg`: portfolio mark.
- `public/documents/mohamad-ammar-cv.pdf`: original two-page CV, downloadable beside the LinkedIn button in the introduction.

## Included interactions

Framer Motion provides viewport reveals, animated project filtering, card gestures, project-view entrances, navigation indicators, and a reading-progress bar. Animations respect the device's reduced-motion setting.

Project cards open accessible, full-screen project views with a close button, Escape support, return navigation, and related projects. Also includes expandable FAQs, a mobile navigation drawer, email copying, category filters, section-aware navigation, and optional motion controls. Project descriptions and career information are maintained in the local source.

The page retains the original light introduction and header, with a centered portrait, scroll fade, and refined AI engineering copy. Projects use original assets, application screenshots, and owner-selected generated illustrations. Profile and career details are based on the supplied CV; project descriptions use the CV and the owner's project notes. No hosted portfolio case-study service is required.
