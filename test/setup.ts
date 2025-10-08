import { vi } from "vitest";
import { JSDOM } from "jsdom";

// Setup JSDOM environment
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
  url: "http://localhost",
  pretendToBeVisual: true,
  resources: "usable",
});

// Mock global objects
global.window = dom.window as any;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.Document = dom.window.Document;
global.Window = dom.window.Window;

// Mock fetch
global.fetch = vi.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
};

// Mock process for Node.js environment
global.process = {
  ...process,
  cwd: vi.fn(() => "/test/project"),
  exit: vi.fn(),
};

// Mock file system operations
vi.mock("fs-extra", () => ({
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    readdir: vi.fn(),
    stat: vi.fn(),
    pathExists: vi.fn(),
    ensureDir: vi.fn(),
    remove: vi.fn(),
  },
}));

// Mock path module
vi.mock("path", () => ({
  default: {
    join: vi.fn((...args) => args.join("/")),
    resolve: vi.fn((...args) => args.join("/")),
    extname: vi.fn((path) => {
      const match = path.match(/\.([^.]+)$/);
      return match ? `.${match[1]}` : "";
    }),
    dirname: vi.fn((path) => path.split("/").slice(0, -1).join("/") || "."),
    basename: vi.fn((path) => path.split("/").pop() || ""),
  },
}));

// Mock chalk
vi.mock("chalk", () => ({
  default: {
    blue: vi.fn((text) => text),
    green: vi.fn((text) => text),
    red: vi.fn((text) => text),
    yellow: vi.fn((text) => text),
    gray: vi.fn((text) => text),
    bold: vi.fn((text) => text),
  },
}));

// Mock puppeteer
vi.mock("puppeteer", () => ({
  default: {
    launch: vi.fn(() =>
      Promise.resolve({
        newPage: vi.fn(() =>
          Promise.resolve({
            goto: vi.fn(() => Promise.resolve()),
            setViewport: vi.fn(() => Promise.resolve()),
            evaluate: vi.fn(() => Promise.resolve()),
            screenshot: vi.fn(() => Promise.resolve(Buffer.from("mock-image"))),
            pdf: vi.fn(() => Promise.resolve()),
            close: vi.fn(() => Promise.resolve()),
          })
        ),
        close: vi.fn(() => Promise.resolve()),
      })
    ),
  },
}));

// Mock CenterContentManager to prevent JSDOM issues
vi.mock("../src/core/components/ui/center/center", () => ({
  CenterContentManager: vi.fn().mockImplementation(() => ({
    initialize: vi.fn(),
    onSlideChange: vi.fn(),
    cleanup: vi.fn(),
  })),
}));

// Mock sharp
vi.mock("sharp", () => ({
  default: vi.fn(() => ({
    jpeg: vi.fn(() => ({
      toFile: vi.fn(() => Promise.resolve()),
    })),
  })),
}));

// Mock pptxgenjs
vi.mock("pptxgenjs", () => ({
  default: vi.fn(() => ({
    author: "",
    company: "",
    title: "",
    addSlide: vi.fn(() => ({
      addText: vi.fn(),
      addImage: vi.fn(),
      background: null,
    })),
    writeFile: vi.fn(() => Promise.resolve()),
  })),
}));

// Mock marked
vi.mock("marked", () => ({
  marked: {
    parse: vi.fn((content) => {
      // Simple markdown parsing for tests
      let html = content;

      // Convert headings
      html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
      html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
      html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
      html = html.replace(/^#### (.*$)/gim, "<h4>$1</h4>");
      html = html.replace(/^##### (.*$)/gim, "<h5>$1</h5>");
      html = html.replace(/^###### (.*$)/gim, "<h6>$1</h6>");

      // Convert bold and italic
      html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

      // Convert inline code
      html = html.replace(/`(.*?)`/g, "<code>$1</code>");

      // Convert code blocks
      html = html.replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        '<pre><code class="language-$1">$2</code></pre>'
      );

      // Convert lists
      html = html.replace(/^- (.*$)/gim, "<li>$1</li>");
      html = html.replace(/^(\d+)\. (.*$)/gim, "<li>$2</li>");

      // Convert links
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

      // Convert images
      html = html.replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1">'
      );

      // Convert blockquotes
      html = html.replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>");

      // Convert horizontal rules
      html = html.replace(/^---$/gim, "<hr>");

      // Convert line breaks
      html = html.replace(/\n/g, "<br>");

      // Convert tables (basic)
      html = html.replace(/\|(.+)\|/g, "<table><tr><td>$1</td></tr></table>");

      // Convert strikethrough
      html = html.replace(/~~(.*?)~~/g, "<del>$1</del>");

      // Convert task lists
      html = html.replace(
        /- \[x\] (.*$)/gim,
        '<input type="checkbox" checked> $1'
      );
      html = html.replace(/- \[ \] (.*$)/gim, '<input type="checkbox"> $1');

      // Wrap in paragraph if not already wrapped
      if (!html.startsWith("<")) {
        html = `<p>${html}</p>`;
      }

      return html;
    }),
    setOptions: vi.fn(),
  },
}));

// Mock prismjs
const mockPrism = {
  highlight: vi.fn(
    (code, grammar, language) => `<span class="token">${code}</span>`
  ),
  languages: {
    javascript: {},
    typescript: {},
    json: {},
    css: {},
    html: {},
    markup: {},
    markdown: {},
    extend: vi.fn((base, extension) => ({ ...base, ...extension })),
    insertBefore: vi.fn(),
  },
  hooks: {
    add: vi.fn(),
  },
};

vi.mock("prismjs", () => ({
  default: mockPrism,
}));

// Mock prismjs components to prevent loading
vi.mock("prismjs/components/prism-markdown", () => ({}));
vi.mock("prismjs/components/prism-markup", () => ({}));
vi.mock("prismjs/components/prism-javascript", () => ({}));
vi.mock("prismjs/components/prism-typescript", () => ({}));
vi.mock("prismjs/components/prism-json", () => ({}));
vi.mock("prismjs/components/prism-css", () => ({}));
vi.mock("prismjs/components/prism-html", () => ({}));

// Make Prism available globally
global.Prism = mockPrism;

// Mock inquirer
vi.mock("inquirer", () => ({
  default: {
    prompt: vi.fn(() => Promise.resolve({})),
  },
}));

// Mock commander
vi.mock("commander", () => ({
  Command: vi.fn(() => ({
    name: vi.fn().mockReturnThis(),
    description: vi.fn().mockReturnThis(),
    version: vi.fn().mockReturnThis(),
    command: vi.fn().mockReturnThis(),
    option: vi.fn().mockReturnThis(),
    action: vi.fn().mockReturnThis(),
    parse: vi.fn(),
  })),
}));

// Setup cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
  // Clear DOM
  document.body.innerHTML = "";
  document.head.innerHTML = "";
});
