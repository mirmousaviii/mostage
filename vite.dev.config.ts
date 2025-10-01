import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  // Set root to dev directory for development
  root: "dev",

  // Development server configuration for Mostage framework
  server: {
    port: 3000,
    open: true,
    host: true, // Allow external connections
    cors: true,
  },

  // Build configuration for development
  build: {
    outDir: "dist-dev",
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Mostage",
      formats: ["es", "cjs"],
      fileName: (format) => {
        const ext = format === "es" ? "js" : "cjs";
        return `index.${ext}`;
      },
    },
    rollupOptions: {
      external: ["fs", "path", "url"],
      output: {
        exports: "named",
        globals: {
          fs: "fs",
          path: "path",
          url: "url",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "index.css") {
            return "mostage.css";
          }
          return assetInfo.name;
        },
      },
    },
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },

  // Optimize dependencies for faster dev server
  optimizeDeps: {
    include: ["marked", "prismjs"],
  },

  // CSS configuration
  css: {
    devSourcemap: true,
  },

  // Plugin configuration
  plugins: [
    // Add any development-specific plugins here
  ],
});
