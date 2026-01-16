# Shell Practices

Useful bash script examples for file operations and automation tasks.

## Technologies

- **Bash** - Unix shell scripting

## Key Practices

### Export Environment Variables from Files
```bash
#!/bin/bash

# Loop through all .env files in a folder
for file in ./envs/*.env; do
  echo "Processing file: $file"
  if [[ -f "$file" ]]; then
    # Read each line and export as environment variable
    # (|| [[ -n "$line" ]] handles last line without newline)
    while IFS= read -r line || [[ -n "$line" ]]; do
      echo "Exporting: $line"
      export "$line"
    done < "$file"
  fi
done
```

**Tips:**
- `IFS=` prevents leading/trailing whitespace trimming
- `-r` prevents backslash interpretation
- `|| [[ -n "$line" ]]` handles files without trailing newline

### Batch Rename Files
```bash
#!/bin/bash

SEASON_NUMBER=2
DIRECTORY="/folder/Some-Show/S$SEASON_NUMBER"
INDEX=1

for FILE in "$DIRECTORY"/*.mkv; do
  echo "filename: ${FILE}, index: $INDEX"

  # Remove leading zeros
  EPISODE_NUMBER=$((10#$INDEX))

  # Format new filename with zero-padded episode number
  NEW_FILENAME="Some-Show S${SEASON_NUMBER}E$(printf "%03d" $EPISODE_NUMBER).mkv"

  # Rename the file
  mv "$FILE" "$DIRECTORY/$NEW_FILENAME"

  INDEX=$((INDEX + 1))
done
```

**Tips:**
- `$((10#$VAR))` forces decimal interpretation (removes leading zeros)
- `printf "%03d"` pads number with zeros (001, 002, etc.)
- Always quote variables containing paths: `"$FILE"`, `"$DIRECTORY"`

## Common Patterns

### Loop Through Files
```bash
for file in /path/to/files/*.txt; do
  echo "Processing: $file"
done
```

### Check if File Exists
```bash
if [[ -f "$file" ]]; then
  echo "File exists"
fi
```

### Check if Directory Exists
```bash
if [[ -d "$dir" ]]; then
  echo "Directory exists"
fi
```

### Read File Line by Line
```bash
while IFS= read -r line || [[ -n "$line" ]]; do
  echo "$line"
done < "$file"
```

### String Manipulation
```bash
# Variable substitution
filename="${file##*/}"    # Remove path, keep filename
extension="${file##*.}"   # Get file extension
basename="${file%.*}"     # Remove extension
```

### Arithmetic
```bash
counter=$((counter + 1))
result=$((10 * 5))
```

## Tips

- Always use `[[ ]]` for conditionals (safer than `[ ]`)
- Quote all variables to handle spaces in filenames
- Use `set -e` to exit on first error
- Use `set -u` to exit on undefined variables
- Use `shellcheck` to lint your scripts

## Files

- `export-every-lines-in-files.sh` - Export env vars from files
- `rename-files-in-folder.sh` - Batch rename files with pattern

## Setup

```bash
# Make scripts executable
chmod +x *.sh

# Run a script
./export-every-lines-in-files.sh
```
