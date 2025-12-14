#!/bin/bash

# usage
# source env.sh [local|dev|stg|prod] (default: local) for mac
# . env.sh for linux
ENV=${1:-local}
if [[ ! "$ENV" =~ ^(local|dev|stg|prod)$ ]]; then
echo "Invalid environment: $ENV"
echo "Usage: $0 [local|dev|stg|prod]"
exit 1
fi

# Load environment variables from .env files using dotenvx
load_env() {
    local env_file=".env.${ENV}"
    
    # get all keys from the .env file except those starting with DOTENV_PUBLIC_KEY
    local keys=$(grep -E '^[A-Z_][A-Z0-9_]*=' "$env_file" | \
                 grep -v '^DOTENV_PUBLIC_KEY' | \
                 cut -d'=' -f1 | \
                 paste -sd '|' -)
    if [ -z "$keys" ]; then
        echo "No environment keys found in $env_file"
        return 1
    fi
    # unset existing environment variables
    for key in $(echo "$keys" | tr '|' '\n'); do
        unset "$key"
    done
    # Load environment variables from .env file using dotenvx and convert to export statements, then execute with eval
    local envs=$(dotenvx run -f "$env_file" -- printenv 2>/dev/null | \
        grep -E "^($keys)=" | \
        sed 's/^\([^=]*\)=\(.*\)/export \1="\2"/')
    eval "$envs"
    echo "✅ Loaded $(echo "$keys" | tr '|' '\n' | wc -l) environment variables from $env_file"
}
load_env

# Activate Poetry virtual environment
eval $(poetry env activate)