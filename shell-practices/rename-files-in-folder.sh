SEASON_NUMBER=2
DIRECTORY="/folder/Some-Show/S$SEASON_NUMBER"

INDEX=1

# Loop through each file in the directory
for FILE in "$DIRECTORY"/*.mkv; do
  echo "filename: ${FILE}, index: $INDEX"
  # Extract the episode number from the filename
  # EPISODE_NUMBER=$(echo "$FILE" | grep -o '_t[0-9]\+' | sed 's/_t//')
  # Remove leading zeros
  EPISODE_NUMBER=$((10#$INDEX))
  echo $EPISODE_NUMBER
  
  # Increment the episode number by 1
  # NEW_EPISODE_NUMBER=$((EPISODE_NUMBER + 1))
  # echo $NEW_EPISODE_NUMBER

  # Format the new filename
  NEW_FILENAME="Some-Show S${SEASON_NUMBER}E$(printf "%03d" $EPISODE_NUMBER).mkv"

  echo $NEW_FILENAME
  
  # Rename the file
  mv "$FILE" "$DIRECTORY/$NEW_FILENAME"

  INDEX=$((INDEX + 1))
done