# project-410-real-time-two-objects

```js
class Playfield {
    constructor(canvasId) {
        this.canvas = document.querySelector(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.objs = [];
    }
    add(obj) {
        this.objs.push(obj);
    }
    moveAll() {
        for(let obj of this.objs) obj.move();
    }
    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for(let obj of this.objs) obj.draw(this.ctx);
    }
    timer() {
        playfield.moveAll();
        playfield.redraw();
    }    
    start() {
        this.redraw();
        setInterval(this.timer, 125);
    }
}

class Box {
    constructor(color, x, y, w, h, dx, dy) {
        this.color = color;
        this.x = x; this.y = y;
        this.w = w; this.h = h;
        this.dx = dx; this.dy = dy;
    }
    move() {
        this.x = this.x + this.dx;
        this.y = this.y + this.dy;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'black';
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
    
}

const playfield = new Playfield('#my_canvas');
playfield.add(new Box("red", 0, 0, 100, 100, 10, 10));
playfield.add(new Box("green", 250, 250, 50, 50, -10, -10));
playfield.add(new Box("orange", 200, 125, 50, 25, -5, 0));
playfield.add(new Box("blue", 250, 250, 50, 50, -20, -20));
playfield.start();
```

* This is a major departure and refactoring of the previous `procedural` experiments
* I've created two classes: `Playfield` and `Box`.
* I've moved all the code that deals with the canvas into `Playfield` class
* And I've moved all the code that deals with the rectangle into the `Box` class
* We've eliminated all the global code and created `encapsulated` objects that "do just one thing"

## Playfield
* The `Playfield` class holds the list of all the objects to be drawn
* It also holds the details of the canvas and the context
* It's responsible for 
  * maintaining a list of all objects on screen (`add()`)
  * moving the objects around (`moveAll()`)
  * redrawing the entire Playfield (`redraw()`)
  * and managing the timer (`timer()` and `start()`)
  
## Box
* The `Box` class holds the stateful information about a single Box
* It is responsible for
  * knowing how to move a single box (`move()`)
  * knowing how to draw a box, given the context to draw it on (`draw(ctx)`)

## The Main code
```js
const playfield = new Playfield('#my_canvas');
playfield.add(new Box("red", 0, 0, 100, 100, 10, 10));
playfield.add(new Box("green", 250, 250, 50, 50, -10, -10));
playfield.add(new Box("orange", 200, 125, 50, 25, -5, 0));
playfield.add(new Box("blue", 250, 250, 50, 50, -20, -20));
playfield.start();
```

* The main code is now simplified to just 5 lines of code to create and add the Boxes to the Playfield
* And a single line to kick the whole thing off (`playfield.start()`)

## Summary
* This is the beginning of a new framework for managing a canvas-based app
* In the next major project, we'll pull the keyboard and mousing capabilities into the Playfield
* And start building entire games