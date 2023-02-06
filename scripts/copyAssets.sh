#!/bin/bash
set -e 
mkdir -p ./dist
outfile="./dist/PlayfieldGraphics.js"
cat /dev/null > "$outfile"
for i in `cat dist-files.txt`; do
    echo $i
    cat "$i" | grep -v '^//# ' >> "$outfile"
    echo "" >> "$outfile"
done
# cp ./dist/Jed/*.map ./dist