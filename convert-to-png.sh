#!/bin/bash

# Exit on error
set -e

# Check if magick (ImageMagick) is installed
if ! command -v magick &> /dev/null; then
    echo "❌ ImageMagick is not installed. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install imagemagick
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt update && sudo apt install -y imagemagick
    else
        echo "❌ Unsupported OS. Please install ImageMagick manually."
        exit 1
    fi
else
    echo "✅ ImageMagick is installed."
fi

# Use first argument as root directory, default to current directory
if [ -n "$1" ]; then
    ROOT_DIR="$1"
else
    ROOT_DIR=$(pwd)
fi

mapfile -t FOLDERS < <(find "$ROOT_DIR" -type d)

# Loop through each folder
for folder in "${FOLDERS[@]}"; do
    echo ""
    echo "📂 Processing folder: $folder"

    mapfile -t FILES < <(find "$folder" -maxdepth 1 -type f \( -iname '*.heic' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' -o -iname '*.bmp' -o -iname '*.tiff' -o -iname '*.gif' -o -iname '*.png' \) | sort)

    if [ ${#FILES[@]} -eq 0 ]; then
        continue
    fi

    counter=1

    for file in "${FILES[@]}"; do
        # Paths and names
        base_folder=$(dirname "$file")
        output_webp="$base_folder/${counter}.webp"


        # Convert to WebP (initial quality)
        magick "$file" -quality 90 "$output_webp"
        echo "  [$counter] Converted: $(basename "$file") → $(basename "$output_webp")"

        # Compress WebP to ≤200KB (reduce quality if needed)
        max_size=204800
        cur_quality=90
        while [ $(stat -c%s "$output_webp") -gt $max_size ] && [ $cur_quality -ge 10 ]; do
            cur_quality=$((cur_quality - 10))
            magick "$file" -quality $cur_quality "$output_webp"
            echo "    Compressed to quality $cur_quality: $(stat -c%s "$output_webp") bytes"
        done



        # No thumbnail creation, only compress WebP to 100-200KB

        # Delete original
        rm -f "$file"
        echo "  [$counter] Deleted original:  $(basename "$file")"

        counter=$((counter + 1))
    done
done
