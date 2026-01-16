# Next.js Practices

A Next.js project with testing setup including Jest for unit tests and Playwright for E2E tests.

## Technologies

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Jest 30** - Unit testing framework
- **Testing Library** - React component testing utilities
- **Playwright** - End-to-end testing framework
- **Turbopack** - Fast bundler for development

## Key Practices

### Unit Testing with Jest
```typescript
// __tests__/page.test.tsx
import Page from "@/app/page";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("Page", () => {
  it("renders a heading", () => {
    render(<Page />);
    const text = screen.getByText("Save and see your changes instantly.");
    expect(text).toBeInTheDocument();
  });
});
```

### E2E Testing with Playwright
```typescript
// e2e/example.spec.ts
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

### Project Structure
```
nextjs-practices/
├── src/           # Source code
├── __tests__/     # Jest unit tests
├── e2e/           # Playwright E2E tests
├── coverage/      # Test coverage reports
├── jest.config.ts # Jest configuration
└── playwright.config.ts # Playwright configuration
```

## Tips

- Use `@/` path alias for imports (configured in tsconfig)
- `@testing-library/jest-dom` provides custom matchers like `toBeInTheDocument()`
- Use `screen.getByRole()` for accessible element queries
- Playwright tests run in real browsers for accurate E2E testing
- Turbopack (`--turbopack`) provides faster dev server and builds

## Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run unit tests
npm test

# Run E2E tests
npx playwright test

# Build for production
npm run build
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest unit tests |
