#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();

program
  .name('mostage')
  .description('A modern, plugin-based, themeable slide presentation framework')
  .version('1.0.0');

// Init command
program
  .command('init')
  .description('Create a new presentation project')
  .option('--with-example', 'Include example slides')
  .option('--slides <file>', 'Slides file name', 'slides.md')
  .option('--theme <theme>', 'Theme to use', 'light')
  .option('-o, --output <file>', 'Output HTML file', 'index.html')
  .argument('[name]', 'Project name')
  .action(async (name, options) => {
    await initProject(name || 'my-presentation', options);
  });

// Build command
program
  .command('build')
  .description('Build static HTML from slides')
  .argument('<slides>', 'Markdown slides file')
  .option('--theme <theme>', 'Theme to use', 'light')
  .option('-o, --output <file>', 'Output HTML file', 'index.html')
  .action(async (slides, options) => {
    await buildProject(slides, options);
  });

// Serve command
program
  .command('serve')
  .description('Start development server with hot reload')
  .argument('<slides>', 'Markdown slides file')
  .option('-p, --port <port>', 'Port to serve on', '3000')
  .option('--theme <theme>', 'Theme to use', 'light')
  .action(async (slides, options) => {
    await serveProject(slides, options);
  });

// Themes command
program
  .command('themes')
  .description('List available themes')
  .action(() => {
    const themes = ['light', 'dark', 'solarized', 'dracula'];
    console.log('Available themes:');
    themes.forEach(theme => console.log(`  - ${theme}`));
  });

async function initProject(name: string, options: any) {
  console.log(`Creating new presentation: ${name}`);
  
  const projectDir = path.join(process.cwd(), name);
  
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }
  
  // Create package.json
  const packageJson = {
    name: name,
    version: '1.0.0',
    description: 'Mostage presentation',
    scripts: {
      dev: 'mostage serve slides.md',
      build: 'mostage build slides.md'
    },
    dependencies: {
      'mostage': '^1.0.0'
    }
  };
  
  fs.writeFileSync(
    path.join(projectDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Create slides.md
  const slidesContent = options.withExample ? getExampleSlides() : getBasicSlides();
  fs.writeFileSync(path.join(projectDir, options.slides), slidesContent);
  
  // Create index.html
  const htmlContent = generateHTML(options.slides, options.theme);
  fs.writeFileSync(path.join(projectDir, options.output), htmlContent);
  
  console.log(`✅ Project created in ${projectDir}`);
  console.log('Run the following commands to get started:');
  console.log(`  cd ${name}`);
  console.log('  npm install');
  console.log('  npm run dev');
}

async function buildProject(slides: string, options: any) {
  console.log(`Building slides from ${slides}...`);
  
  if (!fs.existsSync(slides)) {
    console.error(`Error: Slides file "${slides}" not found`);
    process.exit(1);
  }
  
  const htmlContent = generateHTML(slides, options.theme);
  fs.writeFileSync(options.output, htmlContent);
  
  console.log(`✅ Built ${options.output}`);
}

async function serveProject(slides: string, options: any) {
  console.log(`Starting development server for ${slides}...`);
  console.log(`Server will run on http://localhost:${options.port}`);
  
  // Simple HTTP server implementation
  const http = require('http');
  const url = require('url');
  
  const server = http.createServer((req: any, res: any) => {
    const parsedUrl = url.parse(req.url, true);
    
    if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/index.html') {
      const htmlContent = generateHTML(slides, options.theme);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(htmlContent);
    } else if (parsedUrl.pathname === `/${slides}`) {
      if (fs.existsSync(slides)) {
        const content = fs.readFileSync(slides, 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(content);
      } else {
        res.writeHead(404);
        res.end('Slides file not found');
      }
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });
  
  server.listen(options.port, () => {
    console.log(`🚀 Development server running at http://localhost:${options.port}`);
  });
}

function getBasicSlides(): string {
  return `# Welcome to Mostage

Your presentation framework

---

## Features

- **Markdown support**
- Plugin system
- Multiple themes
- Smooth transitions

---

## Getting Started

1. Edit your slides in \`slides.md\`
2. Run \`npm run dev\` to start development
3. Run \`npm run build\` to create production version

---

## Thank You!

Happy presenting! 🎉`;
}

function getExampleSlides(): string {
  return `# Mostage Example

## A modern presentation framework

---

## What is Mostage?

Mostage is a **modern**, **plugin-based**, and **themeable** slide presentation framework.

- Written in TypeScript
- Custom Markdown parser
- Extensible plugin system
- Multiple built-in themes

---

## Markdown Support

### Headers
# H1 Header
## H2 Header
### H3 Header

### Text Formatting
**Bold text** and *italic text*

### Code
Inline \`code\` and code blocks:

\`\`\`javascript
const mo = new Mo({
  theme: "dark",
  plugins: ["ProgressBar"]
});
mo.start();
\`\`\`

---

## Lists

### Unordered Lists
- Feature 1
- Feature 2
- Feature 3

### Ordered Lists
1. First step
2. Second step
3. Third step

---

## Links and Quotes

Visit [mo.js.org](https://mo.js.org) for more information.

> "Mostage makes presentations beautiful and simple."

---

## Themes

Mostage supports multiple themes:

- Light
- Dark  
- Solarized
- Dracula

---

## Plugins

Built-in plugins include:

- **ProgressBar** - Shows slide progress
- **SlideNumber** - Displays current slide number
- **Controller** - Navigation buttons
- **OverviewMode** - Grid view of all slides

---

## Navigation

- **Arrow keys** - Navigate slides
- **Spacebar** - Next slide
- **ESC** - Overview mode
- **Touch gestures** - Swipe navigation

---

## Thank You!

Start building amazing presentations with Mostage! 🚀

### Get Started
\`\`\`bash
npx mostage init my-presentation --with-example
cd my-presentation
npm install
npm run dev
\`\`\``;
}

function generateHTML(slidesFile: string, theme: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mostage Presentation</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            overflow: hidden;
        }
        
        .mostage-container {
            width: 100vw;
            height: 100vh;
            position: relative;
        }
        
        .mostages {
            width: 100%;
            height: 100%;
            position: relative;
        }
        
        .mostage {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 2rem;
            box-sizing: border-box;
            position: absolute;
            top: 0;
            left: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .mostage h1 { font-size: 3rem; margin-bottom: 1rem; }
        .mostage h2 { font-size: 2.5rem; margin-bottom: 0.8rem; }
        .mostage h3 { font-size: 2rem; margin-bottom: 0.6rem; }
        .mostage h4 { font-size: 1.5rem; margin-bottom: 0.5rem; }
        .mostage h5 { font-size: 1.2rem; margin-bottom: 0.4rem; }
        .mostage h6 { font-size: 1rem; margin-bottom: 0.3rem; }
        
        .mostage p { font-size: 1.2rem; line-height: 1.6; margin-bottom: 1rem; }
        .mostage ul, .mostage ol { font-size: 1.1rem; line-height: 1.5; }
        .mostage li { margin-bottom: 0.5rem; }
        .mostage code { background: rgba(0,0,0,0.1); padding: 0.2rem 0.4rem; border-radius: 3px; }
        .mostage pre { background: rgba(0,0,0,0.1); padding: 1rem; border-radius: 5px; overflow-x: auto; }
        .mostage blockquote { border-left: 4px solid #ccc; padding-left: 1rem; margin: 1rem 0; font-style: italic; }
        
        .mostage-progress-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4px;
            z-index: 1000;
        }
        
        .mostage-number {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            font-size: 0.9rem;
            z-index: 1000;
        }
        
        .mostage-controller {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 1000;
        }
        
        .mostage-btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1.2rem;
            transition: opacity 0.2s ease;
        }
        
        .mostage-btn:hover {
            opacity: 0.8;
        }
        
        .mostage-overview-mode .mostages {
            transform: scale(0.2);
            transform-origin: top left;
        }
        
        .mostage-overview-grid {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 20px;
            background: rgba(0,0,0,0.8);
            z-index: 999;
            overflow-y: auto;
        }
        
        .mostage-overview-slide {
            background: white;
            border-radius: 10px;
            padding: 10px;
            cursor: pointer;
            transition: transform 0.2s ease;
            aspect-ratio: 16/9;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.5rem;
        }
        
        .mostage-overview-slide:hover {
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <div id="app"></div>
    
    <script type="module">
        // Mostage lite implementation for static builds
        class MoLite {
            constructor(config) {
                this.config = config;
                this.currentSlide = 0;
                this.slides = [];
                this.container = document.querySelector(config.element);
                this.setupStyles();
            }
            
            setupStyles() {
                const themes = {
                    light: { bg: '#ffffff', color: '#333333', accent: '#3498db' },
                    dark: { bg: '#1a1a1a', color: '#e0e0e0', accent: '#61dafb' },
                    solarized: { bg: '#fdf6e3', color: '#657b83', accent: '#268bd2' },
                    dracula: { bg: '#282a36', color: '#f8f8f2', accent: '#ff79c6' }
                };
                
                const theme = themes['${theme}'] || themes.light;
                document.body.style.background = theme.bg;
                document.body.style.color = theme.color;
                
                const style = document.createElement('style');
                style.textContent = \`
                    .mostage-progress-bar { background: rgba(0,0,0,0.1); }
                    .mostage-progress-fill { background: \${theme.accent}; height: 100%; transition: width 0.3s ease; width: 0%; }
                    .mostage-number { background: rgba(0,0,0,0.1); color: \${theme.color}; }
                    .mostage-btn { background: \${theme.accent}; color: white; }
                \`;
                document.head.appendChild(style);
            }
            
            async start() {
                const response = await fetch('${slidesFile}');
                const markdown = await response.text();
                this.parseMarkdown(markdown);
                this.render();
                this.setupNavigation();
                this.setupPlugins();
            }
            
            parseMarkdown(content) {
                const slideContents = content.split(/^---\\s*$/gm).filter(s => s.trim());
                this.slides = slideContents.map((slide, i) => ({
                    id: \`slide-\${i}\`,
                    html: this.parseSlideContent(slide.trim())
                }));
            }
            
            parseSlideContent(content) {
                return content
                    .replace(/^#{6}\\s+(.+)$/gm, '<h6>$1</h6>')
                    .replace(/^#{5}\\s+(.+)$/gm, '<h5>$1</h5>')
                    .replace(/^#{4}\\s+(.+)$/gm, '<h4>$1</h4>')
                    .replace(/^#{3}\\s+(.+)$/gm, '<h3>$1</h3>')
                    .replace(/^#{2}\\s+(.+)$/gm, '<h2>$1</h2>')
                    .replace(/^#{1}\\s+(.+)$/gm, '<h1>$1</h1>')
                    .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
                    .replace(/\\*(.+?)\\*/g, '<em>$1</em>')
                    .replace(/\`(.+?)\`/g, '<code>$1</code>')
                    .replace(/\\[(.+?)\\]\\((.+?)\\)/g, '<a href="$2">$1</a>')
                    .replace(/^>\\s+(.+)$/gm, '<blockquote>$1</blockquote>')
                    .replace(/^[-*+]\\s+(.+)$/gm, '<li>$1</li>')
                    .replace(/^\\d+\\.\\s+(.+)$/gm, '<li>$1</li>')
                    .replace(/(<li>.*<\\/li>)/gs, '<ul>$1</ul>')
                    .replace(/\\n\\n/g, '</p><p>')
                    .replace(/^(?!<[h1-6ul>])(.+)$/gm, '<p>$1</p>');
            }
            
            render() {
                this.container.innerHTML = '<div class="mostages"></div>';
                const slidesContainer = this.container.querySelector('.mostages');
                
                this.slides.forEach((slide, i) => {
                    const slideEl = document.createElement('div');
                    slideEl.className = 'mostage';
                    slideEl.innerHTML = slide.html;
                    slideEl.style.display = i === 0 ? 'block' : 'none';
                    slidesContainer.appendChild(slideEl);
                });
            }
            
            setupNavigation() {
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowRight' || e.key === ' ') {
                        e.preventDefault();
                        this.next();
                    } else if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        this.prev();
                    }
                });
            }
            
            setupPlugins() {
                // Progress bar
                const progressBar = document.createElement('div');
                progressBar.className = 'mostage-progress-bar';
                progressBar.innerHTML = '<div class="mostage-progress-fill"></div>';
                document.body.appendChild(progressBar);
                
                // Slide number
                const slideNumber = document.createElement('div');
                slideNumber.className = 'mostage-number';
                slideNumber.textContent = \`1 / \${this.slides.length}\`;
                document.body.appendChild(slideNumber);
                
                // Controller
                const controller = document.createElement('div');
                controller.className = 'mostage-controller';
                controller.innerHTML = \`
                    <button class="mostage-btn mostage-prev">‹</button>
                    <button class="mostage-btn mostage-next">›</button>
                \`;
                document.body.appendChild(controller);
                
                controller.querySelector('.mostage-prev').onclick = () => this.prev();
                controller.querySelector('.mostage-next').onclick = () => this.next();
                
                this.updatePlugins();
            }
            
            updatePlugins() {
                const progress = ((this.currentSlide + 1) / this.slides.length) * 100;
                document.querySelector('.mostage-progress-fill').style.width = \`\${progress}%\`;
                document.querySelector('.mostage-number').textContent = \`\${this.currentSlide + 1} / \${this.slides.length}\`;
            }
            
            next() {
                if (this.currentSlide < this.slides.length - 1) {
                    this.goTo(this.currentSlide + 1);
                }
            }
            
            prev() {
                if (this.currentSlide > 0) {
                    this.goTo(this.currentSlide - 1);
                }
            }
            
            goTo(index) {
                const slides = this.container.querySelectorAll('.mostage');
                slides[this.currentSlide].style.display = 'none';
                slides[index].style.display = 'block';
                this.currentSlide = index;
                this.updatePlugins();
            }
        }
        
        const mo = new MoLite({ element: '#app' });
        mo.start();
    </script>
</body>
</html>`;
}

program.parse();
