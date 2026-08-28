# Visorithm Project Structure

This document maps the current Visorithm repository and records the branding, asset, SEO, dependency, and homepage audits.

Generated: 2026-08-29

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
|-- vite.config.js                     Vite, React, and Tailwind plugin configuration
|-- public/
|   |-- logo.png                       Existing logo/favicon asset
|   |-- img1.png                       README screenshot asset
|   |-- img2.png                       README screenshot asset
|   |-- img3.png                       README screenshot asset
|   |-- img4.png                       README screenshot asset
|   |-- manifest.json                   Progressive Web App metadata
|   |-- robots.txt                     Crawler directives and sitemap location
|   `-- sitemap.xml                    Search-engine URL list
|-- src/
|   |-- main.jsx                       React entry point and BrowserRouter mount
|   |-- App.jsx                        Route table and top-level SEO structured data
|   |-- App.css                        Global application and responsive utility styles
|   |-- index.css                      Tailwind import, theme variables, and base styles
|   |-- algorithms/
|   |   |-- backtracking/index.js       Backtracking algorithm definitions
|   |   |-- dp/index.jsx                Dynamic programming algorithm definitions
|   |   |-- graph/index.jsx             Graph algorithm definitions
|   |   |-- greedy/index.jsx            Greedy algorithm definitions
|   |   |-- mathematical/index.js       Mathematical algorithm definitions
|   |   |-- searching/index.js           Searching algorithm definitions
|   |   |-- searching/index.jsx          Additional searching definitions/configuration
|   |   |-- sorting/index.jsx            Sorting algorithm definitions
|   |   `-- tree/index.js               Tree algorithm definitions
|   |-- components/
|   |   |-- ErrorBoundary.jsx           Runtime error fallback UI
|   |   |-- FAQ.jsx                     FAQ page, FAQ schema, and FAQ content
|   |   |-- Footer.jsx                  Footer, social links, policies, and credits
|   |   |-- Home.jsx                    Homepage/category experience and legacy home composition
|   |   |-- HomeRedesign.jsx             Current redesigned homepage composition
|   |   |-- Layout.jsx                  Shared Navbar, Sidebar, and route outlet layout
|   |   |-- MobileSidebar.jsx            Mobile algorithm navigation drawer
|   |   |-- Navbar.jsx                  Shared brand, search, and algorithm navigation
|   |   |-- Seo.jsx                     Shared route-level Helmet SEO component
|   |   |-- Sidebar.jsx                  Desktop algorithm navigation
|   |   |-- backtracking/
|   |   |   |-- BacktrackingVisualizer.jsx Backtracking visualizer shell
|   |   |   |-- NQueensVisualizer.jsx    N-Queens visualization
|   |   |   |-- SudokuCodeView.jsx       Sudoku code display
|   |   |   `-- SudokuVisualizer.jsx     Sudoku visualization
|   |   |-- dp/
|   |   |   |-- CodeView.jsx             Dynamic programming code display
|   |   |   |-- DPTreeVisualizer.jsx     Dynamic programming tree view
|   |   |   |-- DPVisualizer.jsx         Dynamic programming visualizer shell
|   |   |   `-- LCSTable.jsx             Longest Common Subsequence table
|   |   |-- graph/
|   |   |   `-- GraphVisualizer.jsx      Graph visualization and controls
|   |   |-- greedy/
|   |   |   |-- ActivitySelectionVisualizer.jsx Activity selection visualization
|   |   |   |-- GreedyVisualizer.jsx     Greedy visualizer shell
|   |   |   `-- HuffmanCodingVisualizer.jsx Huffman coding visualization
|   |   |-- home/
|   |   |   |-- AnimatedBars.jsx         Homepage bar animation
|   |   |   |-- TextFrame.jsx             Homepage eyebrow/frame treatment
|   |   |   `-- TextHoverEffect.jsx       Homepage interactive heading effect
|   |   |-- mathematical/
|   |   |   |-- EuclideanGCDVisualizer.jsx Euclidean GCD visualization
|   |   |   |-- MathVisualizer.jsx        Mathematical visualizer shell
|   |   |   |-- PrimeFactorizationVisualizer.jsx Prime factorization visualization
|   |   |   `-- SieveOfEratosthenesVisualizer.jsx Sieve visualization
|   |   |-- race/
|   |   |   `-- RaceMode.jsx             Algorithm race experience
|   |   |-- searching/
|   |   |   `-- SearchVisualizer.jsx     Linear, binary, and related search visualizations
|   |   |-- sorting/
|   |   |   `-- SortingVisualizer.jsx    Sorting visualization and controls
|   |   |-- tree/
|   |   |   |-- AVLOperationsForm.jsx    AVL operation controls
|   |   |   |-- BSTOperationsForm.jsx    Binary search tree operation controls
|   |   |   |-- RBOperationsForm.jsx     Red-black tree operation controls
|   |   |   |-- RedBlackTree.jsx         Red-black tree implementation/view
|   |   |   |-- TreeControls.jsx          Tree visualization controls
|   |   |   |-- TreeInputForm.jsx         Tree input controls
|   |   |   |-- TreeLink.jsx              Tree edge rendering
|   |   |   |-- TreeNode.jsx              Tree node rendering
|   |   |   `-- TreeVisualizer.jsx        Tree visualization shell
|   |   `-- ui/
|   |       |-- 3d-card.jsx               3D card interaction
|   |       |-- animated-bars.jsx         Reusable animated bar background
|   |       |-- cover.jsx                 Heading cover effect
|   |       |-- floating-dock.jsx         Floating social/navigation dock
|   |       |-- hover-border-gradient.jsx Gradient border button
|   |       |-- sparkles.jsx              Sparkle visual effect
|   |       |-- text-generate-effect.jsx  Text reveal effect
|   |       `-- wavy-background.jsx       Animated wave background
|   |-- lib/
|   |   `-- utils.js                     Shared utility helpers
|   |-- store/
|   |   |-- algorithmStore.js            Global algorithm/search state
|   |   |-- backtrackingStore.js         Backtracking state
|   |   |-- dpStore.js                   Dynamic programming state
|   |   |-- graphStore.js                Graph state
|   |   |-- greedyStore.js               Greedy state
|   |   `-- treeStore.js                 Tree state
|   `-- utils/
|       |-- defaultTree.js               Default tree data
|       |-- graphHelpers.js              Graph helper functions
|       |-- sizeManager.js               Visualization sizing helpers
|       |-- treeAnimations.js            Tree animation helpers
|       |-- treeLayout.js                Tree layout calculations
|       |-- treeParser.js                Tree input parsing
|       `-- treeUtils.js                 Tree utility functions
|-- node_modules/                        Installed packages; generated, not authored
`-- dist/                                Vite build output; generated, not authored
```

## File Purpose

The tree above includes every authored source, configuration, public asset, algorithm module, visualizer, store, and utility currently present. The main ownership boundaries are:

- `src/algorithms/`: algorithm definitions and execution data.
- `src/components/`: route screens and reusable interface components.
- `src/components/ui/`: visual effects and presentation primitives.
- `src/store/`: Zustand state for visualizer workflows.
- `src/utils/` and `src/lib/`: shared data, layout, parsing, and helper logic.
- `public/`: static assets and crawler/PWA files.
- Root configuration: Vite, ESLint, npm scripts, and application entry HTML.

## Changes Made

The parent workspace currently reports the Visorithm directory as untracked, so Git cannot provide a reliable per-file historical status. The list below records the known changes made during the rebrand and the files that are new or present in the current implementation.

`index.html`
Status: Modified

Reason:
- Replaced the old product title with Visorithm.
- Updated author, Open Graph, Twitter, canonical, and preconnect metadata.
- Added a TODO at the existing logo reference.

`package.json`
Status: Modified

Reason:
- Renamed the npm project to `visorithm`.
- Current file still contains the legacy self-dependency `coderarmy-3dsa: file:` and should be normalized before publishing.

`package-lock.json`
Status: Modified

Reason:
- Root lockfile package name was changed to `visorithm`.
- Current lockfile still contains the legacy self-dependency entry and should be regenerated after the `package.json` cleanup.

`README.md`
Status: Modified

Reason:
- Rebranded logo alt text, project description, setup commands, demo URL, and author credit.
- Added a TODO for replacing the existing logo.

`src/App.jsx`
Status: Modified

Reason:
- Rebranded top-level Helmet titles and descriptions.
- Updated WebApplication structured data and author.
- Replaced the old canonical host with the temporary Visorithm domain placeholder.

`src/components/Seo.jsx`
Status: Modified

Reason:
- Rebranded shared page titles and SEO defaults.
- Replaced the old base URL and added a production-domain TODO.

`src/components/Navbar.jsx`
Status: Modified

Reason:
- Replaced the visible navbar brand with Visorithm.

`src/components/Footer.jsx`
Status: Modified

Reason:
- Replaced footer branding and copyright text.
- Replaced the GitHub URL with `https://github.com/subratamondalnsec`.
- Removed original X, LinkedIn, and Instagram profiles.
- Rebranded privacy and terms copy.

`src/components/FAQ.jsx`
Status: Modified

Reason:
- Replaced old product references in questions, answers, keywords, and SEO description.

`public/manifest.json`
Status: Modified

Reason:
- Updated application name and short name to Visorithm.
- Added an asset customization TODO field.

`public/robots.txt`
Status: Modified

Reason:
- Replaced the old sitemap host with the temporary Visorithm domain placeholder.
- Added a production-domain TODO.

`public/sitemap.xml`
Status: Modified

Reason:
- Replaced the old deployment host in every indexed URL.
- Added a production-domain TODO.

`BRANDING_AUDIT.md`
Status: New

Reason:
- Added the detailed branding, SEO, external-link, asset, and deployment audit.

`PROJECT_STRUCTURE.md`
Status: New

Reason:
- Added this complete project structure and change audit.

`src/components/HomeRedesign.jsx`
Status: New or recently added

Reason:
- Provides the current redesigned homepage with Visorithm hero content, category cards, race-mode CTA, SEO, and footer.
- Contains TODO placeholders for hero illustration and profile/documentation links.

`src/components/home/AnimatedBars.jsx`
Status: New or recently added

Reason:
- Adds the animated homepage bar decoration.

`src/components/home/TextFrame.jsx`
Status: New or recently added

Reason:
- Adds the homepage label/frame presentation component.

`src/components/home/TextHoverEffect.jsx`
Status: New or recently added

Reason:
- Adds the interactive homepage heading treatment.

`src/components/ui/animated-bars.jsx`
Status: New or recently added

Reason:
- Supplies the reusable animated bar background used by `HomeRedesign.jsx`.

## Branding References

### Current branding

- `index.html`: Visorithm document title, author metadata, Open Graph, Twitter, and canonical metadata.
- `src/App.jsx`: Visorithm page metadata and WebApplication JSON-LD.
- `src/components/Seo.jsx`: Visorithm shared title and SEO defaults.
- `src/components/Navbar.jsx`: visible Visorithm navbar brand.
- `src/components/Footer.jsx`: Visorithm footer, copyright, and policy text.
- `src/components/FAQ.jsx`: Visorithm FAQ content and SEO keywords.
- `src/components/HomeRedesign.jsx`: Visorithm hero and footer content.
- `public/manifest.json`: Visorithm application and short name.
- `README.md`: Visorithm documentation, logo alt text, and author credit.

### Original references

The old product name, old author name, old deployment host, and old social handles were previously found in `index.html`, `src/App.jsx`, `src/components/Seo.jsx`, `src/components/Navbar.jsx`, `src/components/Footer.jsx`, `src/components/FAQ.jsx`, `README.md`, `public/robots.txt`, and `public/sitemap.xml`. They have been removed from first-party authored source.

No original portfolio URL, email address, analytics identifier, or additional contact information was found.

The only retained project social/profile link is:

- `https://github.com/subratamondalnsec` in `src/components/Footer.jsx` and `README.md`.

The current redesign has visible placeholder labels for GitHub, LinkedIn, and Documentation in `src/components/HomeRedesign.jsx`; GitHub is marked for addition and the other profiles were not supplied.

## Assets

### Logo and favicon

`public/logo.png`

Used in:

- `index.html`: favicon reference.
- `index.html`: preload reference.
- `README.md`: project logo image.

The existing logo was intentionally preserved. TODO comments identify replacement locations.

### Public images

- `public/img1.png` through `public/img4.png`: referenced by README screenshot markup.
- No source component currently references these four images.
- The four images were intentionally left unchanged.

### Manifest asset references

`public/manifest.json` references:

- `/icons/icon-72x72.png`
- `/icons/icon-96x96.png`
- `/icons/icon-128x128.png`
- `/icons/icon-144x144.png`
- `/icons/icon-152x152.png`
- `/icons/icon-192x192.png`
- `/icons/icon-384x384.png`
- `/icons/icon-512x512.png`
- `/screenshots/sorting.png`
- `/screenshots/race-mode.png`

These paths are not present in the current `public/` tree and must be supplied or removed before deployment.

### Favicon and SEO image references

- Favicon: `/logo.png` in `index.html`.
- Open Graph image: `/og-image.png` in `index.html`, `src/App.jsx`, and `src/components/Seo.jsx`.
- Twitter image: `/twitter-image.png` in `index.html`, `src/App.jsx`, and `src/components/Seo.jsx`.
- The Open Graph and Twitter image files are not currently present in `public/`.

### Sitemap references

- `index.html` links to `/manifest.json`.
- `public/robots.txt` points to `https://visorithm.example.com/sitemap.xml`.
- `public/sitemap.xml` lists the application routes under the temporary Visorithm domain.

## SEO Files

### `public/manifest.json`

Purpose: Defines the installable PWA name, colors, display mode, icons, screenshots, and categories.

Current Visorithm values: `name` and `short_name` are `Visorithm`; description identifies an educational algorithm visualization platform.

TODO:
- Replace icon paths with real Visorithm icon files.
- Replace screenshot paths with real existing screenshots or remove those entries.
- Confirm application colors, orientation, and categories.

### `public/robots.txt`

Purpose: Allows crawlers and advertises the XML sitemap location.

Current value: all crawlers are allowed and the sitemap uses `https://visorithm.example.com/sitemap.xml`.

TODO:
- Replace `visorithm.example.com` with the final production domain.
- Confirm whether all routes should be crawlable.
- Verify the deployed sitemap URL returns HTTP 200.

### `public/sitemap.xml`

Purpose: Lists indexable Visorithm routes with priority, update frequency, and last-modified values.

Current value: all URLs use the temporary Visorithm domain placeholder.

TODO:
- Replace the domain in every `<loc>`.
- Refresh the stale `lastmod` dates at release time.
- Confirm every listed route exists and should be indexed.
- Add any important public routes that are missing.

Other SEO surfaces:

- `index.html`: static title, description, keywords, author, Open Graph, Twitter, robots, theme color, canonical, favicon, and manifest link.
- `src/App.jsx`: route-shell metadata and WebApplication JSON-LD.
- `src/components/Seo.jsx`: shared route-level metadata and canonical links.
- `src/components/FAQ.jsx`: FAQPage JSON-LD.

## Dependencies

### Installed runtime packages from `package.json`

- `@gsap/react`
- `@tailwindcss/vite`
- `@tsparticles/engine`
- `@tsparticles/react`
- `@tsparticles/slim`
- `clsx`
- `coderarmy-3dsa` (legacy self-reference; cleanup required)
- `d3`
- `framer-motion`
- `gsap`
- `motion`
- `nanoid`
- `react`
- `react-dom`
- `react-helmet`
- `react-icons`
- `react-router-dom`
- `simplex-noise`
- `tailwind-merge`
- `tailwind-scrollbar`
- `tw-animate-css`
- `zustand`

### Installed development packages

- `@eslint/js`
- `@types/react`
- `@types/react-dom`
- `@vitejs/plugin-react`
- `eslint`
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `globals`
- `vite`

### Newly added packages

No package history is available because the project directory is reported as untracked by the parent workspace. `tw-animate-css` is present in the current package metadata but was absent from the earlier project snapshot; confirm whether it is intentionally required.

### Unused packages

No definitive unused-package analysis was run. Static inspection shows active use of React, React Router, Motion/Framer Motion, GSAP, D3, Zustand, Tailwind, React Helmet, and related UI dependencies. Run a dependency analyzer separately before removing anything; package removal could affect visualizer modules not reached from the homepage.

## Homepage Components

The application flow is:

```text
src/main.jsx
  -> BrowserRouter
    -> App.jsx
      -> Layout.jsx
        -> Navbar.jsx
        -> Outlet
          -> Home.jsx for /
             -> HomeRedesign.jsx for the redesigned homepage composition
                -> Seo.jsx
                -> ui/animated-bars.jsx
                -> home/TextFrame.jsx
                -> home/TextHoverEffect.jsx
                -> category cards and React Router Links
                -> race-mode route CTA
```

Homepage-related files:

- `src/components/Home.jsx`: homepage route component, category data, SEO entry, legacy visual effects, and footer integration.
- `src/components/HomeRedesign.jsx`: redesigned hero, category accordion cards, algorithm links, race-mode CTA, and redesign footer.
- `src/components/Seo.jsx`: page title, description, keywords, Open Graph, Twitter, and canonical metadata.
- `src/components/ui/animated-bars.jsx`: reusable animated bar background used by the redesign.
- `src/components/home/AnimatedBars.jsx`: alternate homepage bar animation component.
- `src/components/home/TextFrame.jsx`: hero eyebrow/label component.
- `src/components/home/TextHoverEffect.jsx`: interactive Visorithm heading component.
- `src/components/ui/cover.jsx`: legacy homepage heading cover effect.
- `src/components/ui/text-generate-effect.jsx`: legacy animated text effect.
- `src/components/ui/wavy-background.jsx`: legacy homepage background effect.
- `src/components/ui/hover-border-gradient.jsx`: legacy race-mode CTA treatment.
- `src/components/ui/3d-card.jsx`: legacy category-card presentation primitives.
- `src/components/Footer.jsx`: footer, legal modals, resources, and GitHub social dock used by the legacy `Home.jsx` path.
- `src/components/Layout.jsx`: shared navbar and outlet shell around the homepage.
- `src/components/Navbar.jsx`: shared Visorithm branding and algorithm search.

## Remaining Tasks

- Replace `https://visorithm.example.com` with the real production domain in HTML, React SEO, README, robots, and sitemap.
- Confirm the real GitHub repository path before using the README clone command.
- Remove or rename the legacy `coderarmy-3dsa` self-dependency in `package.json`, then regenerate `package-lock.json`.
- Supply the final Visorithm logo and update the marked logo TODO locations.
- Add valid `/og-image.png` and `/twitter-image.png` assets or update/remove those metadata references.
- Supply valid PWA icons and screenshots or remove the nonexistent manifest entries.
- Decide whether GitHub, LinkedIn, portfolio, and documentation links in `HomeRedesign.jsx` should be real anchors.
- Add verified LinkedIn, portfolio, email, or other social links if desired.
- Refresh sitemap `lastmod` dates and verify all indexed routes after deployment.
- Review privacy policy, terms, author attribution, and copyright wording for the actual owner and jurisdiction.
- Confirm whether the legacy `Home.jsx` or `HomeRedesign.jsx` is the intended active homepage and remove dead composition code only after behavior is verified.
- Run `npm run lint` and `npm run build` after dependency metadata cleanup.
- Perform a dependency usage review before removing any package.
- Add analytics only after selecting a provider and reviewing consent/privacy requirements.
