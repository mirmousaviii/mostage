import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    dts({
      outDir: "dist/core/types",
      include: ["src/**/*"],
      exclude: ["src/cli/**/*"],
      rollupTypes: true,
      copyDtsFiles: true,
    }),
  ],

  build: {
    outDir: "dist/core",
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/core/index.ts"),
      name: "Mostage",
      formats: ["es", "cjs"],
      fileName: (format) => {
        const ext = format === "es" ? "js" : "cjs";
        return `index.${ext}`;
      },
    },
    rollupOptions: {
      external: ["fs", "path", "url"],
      // Preserve entry signatures to maintain class names
      preserveEntrySignatures: "strict",
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
          return assetInfo.name || "asset";
        },
      },
      // Configure treeshaking
      treeshake: {
        moduleSideEffects: (id) => {
          // Keep side effects for prismjs components (language registrations)
          if (id.includes("prismjs")) {
            return true;
          }
          return false;
        },
      },
    },
    // Disable minification for class names
    minify: "terser",
    terserOptions: {
      mangle: {
        // Preserve class names
        keep_classnames: true,
        keep_fnames: true,
        reserved: ["Mostage", "SyntaxHighlighter"],
      },
      compress: {
        // Keep class names during compression
        keep_classnames: true,
        keep_fnames: true,
      },
    },
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },

  optimizeDeps: {
    include: ["marked", "prismjs"],
  },
});
