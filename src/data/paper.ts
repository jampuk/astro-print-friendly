/*
  Global paper configuration for the print site (hybrid: token file + env override).

  Resolution order:
    1. Env vars PUBLIC_PAPER_SIZE / PUBLIC_PAPER_ORIENTATION (build-time, optional)
    2. `paper` token below (personalise like other design tokens)
    3. A4 portrait fallback

  One size applies to the whole site. All pages render at the resolved size.
  Usage:
    - Personalise: edit `paper` below, e.g. `{ name: "Letter", orientation: "portrait" }`
    - Per-build override: `PUBLIC_PAPER_SIZE=A3 PUBLIC_PAPER_ORIENTATION=landscape npm run build`
*/

export type PaperName =
  | "A6"
  | "A5"
  | "A4"
  | "A3"
  | "A2"
  | "A1"
  | "A0"
  | "Letter"
  | "Legal"
  | "Tabloid"
  | "Executive";

export type Orientation = "portrait" | "landscape";

export interface PaperDefinition {
  widthMm: number;
  heightMm: number;
}

/* Portrait base dimensions in mm. Landscape swaps w/h at resolve time. */
export const PAPER_SIZES: Record<PaperName, PaperDefinition> = {
  A6: { widthMm: 105, heightMm: 148 },
  A5: { widthMm: 148, heightMm: 210 },
  A4: { widthMm: 210, heightMm: 297 },
  A3: { widthMm: 297, heightMm: 420 },
  A2: { widthMm: 420, heightMm: 594 },
  A1: { widthMm: 594, heightMm: 841 },
  A0: { widthMm: 841, heightMm: 1189 },
  Letter: { widthMm: 215.9, heightMm: 279.4 },
  Legal: { widthMm: 215.9, heightMm: 355.6 },
  Tabloid: { widthMm: 279.4, heightMm: 431.8 },
  Executive: { widthMm: 184.2, heightMm: 266.7 },
};

export const PAPER_NAMES = Object.keys(PAPER_SIZES) as PaperName[];

/* Personalise the site paper here, like other design tokens in DESIGN.md. */
export const paper: { name: PaperName; orientation: Orientation } = {
  name: "A4",
  orientation: "portrait",
};

export const PAPER_MARGIN_MM = 20;

export interface ResolvedPaper {
  name: PaperName;
  orientation: Orientation;
  widthMm: number;
  heightMm: number;
  marginMm: number;
  usableWidthMm: number;
  usableHeightMm: number;
  /** e.g. "A4 Portrait" */
  label: string;
  /** e.g. "A4 Portrait (210mm x 297mm)" */
  spec: string;
}

function readEnv(): Record<string, string | undefined> {
  try {
    const meta = import.meta as unknown as { env?: Record<string, string | undefined> };
    return meta.env ?? {};
  } catch {
    return {};
  }
}

function normalizeName(raw: string): PaperName | null {
  const cleaned = raw.trim().toLowerCase();
  const hit = PAPER_NAMES.find((n) => n.toLowerCase() === cleaned);
  return hit ?? null;
}

function normalizeOrientation(raw: string): Orientation | null {
  const cleaned = raw.trim().toLowerCase();
  if (cleaned === "portrait" || cleaned === "p") return "portrait";
  if (cleaned === "landscape" || cleaned === "l") return "landscape";
  return null;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function resolvePaper(
  nameInput?: string,
  orientationInput?: string,
): ResolvedPaper {
  const env = readEnv();
  const envName = env.PUBLIC_PAPER_SIZE?.trim() ? env.PUBLIC_PAPER_SIZE : undefined;
  const envOrientation = env.PUBLIC_PAPER_ORIENTATION?.trim()
    ? env.PUBLIC_PAPER_ORIENTATION
    : undefined;
  const rawName = nameInput ?? envName ?? paper.name;
  const rawOrientation = orientationInput ?? envOrientation ?? paper.orientation;

  const name = normalizeName(String(rawName));
  if (!name) {
    throw new Error(
      `Unknown paper size "${rawName}". Valid values: ${PAPER_NAMES.join(", ")}. ` +
        `Set via src/data/paper.ts or env var PUBLIC_PAPER_SIZE.`,
    );
  }

  const orientation = normalizeOrientation(String(rawOrientation));
  if (!orientation) {
    throw new Error(
      `Unknown paper orientation "${rawOrientation}". Valid values: portrait, landscape. ` +
        `Set via src/data/paper.ts or env var PUBLIC_PAPER_ORIENTATION.`,
    );
  }

  const base = PAPER_SIZES[name];
  const portrait = orientation === "portrait";
  const widthMm = round1(portrait ? base.widthMm : base.heightMm);
  const heightMm = round1(portrait ? base.heightMm : base.widthMm);
  const marginMm = PAPER_MARGIN_MM;

  return {
    name,
    orientation,
    widthMm,
    heightMm,
    marginMm,
    usableWidthMm: round1(widthMm - marginMm * 2),
    usableHeightMm: round1(heightMm - marginMm * 2),
    label: `${name} ${capitalize(orientation)}`,
    spec: `${name} ${capitalize(orientation)} (${widthMm}mm x ${heightMm}mm)`,
  };
}

/** Resolved site-wide paper (env override > token file > A4 portrait default). */
export function getPaper(): ResolvedPaper {
  return resolvePaper();
}
