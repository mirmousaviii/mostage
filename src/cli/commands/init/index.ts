import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
// CLI Init Command Types
export interface InitOptions {
  name?: string;
  template?: string;
  contentPath?: string;
  configPath?: string;
  theme?: string;
  plugins?: string;
  transition?: string;
  urlHash?: boolean;
  centerHorizontal?: boolean;
  centerVertical?: boolean;
}

export interface ProjectAnswers {
  projectName?: string;
  template: string;
  createConfigFile: boolean;
  configPath?: string;
  theme: string;
  plugins: string[];
  transition: string;
  urlHash: boolean;
  centerHorizontal: boolean;
  centerVertical: boolean;
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
import { ProjectValidator } from "../../utils/validators";
import { InteractivePrompts } from "../../utils/prompts";
import { TemplateFactory } from "../../generators/template-strategies";

export async function initCommand(options: InitOptions): Promise<void> {
  try {
    // Validate input options
    ProjectValidator.validateOptions(options);

    // Show welcome message
    showWelcomeMessage();

    // Get project answers (interactive or non-interactive)
    const answers = await getProjectAnswers(options);

    // Merge options with answers and set template to custom
    const finalOptions = mergeOptions(options, answers);
    finalOptions.template = "custom";

    // Determine project path based on name option and directory state
    const projectPath = await determineProjectPath(options, answers);

    // Create custom template
    const templateStrategy = TemplateFactory.create("custom");
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

// checkDirectorySafety function removed - replaced with determineProjectPath

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
  // Check if ALL required options are provided (complete non-interactive mode)
  // urlHash and center are optional, so we don't check them
  return !!(
    options.name &&
    options.theme &&
    options.plugins &&
    options.transition
  );
}

function buildNonInteractiveAnswers(options: InitOptions): ProjectAnswers {
  // Parse plugins string if provided
  let parsedPlugins: string[] = [];
  if (options.plugins) {
    parsedPlugins = options.plugins.split(",").map((p) => p.trim());
  } else {
    // Default plugins for non-interactive mode
    parsedPlugins = ["ProgressBar", "SlideNumber", "Controller", "Confetti"];
  }

  return {
    template: options.template || "custom",
    createConfigFile: true,
    configPath: options.configPath,
    theme: options.theme || "dark",
    plugins: parsedPlugins,
    transition: options.transition || "horizontal",
    urlHash: options.urlHash !== undefined ? options.urlHash : true,
    centerHorizontal:
      options.centerHorizontal !== undefined ? options.centerHorizontal : true,
    centerVertical:
      options.centerVertical !== undefined ? options.centerVertical : true,
    createContentFile: true,
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
      (answers.createContentFile ? "./content.md" : undefined),
    configPath:
      options.configPath ||
      answers.configPath ||
      (answers.createConfigFile ? "./config.json" : undefined),
    theme: answers.theme || "dark",
    plugins: answers.plugins || [],
    transition: answers.transition || "horizontal",
    urlHash: answers.urlHash !== undefined ? answers.urlHash : true,
    centerHorizontal:
      answers.centerHorizontal !== undefined ? answers.centerHorizontal : true,
    centerVertical:
      answers.centerVertical !== undefined ? answers.centerVertical : true,
    createContentFile: true,
    createConfigFile: true,
  };
}

function showSuccessMessage(): void {
  console.log(chalk.green.bold("✅ Project created successfully!\n"));
  console.log(chalk.yellow("Next steps:"));
  console.log("  1. Run `mostage dev` to start the development server");
  console.log("  2. Open your browser and start editing your slides");
  console.log("  3. Run `mostage build` when ready to build\n");
}

async function determineProjectPath(
  options: InitOptions,
  answers: ProjectAnswers
): Promise<string> {
  const currentDir = process.cwd();

  // Check if current directory is empty
  const files = await fs.readdir(currentDir);
  const isEmpty = files.length === 0;

  // If name is provided via --name option, create a folder with that name
  if (options.name) {
    return await createProjectFolder(currentDir, options.name);
  }

  // If projectName is provided via interactive prompt, create a folder with that name
  if (answers.projectName) {
    return await createProjectFolder(currentDir, answers.projectName);
  }

  // If directory is empty, use current directory
  if (isEmpty) {
    return currentDir;
  }

  // Directory is not empty, need to create a subfolder
  const defaultName = "mostage-project";
  return await createProjectFolder(currentDir, defaultName);
}

async function createProjectFolder(
  currentDir: string,
  folderName: string
): Promise<string> {
  let finalFolderName = folderName;
  let counter = 1;

  while (true) {
    const projectPath = path.join(currentDir, finalFolderName);

    // Check if folder already exists
    if (!(await fs.pathExists(projectPath))) {
      // Create the folder
      await fs.ensureDir(projectPath);
      return projectPath;
    }

    // Folder exists, try with number suffix
    finalFolderName = `${folderName}-${counter}`;
    counter++;
  }
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
