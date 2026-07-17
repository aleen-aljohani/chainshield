/**
 * Static export config.
 *
 * - `output: 'export'` produces a fully static site in `out/` that can be hosted
 *   anywhere (GitHub Pages, Netlify, any static host). The whole app is
 *   client-side (localStorage), so no server is needed.
 * - `basePath`/`assetPrefix` are set only when PAGES_BASE_PATH is provided
 *   (the GitHub Pages workflow sets it to "/chainshield"), so local `npm run dev`
 *   keeps working at the root.
 */
const basePath = process.env.PAGES_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
