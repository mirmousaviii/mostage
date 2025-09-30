import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class AssetCopier {
  static async copyLocalAssets(projectPath: string): Promise<void> {
    try {
      // Create assets directory
      const assetsDir = path.join(projectPath, "assets");
      await fs.ensureDir(assetsDir);

      // Get the path to the Mostage project root
      const mostageProjectRoot = path.resolve(__dirname, "../../../mostage");

      // Copy CSS file from Mostage project dist directory
      const cssSource = path.join(mostageProjectRoot, "dist/mostage.css");
      const cssDest = path.join(assetsDir, "mostage.css");
      if (await fs.pathExists(cssSource)) {
        await fs.copy(cssSource, cssDest);
      } else {
        console.log(chalk.yellow(`⚠️  CSS file not found: ${cssSource}`));
      }

      // Copy JS file from Mostage project dist directory
      const jsSource = path.join(mostageProjectRoot, "dist/index.js");
      const jsDest = path.join(assetsDir, "index.js");
      if (await fs.pathExists(jsSource)) {
        await fs.copy(jsSource, jsDest);
      } else {
        console.log(chalk.yellow(`⚠️  JS file not found: ${jsSource}`));
      }

      // Copy JS source map file
      const jsMapSource = path.join(mostageProjectRoot, "dist/index.js.map");
      const jsMapDest = path.join(assetsDir, "index.js.map");
      if (await fs.pathExists(jsMapSource)) {
        await fs.copy(jsMapSource, jsMapDest);
      }

      // Copy all theme-loader files from Mostage project dist directory
      const distDir = path.join(mostageProjectRoot, "dist");

      if (await fs.pathExists(distDir)) {
        // Find all theme-loader files in dist directory
        const distFiles = await fs.readdir(distDir);
        const themeLoaderFiles = distFiles.filter(
          (file) =>
            file.startsWith("theme-loader-") &&
            (file.endsWith(".mjs") || file.endsWith(".js"))
        );

        for (const fileName of themeLoaderFiles) {
          const themeLoaderSource = path.join(distDir, fileName);
          const themeLoaderDest = path.join(assetsDir, fileName);
          await fs.copy(themeLoaderSource, themeLoaderDest);
        }
      } else {
        console.log(chalk.yellow(`⚠️  Dist directory not found: ${distDir}`));
      }
    } catch (error) {
      console.log(
        chalk.yellow("⚠️  Could not copy local assets, using CDN fallback")
      );
      console.log("Error:", error);
    }
  }
}
