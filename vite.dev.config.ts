import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "example",

  server: {
    port: 3000,
    open: true,
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },

  // For development, we want to serve from example directory
  // and use the source files directly
});
