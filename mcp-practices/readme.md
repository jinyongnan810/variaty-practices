# MCP Practices
Trying out mcps

## Setup
```bash
# use direnv to load envs
brew install direnv
# add eval "$(direnv hook zsh)" to ~/.zshrc and source it
cp .envrc.example .envrc # and edit envs
direnv allow

# Start mcps
claude /mcp
```

## supabase
- Do the authentication
- Prompt something like: show me the tables.

## github
- Currently doesn't support deleting or archiving repos.
- Check tools for what it can do.

## filesystem
```bash
claude mcp add documents -- npx -y @modelcontextprotocol/server-filesystem /Users/kin/Documents
# prompt like: show all the python files in /Users/kin/Documents/GitHub/variaty-practices 
```