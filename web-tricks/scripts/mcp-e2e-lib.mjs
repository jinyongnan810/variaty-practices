import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export function getScenarioPath(scenarioArg = "e2e/mcp/scenarios.md") {
  return resolve(process.cwd(), scenarioArg);
}

export function readScenarioText(scenarioArg = "e2e/mcp/scenarios.md") {
  return readFileSync(getScenarioPath(scenarioArg), "utf8").trim();
}

export function buildMcpPrompt(
  scenarioArg = "e2e/mcp/scenarios.md",
  options = {},
) {
  const scenarioPath = getScenarioPath(scenarioArg);
  const scenarioText = readScenarioText(scenarioArg);
  const screenshotDir = options.screenshotDir ?? "test-results/mcp";
  const summaryPath = options.summaryPath ?? "test-results/mcp/summary.md";
  const screenshotInstruction =
    options.screenshotInstruction ??
    `Save screenshots under \`${screenshotDir}\` using descriptive kebab-case filenames prefixed with an incrementing two-digit number, for example \`01-home-page.png\` or \`02-detail-view.png\`.`;

  return `
Use Playwright MCP to execute the natural-language E2E scenarios below against the local app.

Execution requirements:
- Start from the project root.
- The app is expected at \`http://127.0.0.1:4173\`.
- Do not modify source files.
- Execute each scenario in order.
- ${screenshotInstruction}
- At the end, return:
  1. a pass/fail result for each scenario
  2. any observed defects
  3. the screenshot file names or paths
  4. a concise overall summary suitable to save at \`${summaryPath}\`

Scenario source:
\`${scenarioPath}\`

Scenarios:

${scenarioText}
`.trim();
}
