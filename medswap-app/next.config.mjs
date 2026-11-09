import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Pages authentifiées lisent la session (cookies) : rendu dynamique, pas de cache statique.
  cacheComponents: false,
  turbopack: {
    root: here,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
