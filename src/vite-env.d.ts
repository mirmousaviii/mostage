/// <reference types="vite/client" />

interface ImportMeta {
  readonly glob: (pattern: string, options?: { eager?: boolean }) => Record<string, () => Promise<any>>;
}
