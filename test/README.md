# Test Suite Documentation

## 📋 Overview

This document describes the comprehensive test suite for the Mostage project, which has been restructured to follow modern testing best practices.

## 🏗️ Test Structure

### **Co-located Unit Tests** (Recommended Approach)

Unit tests are now located next to their corresponding source files in the `src/` directory:

```
src/
├── core/
│   ├── services/
│   │   ├── config-service.ts
│   │   ├── config-service.test.ts      ← Unit test
│   │   ├── content-service.ts
│   │   ├── content-service.test.ts     ← Unit test
│   │   ├── theme-service.ts
│   │   └── theme-service.test.ts       ← Unit test
│   ├── utils/
│   │   ├── markdown-parser/
│   │   │   ├── index.ts
│   │   │   └── index.test.ts           ← Unit test
│   │   └── syntax-highlighter/
│   │       ├── index.ts
│   │       └── index.test.ts           ← Unit test
│   ├── plugins/
│   │   └── progress-bar/
│   │       ├── index.ts
│   │       └── index.test.ts           ← Unit test
│   ├── plugin-base.ts
│   ├── plugin-base.test.ts             ← Unit test
│   └── engine/
│       ├── mostage-engine.ts
│       └── mostage-engine.test.ts      ← Unit test
```

### **Centralized Test Files**

Integration and E2E tests remain in the `test/` directory:

```
test/
├── helpers/                            ← Test utilities
│   ├── test-helpers.ts                 ← Common helper functions
│   ├── mock-factories.ts               ← Factory functions for mocks
│   └── test-data.ts                    ← Centralized test data
├── fixtures/                           ← Test fixtures
│   ├── configs/                        ← Configuration files
│   │   ├── basic.json
│   │   ├── with-plugins.json
│   │   └── invalid.json
│   ├── content/                        ← Content files
│   │   ├── basic.md
│   │   ├── single-slide.md
│   │   └── with-html.md
│   └── themes/                         ← Theme files
│       └── custom.css
├── integration/                        ← Integration tests
│   └── integration.test.ts
├── e2e/                               ← End-to-end tests
│   ├── presentation.test.ts
│   └── export.test.ts
├── setup.ts                           ← Test setup
└── setup.test.ts                      ← Setup verification
```

## 🧪 Test Types

### **1. Unit Tests** (Co-located)

- **Location**: Next to source files in `src/`
- **Purpose**: Test individual functions, classes, and modules in isolation
- **Coverage**: Services, utilities, plugins, and core engine
- **Examples**:
  - `ConfigService` validation and loading
  - `MarkdownParser` markdown-to-HTML conversion
  - `ProgressBarPlugin` initialization and updates
  - `Mostage` engine core functionality

### **2. Integration Tests**

- **Location**: `test/integration/`
- **Purpose**: Test how multiple components work together
- **Coverage**: Service interactions, plugin integration, error handling
- **Examples**:
  - Mostage engine with all services
  - Plugin integration with core engine
  - Theme switching and content updates
  - Error recovery scenarios

### **3. End-to-End Tests**

- **Location**: `test/e2e/`
- **Purpose**: Test complete user workflows and scenarios
- **Coverage**: Full presentation flow, export functionality, performance
- **Examples**:
  - Complete presentation creation and navigation
  - Export to multiple formats (HTML, PDF, PNG, PPTX)
  - Performance with large presentations
  - Memory management and cleanup

## 🛠️ Test Utilities

### **Test Helpers** (`test/helpers/test-helpers.ts`)

Common utilities for test setup and teardown:

```typescript
import { setupDOM, cleanupDOM, createMockConfig } from "@/test-helpers";

// Setup DOM environment
const container = setupDOM();

// Create mock configuration
const config = createMockConfig({
  theme: "dark",
  plugins: { progressBar: { enabled: true } },
});

// Cleanup after tests
cleanupDOM();
```

### **Mock Factories** (`test/helpers/mock-factories.ts`)

Factory functions for creating consistent mock objects:

```typescript
import { ConfigFactory, SlideFactory, ThemeFactory } from "@/mock-factories";

// Create mock configurations
const basicConfig = ConfigFactory.createBasic();
const pluginConfig = ConfigFactory.createWithPlugins({
  progressBar: { enabled: true },
});

// Create mock slides
const slides = SlideFactory.createMultiple(5);
const codeSlide = SlideFactory.createWithCode();

// Create mock themes
const themes = ThemeFactory.createMultiple();
```

### **Test Data** (`test/helpers/test-data.ts`)

Centralized test data and constants:

```typescript
import { TEST_DATA } from "@/test-data";

// Use predefined test content
const config = createMockConfig({
  content: TEST_DATA.MARKDOWN.BASIC,
  theme: TEST_DATA.THEMES.DARK.name,
});
```

## 📊 Test Coverage

The test suite provides comprehensive coverage:

- **Unit Tests**: 315 tests covering all core functionality
- **Integration Tests**: 20 tests for component interactions
- **E2E Tests**: 14 tests for complete workflows
- **Total**: 349 tests

### **Coverage Targets**

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## 🚀 Running Tests

### **All Tests**

```bash
npm run test:run
```

### **With Coverage**

```bash
npm run test:coverage
```

### **Watch Mode**

```bash
npm run test:watch
```

### **UI Mode** (requires `@vitest/ui`)

```bash
npm install --save-dev @vitest/ui
npm run test:ui
```

### **Specific Test Files**

```bash
# Unit tests only
npm run test:run src/

# Integration tests only
npm run test:run test/integration/

# E2E tests only
npm run test:run test/e2e/
```

## 🔧 Configuration

### **Vitest Configuration** (`vitest.config.ts`)

- **Environment**: JSDOM for DOM testing
- **Setup**: `test/setup.ts` for global test setup
- **Aliases**: Configured for easy imports
- **Coverage**: v8 provider with HTML, JSON, and text reports

### **Test Setup** (`test/setup.ts`)

- JSDOM environment configuration
- Global mocks for external dependencies
- Mock implementations for `marked`, `prismjs`, and other libraries

## 📝 Best Practices

### **1. Test Organization**

- Keep unit tests close to source code
- Use descriptive test names
- Group related tests with `describe` blocks
- Use `beforeEach` and `afterEach` for setup/cleanup

### **2. Mocking**

- Mock external dependencies
- Use factory functions for consistent mocks
- Avoid over-mocking internal components
- Test error scenarios with mocked failures

### **3. Assertions**

- Use specific assertions (`toBe`, `toContain`, `toThrow`)
- Test both success and failure cases
- Verify side effects (DOM changes, event emissions)
- Test edge cases and error conditions

### **4. Performance**

- Use `performance.now()` for timing tests
- Test with realistic data sizes
- Verify memory cleanup in lifecycle tests
- Mock expensive operations in unit tests

## 🐛 Debugging Tests

### **Running Specific Tests**

```bash
# Run tests matching a pattern
npm run test:run -- --grep "ConfigService"

# Run tests in a specific file
npm run test:run src/core/services/config-service.test.ts
```

### **Debug Mode**

```bash
# Run with debug output
npm run test:run -- --reporter=verbose
```

### **Coverage Reports**

Coverage reports are generated in:

- **HTML**: `coverage/index.html`
- **JSON**: `coverage/coverage-final.json`
- **Text**: Console output

## 🔄 Maintenance

### **Adding New Tests**

1. **Unit Tests**: Create `*.test.ts` next to source file
2. **Integration Tests**: Add to `test/integration/`
3. **E2E Tests**: Add to `test/e2e/`
4. **Fixtures**: Add test data to `test/fixtures/`

### **Updating Test Data**

- Modify `test/helpers/test-data.ts` for centralized data
- Update fixtures in `test/fixtures/` for file-based data
- Use factories in `test/helpers/mock-factories.ts` for dynamic data

### **Test Maintenance**

- Keep tests up-to-date with code changes
- Remove obsolete tests
- Refactor tests when code structure changes
- Update mocks when external APIs change

## 📈 Metrics

### **Current Status**

- ✅ **315 Unit Tests** - All passing
- ✅ **20 Integration Tests** - All passing
- ✅ **14 E2E Tests** - All passing
- ✅ **349 Total Tests** - 100% pass rate
- ✅ **Coverage Thresholds** - Met (80%+)

### **Test Execution Time**

- **Unit Tests**: ~1.5 seconds
- **Integration Tests**: ~0.4 seconds
- **E2E Tests**: ~0.7 seconds
- **Total**: ~2.6 seconds

This test suite provides comprehensive coverage and follows modern testing best practices, ensuring the reliability and maintainability of the Mostage project.
