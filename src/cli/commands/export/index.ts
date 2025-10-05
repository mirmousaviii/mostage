import chalk from "chalk";
import fs from "fs-extra";
import path from "path";

interface ExportOptions {
  output?: string;
}

interface ProjectFiles {
  content: string;
  config: Record<string, any>;
  cssContent: string;
  jsContent: string;
  htmlContent: string;
  assets: Record<string, string>;
}

const DEFAULT_OUTPUT_DIR = "./export/html";
const SUPPORTED_IMAGE_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
  ".ico",
];
const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

export async function exportCommand(options: ExportOptions) {
  try {
    console.log(chalk.blue.bold("\nMostage CLI - export\n"));

    const outputDir = options.output || DEFAULT_OUTPUT_DIR;
    const projectDir = process.cwd();

    // Validate project directory
    await validateProjectDirectory(projectDir);

    console.log(chalk.green(`✅ Exporting self-contained presentation...`));
    console.log(chalk.gray(`   Project directory: ${projectDir}`));
    console.log(chalk.gray(`   Output directory: ${outputDir}\n`));

    await buildSelfContained(projectDir, outputDir);

    console.log(chalk.green.bold("\n✅ Export completed successfully!"));
    console.log(chalk.gray(`   Output: ${path.resolve(outputDir)}`));
    console.log(
      chalk.gray(
        `   You can now open the HTML file directly in your browser.\n`
      )
    );
  } catch (error) {
    console.error(chalk.red("❌ Error exporting project:"), error);
    process.exit(1);
  }
}

async function validateProjectDirectory(projectDir: string): Promise<void> {
  const indexHtmlPath = path.join(projectDir, "index.html");
  if (!(await fs.pathExists(indexHtmlPath))) {
    throw new Error(
      `Not a valid Mostage project. index.html not found in: ${projectDir}`
    );
  }
}

async function buildSelfContained(
  projectDir: string,
  outputDir: string
): Promise<void> {
  // Create output directory
  await fs.ensureDir(outputDir);

  // Read all project files
  const projectFiles = await readProjectFiles(projectDir);

  // Create self-contained HTML
  const selfContainedHtml = createSelfContainedHtml(projectFiles);

  // Write output file
  const outputPath = path.join(outputDir, "index.html");
  await fs.writeFile(outputPath, selfContainedHtml);
}

async function readProjectFiles(projectDir: string): Promise<ProjectFiles> {
  const [content, config, cssContent, jsContent, htmlContent, assets] =
    await Promise.all([
      readContentFile(projectDir),
      readConfigFile(projectDir),
      readCssFile(projectDir),
      readJsFile(projectDir),
      readHtmlFile(projectDir),
      processAssets(projectDir),
    ]);

  return { content, config, cssContent, jsContent, htmlContent, assets };
}

async function readContentFile(projectDir: string): Promise<string> {
  const contentPath = path.join(projectDir, "content.md");

  if (await fs.pathExists(contentPath)) {
    return await fs.readFile(contentPath, "utf-8");
  }

  throw new Error(
    "content.md file not found. Please create a content.md file in your project directory."
  );
}

async function readConfigFile(
  projectDir: string
): Promise<Record<string, any>> {
  const configPath = path.join(projectDir, "config.json");

  if (await fs.pathExists(configPath)) {
    try {
      const configContent = await fs.readFile(configPath, "utf-8");
      return JSON.parse(configContent);
    } catch (error) {
      throw new Error(
        "Invalid config.json file. Please check the JSON syntax."
      );
    }
  }

  throw new Error(
    "config.json file not found. Please create a config.json file in your project directory."
  );
}

async function readCssFile(projectDir: string): Promise<string> {
  const cssPath = path.join(projectDir, "assets", "mostage.css");

  if (await fs.pathExists(cssPath)) {
    return await fs.readFile(cssPath, "utf-8");
  }

  // Fallback: try to get from dist
  const distCssPath = path.join(__dirname, "../../../dist/core/mostage.css");
  if (await fs.pathExists(distCssPath)) {
    return await fs.readFile(distCssPath, "utf-8");
  }

  throw new Error(
    "CSS file not found. Please ensure mostage.css exists in assets/ directory or run 'npm run build' first."
  );
}

async function readJsFile(projectDir: string): Promise<string> {
  const jsPath = path.join(projectDir, "assets", "index.js");

  if (await fs.pathExists(jsPath)) {
    return await fs.readFile(jsPath, "utf-8");
  }

  // Fallback: try to get from dist
  const distJsPath = path.join(__dirname, "../../../dist/core/index.js");
  if (await fs.pathExists(distJsPath)) {
    return await fs.readFile(distJsPath, "utf-8");
  }

  throw new Error(
    "JavaScript file not found. Please ensure index.js exists in assets/ directory or run 'npm run build' first."
  );
}

async function readHtmlFile(projectDir: string): Promise<string> {
  const htmlPath = path.join(projectDir, "index.html");

  if (await fs.pathExists(htmlPath)) {
    return await fs.readFile(htmlPath, "utf-8");
  }

  throw new Error(
    "index.html file not found. Please ensure index.html exists in your project directory."
  );
}

async function processAssets(
  projectDir: string
): Promise<Record<string, string>> {
  const assets: Record<string, string> = {};

  // Process images directory
  await processImageDirectory(projectDir, "images", assets);

  // Process assets directory (excluding JS and CSS files)
  await processAssetDirectory(projectDir, "assets", assets);

  // Process HTML files
  await processHtmlFiles(projectDir, assets);

  return assets;
}

async function processImageDirectory(
  projectDir: string,
  dirName: string,
  assets: Record<string, string>
): Promise<void> {
  const dirPath = path.join(projectDir, dirName);

  if (!(await fs.pathExists(dirPath))) {
    return;
  }

  const files = await fs.readdir(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = await fs.stat(filePath);

    if (stat.isFile() && isImageFile(file)) {
      try {
        const content = await fs.readFile(filePath);
        const base64 = content.toString("base64");
        const mimeType = getMimeType(path.extname(file).toLowerCase());
        assets[`${dirName}/${file}`] = `data:${mimeType};base64,${base64}`;
      } catch (error) {
        console.log(chalk.yellow(`⚠️  Failed to process image: ${file}`));
      }
    }
  }
}

async function processAssetDirectory(
  projectDir: string,
  dirName: string,
  assets: Record<string, string>
): Promise<void> {
  const dirPath = path.join(projectDir, dirName);

  if (!(await fs.pathExists(dirPath))) {
    return;
  }

  const files = await fs.readdir(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = await fs.stat(filePath);

    if (
      stat.isFile() &&
      !file.endsWith(".js") &&
      !file.endsWith(".css") &&
      isImageFile(file)
    ) {
      try {
        const content = await fs.readFile(filePath);
        const base64 = content.toString("base64");
        const mimeType = getMimeType(path.extname(file).toLowerCase());
        assets[`${dirName}/${file}`] = `data:${mimeType};base64,${base64}`;
      } catch (error) {
        console.log(chalk.yellow(`⚠️  Failed to process asset: ${file}`));
      }
    }
  }
}

async function processHtmlFiles(
  projectDir: string,
  assets: Record<string, string>
): Promise<void> {
  const htmlFiles = ["header.html", "footer.html"];

  for (const fileName of htmlFiles) {
    const filePath = path.join(projectDir, fileName);

    if (await fs.pathExists(filePath)) {
      try {
        const content = await fs.readFile(filePath, "utf-8");
        assets[fileName] = content;
      } catch (error) {
        console.log(
          chalk.yellow(`⚠️  Failed to process HTML file: ${fileName}`)
        );
      }
    }
  }
}

function isImageFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return SUPPORTED_IMAGE_EXTENSIONS.includes(ext);
}

function getMimeType(ext: string): string {
  return MIME_TYPES[ext] || "application/octet-stream";
}

function createSelfContainedHtml(projectFiles: ProjectFiles): string {
  const { content, config, cssContent, jsContent, htmlContent, assets } =
    projectFiles;

  // Process all content with asset path replacement
  const processedContent = replaceAssetPaths(content, assets);
  const processedConfig = processConfig(config, assets);

  // Escape content for template literal
  const escapedContent = escapeForTemplateLiteral(processedContent);

  // Create config object string
  const configString = JSON.stringify(processedConfig, null, 2);

  return generateHtmlTemplate(
    escapedContent,
    configString,
    cssContent,
    jsContent,
    htmlContent
  );
}

function replaceAssetPaths(
  text: string,
  assets: Record<string, string>
): string {
  if (!text) return text;

  let result = text;
  for (const [assetPath, dataUrl] of Object.entries(assets)) {
    // Replace both ./path and path formats
    result = result.split(`./${assetPath}`).join(dataUrl);
    result = result.split(assetPath).join(dataUrl);
  }
  return result;
}

function processConfig(
  config: Record<string, any>,
  assets: Record<string, string>
): Record<string, any> {
  const cleanConfig = { ...config };

  // Remove contentPath since content is embedded
  delete cleanConfig.contentPath;

  // Process header
  if (cleanConfig.header?.contentPath) {
    const headerContent = assets["header.html"];
    if (headerContent) {
      cleanConfig.header.content = replaceAssetPaths(headerContent, assets);
      delete cleanConfig.header.contentPath;
    }
  }

  // Process footer
  if (cleanConfig.footer?.contentPath) {
    const footerContent = assets["footer.html"];
    if (footerContent) {
      cleanConfig.footer.content = replaceAssetPaths(footerContent, assets);
      delete cleanConfig.footer.contentPath;
    }
  }

  // Process background images
  if (cleanConfig.background) {
    if (Array.isArray(cleanConfig.background)) {
      cleanConfig.background = cleanConfig.background.map((bg: any) => ({
        ...bg,
        imagePath: bg.imagePath
          ? replaceAssetPaths(bg.imagePath, assets)
          : bg.imagePath,
      }));
    } else if (cleanConfig.background.imagePath) {
      cleanConfig.background.imagePath = replaceAssetPaths(
        cleanConfig.background.imagePath,
        assets
      );
    }
  }

  return cleanConfig;
}

function escapeForTemplateLiteral(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

function generateHtmlTemplate(
  content: string,
  config: string,
  css: string,
  js: string,
  htmlTemplate: string
): string {
  let result = htmlTemplate.replace(
    /<link[^>]*rel=["']stylesheet["'][^>]*>/g,
    `<style>${css}</style>`
  );

  const inlineScript = `
    const config = ${config};
    config.content = \`${content}\`;
    config.element = "#app";
    ${js}
    const mostage = new Hn(config);
    mostage.start();
  `;

  result = result.replace(
    /<script[^>]*type=["']module["'][^>]*>[\s\S]*?<\/script>/g,
    `<script type="module">${inlineScript}</script>`
  );

  return result;
}
