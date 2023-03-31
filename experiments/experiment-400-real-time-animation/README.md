# project-400-real-time-animation

```js
const canvas = document.querySelector('#my_canvas');
const ctx = canvas.getContext('2d');
const intervalID = setInterval(timer, 500);

let color = "red";
let x = 0;
let y = 0;
let w = 100;
let h = 100;

redraw(enable);

function redraw(enable = true) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.strokeStyle = 'black';
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
}

function timer() {
    x += 10;
    y += 10;
    redraw(enable);
}
```
* JavaScript is called an `asynchronous` language
* This means that other things happen at the same time as your browser code
* But, when your browser code is running - those other things can't run
* Because there is only one "thread"
* And when your code is running, it's hogging that one "thread"
* So, in order to "share" the thread, you have to run your animation in a `timer` or `interval`
* So, the `setInterval` is called
  * the first parameter is a function to call periodically
  * and the second parameter is the number of `milliseconds` to wait between each call
* In our case, we wait 500 milliseconds (one half a second) to call the `timer()` function
* The `timer()` function then increments the `x` and `y` values by 10 pixels
  * then it calls `redraw` to repaint the canvas
* NOTE: This will go on forever. So, when the rectangle drifts off the right side of the canvas
  * it simply disappears
  * but it is still being moved once every 1/2 second
  * even though we can't see it anymore

* NOTE: what we're learning is that JavaScript and Browsers are Event Driven
* All our projects needs to react to EVENTS
* So, our keyboard, mouse, and timer EVENTS comprise the bulk of our application