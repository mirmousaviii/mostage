import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    dts({
      outDir: "dist/types",
      include: ["src/**/*"],
      exclude: ["src/cli/**/*", "example/**/*"],
    }),
  ],

  build: {
    outDir: "dist",
    emptyOutDir: true,
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
      },
    },
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
