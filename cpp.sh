cat "./src/$1" | cpp -I$HOME/tmp | grep -v "^#"  > "./generated/$1"
