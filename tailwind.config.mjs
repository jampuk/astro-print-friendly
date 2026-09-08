/*
  Tailwind CSS configuration for Print-Friendly Site
  Optimized for 300 DPI print output and PDF generation.
  Page size is global (see src/data/paper.ts); mm utilities stay generic.
*/

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{astro,html,js,svelte,ts}",
    "./pages/**/*.{astro,html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["\"Bricolage Grotesque\"", "\"Space Grotesk\"", "sans-serif"],
        heading: ["\"Space Grotesk\"", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["\"Fira Code\"", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      boxSizing: {
        border: "border-box",
      },
    },
  },
  plugins: [],
}
