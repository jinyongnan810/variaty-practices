import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "@playwright/test";
import { parseMarkdownScenarios, runMarkdownStep } from "./runner";

const scenarioFile = join(process.cwd(), "e2e", "markdown", "scenarios.md");
const scenarios = parseMarkdownScenarios(readFileSync(scenarioFile, "utf8"));

test.describe("markdown scenarios", () => {
  for (const scenario of scenarios) {
    test(scenario.title, async ({ page }) => {
      for (const step of scenario.steps) {
        await test.step(step, async () => {
          await runMarkdownStep(page, step);
        });
      }
    });
  }
});
