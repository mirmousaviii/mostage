import inquirer from "inquirer";
import { InitOptions, ProjectAnswers } from "../init";
import {
  TEMPLATE_CHOICES,
  THEME_CHOICES,
  PLUGIN_CHOICES,
  TRANSITION_CHOICES,
  DEFAULT_VALUES,
} from "./constants";

export class InteractivePrompts {
  static async getAnswers(options: InitOptions): Promise<ProjectAnswers> {
    // First, get the template choice
    const templateAnswer = await inquirer.prompt([
      {
        type: "list",
        name: "template",
        message: "Choose a template:",
        choices: TEMPLATE_CHOICES,
        default: options.template || DEFAULT_VALUES.template,
      },
    ]);

    // If basic or demo, return default values immediately
    if (
      templateAnswer.template === "basic" ||
      templateAnswer.template === "demo"
    ) {
      return {
        template: templateAnswer.template,
        createConfigFile: true,
        configPath: "./config.json",
        theme: "dark",
        plugins: ["ProgressBar", "SlideNumber", "Controller", "Confetti"],
        transition: "horizontal",
        urlHash: true,
        centerContent: true,
        createContentFile: true,
        contentPath: "./content.md",
      };
    }

    // For custom template, ask additional questions (without config and content questions)
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "theme",
        message: "Select a theme:",
        choices: THEME_CHOICES,
        default: DEFAULT_VALUES.theme,
      },
      {
        type: "checkbox",
        name: "plugins",
        message: "Select plugins to enable:",
        choices: PLUGIN_CHOICES,
      },
      {
        type: "list",
        name: "transition",
        message: "Choose slide transition:",
        choices: TRANSITION_CHOICES,
        default: DEFAULT_VALUES.transition,
      },
      {
        type: "confirm",
        name: "urlHash",
        message: "Enable URL hash navigation?",
        default: DEFAULT_VALUES.urlHash,
      },
      {
        type: "confirm",
        name: "centerContent",
        message: "Center content?",
        default: DEFAULT_VALUES.centerContent,
      },
    ]);

    return {
      template: templateAnswer.template,
      createConfigFile: true, // Always create config file
      configPath: "./config.json", // Always use default config path
      theme: answers.theme || DEFAULT_VALUES.theme,
      plugins: answers.plugins || [],
      transition: answers.transition || DEFAULT_VALUES.transition,
      urlHash:
        answers.urlHash !== undefined
          ? answers.urlHash
          : DEFAULT_VALUES.urlHash,
      centerContent:
        answers.centerContent !== undefined
          ? answers.centerContent
          : DEFAULT_VALUES.centerContent,
      createContentFile: true, // Always create content file
      contentPath: "./content.md", // Always use default content path
    };
  }
}
