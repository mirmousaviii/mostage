import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import puppeteer from "puppeteer";
import PptxGenJS from "pptxgenjs";
import sharp from "sharp";

interface ExportOptions {
  output?: string;
  format?: string;
}

interface ProjectFiles {
  content: string;
  config: Record<string, any>;
  cssContent: string;
  jsContent: string;
  htmlContent: string;
  assets: Record<string, string>;
}

const DEFAULT_OUTPUT_DIR = "./exports";
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

    const baseOutputDir = options.output || DEFAULT_OUTPUT_DIR;
    const format = options.format || "html";
    const projectDir = process.cwd();

    // Validate project directory
    await validateProjectDirectory(projectDir);

    // Validate format
    const supportedFormats = ["html", "pdf", "pptx", "png", "jpg"];
    if (!supportedFormats.includes(format)) {
      throw new Error(
        `Unsupported format: ${format}. Supported formats: ${supportedFormats.join(", ")}`
      );
    }

    // Create format-specific output directory
    const outputDir = path.join(baseOutputDir, format);

    console.log(
      chalk.green(`✅ Exporting presentation as ${format.toUpperCase()}...`)
    );
    console.log(chalk.gray(`   Project directory: ${projectDir}`));
    console.log(chalk.gray(`   Output directory: ${outputDir}\n`));

    // Build self-contained HTML first
    const tempHtmlPath = await buildSelfContained(projectDir, outputDir);

    // Export based on format
    switch (format) {
      case "html":
        // HTML export is already done
        break;
      case "pdf":
        await exportToPDF(tempHtmlPath, outputDir);
        // Remove temporary HTML file
        await fs.remove(tempHtmlPath);
        break;
      case "pptx":
        await exportToPPTX(tempHtmlPath, outputDir);
        // Remove temporary HTML file
        await fs.remove(tempHtmlPath);
        break;
      case "png":
        await exportToPNG(tempHtmlPath, outputDir);
        // Remove temporary HTML file
        await fs.remove(tempHtmlPath);
        break;
      case "jpg":
        await exportToJPG(tempHtmlPath, outputDir);
        // Remove temporary HTML file
        await fs.remove(tempHtmlPath);
        break;
    }

    console.log(chalk.green.bold("\n✅ Export completed successfully!"));
    console.log(chalk.gray(`   Output: ${path.resolve(outputDir)}`));
    console.log(chalk.gray(`   Format: ${format.toUpperCase()}\n`));
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
): Promise<string> {
  // Create output directory
  await fs.ensureDir(outputDir);

  // Read all project files
  const projectFiles = await readProjectFiles(projectDir);

  // Create self-contained HTML
  const selfContainedHtml = createSelfContainedHtml(projectFiles);

  // Write output file
  const outputPath = path.join(outputDir, "index.html");
  await fs.writeFile(outputPath, selfContainedHtml);

  return outputPath;
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

// PDF Export Function
async function exportToPDF(htmlPath: string, outputDir: string): Promise<void> {
  console.log(chalk.blue("📄 Generating PDF..."));

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(`file://${path.resolve(htmlPath)}`, {
      waitUntil: "networkidle0",
    });

    // Wait for presentation to load
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const pdfPath = path.join(outputDir, "presentation.pdf");
    await page.pdf({
      path: pdfPath,
      format: "A4",
      margin: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
    });

    console.log(chalk.green(`✅ PDF exported to: ${pdfPath}`));
  } finally {
    await browser.close();
  }
}

// PPTX Export Function
async function exportToPPTX(
  htmlPath: string,
  outputDir: string
): Promise<void> {
  console.log(chalk.blue("📊 Generating PPTX..."));

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(`file://${path.resolve(htmlPath)}`, {
      waitUntil: "networkidle0",
    });

    // Wait for presentation to load
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Get total number of slides
    const slideCount = await page.evaluate(() => {
      const slides = document.querySelectorAll(".mostage-slide");
      console.log("Found slides:", slides.length);
      return slides.length;
    });

    console.log(chalk.blue(`Found ${slideCount} slides`));

    const pptx = new PptxGenJS();

    // Set presentation properties
    pptx.author = "Mostage";
    pptx.company = "mo.js.org";
    pptx.title = "Mostage Presentation";

    // Generate slides
    for (let i = 0; i < slideCount; i++) {
      console.log(
        chalk.blue(`Processing slide ${i + 1}/${slideCount} for PPTX`)
      );

      // Capture slide content directly without navigation
      const slideContent = await page.evaluate((slideIndex) => {
        const slides = document.querySelectorAll(".mostage-slide");
        const slide = slides[slideIndex];

        if (!slide) {
          return {
            error: `Slide ${slideIndex} not found`,
            slideCount: slides.length,
          };
        }

        // Get all text content from the slide
        const textContent = slide.innerText || slide.textContent || "";

        // Extract title from various possible selectors
        const titleSelectors = ["h1", "h2", "h3", ".title", ".slide-title"];
        let title = `Slide ${slideIndex + 1}`;

        for (const selector of titleSelectors) {
          const titleElement = slide.querySelector(selector);
          if (titleElement && titleElement.textContent?.trim()) {
            title = titleElement.textContent.trim();
            break;
          }
        }

        // Get all direct text nodes
        const allText = [];
        const walker = document.createTreeWalker(
          slide,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );

        let node;
        while ((node = walker.nextNode())) {
          const text = node.textContent?.trim();
          if (text && text.length > 0) {
            allText.push(text);
          }
        }

        // Extract images
        const images = Array.from(slide.querySelectorAll("img")).map((img) => ({
          src: img.src,
          alt: img.alt,
          width: img.width,
          height: img.height,
        }));

        // Extract background styles
        const backgroundStyle =
          slide.style.backgroundImage ||
          getComputedStyle(slide).backgroundImage;

        // Extract colors and styling
        const backgroundColor =
          slide.style.backgroundColor ||
          getComputedStyle(slide).backgroundColor;

        const textColor = slide.style.color || getComputedStyle(slide).color;

        // Convert RGB colors to hex format for PPTX
        const rgbToHex = (rgb: string) => {
          if (!rgb || rgb === "rgba(0, 0, 0, 0)") return null;
          const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
          if (match) {
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);
            return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
          }
          return null;
        };

        // Extract code blocks
        const codeBlocks = Array.from(slide.querySelectorAll("pre, code")).map(
          (code) => ({
            text: code.textContent?.trim(),
            language: code.className?.match(/language-(\w+)/)?.[1] || "text",
          })
        );

        // Extract lists with better formatting
        const lists = Array.from(slide.querySelectorAll("ul, ol")).map(
          (list) => {
            const items = Array.from(list.querySelectorAll("li"))
              .map((li) => li.textContent?.trim())
              .filter(Boolean);
            const isOrdered = list.tagName === "OL";
            return { items, isOrdered };
          }
        );

        return {
          title,
          textContent,
          allText,
          slideHTML: slide.innerHTML,
          images,
          backgroundStyle,
          backgroundColor: rgbToHex(backgroundColor),
          textColor: rgbToHex(textColor),
          codeBlocks,
          lists,
        };
      }, i);

      if (slideContent && !slideContent.error) {
        console.log(
          chalk.gray(`Slide ${i + 1} - Title: ${slideContent.title}`)
        );
        console.log(
          chalk.gray(
            `Slide ${i + 1} - Text: ${slideContent.textContent.substring(0, 100)}...`
          )
        );

        const slide = pptx.addSlide();

        // Set slide background if available
        if (slideContent.backgroundColor) {
          slide.background = { color: slideContent.backgroundColor };
        }

        // Add title with better styling
        slide.addText(slideContent.title, {
          x: 0.5,
          y: 0.5,
          w: 9,
          h: 1,
          fontSize: 28,
          bold: true,
          color: slideContent.textColor || "363636",
          fontFace: "Arial",
        });

        // Add main content
        let yPosition = 1.8;

        // Add images first
        if (slideContent.images && slideContent.images.length > 0) {
          slideContent.images.forEach((img, imgIndex) => {
            if (yPosition < 6 && img.src) {
              try {
                // Skip data URLs and SVG images as they cause issues
                if (img.src.startsWith("data:") || img.src.includes(".svg")) {
                  slide.addText(`[Image: ${img.alt || "Image"}]`, {
                    x: 0.5,
                    y: yPosition,
                    w: 9,
                    h: 0.5,
                    fontSize: 12,
                    color: "666666",
                    italic: true,
                  });
                  yPosition += 0.6;
                } else {
                  slide.addImage({
                    path: img.src,
                    x: 0.5,
                    y: yPosition,
                    w: 4,
                    h: 2.5,
                  });
                  yPosition += 2.8;
                }
              } catch (error) {
                // If image fails, add as text
                slide.addText(`[Image: ${img.alt || "Image"}]`, {
                  x: 0.5,
                  y: yPosition,
                  w: 9,
                  h: 0.5,
                  fontSize: 12,
                  color: "666666",
                  italic: true,
                });
                yPosition += 0.6;
              }
            }
          });
        }

        // Add code blocks with special formatting
        if (slideContent.codeBlocks && slideContent.codeBlocks.length > 0) {
          slideContent.codeBlocks.forEach((codeBlock, codeIndex) => {
            if (codeBlock.text && yPosition < 6) {
              slide.addText(codeBlock.text, {
                x: 0.5,
                y: yPosition,
                w: 9,
                h: 1.5,
                fontSize: 12,
                color: "2d3748",
                fontFace: "Courier New",
                align: "left",
              });
              yPosition += 1.6;
            }
          });
        }

        // Add lists with proper formatting
        if (slideContent.lists && slideContent.lists.length > 0) {
          slideContent.lists.forEach((list, listIndex) => {
            if (yPosition < 6) {
              list.items.forEach((item, itemIndex) => {
                if (item && yPosition < 6) {
                  const bullet = list.isOrdered ? `${itemIndex + 1}.` : "•";
                  slide.addText(`${bullet} ${item}`, {
                    x: 0.8,
                    y: yPosition,
                    w: 8.5,
                    h: 0.5,
                    fontSize: 14,
                    color: slideContent.textColor || "363636",
                  });
                  yPosition += 0.6;
                }
              });
            }
          });
        }

        // Add regular text content
        if (slideContent.allText && slideContent.allText.length > 0) {
          slideContent.allText.forEach((text, index) => {
            if (text && yPosition < 6) {
              // Skip if it's already in a list or code block
              if (
                !slideContent.lists?.some((list) =>
                  list.items.includes(text)
                ) &&
                !slideContent.codeBlocks?.some((code) =>
                  code.text.includes(text)
                )
              ) {
                slide.addText(text, {
                  x: 0.5,
                  y: yPosition,
                  w: 9,
                  h: 0.6,
                  fontSize: 14,
                  color: slideContent.textColor || "363636",
                });
                yPosition += 0.6;
              }
            }
          });
        } else if (slideContent.textContent) {
          // Fallback to textContent
          const cleanText = slideContent.textContent
            .replace(/\s+/g, " ")
            .trim();
          if (cleanText && yPosition < 6) {
            slide.addText(cleanText, {
              x: 0.5,
              y: yPosition,
              w: 9,
              h: 4,
              fontSize: 14,
              color: slideContent.textColor || "363636",
            });
          }
        } else {
          // If no content found, add a placeholder
          slide.addText(`Content for slide ${i + 1}`, {
            x: 0.5,
            y: yPosition,
            w: 9,
            h: 1,
            fontSize: 16,
            color: "666666",
            italic: true,
          });
        }
      } else {
        console.log(
          chalk.yellow(`No content found for slide ${i + 1}:`, slideContent)
        );
      }
    }

    const pptxPath = path.join(outputDir, "presentation.pptx");
    await pptx.writeFile({ fileName: pptxPath });

    console.log(chalk.green(`✅ PPTX exported to: ${pptxPath}`));
  } finally {
    await browser.close();
  }
}

// PNG Export Function
async function exportToPNG(htmlPath: string, outputDir: string): Promise<void> {
  console.log(chalk.blue("🖼️  Generating PNG..."));

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(`file://${path.resolve(htmlPath)}`, {
      waitUntil: "networkidle0",
    });

    // Wait for presentation to load
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Get total number of slides
    const slideCount = await page.evaluate(() => {
      const slides = document.querySelectorAll(".mostage-slide");
      console.log("Found slides:", slides.length);
      return slides.length;
    });

    console.log(chalk.blue(`Found ${slideCount} slides`));

    // Generate PNG for each slide
    for (let i = 0; i < slideCount; i++) {
      console.log(chalk.blue(`Processing slide ${i + 1}/${slideCount}`));

      // Navigate to specific slide by showing only that slide
      await page.evaluate((slideIndex) => {
        const slides = document.querySelectorAll(".mostage-slide");

        // Hide all slides
        slides.forEach((slide) => {
          slide.style.display = "none";
          slide.style.opacity = "0";
          slide.style.visibility = "hidden";
        });

        // Show only the target slide
        if (slides[slideIndex]) {
          slides[slideIndex].style.display = "block";
          slides[slideIndex].style.opacity = "1";
          slides[slideIndex].style.visibility = "visible";
        }

        // Try to trigger navigation events
        if (window.mostage) {
          // Try different methods to navigate
          if (typeof window.mostage.goToSlide === "function") {
            window.mostage.goToSlide(slideIndex);
          } else if (typeof window.mostage.next === "function") {
            for (let j = 0; j < slideIndex; j++) {
              window.mostage.next();
            }
          }
        }

        // Try keyboard navigation as fallback
        for (let j = 0; j < slideIndex; j++) {
          const event = new CustomEvent("keydown", { key: "ArrowRight" });
          document.dispatchEvent(event);
        }
      }, i);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const pngPath = path.join(outputDir, `slide-${i + 1}.png`);
      console.log(chalk.gray(`Saving to: ${pngPath}`));

      await page.screenshot({
        path: pngPath,
        fullPage: true,
        type: "png",
      });

      console.log(chalk.green(`✅ Slide ${i + 1} saved`));
    }

    console.log(chalk.green(`✅ PNG slides exported to: ${outputDir}`));
  } finally {
    await browser.close();
  }
}

// JPG Export Function
async function exportToJPG(htmlPath: string, outputDir: string): Promise<void> {
  console.log(chalk.blue("🖼️  Generating JPG..."));

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(`file://${path.resolve(htmlPath)}`, {
      waitUntil: "networkidle0",
    });

    // Wait for presentation to load
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Get total number of slides
    const slideCount = await page.evaluate(() => {
      const slides = document.querySelectorAll(".mostage-slide");
      console.log("Found slides:", slides.length);
      return slides.length;
    });

    console.log(chalk.blue(`Found ${slideCount} slides`));

    // Generate JPG for each slide
    for (let i = 0; i < slideCount; i++) {
      console.log(chalk.blue(`Processing slide ${i + 1}/${slideCount}`));

      // Navigate to specific slide by showing only that slide
      await page.evaluate((slideIndex) => {
        const slides = document.querySelectorAll(".mostage-slide");

        // Hide all slides
        slides.forEach((slide) => {
          slide.style.display = "none";
          slide.style.opacity = "0";
          slide.style.visibility = "hidden";
        });

        // Show only the target slide
        if (slides[slideIndex]) {
          slides[slideIndex].style.display = "block";
          slides[slideIndex].style.opacity = "1";
          slides[slideIndex].style.visibility = "visible";
        }

        // Try to trigger navigation events
        if (window.mostage) {
          // Try different methods to navigate
          if (typeof window.mostage.goToSlide === "function") {
            window.mostage.goToSlide(slideIndex);
          } else if (typeof window.mostage.next === "function") {
            for (let j = 0; j < slideIndex; j++) {
              window.mostage.next();
            }
          }
        }

        // Try keyboard navigation as fallback
        for (let j = 0; j < slideIndex; j++) {
          const event = new CustomEvent("keydown", { key: "ArrowRight" });
          document.dispatchEvent(event);
        }
      }, i);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const jpgPath = path.join(outputDir, `slide-${i + 1}.jpg`);
      console.log(chalk.gray(`Saving to: ${jpgPath}`));

      const screenshot = await page.screenshot({
        fullPage: true,
        type: "jpeg",
        quality: 90,
      });

      // Use Sharp to optimize the JPG
      await sharp(screenshot).jpeg({ quality: 90 }).toFile(jpgPath);

      console.log(chalk.green(`✅ Slide ${i + 1} saved`));
    }

    console.log(chalk.green(`✅ JPG slides exported to: ${outputDir}`));
  } finally {
    await browser.close();
  }
}
