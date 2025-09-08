import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';

  return {
    // Development: serve from example directory
    root: isDev ? 'example' : undefined,
    
    // Plugins
    plugins: [
      dts({
        outDir: isDev ? '../dist/types' : 'dist/types',
        include: [isDev ? '../src/**/*' : 'src/**/*']
      })
    ],
    
    // Build configuration
    build: {
      outDir: isDev ? '../dist' : 'dist',
      emptyOutDir: true,
      
      // Library mode
      lib: {
        entry: {
          index: resolve(__dirname, isDev ? '../src/index.ts' : 'src/index.ts')
        },
        formats: ['es', 'cjs'],
        fileName: (format, entryName) => {
          const ext = format === 'es' ? 'js' : 'cjs';
          return `index.${ext}`;
        }
      },
      
      // External dependencies (not bundled)
      rollupOptions: {
        external: ['fs', 'path', 'url'],
        output: {
          exports: 'named'
        }
      }
    },
    
    // Path aliases
    resolve: {
      alias: {
        '@': resolve(__dirname, isDev ? '../src' : 'src')
      }
    }
  };
});
