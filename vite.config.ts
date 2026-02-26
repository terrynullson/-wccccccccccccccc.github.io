import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const defaultBase = process.env.GITHUB_ACTIONS === "true" && repoName ? `/${repoName}/` : "/";
const base = process.env.BASE_PATH ?? defaultBase;

export default defineConfig({
  base,
  plugins: [react(), svgr()],
  server: {
    host: "0.0.0.0",
    port: 55173,
    strictPort: true,
    allowedHosts: ["wcc.local"],
  },
});
