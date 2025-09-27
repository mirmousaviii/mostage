#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { initCommand } from "./commands/init";
import { devCommand } from "./commands/dev";
import { buildCommand } from "./commands/build";
import { themeCommand } from "./commands/theme";
import { pluginCommand } from "./commands/plugin";

const program = new Command();

program
  .name("mostage")
  .description("Mostage CLI - Presentation framework based on markdown")
  .version("1.0.2");

// Init command
program
  .command("init")
  .description("Create a new Mostage project")
  .option("-t, --template <template>", "Template to use (basic, demo)")
  .option("-c, --content-path <path>", "Path to content file")
  .option("--config-path <path>", "Path to config file")
  .action(initCommand);

// Dev command
program
  .command("dev")
  .description("Start development server")
  .option("-p, --port <port>", "Port to run the server on", "3000")
  .option("-h, --host <host>", "Host to bind the server to", "localhost")
  .action(devCommand);

// Build command
program
  .command("build")
  .description("Build the project for production")
  .option("-o, --output <dir>", "Output directory", "dist")
  .action(buildCommand);

// Theme command
program
  .command("theme")
  .description("Manage themes")
  .option("-l, --list", "List available themes")
  .option("-a, --add <name>", "Add a new theme")
  .option("-r, --remove <name>", "Remove a theme")
  .action(themeCommand);

// Plugin command
program
  .command("plugin")
  .description("Manage plugins")
  .option("-l, --list", "List available plugins")
  .option("-a, --add <name>", "Add a new plugin")
  .option("-r, --remove <name>", "Remove a plugin")
  .action(pluginCommand);

// Help command (default)
program
  .command("help")
  .description("Show help information")
  .action(() => {
    console.log(chalk.blue.bold("\n🚀 Mostage CLI - Presentation Framework\n"));
    console.log(
      chalk.gray("Create beautiful presentations with Markdown and HTML\n")
    );
    console.log(chalk.yellow("Commands:"));
    console.log("  init     Create a new project");
    console.log("  dev      Start development server");
    console.log("  build    Build for production");
    console.log("  theme    Manage themes");
    console.log("  plugin   Manage plugins");
    console.log("  help     Show this help");
    console.log("  version  Show version information\n");
    console.log(chalk.gray("For more information, visit: https://mo.js.org\n"));
  });

// Version command
program
  .command("version")
  .description("Show version information")
  .action(() => {
    console.log(chalk.blue.bold("Mostage CLI v1.0.2"));
    console.log(chalk.gray("Presentation framework based on markdown"));
  });

// Parse command line arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
