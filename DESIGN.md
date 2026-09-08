# Print Site Design System

Design tokens for print sites. Adapted for 300 DPI print output and PDF generation. Light theme optimized for printed output - light backgrounds reduce ink usage and improve readability on paper.

## Color Palette (Print/CMYK Adapted)

| Token | Hex | CMYK (Print) | Usage |
|-------|-----|--------------|-------|
| surface-base | `#FAFAFC` | 1, 1, 0, 1 | Page background |
| surface-container | `#FFFFFF` | 0, 0, 0, 0 | Cards, panels, elevated blocks |
| surface-container-high | `#F1F5F9` | 3, 3, 0, 2 | Elevated interactive surfaces, hover states |
| on-surface | `#0B132B` | 95, 80, 45, 55 | Headings, primary body text |
| on-surface-variant | `#475569` | 55, 40, 30, 15 | Secondary body text, subtitles, labels |
| neutral | `#64748B` | 45, 30, 22, 8 | Muted text, captions, metadata |
| tertiary | `#0EA5E9` | 80, 50, 0, 0 | Primary accent, icons, action color |
| accent-amber | `#F59E0B` | 0, 35, 80, 0 | Warning states, secondary accents |
| outline | `#E2E8F0` | 8, 5, 2, 2 | Borders, dividers, subtle separators |
| error | `#EF4444` | 0, 80, 65, 0 | Error states |

## Typography

| Property | Value |
|----------|-------|
| Font Family | Bricolage Grotesque (display/headlines), Space Grotesk (headings), Inter (body), Fira Code (mono) |
| Heading Scale | Scale based on page ratio (1.333x between sizes) - using Space Grotesk |
| Body Size | 10-12pt equivalent at 300 DPI - using Inter |
| Line Height | 1.5 for body text |
| Mono Usage | Fira Code for code snippets or technical annotations |

## Spacing Scale (Metric)

Spacing uses mm units for precise print layout:

- `0.5mm` = 4px at 300dpi
- `1mm` = 8px at 300dpi
- `4mm` = 32px at 300dpi
- `8mm` = 64px at 300dpi
- `16mm` = 128px at 300dpi
- `25mm` = 200px at 300dpi
- `32mm` = 256px at 300dpi
- `40mm` = 320px at 300dpi
- `50mm` = 400px at 300dpi
- `64mm` = 512px at 300dpi

## Paper Sizes

One paper size applies to the whole site, configured in `src/data/paper.ts`
(personalise the `paper` token) with optional per-build override via env vars
`PUBLIC_PAPER_SIZE` / `PUBLIC_PAPER_ORIENTATION`. Supported sizes (portrait W x H):

| Name | Portrait (mm) | Usable at 20mm margin (mm) |
|------|---------------|----------------------------|
| A6 | 105 x 148 | 65 x 108 |
| A5 | 148 x 210 | 108 x 170 |
| A4 | 210 x 297 | 170 x 257 |
| A3 | 297 x 420 | 257 x 380 |
| A2 | 420 x 594 | 380 x 554 |
| A1 | 594 x 841 | 554 x 801 |
| A0 | 841 x 1189 | 801 x 1149 |
| Letter | 215.9 x 279.4 | 175.9 x 239.4 |
| Legal | 215.9 x 355.6 | 175.9 x 315.6 |
| Tabloid | 279.4 x 431.8 | 239.4 x 391.8 |
| Executive | 184.2 x 266.7 | 144.2 x 226.7 |

Landscape swaps width and height. Default is A4 portrait.

## Page Constraints

- Page size: resolved from the paper config (see table above)
- Safe margin: 20mm from all edges
- Bleed: 3mm if edge-to-edge printing

## Image Requirements

- Resolution: 300 DPI minimum
- Color profile: CMYK preferred for print
- Maximum dimensions: Fit within the safe margin (page size minus 20mm margins)
- SVGs preferred for icons/logos (resolution-independent)

## Print-Specific Utilities

Use inline `style` attributes with mm units for precise print layout (Tailwind mm utilities are not defined):
- `style="margin-top: 4mm;"`
- `style="width: 80mm;"`
- `style="height: 100mm;"`
