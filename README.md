# Mostage

[![npm version](https://img.shields.io/npm/v/mostage.svg)](https://www.npmjs.com/package/mostage)

Presentation framework based on **Markdown** (with HTML support) to web-based slide.

## [Demo](https://mo.js.org) | [Documentation](./docs/README.md)

## Quick Start

### Option 1: Using CLI (recommended)

#### Using npx (no installation required)

```bash
# Create a new project
npx mostage init

# Start development server
npx mostage dev
```

#### Install globally

```bash
# Install CLI
npm install -g mostage

# Create a new project
mostage init

# Start development server
mostage dev
```

### Option 2: Manual Setup (without CLI)

If you prefer not to use the CLI, you can set up Mostage manually:

1. **Create your project structure:**

   ```
   my-presentation/
   ├── index.html
   ├── slides.md
   └── config.json
   ```

2. **Create `index.html`:**

   ```html
   <!DOCTYPE html>
   <html>
     <head>
       <meta charset="utf-8" />
       <title>My Presentation</title>
       <link
         rel="stylesheet"
         href="https://unpkg.com/mostage/dist/mostage.css"
       />
     </head>
     <body>
       <script src="https://unpkg.com/mostage/dist/index.js"></script>
       <script>
         new Mostage({
           container: document.body,
           markdown: "./slides.md",
           config: "./config.json",
         });
       </script>
     </body>
   </html>
   ```

3. **Create `slides.md` with your content:**

   ```markdown
   # Slide 1

   Welcome to my presentation!

   ---

   # Slide 2

   This is the second slide.
   ```

4. **Create `config.json` (optional):**

   ```json
   {
     "theme": "light",
     "scale": 1.2
   }
   ```

5. **Serve your files** using any local server (e.g., `python -m http.server` or `npx serve`)

That's it! Open your browser and start creating your presentation.

## CLI Commands

You can use these commands with `npx mostage <command>` or install globally with `npm install -g mostage`:

| Command          | Description              |
| ---------------- | ------------------------ |
| `mostage init`   | Create a new project     |
| `mostage dev`    | Start development server |
| `mostage build`  | Build for production     |
| `mostage theme`  | Manage themes            |
| `mostage plugin` | Manage plugins           |
| `mostage help`   | Show help                |

For detailed CLI documentation, see [CLI Reference](./docs/README.md#cli-usage).

## Documentation

- **[Complete Documentation](./docs/README.md)** - Full documentation
- **[Configuration Reference](./docs/configuration.md)** - All configuration options
- **[API Reference](./docs/api.md)** - Complete API documentation
- **[Examples](./docs/examples.md)** - Various usage examples

## License

MIT License - see [LICENSE](LICENSE) file for details.
