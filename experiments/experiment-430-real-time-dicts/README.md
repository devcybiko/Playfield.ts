# project-430-real-time-dicts

```js
const canvas = document.querySelector('#my_canvas');
const ctx = canvas.getContext('2d');
const intervalID = setInterval(timer, 125);

let objs = [ 
    { color:"red", x:0, y:0, w:100, h:100, dx: 10, dy: 10},
    { color:"green", x:250, y:250, w:50, h:50, dx: -10, dy: -10},
    { color:"orange", x:200, y:125, w:50, h:25, dx: -5, dy: 0},
    { color:"blue", x:250, y:250, w:50, h:50, dx: -20, dy: -20},
];

redraw();

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let obj of objs) draw(obj);
}

function draw(obj) {
    ctx.fillStyle = obj.color;
    ctx.strokeStyle = 'black';
    ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
    ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
}

function move(obj) {
    obj.x = obj.x + obj.dx;
    obj.y = obj.y + obj.dy;
}

function timer() {
    for(let obj of objs) move(obj);
    redraw();
}

```
* Here, we've replaced our multiple arrays of scalars with a single array of `dictionaries` or `hashes`
* This simplifies our code, and makes it easier to add new objects
* And it makes more clear what our objects are composed of
* AND it will make it easier to add more state variables when the time comes
* All of our functions now take a single "object" to operate on
* This also reduces our dependency on "global" variables - which are evil

* `draw(obj)` and `move(obj)` now operate on an object
* `redraw()` iterates over a list of objects - and doesn't depend on index variables
* likewise for `timer()` 
* I've also reduced the timer interval to just 1/8th of a second (125 msecs)
* AND: I've added a new 'blue' object the tears across the screen.