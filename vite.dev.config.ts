import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  // Set root to demo template directory for development
  root: "src/core/templates/demo",

  // Development server configuration for Mostage framework
  server: {
    port: 3000,
    open: true,
    host: true, // Allow external connections
    cors: true,
  },

  // Build configuration for development - both core and CLI
  build: {
    outDir: "dist/dev",
    sourcemap: true,
    lib: {
      entry: {
        // Multiple entry points for core and CLI
        index: resolve(__dirname, "src/core/index.ts"), // Core library
        cli: resolve(__dirname, "src/cli/index.ts"), // CLI
      },
      name: "Mostage",
      formats: ["es", "cjs"],
      fileName: (format, entryName) => {
        const ext = format === "es" ? "js" : "cjs";
        return entryName === "cli" ? `cli/index.${ext}` : `index.${ext}`;
      },
    },
    rollupOptions: {
      external: [
        "fs",
        "path",
        "url",
        "commander",
        "chalk",
        "inquirer",
        "fs-extra",
        "child_process",
        "os",
        "util",
      ],
      output: {
        exports: "named",
        globals: {
          fs: "fs",
          path: "path",
          url: "url",
          commander: "commander",
          chalk: "chalk",
          inquirer: "inquirer",
          "fs-extra": "fs-extra",
          child_process: "child_process",
          os: "os",
          util: "util",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "index.css") {
            return "mostage.css";
          }
          return assetInfo.name || "asset";
        },
      },
    },
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@/core": resolve(__dirname, "src/core"),
      "@/cli": resolve(__dirname, "src/cli"),
      "@/types": resolve(__dirname, "src/core/types"),
      // Alias for demo template assets
      "./assets/index.js": resolve(__dirname, "src/core/index.ts"),
    },
  },

  // Optimize dependencies for faster dev server
  optimizeDeps: {
    include: [
      "marked",
      "prismjs",
      "commander",
      "chalk",
      "inquirer",
      "fs-extra",
    ],
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
