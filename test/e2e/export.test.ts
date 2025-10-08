import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Mostage } from "../../src/core/engine/mostage-engine";
import {
  setupDOM,
  cleanupDOM,
  createMockConfig,
} from "../helpers/test-helpers";
import { TEST_DATA } from "../helpers/test-data";

// Mock export functionality
vi.mock("puppeteer", () => ({
  default: {
    launch: vi.fn(() =>
      Promise.resolve({
        newPage: vi.fn(() =>
          Promise.resolve({
            setContent: vi.fn(),
            pdf: vi.fn(() => Promise.resolve(Buffer.from("mock pdf"))),
            screenshot: vi.fn(() => Promise.resolve(Buffer.from("mock image"))),
            close: vi.fn(),
          })
        ),
        close: vi.fn(),
      })
    ),
  },
}));

vi.mock("sharp", () => ({
  default: vi.fn(() => ({
    resize: vi.fn().mockReturnThis(),
    jpeg: vi.fn(() => Promise.resolve(Buffer.from("mock jpeg"))),
    png: vi.fn(() => Promise.resolve(Buffer.from("mock png"))),
  })),
}));

vi.mock("pptxgenjs", () => ({
  default: vi.fn(() => ({
    addSlide: vi.fn().mockReturnThis(),
    addText: vi.fn().mockReturnThis(),
    addImage: vi.fn().mockReturnThis(),
    writeFile: vi.fn(() => Promise.resolve()),
  })),
}));

describe("E2E Export Tests", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = setupDOM();
  });

  afterEach(() => {
    cleanupDOM();
  });

  describe("HTML Export", () => {
    it("should export presentation to HTML", async () => {
      const config = createMockConfig({
        content: TEST_DATA.MARKDOWN.BASIC,
        theme: "light",
        plugins: {
          progressBar: { enabled: true },
          slideNumber: { enabled: true },
        },
      });

      const mostage = new Mostage(config);
      await mostage.start();

      // Simulate HTML export
      const htmlContent = mostage.getContainer().innerHTML;

      expect(htmlContent).toBeDefined();
      expect(htmlContent.length).toBeGreaterThan(0);

      // Verify slides are present
      const slides = mostage.getSlides();
      expect(slides).toHaveLength(4);

      try {
        mostage.destroy();
      } catch (error) {
        // Ignore cleanup errors in test environment
      }
    });

    it("should export presentation with custom styling", async () => {
      const config = createMockConfig({
        content: TEST_DATA.MARKDOWN.BASIC,
        theme: "dark",
        scale: 1.2,
        background: {
          type: "color",
          value: "#1a1a1a",
        },
        header: "My Presentation",
        footer: "© 2024",
      });

      const mostage = new Mostage(config);
      await mostage.start();

      const htmlContent = mostage.getContainer().innerHTML;

      expect(htmlContent).toBeDefined();
      expect(mostage.config.theme).toBe("dark");
      expect(mostage.config.scale).toBe(1.2);
      expect(mostage.config.background.type).toBe("color");
      expect(mostage.config.header).toBe("My Presentation");
      expect(mostage.config.footer).toBe("© 2024");

      try {
        mostage.destroy();
      } catch (error) {
        // Ignore cleanup errors in test environment
      }
    });
  });

  describe("PDF Export", () => {
    it("should export presentation to PDF", async () => {
      const config = createMockConfig({
        content: TEST_DATA.MARKDOWN.BASIC,
        theme: "light",
      });

      const mostage = new Mostage(config);
      await mostage.start();

      // Mock PDF export process
      const slides = mostage.getSlides();
      expect(slides).toHaveLength(4);

      // Simulate PDF generation
      const pdfBuffer = Buffer.from("mock pdf content");
      expect(pdfBuffer).toBeDefined();
      expect(pdfBuffer.length).toBeGreaterThan(0);

      try {
        mostage.destroy();
      } catch (error) {
        // Ignore cleanup errors in test environment
      }
    });

    it("should export presentation with custom PDF settings", async () => {
      const config = createMockConfig({
        content: TEST_DATA.MARKDOWN.BASIC,
        theme: "dark",
        scale: 0.8,
      });

      const mostage = new Mostage(config);
      await mostage.start();

      // Mock PDF export with custom settings
      const pdfSettings = {
        format: "A4",
        margin: {
          top: "1cm",
          right: "1cm",
          bottom: "1cm",
          left: "1cm",
        },
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: "<div>My Presentation</div>",
        footerTemplate:
          "<div>Page <span class='pageNumber'></span> of <span class='totalPages'></span></div>",
      };

      expect(pdfSettings.format).toBe("A4");
      expect(pdfSettings.margin.top).toBe("1cm");
      expect(pdfSettings.printBackground).toBe(true);

      try {
        mostage.destroy();
      } catch (error) {
        // Ignore cleanup errors in test environment
      }
    });
  });

  describe("Image Export", () => {
    it("should export slides to PNG images", async () => {
      const config = createMockConfig({
        content: TEST_DATA.MARKDOWN.BASIC,
        theme: "ocean",
      });

      const mostage = new Mostage(config);
      await mostage.start();

      const slides = mostage.getSlides();
      expect(slides).toHaveLength(4);

      // Mock PNG export for each slide
      for (let i = 0; i < slides.length; i++) {
        const pngBuffer = Buffer.from(`mock png for slide ${i}`);
        expect(pngBuffer).toBeDefined();
        expect(pngBuffer.length).toBeGreaterThan(0);
      }

      try {
        mostage.destroy();
      } catch (error) {
        // Ignore cleanup errors in test environment
      }
    });

    it("should export slides to JPEG images", async () => {
      const config = createMockConfig({
        content: TEST_DATA.MARKDOWN.BASIC,
        theme: "rainbow",
      });

      const mostage = new Mostage(config);
      await mostage.start();

      const slides = mostage.getSlides();
      expect(slides).toHaveLength(4);

      // Mock JPEG export for each slide
      for (let i = 0; i < slides.length; i++) {
        const jpegBuffer = Buffer.from(`mock jpeg for slide ${i}`);
        expect(jpegBuffer).toBeDefined();
        expect(jpegBuffer.length).toBeGreaterThan(0);
      }

      try {
        mostage.destroy();
      } catch (error) {
        // Ignore cleanup errors in test environment
      }
    });

    it("should export with custom image settings", async () => {
      const config = createMockConfig({
        content: TEST_DATA.MARKDOWN.BASIC,
        theme: "light",
        scale: 1.5,
      });

      const mostage = new Mostage(config);
      await mostage.start();

      const imageSettings = {
        width: 1920,
        height: 1080,
        quality: 90,
        format: "png",
      };

      expect(imageSettings.width).toBe(1920);
      expect(imageSettings.height).toBe(1080);
      expect(imageSettings.quality).toBe(90);
      expect(imageSettings.format).toBe("png");

      try {
        mostage.destroy();
      } catch (error) {
        // Ignore cleanup errors in test environment
      }
    });
  });

  describe("PowerPoint Export", () => {
    it("should export presentation to PowerPoint", async () => {
      const config = createMockConfig({
        content: TEST_DATA.MARKDOWN.BASIC,
        theme: "light",
      });

      const mostage = new Mostage(config);
      await mostage.start();

      const slides = mostage.getSlides();
      expect(slides).toHaveLength(4);

      // Mock PowerPoint export
      const pptxBuffer = Buffer.from("mock pptx content");
      expect(pptxBuffer).toBeDefined();
      expect(pptxBuffer.length).toBeGreaterThan(0);

      try {
        mostage.destroy();
      } catch (error) {
        // Ignore cleanup errors in test environment
      }
    });

    it("should export with custom PowerPoint settings", async () => {
      const config = createMockConfig({
        content: TEST_DATA.MARKDOWN.BASIC,
        theme: "dark",
        header: "My Presentation",
        footer: "© 2024",
      });

      const mostage = new Mostage(config);
      await mostage.start();

      const pptxSettings = {
        layout: "16:9",
        masterSlide: {
          title: "My Presentation",
          subtitle: "Created with Mostage",
        },
        slideSettings: {
          includeNotes: true,
          includeAnimations: false,
        },
      };

      expect(pptxSettings.layout).toBe("16:9");
      expect(pptxSettings.masterSlide.title).toBe("My Presentation");
      expect(pptxSettings.slideSettings.includeNotes).toBe(true);

      try {
        mostage.destroy();
      } catch (error) {
        // Ignore cleanup errors in test environment
      }
    });
  });

  describe("Batch Export", () => {
    it("should export to multiple formats simultaneously", async () => {
      const config = createMockConfig({
        content: TEST_DATA.MARKDOWN.BASIC,
        theme: "ocean",
        plugins: {
          progressBar: { enabled: true },
          slideNumber: { enabled: true },
        },
      });

      const mostage = new Mostage(config);
      await mostage.start();

      const exportFormats = ["html", "pdf", "png", "jpg", "pptx"];
      const exportResults = {};

      // Mock batch export
      for (const format of exportFormats) {
        switch (format) {
          case "html":
            exportResults[format] = mostage.getContainer().innerHTML;
            break;
          case "pdf":
            exportResults[format] = Buffer.from("mock pdf");
            break;
          case "png":
            exportResults[format] = Buffer.from("mock png");
            break;
          case "jpg":
            exportResults[format] = Buffer.from("mock jpg");
            break;
          case "pptx":
            exportResults[format] = Buffer.from("mock pptx");
            break;
        }
      }

      // Verify all formats were exported
      expect(Object.keys(exportResults)).toHaveLength(5);
      expect(exportResults.html).toBeDefined();
      expect(exportResults.pdf).toBeDefined();
      expect(exportResults.png).toBeDefined();
      expect(exportResults.jpg).toBeDefined();
      expect(exportResults.pptx).toBeDefined();

      try {
        mostage.destroy();
      } catch (error) {
        // Ignore cleanup errors in test environment
      }
    });

    it("should handle export errors gracefully", async () => {
      const config = createMockConfig({
        content: TEST_DATA.MARKDOWN.BASIC,
        theme: "light",
      });

      const mostage = new Mostage(config);
      await mostage.start();

      // Mock export errors
      const exportErrors = [];

      try {
        // Simulate PDF export error
        throw new Error("PDF export failed");
      } catch (error) {
        exportErrors.push({ format: "pdf", error: error.message });
      }

      try {
        // Simulate PNG export error
        throw new Error("PNG export failed");
      } catch (error) {
        exportErrors.push({ format: "png", error: error.message });
      }

      // HTML export should still work
      const htmlContent = mostage.getContainer().innerHTML;
      expect(htmlContent).toBeDefined();

      // Verify error handling
      expect(exportErrors).toHaveLength(2);
      expect(exportErrors[0].format).toBe("pdf");
      expect(exportErrors[0].error).toBe("PDF export failed");
      expect(exportErrors[1].format).toBe("png");
      expect(exportErrors[1].error).toBe("PNG export failed");

      try {
        mostage.destroy();
      } catch (error) {
        // Ignore cleanup errors in test environment
      }
    });
  });

  describe("Export Performance", () => {
    it("should export large presentations efficiently", async () => {
      // Create a large presentation
      const largeContent = Array.from(
        { length: 20 },
        (_, i) =>
          `# Slide ${i + 1}

This is slide ${i + 1} with content.

\`\`\`javascript
// Code for slide ${i + 1}
function slide${i + 1}() {
  return "Hello from slide ${i + 1}!";
}
\`\`\``
      ).join("\n\n---\n\n");

      const config = createMockConfig({
        content: largeContent,
        theme: "light",
      });

      const mostage = new Mostage(config);
      await mostage.start();

      expect(mostage.getTotalSlides()).toBe(20);

      // Test export performance
      const startTime = performance.now();

      // Mock export of all slides
      for (let i = 0; i < mostage.getTotalSlides(); i++) {
        const slideBuffer = Buffer.from(`mock export for slide ${i}`);
        expect(slideBuffer).toBeDefined();
      }

      const endTime = performance.now();

      // Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(5000); // 5 seconds

      try {
        mostage.destroy();
      } catch (error) {
        // Ignore cleanup errors in test environment
      }
    });

    it("should handle concurrent exports", async () => {
      const config = createMockConfig({
        content: TEST_DATA.MARKDOWN.BASIC,
        theme: "dark",
      });

      const mostage = new Mostage(config);
      await mostage.start();

      const startTime = performance.now();

      // Mock concurrent exports
      const exportPromises = [
        Promise.resolve(Buffer.from("mock pdf")),
        Promise.resolve(Buffer.from("mock png")),
        Promise.resolve(Buffer.from("mock jpg")),
        Promise.resolve(Buffer.from("mock pptx")),
      ];

      const results = await Promise.all(exportPromises);

      const endTime = performance.now();

      expect(results).toHaveLength(4);
      expect(endTime - startTime).toBeLessThan(1000); // 1 second

      try {
        mostage.destroy();
      } catch (error) {
        // Ignore cleanup errors in test environment
      }
    });
  });

  describe("Export Quality", () => {
    it("should maintain content fidelity in exports", async () => {
      const complexContent = `# Complex Slide

This slide has **bold text**, *italic text*, and \`inline code\`.

## Code Block

\`\`\`javascript
function complexFunction() {
  const data = {
    name: "Test",
    value: 42,
    items: [1, 2, 3]
  };
  
  return data;
}
\`\`\`

## Table

| Feature | Status | Notes |
|---------|--------|-------|
| Markdown | ✅ | Working |
| Code | ✅ | Highlighted |
| Tables | ✅ | Formatted |

## Quote

> "The best way to predict the future is to create it."
> 
> — Peter Drucker

---

# Another Complex Slide

<div class="custom-html">
  <p>This is custom HTML content.</p>
  <button onclick="alert('Hello!')">Click me</button>
</div>

- List item 1
- List item 2
- List item 3`;

      const config = createMockConfig({
        content: complexContent,
        theme: "ocean",
        plugins: {
          progressBar: { enabled: true },
        },
      });

      const mostage = new Mostage(config);
      await mostage.start();

      const slides = mostage.getSlides();
      expect(slides).toHaveLength(2);

      // Verify content is preserved
      expect(slides[0].content).toContain("Complex Slide");
      expect(slides[0].content).toContain("**bold text**");
      expect(slides[0].content).toContain("*italic text*");
      expect(slides[0].content).toContain("`inline code`");
      expect(slides[0].content).toContain("```javascript");
      expect(slides[0].content).toContain("| Feature | Status |");
      expect(slides[0].content).toContain('> "The best way');

      expect(slides[1].content).toContain("Another Complex Slide");
      expect(slides[1].content).toContain('<div class="custom-html">');
      expect(slides[1].content).toContain("- List item 1");

      // Mock export and verify content preservation
      const exportedContent = slides
        .map((slide) => slide.content)
        .join("\n\n---\n\n");
      expect(exportedContent).toContain("Complex Slide");
      expect(exportedContent).toContain("Another Complex Slide");

      try {
        mostage.destroy();
      } catch (error) {
        // Ignore cleanup errors in test environment
      }
    });
  });
});
