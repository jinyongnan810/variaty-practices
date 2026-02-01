# MCP Practices

Practice project for [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) servers with Claude Code.

## Technologies

- **MCP (Model Context Protocol)** - Protocol for connecting AI models to external tools
- **Claude Code** - Anthropic's CLI tool
- **direnv** - Automatic environment variable loading
- **npx** - Node package executor
- **uvx** - Python package executor (uv)

## Key Practices

### MCP Configuration (`.mcp.json`)
```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "${SUPABASE_URL}"
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "awslabs.aws-documentation-mcp-server": {
      "command": "uvx",
      "args": ["awslabs.aws-documentation-mcp-server@latest"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR",
        "AWS_DOCUMENTATION_PARTITION": "aws"
      }
    }
  }
}
```

### MCP Server Types

| Type | Description |
|------|-------------|
| `http` | HTTP-based MCP server (like Supabase) |
| `command` | Local command execution (npx, uvx, python, etc.) |

## Available MCP Servers

### Supabase
- Do the authentication
- Prompt something like: "show me the tables"

### GitHub
- Currently doesn't support deleting or archiving repos
- Check tools for what it can do

### Filesystem
```bash
claude mcp add documents -- npx -y @modelcontextprotocol/server-filesystem /Users/kin/Documents
# Prompt like: show all the python files in /path/to/folder
```

### AWS Documentation
- add `uv` with `curl -LsSf https://astral.sh/uv/install.sh | sh`
- Provides access to AWS documentation via MCP
- Prompt like: "explain how S3 bucket policies work" or "show me Lambda concurrency limits"

## Tips

- Use environment variables with `${VAR_NAME}` syntax in `.mcp.json`
- Keep sensitive tokens in `.envrc` (not committed to git)
- Use `claude /mcp` to check MCP server status
- Different MCP servers provide different tools - check their documentation

## Setup

```bash
# Install direnv for automatic env loading
brew install direnv
# Add to ~/.zshrc: eval "$(direnv hook zsh)"
source ~/.zshrc

# Setup environment
cp .envrc.example .envrc  # Edit with your tokens
direnv allow

# Start Claude Code with MCP servers
claude /mcp
```