# project-410-real-time-two-objects

```js
const canvas = document.querySelector('#my_canvas');
const ctx = canvas.getContext('2d');
const intervalID = setInterval(timer, 500);

let color_0 = "red";
let x_0 = 0;
let y_0 = 0;
let w_0 = 100;
let h_0 = 100;

let color_1 = "green";
let x_1 = 250;
let y_1 = 250;
let w_1 = 50;
let h_1 = 50;

redraw_0();
redraw_1();

function redraw(enable = true) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    redraw_0();
    redraw_1();
}
function redraw_0() {
    ctx.fillStyle = color_0;
    ctx.strokeStyle = 'black';
    ctx.fillRect(x_0, y_0, w_0, h_0);
    ctx.strokeRect(x_0, y_0, w_0, h_0);
}
function redraw_1() {
    ctx.fillStyle = color_1;
    ctx.strokeStyle = 'black';
    ctx.fillRect(x_1, y_1, w_1, h_1);
    ctx.strokeRect(x_1, y_1, w_1, h_1);
}

function timer() {
    x_0 += 10;
    y_0 += 10;
    x_1 -= 10;
    y_1 -= 10;
    redraw(enable);
}

```
* In order to manage multiple objects, we need to maintain the "state" of each object
* Here, we create duplicate variables for object '0' and object '1' 
  * by appending `_0` and `_1' to each of the state variables
  * x, y, w, h
* Correspondingly, we make a new `redraw_0()` and `redraw_1()` function to draw their respective rectangles
* And, we rewrite `redraw(enable)` to clear the canvas and call each of `redraw_0` and `redraw_1`
* Additionally, we rewrite `timer()` to move the rectangles in two different directions.

* Notice that the green rectangle appears to pass 'in front' of the red rectangle
* This is an illusion propagated by the fact that the red rectangle is drawn first
* Then the green rectangle is drawn on top of it.
* Generally speaking, we can give "depth" to our "playfield" by the order in which objects are drawn

* Also notice that if we want to add a few dozen or even hundreds of objects this could become quite difficult to manage
* You don't want to use discreet or `scalar` variables to manage your `objects`. 
* In the next two experiments we'll introduce arrays and objects as a way to manage your animations