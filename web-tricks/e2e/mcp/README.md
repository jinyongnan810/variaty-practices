# Playwright MCP E2E

This folder is for pure natural-language E2E scenarios intended to be executed
by an MCP-capable agent that has access to Playwright MCP.

Files:

- `scenarios.md` - plain-language test cases

This is different from:

- `e2e/specs` - executable Playwright specs written in TypeScript
- `e2e/markdown` - executable constrained Markdown scenarios parsed by code

The MCP flow is agent-driven instead of code-driven. The recommended workflow is:

1. Start the app locally.
2. Run `npm run test:e2e:mcp` to generate the MCP execution prompt.
3. Give that prompt to an agent session that has Playwright MCP available.
4. Review the returned screenshots and pass/fail summary.
