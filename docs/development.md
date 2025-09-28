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

This project includes an automated CI/CD pipeline using GitHub Actions that handles package publishing when version tags are created.

### How it works

When you create and push a version tag (e.g., `v1.2.0`), the workflow automatically:

1. **Extracts version from tag** - Automatically updates `package.json` with the version from the tag
2. **Builds the project** - Runs `npm run build` to compile TypeScript and generate distribution files
3. **Publishes to NPM** - Publishes to the public NPM registry for global installation
4. **Publishes to GitHub Packages** - Also publishes to GitHub's package registry

### Publishing a new version

To release a new version:

```bash
# Create and push a version tag
git tag v1.2.0
git push origin v1.2.0
```

The workflow will automatically:

- ✅ Extract version from tag (`v1.2.0` → `1.2.0`)
- ✅ Update `package.json` version
- ✅ Build the project
- ✅ Publish to NPM (`npm install mostage@latest`)
- ✅ Publish to GitHub Packages (`npm install @mirmousaviii/mostage`)

### Required Setup

Before the first release, you need to configure:

1. **NPM Token**:
   - Go to [npmjs.com](https://www.npmjs.com) → Access Tokens
   - Create an **Automation** token
   - Add it to GitHub repository secrets as `NPM_TOKEN`

2. **GitHub Token**:
   - Automatically provided by GitHub Actions (no setup needed)

### Workflow Features

- **Automatic version management** - No need to manually update `package.json`
- **Dual publishing** - Packages are available on both NPM and GitHub Packages
- **Node.js 21.7.3** - Uses the specified Node.js version
- **Build verification** - Ensures the project builds successfully before publishing

## Building

### Development Build

```bash
npm run dev
```

This starts the Vite development server with hot reload.

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
