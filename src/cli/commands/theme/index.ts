import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { ThemeLoader } from "../../../app/theme-loader";

export async function themeCommand(options: {
  list?: boolean;
  add?: string;
  remove?: string;
}) {
  try {
    if (options.list) {
      await listThemes();
    } else if (options.add) {
      await addTheme(options.add);
    } else if (options.remove) {
      await removeTheme(options.remove);
    } else {
      console.log(chalk.blue.bold("\nMostage CLI - theme\n"));
      console.log(chalk.yellow("Usage:"));
      console.log("  mostage theme --list          List available themes");
      console.log("  mostage theme --add <name>    Add a new theme");
      console.log("  mostage theme --remove <name> Remove a theme\n");
    }
  } catch (error) {
    console.error(chalk.red("❌ Error managing themes:"), error);
    process.exit(1);
  }
}

async function listThemes() {
  console.log(chalk.blue.bold("\nMostage CLI - Available Themes\n"));

  // Get built-in themes using ThemeLoader
  const builtInThemes = ThemeLoader.getThemeNames();

  console.log(chalk.yellow("Built-in Themes:"));
  builtInThemes.forEach((themeName: string) => {
    console.log(`  • ${chalk.green(themeName)}`);
  });

  // Check for custom themes in current project
  const customThemesPath = path.join(process.cwd(), "themes");
  if (await fs.pathExists(customThemesPath)) {
    const customThemes = await fs.readdir(customThemesPath);
    if (customThemes.length > 0) {
      console.log(chalk.yellow("\nCustom Themes:"));
      customThemes.forEach((theme: string) => {
        const themeName = path.basename(theme, ".css");
        console.log(`  • ${chalk.blue(themeName)}`);
      });
    }
  }

  console.log(chalk.gray("\nTo use a theme, set it in your config.json:"));
  console.log(chalk.gray('  "theme": "theme-name"\n'));
}

async function addTheme(themeName: string) {
  console.log(
    chalk.blue.bold(`\nMostage CLI - Creating theme: ${themeName}\n`)
  );

  const themesDir = path.join(process.cwd(), "themes");
  await fs.ensureDir(themesDir);

  const themePath = path.join(themesDir, `${themeName}.css`);

  if (await fs.pathExists(themePath)) {
    console.log(chalk.yellow(`⚠️  Theme ${themeName} already exists`));
    return;
  }

  const themeContent = `/* ${themeName} Theme for Mostage */

:root {
  --mostage-bg-color: #ffffff;
  --mostage-text-color: #333333;
  --mostage-primary-color: #007acc;
  --mostage-secondary-color: #6c757d;
  --mostage-accent-color: #28a745;
  --mostage-border-color: #dee2e6;
  --mostage-highlight-color: #ffc107;
}

.mostage-slide {
  background: var(--mostage-bg-color);
  color: var(--mostage-text-color);
  border: 1px solid var(--mostage-border-color);
}

/* Customize your theme here */
.mostage-slide h1,
.mostage-slide h2,
.mostage-slide h3,
.mostage-slide h4,
.mostage-slide h5,
.mostage-slide h6 {
  color: var(--mostage-primary-color);
}

.mostage-slide a {
  color: var(--mostage-accent-color);
}

.mostage-slide code {
  background: var(--mostage-border-color);
  color: var(--mostage-text-color);
  padding: 0.2em 0.4em;
  border-radius: 3px;
}

.mostage-slide pre {
  background: var(--mostage-border-color);
  border: 1px solid var(--mostage-border-color);
}

.mostage-slide blockquote {
  border-left: 4px solid var(--mostage-primary-color);
  background: var(--mostage-border-color);
}
`;

  await fs.writeFile(themePath, themeContent);

  console.log(chalk.green(`✅ Theme ${themeName} created successfully!`));
  console.log(chalk.gray(`   File: ${themePath}`));
  console.log(
    chalk.gray(`   To use: Set "theme": "${themeName}" in your config.json\n`)
  );
}

async function removeTheme(themeName: string) {
  console.log(chalk.blue.bold(`\nMostage CLI - Removing theme: ${themeName}\n`));

  const themePath = path.join(process.cwd(), "themes", `${themeName}.css`);

  if (!(await fs.pathExists(themePath))) {
    console.log(chalk.yellow(`⚠️  Theme ${themeName} not found`));
    return;
  }

  await fs.remove(themePath);

  console.log(chalk.green(`✅ Theme ${themeName} removed successfully!`));
  console.log(
    chalk.gray(
      `   Remember to update your config.json if you were using this theme\n`
    )
  );
}
