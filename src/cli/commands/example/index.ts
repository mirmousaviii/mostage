import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { TemplateFactory } from "../../generators/template-strategies";
import { EXAMPLE_TEMPLATE_CHOICES } from "../../utils/constants";

export interface ExampleOptions {
  template?: string;
}

export async function exampleCommand(options: ExampleOptions): Promise<void> {
  try {
    console.log(chalk.blue("\nMostage CLI - example"));
    console.log(chalk.gray("Create presentation project from examples.\n"));

    // Validate template if provided
    if (options.template && !["basic", "demo"].includes(options.template)) {
      throw new Error(
        `Invalid template: ${options.template}. Available templates: basic, demo`
      );
    }

    let template: string;

    if (options.template) {
      // Non-interactive mode
      console.log(
        chalk.blue(
          "🔧 Non-interactive mode detected. Using provided options..."
        )
      );
      template = options.template;
    } else {
      // Interactive mode
      const templateAnswer = await inquirer.prompt([
        {
          type: "list",
          name: "template",
          message: "Choose an example template:",
          choices: EXAMPLE_TEMPLATE_CHOICES,
        },
      ]);
      template = templateAnswer.template;
    }

    // Create project
    await createProject(template);

    console.log(chalk.green("\n✅ Project created successfully!"));
    console.log(chalk.gray("\nNext steps:"));
    console.log(
      chalk.gray("  1. Run `mostage dev` to start the development server")
    );
    console.log(
      chalk.gray("  2. Open your browser and start editing your slides")
    );
    console.log(chalk.gray("  3. Run `mostage build` when ready to build"));
  } catch (error) {
    console.error(chalk.red(`❌ Error creating project: ${error}`));
    process.exit(1);
  }
}

async function createProject(template: string): Promise<void> {
  const currentDir = process.cwd();

  // Create project folder with template name
  let folderName = `mostage-${template}`;
  let counter = 1;

  while (true) {
    const projectPath = path.join(currentDir, folderName);
    if (!(await fs.pathExists(projectPath))) {
      await fs.ensureDir(projectPath);

      // Get template strategy and create project
      const strategy = TemplateFactory.create(template);
      const projectOptions = {
        template,
        createConfigFile: true,
        createContentFile: true,
      };
      await strategy.create(projectPath, projectOptions as any);

      console.log(
        chalk.gray(
          `\n📁 Project created in: ${path.relative(process.cwd(), projectPath)}`
        )
      );
      return;
    }
    folderName = `mostage-${template}-${counter}`;
    counter++;
  }
}
