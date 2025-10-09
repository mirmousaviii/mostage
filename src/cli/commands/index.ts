/**
 * Mostage CLI Commands
 *
 * Centralized CLI command layer for the Mostage presentation framework.
 * This barrel export provides all CLI commands in one place.
 */

// Core commands
export { newCommand } from "./new/index";
export { exampleCommand } from "./example/index";
export { devCommand } from "./dev/index";
export { exportCommand } from "./export/index";
export { themeCommand } from "./theme/index";
export { pluginCommand } from "./plugin/index";

// Command types
export type { NewOptions, ProjectAnswers, ProjectOptions } from "./new/index";
export type { ExampleOptions } from "./example/index";
export type { ExportOptions } from "./export/index";
