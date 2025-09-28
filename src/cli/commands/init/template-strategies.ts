import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import { ProjectOptions } from "../init";
import { ConfigBuilder } from "./config-builder";
import { AssetCopier } from "./asset-copier";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface TemplateStrategy {
  create(projectPath: string, options: ProjectOptions): Promise<void>;
}

export class BasicTemplateStrategy implements TemplateStrategy {
  async create(projectPath: string, options: ProjectOptions): Promise<void> {
    // Ensure project directory exists
    await fs.ensureDir(projectPath);

    // Create content.md only if createContentFile is true
    if (options.createContentFile) {
      await this.createContentFile(projectPath, options);
    }

    // Create config.json only if createConfigFile is true
    if (options.createConfigFile) {
      await this.createConfigFile(projectPath, options);
    }

    // Create index.html
    await this.createIndexHtml(projectPath, options);

    // Copy CSS and JS files locally
    await AssetCopier.copyLocalAssets(projectPath);

    this.logSuccess(options);
  }

  private async createContentFile(
    projectPath: string,
    options: ProjectOptions
  ): Promise<void> {
    const slidesContent = `# Welcome to Mostage

## Your First Slide

This is a simple presentation created with Mostage.

- **Web-based** — Run in any browser
- **Markdown** — Write content in Markdown
- **HTML Support** — Use HTML when needed

---

## Features

- Easy to use
- Customizable themes
- Plugin system
- Keyboard navigation

---

## Get Started

Edit this file to create your presentation!

---

## Happy Presenting!

<!-- confetti -->
`;

    const contentPath = options.contentPath || "./content.md";
    await fs.writeFile(path.join(projectPath, contentPath), slidesContent);
  }

  private async createConfigFile(
    projectPath: string,
    options: ProjectOptions
  ): Promise<void> {
    const configContent = ConfigBuilder.buildConfigContent(options);
    const configPath = options.configPath || "./config.json";
    await fs.writeFile(
      path.join(projectPath, configPath),
      JSON.stringify(configContent, null, 2)
    );
  }

  private async createIndexHtml(
    projectPath: string,
    options: ProjectOptions
  ): Promise<void> {
    const configPath = options.configPath || "./config.json";
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mostage Presentation</title>
    <link rel="stylesheet" href="./assets/mostage.css">
</head>
<body>
    <div id="app"></div>
    <script type="module">
        import Mostage from './assets/index.js';
        
        const mostage = new Mostage('${configPath}');
        mostage.start();
    </script>
</body>
</html>`;

    await fs.writeFile(path.join(projectPath, "index.html"), htmlContent);
  }

  private logSuccess(options: ProjectOptions): void {
    console.log(chalk.green("✅ Basic template created"));
    if (options.createContentFile) {
      const contentPath = options.contentPath || "./content.md";
      console.log(
        chalk.gray(`   - ${contentPath} (your presentation content)`)
      );
    }
    if (options.createConfigFile) {
      const configPath = options.configPath || "./config.json";
      console.log(chalk.gray(`   - ${configPath} (configuration)`));
    }
    console.log(chalk.gray("   - index.html (main HTML file)"));
    console.log(chalk.gray("   - assets/ (CSS and JS files)"));
  }
}

export class DemoTemplateStrategy implements TemplateStrategy {
  async create(projectPath: string, options: ProjectOptions): Promise<void> {
    // Ensure project directory exists
    await fs.ensureDir(projectPath);

    const examplePath = path.resolve(__dirname, "../../example");

    // Copy content.md only if createContentFile is true
    if (options.createContentFile) {
      await this.copyContentFile(projectPath, examplePath, options);
    }

    // Copy config.json only if createConfigFile is true
    if (options.createConfigFile) {
      await this.createConfigFile(projectPath, examplePath, options);
    }

    // Copy index.html and update config path if needed
    await this.createIndexHtml(projectPath, examplePath, options);

    // Copy CSS and JS files locally
    await AssetCopier.copyLocalAssets(projectPath);

    // Copy background folder if it exists
    await this.copyBackgroundAssets(projectPath, examplePath);

    this.logSuccess(options);
  }

  private async copyContentFile(
    projectPath: string,
    examplePath: string,
    options: ProjectOptions
  ): Promise<void> {
    const slidesContent = await fs.readFile(
      path.join(examplePath, "content.md"),
      "utf-8"
    );
    const contentPath = options.contentPath || "./content.md";
    await fs.writeFile(path.join(projectPath, contentPath), slidesContent);
  }

  private async createConfigFile(
    projectPath: string,
    examplePath: string,
    options: ProjectOptions
  ): Promise<void> {
    const configContent = await fs.readFile(
      path.join(examplePath, "config.json"),
      "utf-8"
    );
    const config = JSON.parse(configContent);

    // Update configuration with user selections
    if (options.theme) {
      config.theme = options.theme;
    }
    if (options.transition) {
      config.transition.type = options.transition;
    }
    if (options.urlHash !== undefined) {
      config.urlHash = options.urlHash;
    }
    if (options.centerContent !== undefined && config.centerContent) {
      config.centerContent.vertical = options.centerContent;
    }

    // Update contentPath if specified in options
    if (options.contentPath) {
      config.contentPath = options.contentPath;
    }

    // Update plugins based on user selection
    if (options.plugins && options.plugins.length > 0) {
      // Reset all plugins to disabled first
      Object.keys(config.plugins).forEach((plugin) => {
        config.plugins[plugin].enabled = false;
      });

      // Enable selected plugins
      options.plugins.forEach((plugin: string) => {
        if (config.plugins[plugin]) {
          config.plugins[plugin].enabled = true;
        }
      });
    }

    const configPath = options.configPath || "./config.json";
    await fs.writeFile(
      path.join(projectPath, configPath),
      JSON.stringify(config, null, 2)
    );
  }

  private async createIndexHtml(
    projectPath: string,
    examplePath: string,
    options: ProjectOptions
  ): Promise<void> {
    let htmlContent = await fs.readFile(
      path.join(examplePath, "index.html"),
      "utf-8"
    );

    // Update import path from ../src/index.ts to ./assets/index.js
    htmlContent = htmlContent.replace("../src/index.ts", "./assets/index.js");

    // Add CSS link
    htmlContent = htmlContent.replace(
      "<title>Mostage - Presentation framework based on markdown</title>",
      '<title>Mostage - Presentation framework based on markdown</title>\n    <link rel="stylesheet" href="./assets/mostage.css">'
    );

    // Update config path if custom config is specified
    if (options.configPath) {
      htmlContent = htmlContent.replace("./config.json", options.configPath);
    }

    await fs.writeFile(path.join(projectPath, "index.html"), htmlContent);
  }

  private async copyBackgroundAssets(
    projectPath: string,
    examplePath: string
  ): Promise<void> {
    const backgroundPath = path.join(examplePath, "background");
    if (await fs.pathExists(backgroundPath)) {
      await fs.copy(backgroundPath, path.join(projectPath, "background"));
    }
  }

  private logSuccess(options: ProjectOptions): void {
    console.log(chalk.green("✅ Demo template created"));
    if (options.createContentFile) {
      const contentPath = options.contentPath || "./content.md";
      console.log(chalk.gray(`   - ${contentPath} (demo presentation)`));
    }
    if (options.createConfigFile) {
      const configPath = options.configPath || "./config.json";
      console.log(chalk.gray(`   - ${configPath} (demo configuration)`));
    }
    console.log(chalk.gray("   - index.html (main HTML file)"));
    console.log(chalk.gray("   - assets/ (CSS and JS files)"));
    console.log(chalk.gray("   - background/ (background assets)"));
  }
}

export class TemplateFactory {
  static create(templateType: string): TemplateStrategy {
    switch (templateType) {
      case "basic":
        return new BasicTemplateStrategy();
      case "demo":
        return new DemoTemplateStrategy();
      case "custom":
        return new BasicTemplateStrategy();
      default:
        throw new Error(`Unknown template: ${templateType}`);
    }
  }
}
