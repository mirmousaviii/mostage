import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    // Disable dts for CLI build to avoid TypeScript errors from app files
    // dts({
    //   outDir: "dist/types",
    //   tsconfigPath: "./tsconfig.cli.json",
    // }),
  ],

  build: {
    outDir: "dist",
    emptyOutDir: false, // Don't empty since library might be built first
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
      ],
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
