import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Helper function to resolve asset paths that work in both dev and published environments
function resolveAssetPath(relativePath: string): string {
  // In built CLI: __dirname = dist/cli/, so we need dist/core/ (../core/)
  // In development: __dirname = src/cli/generators/, so we need src/core/ (../../src/core/)

  // Try published package path first (dist/core/)
  const publishedPath = path.resolve(__dirname, "../core", relativePath);

  // Try development path (src/core/)
  const devPath = path.resolve(__dirname, "../../src/core", relativePath);

  // Check which path exists and return it
  if (fs.existsSync(publishedPath)) {
    return publishedPath;
  } else if (fs.existsSync(devPath)) {
    return devPath;
  } else {
    // Fallback to published path (will throw error if not found)
    return publishedPath;
  }
}

export class AssetCopier {
  static async copyLocalAssets(projectPath: string): Promise<void> {
    try {
      // Create assets directory
      const assetsDir = path.join(projectPath, "assets");
      await fs.ensureDir(assetsDir);

      // Copy CSS file from Mostage project
      const cssSource = resolveAssetPath("mostage.css");
      const cssDest = path.join(assetsDir, "mostage.css");
      if (await fs.pathExists(cssSource)) {
        await fs.copy(cssSource, cssDest);
      } else {
        console.log(chalk.yellow(`⚠️  CSS file not found: ${cssSource}`));
      }

      // Copy JS file from Mostage project
      const jsSource = resolveAssetPath("index.js");
      const jsDest = path.join(assetsDir, "index.js");
      if (await fs.pathExists(jsSource)) {
        await fs.copy(jsSource, jsDest);
      } else {
        console.log(chalk.yellow(`⚠️  JS file not found: ${jsSource}`));
      }

      // Copy JS source map file
      const jsMapSource = resolveAssetPath("index.js.map");
      const jsMapDest = path.join(assetsDir, "index.js.map");
      if (await fs.pathExists(jsMapSource)) {
        await fs.copy(jsMapSource, jsMapDest);
      }

      // Copy all theme-loader files from Mostage project
      const coreDir = path.resolve(__dirname, "../../core");
      const devCoreDir = path.resolve(__dirname, "../../src/core");

      let distDir: string;
      if (await fs.pathExists(coreDir)) {
        distDir = path.resolve(__dirname, "../..");
      } else if (await fs.pathExists(devCoreDir)) {
        distDir = path.resolve(__dirname, "../../../dist");
      } else {
        distDir = path.resolve(__dirname, "../..");
      }

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
