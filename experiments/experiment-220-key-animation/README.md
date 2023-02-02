# project-220-key-animation


```js
const canvas = document.querySelector('#my_canvas');
document.addEventListener("keydown", handleKeyDown);
const ctx = canvas.getContext('2d');

let color = "black";
let x = 0;
let y = 0;

handleKeyDown({});

function handleKeyDown(event) {
    console.log(event.key);
    if (event.key === 'r') color = 'red';
    if (event.key === 'o') color = 'orange';
    if (event.key === 'y') color = 'yellow';
    if (event.key === 'g') color = 'green';
    if (event.key === 'b') color = 'blue';
    if (event.key === 'i') color = 'indigo';
    if (event.key === 'v') color = 'violet';
    if (event.key === 'ArrowUp') y += -10;
    if (event.key === 'ArrowDown') y += 10;
    if (event.key === 'ArrowLeft') x += -10;
    if (event.key === 'ArrowRight') x += 10;
    ctx.fillStyle = color;
    ctx.strokeStyle = 'black';
    ctx.fillRect(x, y, 100, 100);
    ctx.strokeRect(x, y, 100, 100);
}
```

* we've replaced the `i` variable with `x,y` so we have control over the two axes of the canvas
* we also capture the keys for the up, down, left, and right keys
* when we sense one of those keys, we change the x or y variable by 10 pixels
* notice that we left the color change keys in there
* try moving the image around with arrow keys
  - try holding the key down so it repeats
* also notice that the square doesn't move when you change colors
* BUG: but there's a bug - the boxes leave a 'trace'
  - Or is it a bug?
  - Definition of a bug: `A feature you don't like`

