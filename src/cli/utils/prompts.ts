import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { NewOptions, ProjectAnswers } from "../commands/new";
import {
  THEME_CHOICES,
  PLUGIN_CHOICES,
  TRANSITION_CHOICES,
  DEFAULT_VALUES,
} from "./constants";

export class InteractivePrompts {
  static async getAnswers(options: NewOptions): Promise<ProjectAnswers> {
    const questions = await this.buildQuestions(options);
    const answers =
      questions.length > 0 ? await inquirer.prompt(questions) : {};

    return this.mergeAnswers(options, answers);
  }

  private static async buildQuestions(options: NewOptions): Promise<any[]> {
    const questions = [];

    // Project name question
    if (!options.name) {
      const smartDefault = await getSmartDefaultProjectName();
      questions.push({
        type: "input",
        name: "projectName",
        message: "Enter project name:",
        default: smartDefault,
        validate: (input: string) =>
          input.trim() ? true : "Project name is required",
      });
    }

    // Theme question
    if (!options.theme) {
      questions.push({
        type: "list",
        name: "theme",
        message: "Select a theme:",
        choices: THEME_CHOICES,
        default: DEFAULT_VALUES.theme,
      });
    }

    // Plugins question
    if (!options.plugins) {
      questions.push({
        type: "checkbox",
        name: "plugins",
        message: "Select plugins to enable:",
        choices: PLUGIN_CHOICES,
      });
    }

    // Transition question
    if (!options.transition) {
      questions.push({
        type: "list",
        name: "transition",
        message: "Choose slide transition:",
        choices: TRANSITION_CHOICES,
        default: DEFAULT_VALUES.transition,
      });
    }

    // URL hash question
    if (options.urlHash === undefined) {
      questions.push({
        type: "confirm",
        name: "urlHash",
        message: "Enable URL hash navigation?",
        default: DEFAULT_VALUES.urlHash,
      });
    }

    // Center horizontal question
    if (options.centerHorizontal === undefined) {
      questions.push({
        type: "confirm",
        name: "centerHorizontal",
        message: "Center content horizontally?",
        default: DEFAULT_VALUES.centerHorizontal,
      });
    }

    // Center vertical question
    if (options.centerVertical === undefined) {
      questions.push({
        type: "confirm",
        name: "centerVertical",
        message: "Center content vertically?",
        default: DEFAULT_VALUES.centerVertical,
      });
    }

    return questions;
  }

  private static mergeAnswers(
    options: NewOptions,
    answers: any
  ): ProjectAnswers {
    return {
      projectName: answers.projectName,
      template: "custom",
      createConfigFile: true,
      configPath: options.configPath || "./config.json",
      theme: this.getValue(options.theme, answers.theme, DEFAULT_VALUES.theme),
      plugins: options.plugins
        ? options.plugins.split(",").map((p) => p.trim())
        : answers.plugins || [],
      transition: this.getValue(
        options.transition,
        answers.transition,
        DEFAULT_VALUES.transition
      ),
      urlHash: this.getBooleanValue(
        options.urlHash,
        answers.urlHash,
        DEFAULT_VALUES.urlHash
      ),
      centerHorizontal: this.getBooleanValue(
        options.centerHorizontal,
        answers.centerHorizontal,
        DEFAULT_VALUES.centerHorizontal
      ),
      centerVertical: this.getBooleanValue(
        options.centerVertical,
        answers.centerVertical,
        DEFAULT_VALUES.centerVertical
      ),
      createContentFile: true,
      contentPath: options.contentPath || "./content.md",
    };
  }

  private static getValue<T>(
    optionValue: T | undefined,
    answerValue: T | undefined,
    defaultValue: T
  ): T {
    return optionValue ?? answerValue ?? defaultValue;
  }

  private static getBooleanValue(
    optionValue: boolean | undefined,
    answerValue: boolean | undefined,
    defaultValue: boolean
  ): boolean {
    return optionValue !== undefined
      ? optionValue
      : answerValue !== undefined
        ? answerValue
        : defaultValue;
  }
}

async function getSmartDefaultProjectName(): Promise<string> {
  const currentDir = process.cwd();
  const baseName = "mostage-project";
  let finalName = baseName;
  let counter = 1;

  while (true) {
    const projectPath = path.join(currentDir, finalName);

    // Check if folder already exists
    if (!(await fs.pathExists(projectPath))) {
      return finalName;
    }

    // Folder exists, try with number suffix
    finalName = `${baseName}-${counter}`;
    counter++;
  }
}
