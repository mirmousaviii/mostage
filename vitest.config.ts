import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    // Include tests from both src/ and test/ directories
    include: ["src/**/*.{test,spec}.{js,ts}", "test/**/*.{test,spec}.{js,ts}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/vite.*.config.*",
        "**/coverage/**",
        "**/test/**",
        "**/docs/**",
        "**/examples/**",
        "**/demo/**",
        "**/mostage-demo/**",
        "**/*.test.*",
        "**/*.spec.*",
        // Exclude test helpers and fixtures from coverage
        "test/helpers/**",
        "test/fixtures/**",
        "test/setup.ts",
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@/core": resolve(__dirname, "./src/core"),
      "@/cli": resolve(__dirname, "./src/cli"),
      "@/types": resolve(__dirname, "./src/core/types"),
      // Test helpers
      "@/test-helpers": resolve(__dirname, "./test/helpers/test-helpers"),
      "@/mock-factories": resolve(__dirname, "./test/helpers/mock-factories"),
      "@/test-data": resolve(__dirname, "./test/helpers/test-data"),
    },
  },
  esbuild: {
    target: "node14",
  },
});
