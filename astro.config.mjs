import tailwind from "@astrojs/tailwind";

/** @type {import('astro').AstroUserConfig} */
export default {
  output: "static",
  integrations: [
    tailwind(),
  ],
}