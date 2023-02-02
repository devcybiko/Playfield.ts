# project-200-keyboard-input


```js
const canvas = document.querySelector('#my_canvas');
document.addEventListener("keydown", handleKeyDown);
const ctx = canvas.getContext('2d');
let i = 0;
handleKeyDown();

function handleKeyDown(event) {
    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'black';
    ctx.fillRect(i, i, 100, 100);
    ctx.strokeRect(i, i, 100, 100);
    i = i + 10;
}
```

* here, we introduce functions
  - We're not going to spend a lot of time teaching JavaScript
  - but functions group lines of code together so they're easily reused
* `document.addEventListener` defines a 'keydown' event and a function to call when a keypress is made
  - note that I call `handleKeyDown()` once to display a single box
* every time a key is pressed, we draw a rectangle, and increment the `i` variable to move it next time
