rm -rf ./generated
cp -R ./src/ ./generated
cat src-include/Tree.ts | sed '1d;$d' > $HOME/tmp/Tree.ts
cpp.sh AgileFrontiers/10-Playfield/Actor.ts
cpp.sh AgileFrontiers/10-Playfield/Playfield.ts
tsc