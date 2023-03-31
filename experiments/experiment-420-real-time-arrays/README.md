# project-420-real-time-arrays

```js
const canvas = document.querySelector('#my_canvas');
const ctx = canvas.getContext('2d');
const intervalID = setInterval(timer, 250);

let color = ["red", "green", "orange"];
let x = [0,250,200];
let y = [0, 250,125];
let w = [100, 50, 50];
let h = [100, 50, 25];
let dx = [10, -10, -5];
let dy = [10, -10, 0]

redraw(enable);

function redraw(enable = true) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=0; i<color.length; i++) {
        draw(i);
    }
}

function draw(n) {
    ctx.fillStyle = color[n];
    ctx.strokeStyle = 'black';
    ctx.fillRect(x[n], y[n], w[n], h[n]);
    ctx.strokeRect(x[n], y[n], w[n], h[n]);
}

function move(n) {
    x[n] = x[n] + dx[n];
    y[n] = y[n] + dy[n];
}

function timer() {
    for(let i=0; i<color.length; i++) {
        move(i);
    }
    redraw(enable);
}
```
* This is a major rewrite of our canvas code
* We moved all the 'state' values into arrays
  * `x, y, w, h,` and `color` do the obvious things
  * and `dx`, and `dy` are the deltas each object moves on each call to `timer()`
* We also removed the individual `redraw_n` functions 
  * and replaced them with a single function `draw(n)`
  * that takes an index into the arrays to draw the `nth` object
* `redraw(enable)` now iterates over all the objects and 
* a new function `move(n)` adds the `dx` and `dy` (deltas) to the 'nth` object
* `timer()` now iterates over all the object arrays on each 'tick' of our clock (interval timer)
  * calls `move(n)` on each of them
  * then calls `redraw(enable)` to redraw each of them
* NOTICE: We're calling the 'timer` every 1/4 second (250 milliseconds)
  * so our animation is running faster
* ALSO NOTICE: That the orange rectangle appears to move more 'slowly' than the other two
  * this is because the 'dx' value is only -5 instead of -10 pixels
  * this is a 'cheap' way of controlling the speed an object moves in an animation
  * the larger the delta, the faster it appears to move
  * the smaller the delta, the slower it appears to move
* ALSO, ALSO NOTICE: that when all three objects converge in the center
  * The orange appears on top, the green beneath it, and the red beneath all of them
  * This is again due to the order they are "painted" or "drawn"
  * The red object is painted first, so it appears to be the "furthest away"
  * The green object is painted next, so it appears to be "between" the other two
  * And the orange object is painted last, so it appears "on top"
  * This is called the "z order" of the objects