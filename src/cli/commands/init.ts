import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function initCommand(options: {
  template: string;
  contentPath?: string;
  configPath?: string;
}) {
  try {
    console.log(chalk.blue.bold("\n🚀 Creating new Mostage project...\n"));

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

    // Create basic template
    if (options.template === "basic") {
      await createBasicTemplate(projectPath, options);
    } else if (options.template === "demo") {
      await createDemoTemplate(projectPath, options);
    } else {
      console.log(chalk.red(`❌ Unknown template: ${options.template}`));
      console.log(chalk.gray("Available templates: basic, demo"));
      process.exit(1);
    }

    console.log(chalk.green.bold("✅ Project created successfully!\n"));
    console.log(chalk.yellow("Next steps:"));
    console.log("  1. Run `mostage dev` to start the development server");
    console.log("  2. Open your browser and start editing your slides");
    console.log(
      "  3. Run `mostage build` when ready to build for production\n"
    );
  } catch (error) {
    console.error(chalk.red("❌ Error creating project:"), error);
    process.exit(1);
  }
}

async function createBasicTemplate(projectPath: string, options: any) {
  // Create slides.md only if no custom content path is provided
  if (!options.contentPath) {
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

Start your development server with:

\`\`\`bash
mostage dev
\`\`\`
`;

    await fs.writeFile(path.join(projectPath, "slides.md"), slidesContent);
  }

  // Create config.json only if no custom config path is provided
  if (!options.configPath) {
    const configContent = {
      element: "#app",
      theme: "dark",
      contentPath: options.contentPath || "./slides.md",
      scale: 1.0,
      transition: {
        type: "horizontal",
        easing: "ease-in-out",
      },
      urlHash: true,
      centerContent: {
        vertical: true,
        horizontal: true,
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
      plugins: {
        ProgressBar: {
          enabled: true,
          position: "top",
          height: "12px",
        },
        SlideNumber: {
          enabled: true,
          position: "bottom-right",
          format: "current/total",
        },
        Controller: {
          enabled: true,
          position: "bottom-center",
        },
        Confetti: {
          enabled: true,
          particleCount: 50,
          size: {
            min: 5,
            max: 15,
          },
          duration: 4000,
          delay: 50,
        },
      },
    };
    await fs.writeFile(
      path.join(projectPath, "config.json"),
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
  if (!options.contentPath) {
    console.log(chalk.gray("   - slides.md (your presentation content)"));
  }
  if (!options.configPath) {
    console.log(chalk.gray("   - config.json (configuration)"));
  }
  console.log(chalk.gray("   - index.html (main HTML file)"));
  console.log(chalk.gray("   - assets/ (CSS and JS files)"));
}

async function createDemoTemplate(projectPath: string, options: any) {
  // Copy demo content from example folder
  const examplePath = path.resolve(__dirname, "../../example");

  // Copy slides.md only if no custom content path is provided
  if (!options.contentPath) {
    const slidesContent = await fs.readFile(
      path.join(examplePath, "slides.md"),
      "utf-8"
    );
    await fs.writeFile(path.join(projectPath, "slides.md"), slidesContent);
  }

  // Copy config.json only if no custom config path is provided
  if (!options.configPath) {
    const configContent = await fs.readFile(
      path.join(examplePath, "config.json"),
      "utf-8"
    );
    const config = JSON.parse(configContent);

    // Update contentPath if specified in options
    if (options.contentPath) {
      config.contentPath = options.contentPath;
    }

    await fs.writeFile(
      path.join(projectPath, "config.json"),
      JSON.stringify(config, null, 2)
    );
  }

  // Copy index.html and update config path if needed
  let htmlContent = await fs.readFile(
    path.join(examplePath, "index.html"),
    "utf-8"
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
  if (!options.contentPath) {
    console.log(chalk.gray("   - slides.md (demo presentation)"));
  }
  if (!options.configPath) {
    console.log(chalk.gray("   - config.json (demo configuration)"));
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
