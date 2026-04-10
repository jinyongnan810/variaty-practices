import { expect, type Page } from "@playwright/test";

export interface MarkdownScenario {
  title: string;
  steps: string[];
}

export function parseMarkdownScenarios(source: string): MarkdownScenario[] {
  const scenarios: MarkdownScenario[] = [];
  let current: MarkdownScenario | null = null;

  for (const rawLine of source.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      current = { title: headingMatch[1].trim(), steps: [] };
      scenarios.push(current);
      continue;
    }

    const stepMatch = line.match(/^-\s+(.+)$/);
    if (stepMatch && current) {
      current.steps.push(stepMatch[1].trim());
    }
  }

  return scenarios;
}

export async function runMarkdownStep(page: Page, step: string) {
  let match = step.match(/^Visit\s+`(.+)`$/);
  if (match) {
    await page.goto(match[1]);
    return;
  }

  match = step.match(/^Click\s+(button|link)\s+`(.+)`$/);
  if (match) {
    await page
      .getByRole(match[1] as "button" | "link", { name: match[2] })
      .click();
    return;
  }

  match = step.match(
    /^Fill\s+(textbox|searchbox)\s+`(.+)`\s+with\s+`([\s\S]*)`$/,
  );
  if (match) {
    await page
      .getByRole(match[1] as "textbox" | "searchbox", { name: match[2] })
      .fill(match[3]);
    return;
  }

  match = step.match(/^Expect\s+(heading|text|link|button|textbox)\s+`(.+)`$/);
  if (match) {
    const [, target, value] = match;
    if (target === "text") {
      await expect(page.getByText(value)).toBeVisible();
      return;
    }

    await expect(
      page.getByRole(target as "heading" | "link" | "button" | "textbox", {
        name: value,
      }),
    ).toBeVisible();
    return;
  }

  match = step.match(/^Expect no link `(.+)`$/);
  if (match) {
    await expect(page.getByRole("link", { name: match[1] })).toHaveCount(0);
    return;
  }

  match = step.match(/^Expect label `(.+)` equals `([\s\S]*)`$/);
  if (match) {
    await expect(page.getByLabel(match[1])).toHaveText(match[2]);
    return;
  }

  match = step.match(/^Expect text `(.+)` contains `([\s\S]*)`$/);
  if (match) {
    await expect(page.getByText(match[1])).toContainText(match[2]);
    return;
  }

  match = step.match(/^Reload page$/);
  if (match) {
    await page.reload();
    return;
  }

  match = step.match(/^Take screenshot `(.+)`$/);
  if (match) {
    await page.screenshot({
      fullPage: true,
      path: `test-results/markdown-${match[1]}.png`,
    });
    return;
  }

  throw new Error(`Unsupported markdown step: ${step}`);
}
