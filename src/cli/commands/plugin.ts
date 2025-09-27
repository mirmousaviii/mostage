import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function pluginCommand(options: {
  list?: boolean;
  add?: string;
  remove?: string;
}) {
  try {
    if (options.list) {
      await listPlugins();
    } else if (options.add) {
      await addPlugin(options.add);
    } else if (options.remove) {
      await removePlugin(options.remove);
    } else {
      console.log(chalk.blue.bold("\n🔌 Mostage Plugin Manager\n"));
      console.log(chalk.yellow("Usage:"));
      console.log("  mostage plugin --list          List available plugins");
      console.log("  mostage plugin --add <name>    Add a new plugin");
      console.log("  mostage plugin --remove <name> Remove a plugin\n");
    }
  } catch (error) {
    console.error(chalk.red("❌ Error managing plugins:"), error);
    process.exit(1);
  }
}

async function listPlugins() {
  console.log(chalk.blue.bold("\n🔌 Available Plugins\n"));

  const pluginsPath = path.join(__dirname, "../../../src/plugins");
  const builtInPlugins = await fs.readdir(pluginsPath);

  console.log(chalk.yellow("Built-in Plugins:"));
  builtInPlugins.forEach((plugin: string) => {
    console.log(`  • ${chalk.green(plugin)}`);
  });

  // Check for custom plugins in current project
  const customPluginsPath = path.join(process.cwd(), "plugins");
  if (await fs.pathExists(customPluginsPath)) {
    const customPlugins = await fs.readdir(customPluginsPath);
    if (customPlugins.length > 0) {
      console.log(chalk.yellow("\nCustom Plugins:"));
      customPlugins.forEach((plugin: string) => {
        console.log(`  • ${chalk.blue(plugin)}`);
      });
    }
  }

  console.log(chalk.gray("\nTo use a plugin, add it to your config.json:"));
  console.log(
    chalk.gray('  "plugins": { "PluginName": { "enabled": true } }\n')
  );
}

async function addPlugin(pluginName: string) {
  console.log(chalk.blue.bold(`\n🔌 Creating plugin: ${pluginName}\n`));

  const pluginsDir = path.join(process.cwd(), "plugins", pluginName);
  await fs.ensureDir(pluginsDir);

  const pluginPath = path.join(pluginsDir, "index.js");

  if (await fs.pathExists(pluginPath)) {
    console.log(chalk.yellow(`⚠️  Plugin ${pluginName} already exists`));
    return;
  }

  const pluginContent = `/**
 * ${pluginName} Plugin for Mostage
 */

class ${pluginName} {
  name = "${pluginName}";

  constructor(options = {}) {
    this.options = {
      enabled: true,
      ...options
    };
  }

  init(mostage) {
    if (!this.options.enabled) return;
    
    console.log(\`${pluginName} plugin initialized\`);
    
    // Add your plugin logic here
    // Example: Add event listeners, modify DOM, etc.
  }

  destroy() {
    // Clean up when plugin is destroyed
    console.log(\`${pluginName} plugin destroyed\`);
  }
}

export default ${pluginName};
`;

  const stylePath = path.join(pluginsDir, "style.css");
  const styleContent = `/* ${pluginName} Plugin Styles */

.${pluginName.toLowerCase()}-container {
  /* Add your plugin styles here */
}
`;

  await fs.writeFile(pluginPath, pluginContent);
  await fs.writeFile(stylePath, styleContent);

  console.log(chalk.green(`✅ Plugin ${pluginName} created successfully!`));
  console.log(chalk.gray(`   Files: ${pluginPath}`));
  console.log(chalk.gray(`          ${stylePath}`));
  console.log(
    chalk.gray(
      `   To use: Add "${pluginName}": { "enabled": true } to your config.json\n`
    )
  );
}

async function removePlugin(pluginName: string) {
  console.log(chalk.blue.bold(`\n🗑️  Removing plugin: ${pluginName}\n`));

  const pluginPath = path.join(process.cwd(), "plugins", pluginName);

  if (!(await fs.pathExists(pluginPath))) {
    console.log(chalk.yellow(`⚠️  Plugin ${pluginName} not found`));
    return;
  }

  await fs.remove(pluginPath);

  console.log(chalk.green(`✅ Plugin ${pluginName} removed successfully!`));
  console.log(
    chalk.gray(
      `   Remember to update your config.json if you were using this plugin\n`
    )
  );
}
