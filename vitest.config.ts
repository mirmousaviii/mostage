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
      // Test helpers
      "@/test-helpers": resolve(__dirname, "./test/helpers/test-helpers"),
      "@/mock-factories": resolve(__dirname, "./test/helpers/mock-factories"),
      "@/test-data": resolve(__dirname, "./test/helpers/test-data"),
      // For CLI tests, map to dist files
      "../../src/cli/index": resolve(__dirname, "./dist/cli/index.js"),
      "../commands/": resolve(__dirname, "./dist/cli/commands/"),
      // Map utility imports to source files
      "../../src/core/utils/markdown-parser": resolve(
        __dirname,
        "./src/core/utils/markdown-parser/index.ts"
      ),
      "../../src/core/utils/syntax-highlighter": resolve(
        __dirname,
        "./src/core/utils/syntax-highlighter/index.ts"
      ),
      "../../src/core/plugin-base": resolve(
        __dirname,
        "./src/core/plugin-base.ts"
      ),
      "../../src/core/plugins/progress-bar": resolve(
        __dirname,
        "./src/core/plugins/progress-bar/index.ts"
      ),
      "../../src/core/services/config-service": resolve(
        __dirname,
        "./src/core/services/config-service.ts"
      ),
      "../../src/core/services/content-service": resolve(
        __dirname,
        "./src/core/services/content-service.ts"
      ),
      "../../src/core/services/theme-service": resolve(
        __dirname,
        "./src/core/services/theme-service.ts"
      ),
      "../../src/core/engine/mostage-engine": resolve(
        __dirname,
        "./src/core/engine/mostage-engine.ts"
      ),
    },
  },
  esbuild: {
    target: "node14",
  },
});
