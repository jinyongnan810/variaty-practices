import { spawn } from "node:child_process";
import { createWriteStream, existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { buildMcpPrompt } from "./mcp-e2e-lib.mjs";

const scenarioArg = process.argv[2] ?? "e2e/mcp/scenarios.md";
const baseUrl = "http://127.0.0.1:4173";
const mcpOutputDir = resolve(process.cwd(), "test-results", "mcp");
const mcpSummaryPath = resolve(mcpOutputDir, "summary.md");
const mcpTranscriptPath = resolve(mcpOutputDir, "transcript.log");
const prompt = buildMcpPrompt(scenarioArg, {
  screenshotDir: "test-results/mcp",
  summaryPath: "test-results/mcp/summary.md",
});
const localPlaywrightMcp = resolve(
  process.cwd(),
  "node_modules",
  ".bin",
  "playwright-mcp",
);
const inheritedEnv = {
  ...process.env,
  PATH: `${process.env.HOME}/.nvm/versions/node/v22.20.0/bin:/opt/homebrew/bin:/usr/bin:/bin:${process.env.PATH ?? ""}`,
};

function spawnCommand(command, args, options = {}) {
  return spawn(command, args, {
    cwd: process.cwd(),
    stdio: ["pipe", "pipe", "pipe"],
    env: inheritedEnv,
    ...options,
  });
}

async function waitForServer(url, timeoutMs = 30_000) {
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Retry until timeout.
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for dev server at ${url}`);
}

async function isServerAvailable(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

function pipeOutput(child, label, transcript) {
  child.stdout.on("data", (chunk) => {
    process.stdout.write(chunk);
    transcript?.write(chunk);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(label ? `[${label}] ${chunk}` : chunk);
    transcript?.write(label ? `[${label}] ${chunk}` : chunk);
  });
}

async function run() {
  if (!existsSync(localPlaywrightMcp)) {
    throw new Error(
      `Missing local Playwright MCP binary at ${localPlaywrightMcp}. Install dependencies before running this command.`,
    );
  }

  mkdirSync(mcpOutputDir, { recursive: true });
  const transcript = createWriteStream(mcpTranscriptPath, { flags: "w" });

  let devServer = null;

  if (!(await isServerAvailable(baseUrl))) {
    devServer = spawnCommand("./node_modules/.bin/vite", [
      "--host",
      "127.0.0.1",
      "--port",
      "4173",
    ]);

    pipeOutput(devServer, "vite", transcript);
  }

  try {
    await waitForServer(baseUrl);

    const codex = spawnCommand(
      "/opt/homebrew/bin/codex",
      [
        "exec",
        "--dangerously-bypass-approvals-and-sandbox",
        "-c",
        "shell_environment_policy.inherit=all",
        "-c",
        `mcp_servers.playwright.command="${localPlaywrightMcp}"`,
        "-c",
        "mcp_servers.playwright.args=[]",
        "-o",
        mcpSummaryPath,
        "--cd",
        process.cwd(),
        "-",
      ],
      {
        stdio: ["pipe", "pipe", "pipe"],
      },
    );

    pipeOutput(codex, "", transcript);
    codex.stdin.write(prompt);
    codex.stdin.end();

    const exitCode = await new Promise((resolve, reject) => {
      codex.on("error", reject);
      codex.on("close", resolve);
    });

    if (exitCode !== 0) {
      throw new Error(`codex exec failed with exit code ${exitCode}`);
    }

    if (!existsSync(mcpSummaryPath)) {
      throw new Error(
        `MCP E2E run finished without writing ${mcpSummaryPath}. Treating the run as failed.`,
      );
    }

    if (!readFileSync(mcpSummaryPath, "utf8").trim()) {
      throw new Error(
        `MCP E2E run wrote an empty summary file at ${mcpSummaryPath}. Treating the run as failed.`,
      );
    }
  } finally {
    devServer?.kill("SIGTERM");
    transcript.end();
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
