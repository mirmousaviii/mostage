import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    dts({
      outDir: "dist/types",
      include: ["src/**/*"],
      exclude: ["src/cli/**/*", "src/core/templates/**/*"],
      rollupTypes: true,
      copyDtsFiles: true,
    }),
  ],

  build: {
    outDir: "dist",
    emptyOutDir: true,
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

  optimizeDeps: {
    include: ["marked", "prismjs"],
  },
});
