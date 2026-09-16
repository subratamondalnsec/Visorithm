# Visorithm Project Structure

This document maps the current Visorithm repository and records the branding, asset, SEO, dependency, and homepage audits.

Generated: 2026-09-16

## Project Tree

Generated folders are shown but intentionally not expanded: `node_modules/` contains installed dependencies and `dist/` contains Vite build output. They should not be hand-edited or committed.

```text
Visorithm/
|-- .gitignore                         Git ignore rules
|-- BRANDING_AUDIT.md                  Detailed rebranding audit and deployment checklist
|-- PROJECT_STRUCTURE.md               This repository map and change audit
|-- README.md                          Project documentation and setup guide
|-- index.html                         HTML shell, favicon, and static SEO metadata
|-- package.json                       Scripts, project identity, and dependencies
|-- package-lock.json                  Locked dependency graph and package metadata
|-- eslint.config.js                   ESLint flat configuration
|-- vite.config.js                     Vite, React, Tailwind v4, and '@' path alias configuration
|-- public/
|   |-- images/
|   |   |-- avtar.png                  User/student avatar asset
|   |   |-- logo.png                   High-resolution brand logo (raster)
|   |   |-- logo.svg                   Scalable vector brand logo (SVG)
|   |   `-- student-illustration.svg   Educational student graphic
|   |-- manifest.json                  Progressive Web App metadata
|   |-- robots.txt                     Crawler directives and sitemap location
|   `-- sitemap.xml                    Search-engine URL list
|-- src/
|   |-- main.jsx                       React entry point and BrowserRouter mount
|   |-- App.jsx                        Route table and top-level SEO structured data
|   |-- App.css                        Global application and responsive utility styles
|   |-- index.css                      Tailwind import, theme variables, and base styles
|   |-- algorithms/
|   |   |-- backtracking/index.js      Backtracking algorithm definitions
|   |   |-- dp/index.jsx               Dynamic programming algorithm definitions
|   |   |-- graph/index.jsx            Graph algorithm definitions
|   |   |-- greedy/index.jsx           Greedy algorithm definitions
|   |   |-- mathematical/index.js      Mathematical algorithm definitions
|   |   |-- searching/index.js          Searching algorithm definitions
|   |   |-- searching/index.jsx         Additional searching definitions/configuration
|   |   |-- sorting/index.jsx           Sorting algorithm definitions
|   |   `-- tree/index.js              Tree algorithm definitions
|   |-- components/
|   |   |-- ErrorBoundary.jsx          Runtime error fallback UI
|   |   |-- FAQ.jsx                    FAQ page, FAQ schema, and FAQ content
|   |   |-- Footer.jsx                 Footer, social links, policies, and credits
|   |   |-- Home.jsx                   Homepage/category experience and legacy home composition
|   |   |-- HomeRedesign.jsx           Current redesigned homepage composition with interactive CTAs
|   |   |-- Layout.jsx                 Shared Navbar, Sidebar, and route outlet layout
|   |   |-- MobileSidebar.jsx          Mobile algorithm navigation drawer
|   |   |-- Navbar.jsx                 Shared brand, search, and responsive algorithm navigation
|   |   |-- Seo.jsx                    Shared route-level Helmet SEO component
|   |   |-- Sidebar.jsx                Desktop algorithm navigation
|   |   |-- backtracking/
|   |   |   |-- BacktrackingVisualizer.jsx Backtracking visualizer shell
|   |   |   |-- NQueensVisualizer.jsx   N-Queens visualization
|   |   |   |-- SudokuCodeView.jsx      Sudoku code display
|   |   |   `-- SudokuVisualizer.jsx    Sudoku visualization
|   |   |-- dp/
|   |   |   |-- CodeView.jsx            Dynamic programming code display
|   |   |   |-- DPTreeVisualizer.jsx    Dynamic programming tree view
|   |   |   |-- DPVisualizer.jsx        Dynamic programming visualizer shell
|   |   |   `-- LCSTable.jsx            Longest Common Subsequence table
|   |   |-- graph/
|   |   |   `-- GraphVisualizer.jsx     Graph visualization and controls
|   |   |-- greedy/
|   |   |   |-- ActivitySelectionVisualizer.jsx Activity selection visualization
|   |   |   |-- GreedyVisualizer.jsx    Greedy visualizer shell
|   |   |   `-- HuffmanCodingVisualizer.jsx Huffman coding visualization
|   |   |-- home/
|   |   |   |-- AnimatedBars.jsx        Homepage bar animation
|   |   |   |-- HeroSection.jsx         Modular hero section component
|   |   |   |-- TextFrame.jsx           Homepage eyebrow/frame treatment
|   |   |   `-- TextHoverEffect.jsx     Homepage interactive heading effect
|   |   |-- mathematical/
|   |   |   |-- EuclideanGCDVisualizer.jsx Euclidean GCD visualization
|   |   |   |-- MathVisualizer.jsx       Mathematical visualizer shell
|   |   |   |-- PrimeFactorizationVisualizer.jsx Prime factorization visualization
|   |   |   `-- SieveOfEratosthenesVisualizer.jsx Sieve visualization
|   |   |-- race/
|   |   |   `-- RaceMode.jsx            Algorithm race experience
|   |   |-- searching/
|   |   |   `-- SearchVisualizer.jsx    Linear, binary, and related search visualizations
|   |   |-- sorting/
|   |   |   `-- SortingVisualizer.jsx   Sorting visualization and controls
|   |   |-- tree/
|   |   |   |-- AVLOperationsForm.jsx   AVL operation controls
|   |   |   |-- BSTOperationsForm.jsx   Binary search tree operation controls
|   |   |   |-- RBOperationsForm.jsx    Red-black tree operation controls
|   |   |   |-- RedBlackTree.jsx        Red-black tree implementation/view
|   |   |   |-- TreeControls.jsx        Tree visualization controls
|   |   |   |-- TreeInputForm.jsx       Tree input controls
|   |   |   |-- TreeLink.jsx            Tree edge rendering
|   |   |   |-- TreeNode.jsx            Tree node rendering
|   |   |   `-- TreeVisualizer.jsx      Tree visualization shell
|   |   `-- ui/
|   |       |-- 3d-card.jsx             3D card interaction
|   |       |-- animated-bars.jsx       Reusable animated bar background
|   |       |-- cover.jsx               Heading cover effect
|   |       |-- floating-dock.jsx       Floating social/navigation dock
|   |       |-- hover-border-gradient.jsx Gradient border button
|   |       |-- icons/
|   |       |   `-- logo.jsx            Brand logo component (SVG/PNG with fallback)
|   |       |-- sparkles.jsx            Sparkle visual effect
|   |       |-- text-frame.jsx          Framed text highlight effect
|   |       |-- text-generate-effect.jsx Text reveal effect
|   |       |-- three-d-button.jsx      3D button with gradient & highlight
|   |       `-- wavy-background.jsx     Animated wave background
|   |-- lib/
|   |   `-- utils.js                    Class name concatenation and Tailwind merge helper
|   |-- store/
|   |   |-- algorithmStore.js           Global algorithm/search state
|   |   |-- backtrackingStore.js        Backtracking state
|   |   |-- dpStore.js                  Dynamic programming state
|   |   |-- graphStore.js               Graph state
|   |   |-- greedyStore.js              Greedy state
|   |   `-- treeStore.js                Tree state
|   `-- utils/
|       |-- defaultTree.js              Default tree data
|       |-- graphHelpers.js             Graph helper functions
|       |-- sizeManager.js              Visualization sizing helpers
|       |-- treeAnimations.js           Tree animation helpers
|       |-- treeLayout.js               Tree layout calculations
|       |-- treeParser.js               Tree input parsing
|       `-- treeUtils.js                Tree utility functions
|-- node_modules/                       Installed packages; generated, not authored
`-- dist/                               Vite build output; generated, not authored
```

## File Purpose

The tree above includes every authored source, configuration, public asset, algorithm module, visualizer, store, and utility currently present. The main ownership boundaries are:

- `src/algorithms/`: algorithm definitions and execution data.
- `src/components/`: route screens and reusable interface components.
- `src/components/home/`: landing page presentation modules (`HeroSection.jsx`, `TextHoverEffect.jsx`, `TextFrame.jsx`, `AnimatedBars.jsx`).
- `src/components/ui/`: visual effects, animation wrappers, icons, and presentation primitives (`icons/logo.jsx`, `three-d-button.jsx`, `text-frame.jsx`, `animated-bars.jsx`, etc.).
- `src/store/`: Zustand state for visualizer workflows.
- `src/utils/` and `src/lib/`: shared data, layout, parsing, and helper logic (`utils.js`).
- `public/`: static assets (`public/images/`), crawler directives (`robots.txt`), sitemap (`sitemap.xml`), and PWA metadata (`manifest.json`).
- Root configuration: Vite (`vite.config.js`), ESLint (`eslint.config.js`), npm scripts (`package.json`), and application entry HTML (`index.html`).

## Changes Made

The list below records the changes made across rebranding, architectural upgrades, UI/UX polish, and new module additions:

`vite.config.js`
Status: Modified

Reason:
- Added `@` path alias mapped to `src/` using ESM `fileURLToPath(new URL('./src', import.meta.url))`.
- Integrates React plugin (`@vitejs/plugin-react`) and Tailwind CSS v4 Vite plugin (`@tailwindcss/vite`).

`package.json` & `package-lock.json`
Status: Modified

Reason:
- Added `lucide-react` dependency for modern icons (such as `ArrowUpRight` used in hero CTAs).
- Project renamed to `visorithm`.
- *Note:* Current package still contains the legacy self-dependency `coderarmy-3dsa: file:` and should be normalized before publishing.

`public/images/`
Status: New / Reorganized

Reason:
- Consolidated brand and visual assets:
  - `logo.svg`: Official scalable vector brand mark.
  - `logo.png`: High-resolution raster logo.
  - `avtar.png`: Avatar graphic used in UI elements.
  - `student-illustration.svg`: Illustration asset for educational cards.

`src/components/ui/icons/logo.jsx`
Status: New

Reason:
- Authored a reusable brand logo component that renders `/images/logo.svg` by default (or `/images/logo.png` when `usePng` is set).
- Supports customizable `className`, `alt`, and `src` overrides, enabling standard brand rendering across buttons, navbars, and headers.

`src/components/ui/three-d-button.jsx`
Status: New

Reason:
- Supplies a 3D gradient button component with inset highlights, drop shadows, and top specular sheen.

`src/components/ui/text-frame.jsx`
Status: Modified / Enhanced

Reason:
- Refactored text framing component with animated SVG gradient border, corner marks, and staggered motion effects.

`src/components/home/HeroSection.jsx`
Status: New

Reason:
- Provides a dedicated modular Hero section integrating `AnimatedBars`, `TextHoverEffect`, `TextFrame`, and `ThreeDButton`.

`src/components/HomeRedesign.jsx`
Status: Modified / Enhanced

Reason:
- Redesigned landing page with category accordion cards, algorithm difficulty indicators, SEO meta tags, and high-impact hero CTAs:
  - **Explore Algorithms CTA**: Features the official Visorithm brand mark via `<Logo />`, rendered in a crisp black silhouette (`brightness-0`), with optimized proportions (`h-6`), tightened text-to-logo gap (`gap-1.5`), vibrant blue gradient background with 3D inset shadows, and light beam hover effect.
  - **Open Race Mode CTA**: Implements dynamic sliding button physics with a `ResizeObserver` travel distance calculation, 360° spinning icon pill with smooth horizontal translation on hover, 45° arrow tilt, fluid responsive padding transition (`ps-6 pe-14 hover:ps-14 hover:pe-6`), refined dark gray / 90% black palette (`bg-[#161822]/95`), subtle white contour outline/ring (`ring-1 ring-inset ring-white/15 hover:ring-white/30`), and a custom blue-to-black linear gradient pill (`#0085FF` to `#00428D` to `#000000`).

`src/components/Navbar.jsx`
Status: Modified / Refactored

Reason:
- Refactored responsive navbar layout, algorithm search integration, mobile drawer handling, and brand identity presentation.

`src/lib/utils.js`
Status: Modified

Reason:
- Provides class name composition utility using `clsx` and `tailwind-merge` (`twMerge`).

`index.html`
Status: Modified

Reason:
- Updated title to Visorithm.
- Updated author, Open Graph, Twitter, canonical, and preconnect metadata.
- Configured favicon and theme colors.

`README.md`
Status: Modified

Reason:
- Rebranded documentation, project description, setup commands, demo URL (`https://visorithm.vercel.app/`), and author credit.
- Documented Hero CTA polish details, interaction behavior, and dependency reuse.

`src/App.jsx`
Status: Modified

Reason:
- Rebranded top-level Helmet titles and descriptions.
- Updated WebApplication structured data and author.
- Linked production host `https://visorithm.vercel.app`.

`src/components/Seo.jsx`
Status: Modified

Reason:
- Configured shared page titles and SEO defaults.
- Updated canonical domain to `https://visorithm.vercel.app`.

`src/components/Footer.jsx`
Status: Modified

Reason:
- Replaced footer branding and copyright text.
- Replaced GitHub URL with `https://github.com/subratamondalnsec`.
- Rebranded privacy and terms copy.

`src/components/FAQ.jsx`
Status: Modified

Reason:
- Replaced product references in questions, answers, keywords, and SEO description.

`public/manifest.json`
Status: Modified

Reason:
- Updated application name and short name to Visorithm.
- Updated description and theme colors.

`public/robots.txt`
Status: Modified

Reason:
- Configured crawler permissions and sitemap location pointing to `https://visorithm.vercel.app/sitemap.xml`.

`public/sitemap.xml`
Status: Modified

Reason:
- Replaced deployment host across all indexed URLs with `https://visorithm.vercel.app/`.

`BRANDING_AUDIT.md`
Status: Existing Reference

Reason:
- Comprehensive branding, SEO, external-link, asset, and deployment audit checklist.

`PROJECT_STRUCTURE.md`
Status: Updated

Reason:
- Kept synchronized with the current repository file tree, new modules, configuration aliases, and UI enhancements.

## Branding References

### Current branding

- `index.html`: Visorithm document title, author metadata, Open Graph, Twitter, and canonical metadata.
- `src/App.jsx`: Visorithm page metadata and WebApplication JSON-LD.
- `src/components/Seo.jsx`: Visorithm shared title and SEO defaults.
- `src/components/Navbar.jsx`: visible Visorithm navbar brand.
- `src/components/Footer.jsx`: Visorithm footer, copyright, and policy text.
- `src/components/FAQ.jsx`: Visorithm FAQ content and SEO keywords.
- `src/components/HomeRedesign.jsx`: Visorithm hero, category cards, and CTAs.
- `src/components/ui/icons/logo.jsx`: Standardized brand logo rendering component.
- `public/manifest.json`: Visorithm application and short name.
- `README.md`: Visorithm documentation, logo alt text, and author credit.

### Original references

Old product names, old author handles, old deployment hosts, and external social handles were removed from first-party authored source.

The retained project profile link is:
- `https://github.com/subratamondalnsec` in `src/components/Footer.jsx` and `README.md`.

## Assets

### Logo and favicon

- `public/images/logo.svg`: Primary vector logo asset used in `src/components/ui/icons/logo.jsx` and hero CTA.
- `public/images/logo.png`: High-resolution raster logo asset.
- `public/images/avtar.png`: Avatar graphic used in UI components.
- `public/images/student-illustration.svg`: Illustration graphic used in educational UI.
- `index.html`: favicon and preload references.
- `README.md`: project logo reference.

### Manifest asset references

`public/manifest.json` references icon and screenshot paths (`/icons/icon-*.png`, `/screenshots/*.png`). Production release should ensure real icon files are present in `public/icons/` matching the manifest, or manifest entries pruned to avoid 404s.

### Sitemap references

- `index.html` links to `/manifest.json`.
- `public/robots.txt` points to `https://visorithm.vercel.app/sitemap.xml`.
- `public/sitemap.xml` lists application routes under `https://visorithm.vercel.app/`.

## Dependencies

### Installed runtime packages from `package.json`

- `@gsap/react` (^2.1.2)
- `@tailwindcss/vite` (^4.0.7)
- `@tsparticles/engine` (^3.8.1)
- `@tsparticles/react` (^3.0.0)
- `@tsparticles/slim` (^3.8.1)
- `clsx` (^2.1.1)
- `coderarmy-3dsa` (legacy self-reference; cleanup recommended before publishing)
- `d3` (^7.9.0)
- `framer-motion` (^12.4.5)
- `gsap` (^3.12.7)
- `lucide-react` (^1.43.0)
- `motion` (^12.4.10)
- `nanoid` (^5.1.0)
- `react` (^19.0.0)
- `react-dom` (^19.0.0)
- `react-helmet` (^6.1.0)
- `react-icons` (^4.12.0)
- `react-router-dom` (^7.2.0)
- `simplex-noise` (^4.0.3)
- `tailwind-merge` (^3.0.2)
- `tailwind-scrollbar` (^4.0.0)
- `tailwindcss` (^4.0.7)
- `tw-animate-css` (^1.4.0)
- `zustand` (^5.0.3)

### Installed development packages

- `@eslint/js` (^9.19.0)
- `@types/react` (^19.0.8)
- `@types/react-dom` (^19.0.3)
- `@vitejs/plugin-react` (^1.3.2)
- `eslint` (^9.19.0)
- `eslint-plugin-react` (^7.37.4)
- `eslint-plugin-react-hooks` (^5.0.0)
- `eslint-plugin-react-refresh` (^0.4.18)
- `globals` (^15.14.0)
- `vite` (^6.1.0)

## Homepage Components

The application routing flow is:

```text
src/main.jsx
  -> BrowserRouter
    -> App.jsx
      -> Layout.jsx
        -> Navbar.jsx
        -> Outlet
          -> Home.jsx (or HomeRedesign.jsx for active redesigned experience)
             -> Seo.jsx
             -> ui/animated-bars.jsx
             -> home/TextHoverEffect.jsx
             -> ui/text-frame.jsx
             -> Hero CTA Group:
                - Primary: "Explore Algorithms" with ui/icons/logo.jsx & 3D gradient sheen
                - Secondary: "Open Race Mode" with sliding button physics & ArrowUpRight
             -> Category accordion cards and algorithm links
             -> Redesign Footer
```

Key homepage-related files:

- `src/components/HomeRedesign.jsx`: Current active homepage with responsive hero, animated bars, interactive CTA buttons, category cards, and footer.
- `src/components/home/HeroSection.jsx`: Modular Hero component packaging `AnimatedBars`, `TextHoverEffect`, `TextFrame`, and `ThreeDButton`.
- `src/components/home/TextHoverEffect.jsx`: Interactive hover effect for the main brand heading.
- `src/components/ui/icons/logo.jsx`: Standardized brand logo rendering component.
- `src/components/ui/animated-bars.jsx`: Reusable canvas-based animated bar background.
- `src/components/ui/text-frame.jsx`: Animated framed text highlight primitive.
- `src/components/ui/three-d-button.jsx`: 3D button component with dual-gradient styling.
- `src/components/Navbar.jsx`: Brand header, algorithm search, and mobile navigation drawer.
- `src/components/Footer.jsx`: Application footer, privacy, terms, and social links.

## Remaining Tasks

- Remove the legacy `coderarmy-3dsa` self-dependency in `package.json`, then regenerate `package-lock.json`.
- Add valid `/og-image.png` and `/twitter-image.png` assets or adjust social share tags in `index.html` and `src/App.jsx`.
- Ensure icon assets in `public/icons/` match `public/manifest.json` before PWA distribution.
- Refresh sitemap `lastmod` dates upon new releases.
- Run `npm run lint` and `npm run build` as part of CI validation.
