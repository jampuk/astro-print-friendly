# ── Base: install dependencies ────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

# ── Development: Astro dev server with HMR ────────────────────────────────────
FROM base AS development
EXPOSE 4321
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "4321"]

# ── Build: static output to dist/ ─────────────────────────────────────────────
FROM base AS build
# Optional paper override (hybrid with src/data/paper.ts token).
# Empty by default; resolver ignores empty values and uses the token file.
ARG PUBLIC_PAPER_SIZE=""
ARG PUBLIC_PAPER_ORIENTATION=""
ENV PUBLIC_PAPER_SIZE=$PUBLIC_PAPER_SIZE PUBLIC_PAPER_ORIENTATION=$PUBLIC_PAPER_ORIENTATION
RUN npm run build

# ── Production: serve static dist/ with nginx ─────────────────────────────────
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
