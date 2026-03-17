import { buildMcpPrompt } from "./mcp-e2e-lib.mjs";

const scenarioArg = process.argv[2] ?? "e2e/mcp/scenarios.md";
process.stdout.write(`${buildMcpPrompt(scenarioArg, {})}\n`);
