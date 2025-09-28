import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
// CLI Init Command Types
export interface InitOptions {
  template?: string;
  contentPath?: string;
  configPath?: string;
  theme?: string;
  plugins?: string;
  transition?: string;
  urlHash?: boolean;
  center?: boolean;
  config?: boolean;
  content?: boolean;
}

export interface ProjectAnswers {
  template: string;
  createConfigFile: boolean;
  configPath?: string;
  theme: string;
  plugins: string[];
  transition: string;
  urlHash: boolean;
  centerContent: boolean;
  createContentFile: boolean;
  contentPath?: string;
}

export interface ProjectOptions extends ProjectAnswers {
  contentPath?: string;
  configPath?: string;
}

export interface TemplateChoice {
  name: string;
  value: string;
  short: string;
}

export interface ThemeChoice {
  name: string;
  value: string;
}

export interface PluginChoice {
  name: string;
  value: string;
  checked: boolean;
}

export interface TransitionChoice {
  name: string;
  value: string;
}

export interface ConfigContent {
  element: string;
  theme: string;
  contentPath: string;
  scale: number;
  transition: {
    type: string;
    easing: string;
  };
  urlHash: boolean;
  centerContent: {
    vertical: boolean;
    horizontal: boolean;
  };
  header: {
    content: string;
    position: string;
    showOnFirstSlide: boolean;
  };
  footer: {
    content: string;
    position: string;
    showOnFirstSlide: boolean;
  };
  plugins: Record<string, any>;
}

export class InitError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "InitError";
  }
}
import { ProjectValidator } from "./validators";
import { InteractivePrompts } from "./prompts";
import { TemplateFactory } from "./template-strategies";

export async function initCommand(options: InitOptions): Promise<void> {
  try {
    // Validate input options
    ProjectValidator.validateOptions(options);

    // Show welcome message
    showWelcomeMessage();

    // Check directory safety and get final project path
    const initialPath = process.cwd();
    const projectPath = await checkDirectorySafety(initialPath);

    // Get project answers (interactive or non-interactive)
    const answers = await getProjectAnswers(options);

    // Merge options with answers
    const finalOptions = mergeOptions(options, answers);

    // Create template based on selection
    const templateStrategy = TemplateFactory.create(finalOptions.template);
    await templateStrategy.create(projectPath, finalOptions);

    // Show success message
    showSuccessMessage();
  } catch (error) {
    handleError(error);
  }
}

function showWelcomeMessage(): void {
  console.log(chalk.blue.bold("\nMostage CLI - init\n"));
  console.log(chalk.gray("Create presentation project step by step.\n"));
}

async function checkDirectorySafety(projectPath: string): Promise<string> {
  const files = await fs.readdir(projectPath);
  if (files.length > 0) {
    console.log(
      chalk.yellow(
        "⚠️  Directory is not empty. Creating project in a new folder.\n"
      )
    );

    const inquirer = await import("inquirer");
    let folderName = "mostage-project";
    let counter = 1;

    while (true) {
      const answer = await inquirer.default.prompt([
        {
          type: "input",
          name: "folderName",
          message: "Enter folder name for the new project:",
          default: folderName,
          validate: (input: string) => {
            if (!input.trim()) {
              return "Folder name is required";
            }
            return true;
          },
        },
      ]);

      const fullPath = path.join(projectPath, answer.folderName);

      // Check if folder already exists
      if (await fs.pathExists(fullPath)) {
        console.log(
          chalk.red(
            `❌ Folder "${answer.folderName}" already exists. Please choose a different name.\n`
          )
        );
        folderName = `mostage-project-${counter}`;
        counter++;
        continue;
      }

      return fullPath;
    }
  }

  return projectPath;
}

async function getProjectAnswers(
  options: InitOptions
): Promise<ProjectAnswers> {
  // Check if we're in non-interactive mode (CI/CD)
  const isNonInteractive = isNonInteractiveMode(options);

  if (isNonInteractive) {
    console.log(
      chalk.blue(
        "🔧 Non-interactive mode detected. Using provided options...\n"
      )
    );
    return buildNonInteractiveAnswers(options);
  } else {
    return await InteractivePrompts.getAnswers(options);
  }
}

function isNonInteractiveMode(options: InitOptions): boolean {
  return !!options.template;
}

function buildNonInteractiveAnswers(options: InitOptions): ProjectAnswers {
  // Parse plugins string if provided
  let parsedPlugins: string[] = [];
  if (options.plugins) {
    parsedPlugins = options.plugins.split(",").map((p) => p.trim());
  } else {
    // Default plugins for non-interactive mode
    parsedPlugins = ["ProgressBar", "SlideNumber", "Controller"];
  }

  return {
    template: options.template!,
    createConfigFile: options.config !== false,
    configPath: options.configPath,
    theme: options.theme || "dark",
    plugins: parsedPlugins,
    transition: options.transition || "horizontal",
    urlHash: options.urlHash !== false,
    centerContent: options.center !== false,
    createContentFile: options.content !== false,
    contentPath: options.contentPath,
  };
}

function mergeOptions(
  options: InitOptions,
  answers: ProjectAnswers
): ProjectAnswers {
  return {
    template: options.template || answers.template || "basic",
    contentPath:
      options.contentPath ||
      answers.contentPath ||
      (answers.createContentFile ? "./slides.md" : undefined),
    configPath:
      options.configPath ||
      answers.configPath ||
      (answers.createConfigFile ? "./config.json" : undefined),
    theme: answers.theme || "dark",
    plugins: answers.plugins || [],
    transition: answers.transition || "horizontal",
    urlHash: answers.urlHash !== undefined ? answers.urlHash : true,
    centerContent:
      answers.centerContent !== undefined ? answers.centerContent : true,
    createContentFile: answers.createContentFile,
    createConfigFile: answers.createConfigFile,
  };
}

function showSuccessMessage(): void {
  console.log(chalk.green.bold("✅ Project created successfully!\n"));
  console.log(chalk.yellow("Next steps:"));
  console.log("  1. Run `mostage dev` to start the development server");
  console.log("  2. Open your browser and start editing your slides");
  console.log("  3. Run `mostage build` when ready to build\n");
}

function handleError(error: unknown): void {
  if (error instanceof InitError) {
    console.error(chalk.red(`❌ ${error.message}`));
    process.exit(1);
  } else {
    console.error(chalk.red("❌ Error creating project:"), error);
    process.exit(1);
  }
}
