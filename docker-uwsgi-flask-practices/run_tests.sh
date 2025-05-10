#!/bin/bash

# Loop through all files in the envs folder
for file in ./envs/*.env; do
  echo "Processing file: $file"
  # Check if it's a file
  if [[ -f "$file" ]]; then
    # Export each line in the file as an environment variable
    # (|| [[ -n "$line" ]] is to handle the last line if it doesn't end with a newline)
    while IFS= read -r line || [[ -n "$line" ]]; do
      echo "Exporting: $line"
      export "$line"
    done < "$file"
  fi
done

poetry run pytest