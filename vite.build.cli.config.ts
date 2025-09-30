import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false, // Don't empty since library might be built first
    sourcemap: false, // CLI doesn't need sourcemaps
    minify: "terser",
    lib: {
      entry: resolve(__dirname, "src/cli/index.ts"),
      name: "MostageCLI",
      formats: ["es", "cjs"],
      fileName: (format) => {
        const ext = format === "es" ? "js" : "cjs";
        return `cli/index.${ext}`;
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
      },
    },
    terserOptions: {
      compress: {
        drop_console: false, // Keep console for CLI
        drop_debugger: true,
      },
    },
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },

  optimizeDeps: {
    include: ["commander", "chalk", "inquirer", "fs-extra"],
  },
});
