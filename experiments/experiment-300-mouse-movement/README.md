# project-300-mouse-movement


```js
const canvas = document.querySelector('#my_canvas');
document.addEventListener("keydown", handleKeyEvent);
document.addEventListener('mousemove', handleMouseEvent);

const ctx = canvas.getContext('2d');

let color = "red";
let x = 0;
let y = 0;

redraw();

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.strokeStyle = 'black';
    ctx.fillRect(x, y, 100, 100);
    ctx.strokeRect(x, y, 100, 100);
}

function handleKeyEvent(event) {
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
    redraw();
}

function handleMouseEvent(event) {
    console.log({event});
    x = event.offsetX - 50;
    y = event.offsetY - 50;
    redraw();
}
```

* We've added an `EventListener` for mousemove
* And, we've added a new function to `handleMouseEvent`s
  - Every time the mouse is moved, it calls the `HandleMouseEvent`
  - this function merely resets the x,y values to the current location of the mouse pointer
  - then it calls `redraw()`
* Notice that we've `Refactored` the rectangle calling code to its own function
  - REFACTORING: moving code around without changing it's functionality
  - We need to draw the rectangle in two places - at the end of the `handleKeyEvent` and at the end of the `handleMouseEvent`
* This is the `DRY` principal
  - DRY: "Don't Repeat Yourself"
  - Continually refactor code so that you don't repeat it

## Extra Credit
* Notice how the rectangle is moved by the mouse pointer - in the upper left corner of the rectangle
* How could you modify the code so that the mouse appears to move the rectangle from the center point?

```js
function handleMouseEvent(event) {
    console.log({event});
    x = event.offsetX - 50;
    y = event.offsetY - 50;
    redraw();
}
```