import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "example",
  base: "./", // Use relative paths for GitHub Pages

  build: {
    outDir: "../dist/example",
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "example/index.html"),
    },
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },

  // Copy assets
  publicDir: "example",
});
