/// <reference types="vite/client" />

interface ImportMeta {
  readonly glob: (
    pattern: string,
    options?: { eager?: boolean },
  ) => Record<string, () => Promise<any>>;
}

// CSS module declarations
declare module "*.css" {
  const content: string;
  export default content;
}

declare module "*.css?raw" {
  const content: string;
  export default content;
}

declare module "*.css?inline" {
  const content: string;
  export default content;
}
