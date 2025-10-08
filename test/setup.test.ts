import { describe, it, expect } from "vitest";

describe("Test Setup", () => {
  it("should have document available", () => {
    expect(document).toBeDefined();
    expect(document.createElement).toBeDefined();
  });

  it("should have window available", () => {
    expect(window).toBeDefined();
  });

  it("should be able to create DOM elements", () => {
    const div = document.createElement("div");
    expect(div).toBeDefined();
    expect(div.tagName).toBe("DIV");
  });
});
