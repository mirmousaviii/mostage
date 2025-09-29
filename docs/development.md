# Development

## Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**

4. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request**

## CI/CD Pipeline

This project includes automated CI/CD pipelines using GitHub Actions that handle both package publishing and GitHub Pages deployment when changes are pushed to the main branch.

### How it works

When you push changes to the main branch, two workflows run automatically:

#### 1. **Package Publishing** (`publish.yml`)

- **Builds the project** - Runs `npm run build` to compile TypeScript and generate distribution files
- **Publishes to NPM** - Publishes to the public NPM registry for global installation
- **Publishes to GitHub Packages** - Also publishes to GitHub's package registry

#### 2. **GitHub Pages Deployment** (`deploy-pages.yml`)

- **Builds example** - Runs `npm run build:example` to build the demo
- **Deploys to GitHub Pages** - Makes the example available at `https://mirmousaviii.github.io/mostage/`

### Publishing a new version

To release a new version:

```bash
# 1. Update version in package.json manually
npm version patch  # or minor, major

# 2. Build and commit changes
npm run build && git add . && git commit -m 'Build for release' && git push

# 3. Push to main branch (triggers automatic deployment)
git push origin main
```

### Required Setup

###### Just for remember

Before the first release, you need to configure:

1. **NPM Token**:
   - Go to [npmjs.com](https://www.npmjs.com) → Access Tokens
   - Create an **Automation** token
   - Add it to GitHub repository secrets as `NPM_TOKEN`

2. **GitHub Pages**:
   - Go to Repository Settings → Pages
   - Set Source to "GitHub Actions"
   - No additional setup needed

3. **GitHub Token**:
   - Automatically provided by GitHub Actions (no setup needed)

## Building

### Development

```bash
npm run dev
```

This starts the Vite development server with hot reload using the example directory.

### Production Builds

The project uses separate Vite configurations for different build targets:

#### Library Build

```bash
npm run build:lib
```

Builds the main library (`dist/index.js`, `dist/index.cjs`, `dist/mostage.css`)

#### CLI Build

```bash
npm run build:cli
```

Builds the CLI tool (`dist/cli/index.js`, `dist/cli/index.cjs`)

#### Example Build

```bash
npm run build:example
```

Builds the example for GitHub Pages (`dist/example/`)

#### Full Build

```bash
npm run build
```

Builds everything: library + CLI + example

### Build Configuration

The project uses separate Vite config files for better organization:

- `vite.dev.config.ts` - Development server
- `vite.build.lib.config.ts` - Library build
- `vite.build.cli.config.ts` - CLI build
- `vite.build.example.config.ts` - Example build

### Preview

```bash
npm run preview
```

Preview the built example locally.

## Plugin Development

### Creating a Plugin

1. **Create plugin file** in `src/plugins/your-plugin/`
2. **Implement plugin interface**:

```typescript
export class YourPlugin {
  name = "YourPlugin";

  init(mostage: Mostage, config: any) {
    // Initialize your plugin
  }

  destroy() {
    // Cleanup resources
  }

  setEnabled(enabled: boolean) {
    // Enable/disable functionality
  }
}
```

3. **No need to add to plugin loader** — this is done automatically
4. **Create styles** if needed

## Theme Development

### Creating a Theme

1. **Create theme file** in `src/themes/your-theme.css`
2. **Use CSS custom properties** for consistency
3. **Follow the existing theme structure**

### Getting Help

- Check existing [Issues](https://github.com/mirmousaviii/mostage/issues)
- Create a new issue with detailed description
- Join discussions in the community
