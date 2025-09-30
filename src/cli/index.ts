#!/usr/bin/env node

import { Command } from "commander";
import pkg from "../../package.json";
import { initCommand } from "./commands/init/index";
import { exampleCommand } from "./commands/example/index";
import { devCommand } from "./commands/dev/index";
import { buildCommand } from "./commands/build/index";
import { themeCommand } from "./commands/theme/index";
import { pluginCommand } from "./commands/plugin/index";

// Initialize CLI
const program = new Command();

// Set CLI name, description, and version
program.name("Mostage CLI").description(pkg.description).version(pkg.version);

// Initialize commands

// Initialize init command (custom template only)
program
  .command("init")
  .description("Create a new custom Mostage project")
  .option("--name <name>", "Project name (creates a folder with this name)")
  .option("--content-path <path>", "Path to content file")
  .option("--config-path <path>", "Path to config file")
  .option(
    "--theme <theme>",
    "Theme to use (dark, light, dracula, ocean, rainbow)"
  )
  .option("--plugins <plugins>", "Comma-separated list of plugins to enable")
  .option(
    "--transition <transition>",
    "Slide transition type (horizontal, vertical, fade)"
  )
  .option("--url-hash [boolean]", "Enable/disable URL hash navigation")
  .option(
    "--center-horizontal [boolean]",
    "Enable/disable horizontal content centering"
  )
  .option(
    "--center-vertical [boolean]",
    "Enable/disable vertical content centering"
  )
  .action(initCommand);

// Initialize example command
program
  .command("example")
  .description("Create a new Mostage project from examples")
  .option("--template <template>", "Example template to use (basic, demo)")
  .action(exampleCommand);

// Initialize dev command
program
  .command("dev")
  .description("Start development server")
  .option("-p, --port <port>", "Port to run the server on", "3000")
  .option("-h, --host <host>", "Host to bind the server to", "localhost")
  .option("-d, --dir <path>", "Project directory to serve", ".")
  .action(devCommand);

// Initialize build command
program
  .command("build")
  .description("Build the project for production")
  .option("-o, --output <dir>", "Output directory", "dist")
  .action(buildCommand);

// Initialize theme command
program
  .command("theme")
  .description("Manage themes")
  .option("-l, --list", "List available themes")
  .option("-a, --add <name>", "Add a new theme")
  .option("-r, --remove <name>", "Remove a theme")
  .action(themeCommand);

// Initialize plugin command
program
  .command("plugin")
  .description("Manage plugins")
  .option("-l, --list", "List available plugins")
  .option("-a, --add <name>", "Add a new plugin")
  .option("-r, --remove <name>", "Remove a plugin")
  .action(pluginCommand);

// TODO: Add commands for export, import

// Parse command line arguments
program.parse();
