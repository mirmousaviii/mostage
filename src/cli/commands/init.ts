import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function initCommand(options: {
  template?: string;
  contentPath?: string;
  configPath?: string;
}) {
  try {
    console.log(chalk.blue.bold("\n🚀 Welcome to Mostage!\n"));
    console.log(
      chalk.gray("Let's create your presentation project step by step.\n")
    );

    const projectPath = process.cwd();

    // Check if directory is empty
    const files = await fs.readdir(projectPath);
    if (files.length > 0) {
      console.log(
        chalk.yellow(
          "⚠️  Directory is not empty. Some files may be overwritten.\n"
        )
      );
    }

    // Interactive prompts
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "template",
        message: "Choose a template:",
        choices: [
          {
            name: "Custom - Configure settings",
            value: "custom",
            short: "Custom",
          },
          {
            name: "Basic - Quick start with default settings (as a basic example)",
            value: "basic",
            short: "Basic",
          },
          {
            name: "Demo - Complete example with sample content (as an advanced example)",
            value: "demo",
            short: "Demo",
          },
        ],
        default: options.template || "custom",
      },
      {
        type: "confirm",
        name: "createConfigFile",
        message: "Create config file (config.json)?",
        default: true,
        when: (answers: any) => answers.template === "custom",
      },
      {
        type: "input",
        name: "configPath",
        message: "Config file path:",
        default: "./config.json",
        when: (answers: any) =>
          answers.template === "custom" &&
          !answers.createConfigFile &&
          !options.configPath,
        validate: (input: string) => {
          if (!input.trim()) {
            return "Config path is required";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "theme",
        message: "Select a theme:",
        choices: [
          { name: "Dark - Modern dark theme", value: "dark" },
          { name: "Light - Clean light theme", value: "light" },
          { name: "Dracula - Purple dark theme", value: "dracula" },
          { name: "Ocean - Blue ocean theme", value: "ocean" },
          { name: "Rainbow - Colorful theme", value: "rainbow" },
        ],
        default: "dark",
        when: (answers: any) =>
          answers.template === "custom" && answers.createConfigFile,
      },
      {
        type: "checkbox",
        name: "plugins",
        message: "Select plugins to enable:",
        choices: [
          {
            name: "Progress Bar - Shows presentation progress",
            value: "ProgressBar",
            checked: true,
          },
          {
            name: "Slide Number - Shows current slide number",
            value: "SlideNumber",
            checked: true,
          },
          {
            name: "Controller - Navigation controls",
            value: "Controller",
            checked: true,
          },
          {
            name: "Confetti - Celebration effects",
            value: "Confetti",
            checked: true,
          },
        ],
        when: (answers: any) =>
          answers.template === "custom" && answers.createConfigFile,
      },
      {
        type: "list",
        name: "transition",
        message: "Choose slide transition:",
        choices: [
          { name: "Horizontal - Slide left/right", value: "horizontal" },
          { name: "Vertical - Slide up/down", value: "vertical" },
          { name: "Fade - Fade in/out", value: "fade" },
        ],
        default: "horizontal",
        when: (answers: any) =>
          answers.template === "custom" && answers.createConfigFile,
      },
      {
        type: "confirm",
        name: "urlHash",
        message: "Enable URL hash navigation?",
        default: true,
        when: (answers: any) =>
          answers.template === "custom" && answers.createConfigFile,
      },
      {
        type: "confirm",
        name: "centerContent",
        message: "Center content?",
        default: true,
        when: (answers: any) =>
          answers.template === "custom" && answers.createConfigFile,
      },
      {
        type: "confirm",
        name: "createContentFile",
        message: "Create sample content file (slides.md)?",
        default: true,
        when: (answers: any) => answers.template === "custom",
      },
      {
        type: "input",
        name: "contentPath",
        message: "Content file path:",
        default: "./slides.md",
        when: (answers: any) =>
          answers.template === "custom" &&
          !answers.createContentFile &&
          answers.createConfigFile &&
          !options.contentPath,
        validate: (input: string) => {
          if (!input.trim()) {
            return "Content path is required";
          }
          return true;
        },
      },
    ]);

    // Merge options with answers
    const finalOptions = {
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
      createContentFile:
        answers.template === "demo" || answers.template === "basic"
          ? true
          : answers.createContentFile,
      createConfigFile:
        answers.template === "demo" || answers.template === "basic"
          ? true
          : answers.createConfigFile,
    };

    console.log(chalk.blue.bold("\n🚀 Creating your Mostage project...\n"));

    // Create template based on selection
    if (
      finalOptions.template === "basic" ||
      finalOptions.template === "custom"
    ) {
      await createBasicTemplate(projectPath, finalOptions);
    } else if (finalOptions.template === "demo") {
      await createDemoTemplate(projectPath, finalOptions);
    } else {
      console.log(chalk.red(`❌ Unknown template: ${finalOptions.template}`));
      console.log(chalk.gray("Available templates: basic, demo"));
      process.exit(1);
    }

    console.log(chalk.green.bold("✅ Project created successfully!\n"));
    console.log(chalk.yellow("Next steps:"));
    console.log("  1. Run `mostage dev` to start the development server");
    console.log("  2. Open your browser and start editing your slides");
    console.log("  3. Run `mostage build` when ready to build\n");
  } catch (error) {
    console.error(chalk.red("❌ Error creating project:"), error);
    process.exit(1);
  }
}

async function createBasicTemplate(projectPath: string, options: any) {
  // Create slides.md only if createContentFile is true
  if (options.createContentFile) {
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

    const contentPath = options.contentPath || "./slides.md";
    await fs.writeFile(path.join(projectPath, contentPath), slidesContent);
  }

  // Create config.json only if createConfigFile is true
  if (options.createConfigFile) {
    // Build plugins configuration based on user selection
    const pluginsConfig: any = {};

    if (options.plugins && options.plugins.length > 0) {
      if (options.plugins.includes("ProgressBar")) {
        pluginsConfig.ProgressBar = {
          enabled: true,
          position: "bottom",
          height: "12px",
        };
      }

      if (options.plugins.includes("SlideNumber")) {
        pluginsConfig.SlideNumber = {
          enabled: true,
          position: "bottom-right",
          format: "current/total",
        };
      }

      if (options.plugins.includes("Controller")) {
        pluginsConfig.Controller = {
          enabled: true,
          position: "bottom-center",
        };
      }

      if (options.plugins.includes("Confetti")) {
        pluginsConfig.Confetti = {
          enabled: true,
          particleCount: 50,
          size: {
            min: 5,
            max: 15,
          },
          duration: 4000,
          delay: 50,
        };
      }
    }

    const configContent = {
      element: "#app",
      theme: options.theme || "dark",
      contentPath: options.contentPath || "./slides.md",
      scale: 1.0,
      transition: {
        type: options.transition || "horizontal",
        easing: "ease-in-out",
      },
      urlHash: options.urlHash !== undefined ? options.urlHash : true,
      centerContent: {
        vertical:
          options.centerContent !== undefined ? options.centerContent : true,
        horizontal:
          options.centerContent !== undefined ? options.centerContent : true,
      },
      header: {
        content: "",
        position: "top-left",
        showOnFirstSlide: false,
      },
      footer: {
        content: "",
        position: "bottom-left",
        showOnFirstSlide: true,
      },
      plugins: pluginsConfig,
    };
    const configPath = options.configPath || "./config.json";
    await fs.writeFile(
      path.join(projectPath, configPath),
      JSON.stringify(configContent, null, 2)
    );
  }

  // Create index.html
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

  // Copy CSS and JS files locally
  await copyLocalAssets(projectPath);

  console.log(chalk.green("✅ Basic template created"));
  if (options.createContentFile) {
    const contentPath = options.contentPath || "./slides.md";
    console.log(chalk.gray(`   - ${contentPath} (your presentation content)`));
  }
  if (options.createConfigFile) {
    const configPath = options.configPath || "./config.json";
    console.log(chalk.gray(`   - ${configPath} (configuration)`));
  }
  console.log(chalk.gray("   - index.html (main HTML file)"));
  console.log(chalk.gray("   - assets/ (CSS and JS files)"));
}

async function createDemoTemplate(projectPath: string, options: any) {
  // Copy demo content from example folder
  const examplePath = path.resolve(__dirname, "../../example");

  // Copy slides.md only if createContentFile is true
  if (options.createContentFile) {
    const slidesContent = await fs.readFile(
      path.join(examplePath, "slides.md"),
      "utf-8"
    );
    const contentPath = options.contentPath || "./slides.md";
    await fs.writeFile(path.join(projectPath, contentPath), slidesContent);
  }

  // Copy config.json only if createConfigFile is true
  if (options.createConfigFile) {
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

  // Copy index.html and update config path if needed
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

  // Copy CSS and JS files locally
  await copyLocalAssets(projectPath);

  // Copy background folder if it exists
  const backgroundPath = path.join(examplePath, "background");
  if (await fs.pathExists(backgroundPath)) {
    await fs.copy(backgroundPath, path.join(projectPath, "background"));
  }

  console.log(chalk.green("✅ Demo template created"));
  if (options.createContentFile) {
    const contentPath = options.contentPath || "./slides.md";
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

async function copyLocalAssets(projectPath: string) {
  try {
    // Create assets directory
    const assetsDir = path.join(projectPath, "assets");
    await fs.ensureDir(assetsDir);

    // Copy CSS file
    const cssSource = path.resolve(__dirname, "../../dist/mostage.css");
    const cssDest = path.join(assetsDir, "mostage.css");
    if (await fs.pathExists(cssSource)) {
      await fs.copy(cssSource, cssDest);
    }

    // Copy JS file
    const jsSource = path.resolve(__dirname, "../../dist/index.js");
    const jsDest = path.join(assetsDir, "index.js");
    if (await fs.pathExists(jsSource)) {
      await fs.copy(jsSource, jsDest);
    }
  } catch (error) {
    console.log(
      chalk.yellow("⚠️  Could not copy local assets, using CDN fallback")
    );
    console.log("Error:", error);
  }
}
