# Visorithm Branding Audit

Date: 2026-08-28

## Completed Changes

- Renamed the visible product identity from `Algorithm Arena` and `AlgoArena` to `Visorithm`.
- Updated navbar, footer, FAQ copy, privacy/terms copy, document title, meta descriptions, Open Graph titles, Twitter titles, and structured WebApplication data.
- Replaced the original creator name with `Subrata Mondal` in author metadata and structured data.
- Replaced the original GitHub, X, LinkedIn, and Instagram references with the supplied GitHub profile: https://github.com/subratamondalnsec.
- Removed the original creator's X, LinkedIn, and Instagram links because replacement profiles were not supplied.
- Renamed npm package metadata in `package.json` and `package-lock.json` to `visorithm`.
- Kept `public/logo.png`, `public/img1.png`, `public/img2.png`, `public/img3.png`, and `public/img4.png` unchanged.

## Files Modified

- `index.html`: document title, author, canonical URL, preconnect URL, Open Graph and Twitter metadata, and logo replacement TODO.
- `package.json`: npm project name.
- `package-lock.json`: root npm project name, self-reference, and linked package key.
- `README.md`: logo alt text, project description, demo URL, clone instructions, and creator credit.
- `src/App.jsx`: WebApplication structured data and top-level SEO tags.
- `src/components/Seo.jsx`: shared page title, base URL, and SEO defaults.
- `src/components/Navbar.jsx`: visible navbar brand.
- `src/components/Footer.jsx`: brand, copyright, social links, and policy text.
- `src/components/FAQ.jsx`: product references and FAQ SEO copy.
- `public/manifest.json`: application name and short name, plus an asset TODO field.
- `public/robots.txt`: sitemap URL and production-domain TODO.
- `public/sitemap.xml`: all site URLs and production-domain TODO.
- `BRANDING_AUDIT.md`: this audit and deployment checklist.

## Branding References Found

- Product name: `Algorithm Arena` in the HTML shell, React app SEO, navbar, footer, FAQ, policy text, and README. All replaced with `Visorithm`.
- Short product name: `AlgoArena` in the manifest and FAQ keywords. Replaced with `Visorithm`.
- Related generic credit: `Algorithm Visualizer` in the footer copyright. Replaced with `Visorithm`.
- Original creator: `Deven Wagh` and `DEVENWAGH` in author metadata, structured data, footer links, and README. Replaced or removed.
- Original deployment host: `coder-army-algo-arena.vercel.app` in metadata, robots, sitemap, and README. Replaced with the temporary placeholder host below.

## External Links Found

First-party links after this migration:

- GitHub: https://github.com/subratamondalnsec in `src/components/Footer.jsx` and `README.md`.
- Temporary canonical/demo host: `https://visorithm.example.com` in `index.html`, `src/App.jsx`, `src/components/Seo.jsx`, `public/robots.txt`, `public/sitemap.xml`, and `README.md`.
- Schema namespace: `https://schema.org` in `src/App.jsx` and `src/components/FAQ.jsx`.
- Sitemap namespace: `http://www.sitemaps.org/schemas/sitemap/0.9` in `public/sitemap.xml`.
- README badge and package provenance URLs remain external documentation/dependency links, not creator branding.

The dependency URLs in `package-lock.json` point to npm registries and package sponsors. They are third-party package metadata and were intentionally not changed.

## Social, Profile, Portfolio, and Contact Audit

- GitHub: original creator link removed; replaced with `https://github.com/subratamondalnsec`.
- X/Twitter: original creator link removed; no replacement supplied.
- LinkedIn: original creator link removed; no replacement supplied.
- Instagram: original creator link removed; no replacement supplied.
- Portfolio links: none found in first-party source.
- Email or contact information: none found. The policy copy directs users to GitHub.
- Additional author or credit references: none remain after the migration.

## Logo References

`public/logo.png` is referenced in:

- `index.html` as the favicon and preload image.
- `README.md` as the displayed project logo.

Both references remain unchanged in implementation. TODO comments identify where the final Visorithm logo should be substituted. The four public screenshots/images were not modified.

## SEO and Structured Data Audit

- `index.html`: title, title meta tag, description, keywords, author, Open Graph type/url/title/description/image, Twitter card/url/title/description/image, theme color, robots directive, canonical URL, favicon, and preload.
- `src/App.jsx`: Helmet title, description, keywords, Open Graph fields, Twitter fields, canonical URL, and WebApplication JSON-LD including name, description, category, operating system, offer, author, keywords, URL, and software version.
- `src/components/Seo.jsx`: shared title, description, keywords, Open Graph fields, Twitter fields, image, and canonical URL.
- `src/components/FAQ.jsx`: FAQPage JSON-LD plus FAQ page description and keywords.
- `public/manifest.json`: name, short name, description, start URL, display mode, colors, orientation, icons, screenshots, and categories.
- `public/robots.txt`: crawler access and sitemap location.
- `public/sitemap.xml`: canonical URL list, last modified dates, change frequencies, and priorities.
- Analytics identifiers: none found (`gtag`, Google Analytics IDs, and `UA-` identifiers are absent).

## Recommended Replacement Values

- Production domain: replace every `https://visorithm.example.com` occurrence with the final deployed Visorithm origin, including the trailing-slash conventions used in canonical URLs.
- GitHub repository: confirm `https://github.com/subratamondalnsec/Visorithm.git` is the actual repository path before publishing the README command.
- Author: confirm whether `Subrata Mondal` is the preferred public display name and update it if needed.
- Social profiles: add verified X, LinkedIn, Instagram, portfolio, and contact URLs only when available.
- Social preview images: replace `/og-image.png` and `/twitter-image.png` with real assets if those files are intended for production; they are currently referenced but are not present in `public/`.
- PWA assets: update manifest icon and screenshot paths to files that exist, or add the final assets during deployment. Do not use the placeholder asset paths as production claims.
- Sitemap: refresh all `lastmod` values at release time and remove any routes that are not intended to be indexed.
- Analytics: add a verified analytics identifier only after a consent/privacy review. No identifier currently exists to migrate.
- Legal: review the placeholder privacy and terms text with the actual owner and jurisdiction before deployment.

## Migration Checklist

- [x] Replace visible product branding with Visorithm.
- [x] Replace old creator references and remove old social profiles.
- [x] Set supplied GitHub profile in the footer and README.
- [x] Audit and update HTML, React, manifest, robots, and sitemap branding.
- [x] Preserve all five public image assets unchanged.
- [x] Add logo replacement TODO guidance.
- [x] Document missing portfolio, contact, and analytics identifiers.
- [ ] Replace `visorithm.example.com` with the real production domain everywhere.
- [ ] Confirm the GitHub repository URL and repository visibility.
- [ ] Supply final Visorithm logo and update the marked references.
- [ ] Supply valid Open Graph and Twitter preview images.
- [ ] Supply valid PWA icon and screenshot assets or remove their manifest entries.
- [ ] Add verified social, portfolio, and contact links if desired.
- [ ] Review privacy policy, terms, author attribution, and copyright wording.
- [ ] Refresh sitemap dates and verify every indexed route.
- [ ] Add analytics only after choosing the provider and privacy requirements.
- [ ] Run `npm install`, `npm run lint`, and `npm run build` in the workspace before deployment.
