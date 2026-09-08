# Astro Print Friendly

A single-page, scrollable print site template built with Astro and Tailwind CSS. Design in the browser, print to paper or export to PDF with pixel exact pages in your configured paper size.

Use it for company profiles, product one-pagers, brochures, reports, resumes, event handouts, and any document that needs to look identical on screen and on paper.

This is the same framework used to create the Jampuk Intelligence PDF brochure. See the live company site at [www.jampuk.com](https://www.jampuk.com).

## Contents

- [Features](#features)
- [How it works](#how-it-works)
- [Included pages](#included-pages)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [Architecture and conventions](#architecture-and-conventions)
- [Customization](#customization)
- [Adding a new page](#adding-a-new-page)
- [Design system](#design-system)
- [Images and assets](#images-and-assets)
- [Print and PDF export](#print-and-pdf-export)
- [Deployment](#deployment)
- [Configuration reference](#configuration-reference)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Disclaimer](#disclaimer)

## Features

- **True print pages in the browser.** Each visual page is a fixed-size section (your configured paper size, A4 portrait by default) that stacks vertically for scrolling and breaks cleanly when printed.
- **Print exact output.** `@page` size, `page-break` rules, `print-color-adjust: exact`, and a 20mm safe margin keep screen and paper in sync.
- **Static output, zero runtime JS.** Astro renders to plain HTML and CSS in `dist/`. No animations, transitions, hover states, or client side interactions to break on paper.
- **Light, ink friendly theme.** Light backgrounds and CMYK adapted palette reduce ink usage and stay readable in print.
- **Reusable print primitives.** `PageSection` for page wrappers and `PrintFooter` for consistent footers with page numbers.
- **Design tokens in one place.** Colors, type, spacing, paper size, and page constraints documented in `DESIGN.md` and wired into `tailwind.config.mjs`, `src/data/paper.ts`, and `src/tailwind.css`.
- **Reference-only pages.** Flag a section with `noPrint` to show it on screen (for example a colophon or style guide) while hiding it from print.
- **Docker ready.** Multi-stage `Dockerfile` for local dev, static build, and nginx production serving, plus `docker-compose.yml` profiles and a `cloudbuild.yaml` for Cloud Run.

## How it works

There is exactly one route: `src/pages/index.astro`.

That file composes full page components from `src/components/` inside a shared `PrintLayout`:

```astro
---
import PrintLayout from "../layouts/PrintLayout.astro";
import CoverPage from "../components/CoverPage.astro";
import IntroductionPage from "../components/IntroductionPage.astro";
import ColophonPage from "../components/ColophonPage.astro";
---

<PrintLayout title="Your Company">
  <CoverPage companyName="Your Company" />
  <IntroductionPage companyName="Your Company" />
  <ColophonPage companyName="Your Company" />
</PrintLayout>
```

Each page component renders one `<section class="print-page">` through the `PageSection` helper. In the browser the sections scroll naturally. In print each section starts on a fresh physical page.

## Included pages

| Component | Purpose | Prints by default |
|-----------|---------|-------------------|
| `CoverPage.astro` | Cover with edition label, tagline, headline, description, and feature box | Yes |
| `IntroductionPage.astro` | About section with pillars, highlights, stats, approach, and values | Yes |
| `ColophonPage.astro` | Typography, color, and spec reference for designers | No (`noPrint`) |
| `PageSection.astro` | Shared page wrapper, renders `<section class="print-page">` | Helper |
| `PrintFooter.astro` | Shared footer with company name, copyright, and `pageNumber / totalPages` | Helper |

`PrintLayout.astro` owns the document `<head>`, Google Fonts loading, and the global `.print-page` CSS.

## Prerequisites

- Node.js 20 or later (the Docker images use `node:20-alpine`)
- npm 10 or later

Check your versions:

```bash
node --version
npm --version
```

## Quick start

```bash
# Clone the repo
git clone https://github.com/<your-org>/astro-print-friendly.git
cd astro-print-friendly

# Install dependencies
npm install

# Start the dev server (http://localhost:4321)
npm run dev

# Build static output to dist/
npm run build

# Preview the production build locally
npm run preview
```

## Available scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `astro dev` | Local dev server with reload |
| `start` | `astro dev` | Alias for `dev` |
| `build` | `astro build` | Static build to `dist/` |
| `preview` | `astro preview` | Serve `dist/` locally to verify print output |
| `astro` | `astro` | Direct access to the Astro CLI |

## Project structure

```text
├── public/
│   └── favicon.svg           # Static assets copied as-is to dist/
├── src/
│   ├── components/
│   │   ├── PageSection.astro       # Page wrapper, renders section.print-page
│   │   ├── PrintFooter.astro     # Reusable footer with page numbers
│   │   ├── CoverPage.astro       # Page 1, cover and hero
│   │   ├── IntroductionPage.astro# Page 2, about and highlights
│   │   └── ColophonPage.astro    # Reference page, hidden from print
│   ├── data/                 # Content data files (empty by default, add JSON or TS here)
│   ├── layouts/
│   │   └── PrintLayout.astro # Document head, fonts, global .print-page CSS
│   ├── pages/
│   │   └── index.astro       # The only page, composes all sections
│   ├── styles/
│   │   └── global.css        # Print overrides (.no-print, color adjust)
│   └── tailwind.css          # Tailwind base plus CSS variables and @page rule
├── astro.config.mjs          # Static output plus Tailwind integration
├── tailwind.config.mjs       # Fonts, colors, print safelist
├── tsconfig.json             # Strict TypeScript config
├── Dockerfile                # Dev, build, and nginx production stages
├── docker-compose.yml        # app (prod) and dev (HMR) profiles
├── cloudbuild.yaml           # Build, push, and deploy to Cloud Run
├── DESIGN.md                 # Full print design tokens
```

Do not add extra files under `src/pages/`. New visual pages go in `src/components/` and are composed in `src/pages/index.astro`. See [Adding a new page](#adding-a-new-page).

## Architecture and conventions

These rules keep output deterministic on paper.

1. **Single-page architecture.** One route (`/`), many sections. Each visual page is its own component.
2. **Static print-only output.** No CSS animations, transitions, or keyframes. No `hover:` classes or `:hover` styles. No JavaScript driven interactions. No buttons or clickable UI. For calls to action, render a QR code or a literal URL as a standard link so it stays usable in PDF.
3. **Configured page geometry.** One paper size per site (see [Paper size](#paper-size)), with a `20mm` safe margin on all sides. Use inline `style` attributes with `mm` units for precise layout.
4. **No responsive breakpoints.** Print has one viewport: your configured paper size. Do not use `md:`, `lg:`, or `xl:` prefixes.
5. **Explicit component props.** Every `.astro` component defines a TypeScript `Props` interface in frontmatter and destructures it with `const { ... } = Astro.props`. Keep frontmatter logic limited to data setup and prop parsing.
6. **Shared building blocks.** Reuse `PageSection` and `PrintFooter` instead of duplicating wrappers or footer markup.
7. **Standard hyphens in copy.** Use short hyphens (`-`) in text content. Avoid em dashes and en dashes so typography stays consistent in print.
8. **Direct `<img>` tags for images.** Use plain `<img>` with inline `mm` sizing for deterministic print layout instead of responsive image components.

Standard page pattern:

```astro
---
import PageSection from "../components/PageSection.astro";
import PrintFooter from "../components/PrintFooter.astro";
---

<PageSection>
  <div class="absolute inset-0 flex flex-col justify-between" style="padding: 20mm;">
    <div>
      <!-- Page content here -->
    </div>
    <PrintFooter pageNumber={2} totalPages={3} companyName="Your Company" />
  </div>
</PageSection>
```

For a screen-only reference page:

```astro
<PageSection noPrint>
  <!-- Visible in browser, hidden in print via .no-print -->
</PageSection>
```

## Customization

### 1. Edit content

Start in `src/pages/index.astro`. Update the props passed to each page component:

```astro
<CoverPage
  editionLabel="26.01 Edition"
  companyName="Acme Corporation"
  tagline="Design to print"
  headline="Reports that look"
  headlineAccent="perfect on paper"
  description="Replace this with your own compelling copy."
/>
<IntroductionPage companyName="Acme Corporation" />
```

Then open the component itself (for example `src/components/CoverPage.astro`) to replace placeholder pillars, stats, and feature lists.

For larger documents, move repeated copy into `src/data/` as JSON or TypeScript modules and import them in frontmatter.

### 2. Apply branding

- **Company name and logo.** Replace the text logo in `CoverPage` and `PrintFooter` with your own `<img>` tag sized in `mm` (for example `style="height: 10mm; width: auto;"`). Put the file in `public/` and reference it by root path (for example `/logo.svg`).
- **Colors.** Update the CSS variables in `src/tailwind.css` (`--background`, `--foreground`, `--primary`, `--accent`, and so on) and mirror any print palette changes in `DESIGN.md`.
- **Fonts.** The default stack is Bricolage Grotesque (display), Space Grotesk (headings), Inter (body), and Fira Code (mono), loaded in `PrintLayout.astro`. To change fonts, update the Google Fonts link, the `fontFamily` entries in `tailwind.config.mjs`, and the inline `font-family` styles.
- **Footer.** Set `companyName`, `pageNumber`, and `totalPages` on every `PrintFooter`. Keep numbering sequential across printed pages only. Reference pages with `noPrint` typically use `<PrintFooter showPageNumber={false} />`.

### 3. Page numbers and total pages

`PrintFooter` accepts:

| Prop | Default | Description |
|------|---------|-------------|
| `pageNumber` | undefined | Current printed page number |
| `totalPages` | 4 | Total printed page count, update manually when you add or remove pages |
| `showPageNumber` | true | Set to false for covers or reference pages |
| `companyName` | "Your Company" | Brand shown in the footer |

The cover has no footer by design. The last content page can use the standard footer or its own closing layout.

### 4. Paper size

One paper size applies to the whole site (hybrid: token file + env override).

- **Personalise (default for the repo).** Edit the `paper` token in `src/data/paper.ts`:
  ```ts
  export const paper = { name: "Letter", orientation: "portrait" };
  ```
  Sizes: `A6`, `A5`, `A4`, `A3`, `A2`, `A1`, `A0`, `Letter`, `Legal`, `Tabloid`, `Executive`. Orientations: `portrait`, `landscape` (dimensions swap automatically). Full table in `DESIGN.md`.
- **Per-build override (no code change).** Env vars win over the token file:
  ```bash
  PUBLIC_PAPER_SIZE=A3 PUBLIC_PAPER_ORIENTATION=landscape npm run build
  PUBLIC_PAPER_SIZE=Letter npm run dev
  ```
  Invalid values fail the build with the list of valid names. Empty/unset values fall back to the token file.
- **Docker / Cloud Run.** `docker-compose.yml` forwards `PUBLIC_PAPER_SIZE` / `PUBLIC_PAPER_ORIENTATION`; the `Dockerfile` build stage accepts them as build args; `cloudbuild.yaml` exposes `_PAPER_SIZE` / `_PAPER_ORIENTATION` substitutions.

## Adding a new page

1. Create `src/components/ServicesPage.astro` using the pattern below.
2. Import and insert it in `src/pages/index.astro` in reading order.
3. Renumber every `PrintFooter pageNumber` and update `totalPages` so the printed sequence stays correct.

```astro
---
import PageSection from "../components/PageSection.astro";
import PrintFooter from "../components/PrintFooter.astro";

interface Props {
  companyName?: string;
}

const { companyName = "Your Company" } = Astro.props;
---

<PageSection>
  <div class="absolute inset-0 flex flex-col justify-between" style="padding: 20mm;">
    <div>
      <span style="font-family: 'Space Grotesk', sans-serif; font-size: 6pt; font-weight: 600; color: #0EA5E9; letter-spacing: 0.1em; text-transform: uppercase;">Page 03 - Services</span>
      <h2 style="font-family: 'Bricolage Grotesque', 'Space Grotesk', sans-serif; font-weight: 700; font-size: 22pt; color: #0B132B; margin-top: 2mm;">Our Services</h2>
      <!-- Add cards, tables, or lists here using mm spacing -->
    </div>
    <PrintFooter pageNumber={3} totalPages={4} companyName={companyName} />
  </div>
</PageSection>
```

```astro
---
// src/pages/index.astro
import ServicesPage from "../components/ServicesPage.astro";
---

<PrintLayout title="Your Company">
  <CoverPage companyName="Your Company" />
  <IntroductionPage companyName="Your Company" />
  <ServicesPage companyName="Your Company" />
  <ColophonPage companyName="Your Company" />
</PrintLayout>
```

## Design system

Full tokens live in `DESIGN.md`. Summary:

- **Palette (print adapted).** `surface-base #FAFAFC`, `surface-container #FFFFFF`, `on-surface #0B132B`, `on-surface-variant #475569`, `neutral #64748B`, `tertiary #0EA5E9`, `accent-amber #F59E0B`, `outline #E2E8F0`, `error #EF4444`. Each token lists a CMYK equivalent for the print shop.
- **Type.** Bricolage Grotesque for display, Space Grotesk for headings and labels, Inter for body at 10 to 12pt, Fira Code for code and technical annotations. Body line height 1.5.
- **Spacing.** Millimetre scale for precise print layout: `0.5mm`, `1mm`, `4mm`, `8mm`, `16mm`, `25mm`, `32mm`, `40mm`, `50mm`, `64mm`. Prefer inline `mm` styles over Tailwind spacing for exact control.
- **Page constraints.** Configured paper size with safe area after `20mm` margins, optional `3mm` bleed for edge to edge printing. See the paper table in `DESIGN.md`.

`tailwind.config.mjs` extends `fontFamily` and theme colors. Use inline `style` attributes with mm units for precise print layout.

### Personalise the design system

The shipped tokens are placeholders. Personalise them before publishing so the document carries your brand, not the template brand.

1. **Start with `DESIGN.md`.** Treat it as the source of truth. Replace the palette table with your brand colors and add a CMYK value per token for the print shop. Confirm body size, line height, and the `mm` spacing scale still suit your content.
2. **Mirror color changes in code.** Update the HSL variables in `src/tailwind.css` (`--background`, `--foreground`, `--primary`, `--accent`, and so on) and the `colors` block in `tailwind.config.mjs` so utilities and components pick up the new palette.
3. **Swap the font stack.** Update the Google Fonts link in `src/layouts/PrintLayout.astro`, the `fontFamily` entries in `tailwind.config.mjs`, and the inline `font-family` styles in your page components. Keep display, heading, body, and mono roles distinct for print hierarchy.
4. **Update the colophon.** `src/components/ColophonPage.astro` hardcodes its type specimens and color swatches, so edit them to match your new tokens. This keeps the on screen reference honest.
5. **Proof one copy.** Build, print or export a single PDF, and check contrast, ink coverage, and readability on paper before a full run. Light backgrounds print cheaper and stay legible.

Keep print mechanics intact while personalising. Do not change the `20mm` safe margin or the `mm` based layout approach. Change brand expression (color, type, logo, tone) and the configured paper size, not print mechanics.

## Images and assets

- **Prefer SVG** for logos, icons, and vector graphics. SVGs are resolution independent and stay sharp in print.
- **Raster images** should be at least 300 DPI at their printed size and fit inside the safe area.
- **CMYK preferred** for final press output. RGB is fine during design but confirm conversion with your printer.
- **Sizing.** Use direct `<img>` tags with inline `mm` dimensions so layout does not shift between screen and print.
- **Placement.** Put all assets in `public/` and reference them by root path (for example `/logo.svg`). Files in `public/` are copied as-is to `dist/`, which keeps print layout loading simple and deterministic. There is no `src/assets/` folder, no Astro `Image` optimization, and no WebP conversion. That pipeline is overkill for this setup and can shift exact `mm` sizing.

## Print and PDF export

The build output in `dist/` is plain HTML and CSS and works with any standard print path.

**Browser print (recommended for quick PDFs):**

1. Run `npm run build` then `npm run preview`, or deploy the `dist/` folder.
2. Open the page in Chrome or Edge.
3. Open Print (`Ctrl + P` or `Cmd + P`).
4. Set Destination to Save as PDF.
5. Set Paper size to match `src/data/paper.ts` (or your `PUBLIC_PAPER_SIZE` override) and Margins to None (margins are built into the layout).
6. Enable Background graphics so brand colors render.
7. Save. Each `.print-page` section becomes one PDF page.

**Tips for clean output:**

- Keep content inside the 20mm safe margin so nothing is clipped by printer hardware margins.
- Verify `totalPages` and `pageNumber` values before exporting.
- Hide draft or reference pages with `<PageSection noPrint>` instead of deleting them.
- For press runs, export the PDF and convert to CMYK with your print shop profile, then proof one physical copy before a full run.

## Deployment

**Static hosting (simplest).** `npm run build` produces `dist/`. Upload it to any static host such as GitHub Pages, Netlify, Vercel, Cloudflare Pages, or an object storage bucket with static website hosting.

**Docker production (nginx):**

```bash
# Build and serve on http://localhost:8080
docker compose up --build app

# Detached
docker compose up --build -d app

# Stop
docker compose down
```

**Docker development (Astro HMR on port 4321):**

```bash
docker compose --profile dev up --build dev
```

The `Dockerfile` has three stages: `development` (Astro dev server), `build` (Astro static build), and `production` (nginx serving `dist/` on port 80).

**Google Cloud Run.** `cloudbuild.yaml` builds the `production` target, pushes to Artifact Registry, and deploys to Cloud Run. Defaults are region `europe-west1`, repository `apps`, and service `astro-print-friendly`. Override with substitution variables `_REGION`, `_REPOSITORY`, and `_SERVICE`.

## Configuration reference

| File | Purpose |
|------|---------|
| `astro.config.mjs` | `output: "static"` plus the `@astrojs/tailwind` integration |
| `tailwind.config.mjs` | Font stacks, theme colors, and safelist for `mm` utilities |
| `src/data/paper.ts` | Global paper size token + `PUBLIC_PAPER_SIZE` / `PUBLIC_PAPER_ORIENTATION` env override |
| `src/tailwind.css` | Tailwind directives, HSL CSS variables, `@page` size from `--page-w`/`--page-h`, print color adjust |
| `src/styles/global.css` | `.no-print { display: none }` in print media plus print quality helpers |
| `src/layouts/PrintLayout.astro` | Fonts, `.print-page` dimensions from resolved paper, `page-break-before` rules |
| `tsconfig.json` | Strict TypeScript, `ES2022`, bundler resolution, `noEmit` for type checking |
| `Dockerfile` | Node 20 build and nginx runtime |
| `docker-compose.yml` | Port 8080 for prod, port 4321 for dev with source volume |
| `cloudbuild.yaml` | Cloud Build pipeline for Artifact Registry and Cloud Run |

## Troubleshooting

| Symptom | Likely cause and fix |
|---------|----------------------|
| Pages break mid section when printing | Content taller than the configured page height or missing `.print-page` wrapper. Keep each page inside one `PageSection` and shorten overflowing copy. |
| Extra blank pages in PDF | Browser margins added on top of the built in 20mm padding. Set browser Margins to None and `@page` margin to 0. |
| Colors look washed out in print | Background graphics disabled. Enable Background graphics and confirm `print-color-adjust: exact` is active. |
| Reference page prints when it should not | Missing `noPrint` prop. Use `<PageSection noPrint>` and confirm `.no-print` is defined in `global.css`. |
| Page numbers out of order | Hardcoded `pageNumber` or `totalPages` not updated after adding a page. Renumber all `PrintFooter` instances. |
| Fonts differ between screen and PDF | Web font blocked or substituted. Check the Google Fonts link in `PrintLayout.astro` and export with network access enabled. |
| Dev server port conflict | Port 4321 already in use. Stop the other process or run `astro dev --port 4331`. |
| Docker volume shows stale output | Anonymous `node_modules` volume or cached layer. Rebuild with `docker compose up --build` and confirm the bind mount points at the repo root. |

## Contributing

Contributions are welcome. For a public repo workflow:

1. Fork the repo and create a feature branch.
2. Keep to the project conventions: single `index.astro` entry point, new visual pages as components, no animations or hover styles, `mm` units for print geometry, explicit `Props` interfaces.
3. Test both paths: `npm run dev` for screen review and browser Print to PDF for paper review.
4. Open a pull request describing the pages touched and attaching a PDF export or screenshots if layout changed.

Please do not add interactive widgets, animation libraries, or responsive breakpoints. Everything merged must render identically on screen and on paper.

## License

Copyright 2026 Jampuk Intelligence Systems

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for the full text.

## Disclaimer

This project was developed with the assistance of Artificial Intelligence (AI) tools for code generation, refactoring, and documentation. All AI generated output has been reviewed and tested by human developers.
