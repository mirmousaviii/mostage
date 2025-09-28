import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export class AssetCopier {
  static async copyLocalAssets(projectPath: string): Promise<void> {
    try {
      // Create assets directory
      const assetsDir = path.join(projectPath, "assets");
      await fs.ensureDir(assetsDir);

      // Copy CSS file - find dist directory relative to current working directory
      const cssSource = path.resolve(process.cwd(), "dist/mostage.css");
      const cssDest = path.join(assetsDir, "mostage.css");
      if (await fs.pathExists(cssSource)) {
        await fs.copy(cssSource, cssDest);
      } else {
        // Try alternative path from project root
        const altCssSource = path.resolve(process.cwd(), "../dist/mostage.css");
        if (await fs.pathExists(altCssSource)) {
          await fs.copy(altCssSource, cssDest);
        } else {
          // Try absolute path as fallback
          const absCssSource = path.resolve(
            "/home/mostafa/Projects/mostage/dist/mostage.css"
          );
          if (await fs.pathExists(absCssSource)) {
            await fs.copy(absCssSource, cssDest);
          } else {
            console.log(chalk.yellow(`⚠️  CSS file not found: ${cssSource}`));
          }
        }
      }

      // Copy JS file - find dist directory relative to current working directory
      const jsSource = path.resolve(process.cwd(), "dist/index.js");
      const jsDest = path.join(assetsDir, "index.js");
      if (await fs.pathExists(jsSource)) {
        await fs.copy(jsSource, jsDest);
      } else {
        // Try alternative path from project root
        const altJsSource = path.resolve(process.cwd(), "../dist/index.js");
        if (await fs.pathExists(altJsSource)) {
          await fs.copy(altJsSource, jsDest);
        } else {
          // Try absolute path as fallback
          const absJsSource = path.resolve(
            "/home/mostafa/Projects/mostage/dist/index.js"
          );
          if (await fs.pathExists(absJsSource)) {
            await fs.copy(absJsSource, jsDest);
          } else {
            console.log(chalk.yellow(`⚠️  JS file not found: ${jsSource}`));
          }
        }
      }

      // Copy all theme-loader files - find dist directory relative to current working directory
      const distDir = path.resolve(process.cwd(), "dist");
      const altDistDir = path.resolve(process.cwd(), "../dist");
      const absDistDir = path.resolve("/home/mostafa/Projects/mostage/dist");

      let actualDistDir = null;
      if (await fs.pathExists(distDir)) {
        actualDistDir = distDir;
      } else if (await fs.pathExists(altDistDir)) {
        actualDistDir = altDistDir;
      } else if (await fs.pathExists(absDistDir)) {
        actualDistDir = absDistDir;
      }

      if (actualDistDir) {
        // Find all theme-loader files in dist directory
        const distFiles = await fs.readdir(actualDistDir);
        const themeLoaderFiles = distFiles.filter(
          (file) =>
            file.startsWith("theme-loader-") &&
            (file.endsWith(".mjs") || file.endsWith(".js"))
        );

        for (const fileName of themeLoaderFiles) {
          const themeLoaderSource = path.join(actualDistDir, fileName);
          const themeLoaderDest = path.join(assetsDir, fileName);
          await fs.copy(themeLoaderSource, themeLoaderDest);
          console.log();
        }
      } else {
        console.log(chalk.yellow(`⚠️  Dist directory not found`));
      }
    } catch (error) {
      console.log(
        chalk.yellow("⚠️  Could not copy local assets, using CDN fallback")
      );
      console.log("Error:", error);
    }
  }
}
