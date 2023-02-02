# project-500-playfields

## Playfield.js
```js
class Playfield {
    constructor(canvasId) {
        this.canvas = document.querySelector(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.objs = [];
    }
    add(obj) {
        obj.playfield = this;
        this.objs.push(obj);
    }
    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let obj of this.objs) obj.draw(this.ctx);
    }
}

class Box {
    constructor(name, color, x, y, w, h) {
        this.name = name;
        this.color = color;
        this.x = x; this.y = y;
        this.w = w; this.h = h;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        ctx.font = '12px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.name, this.x + this.w/2, this.y + this.h/2);

        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
}
```

## main.js
```js
const playfield = new Playfield('#my_canvas');
playfield.add(new Box("RED", "red", 0, 0, 100, 100, 10, 10));
playfield.add(new Box("GREEN", "green", 100, 200, 50, 50, -10, -10));
playfield.add(new Box("ORANGE", "orange", 200, 125, 50, 25, -5, 0));
playfield.add(new Box("BLUE", "blue", 200, 200, 50, 50, -20, -20));
playfield.redraw();
```

## Summary
* We're dropping back to basics
  * we'll create a playfield and a few static boxes
  * later, we'll manage moving the boxes around using keyboard, mouse, and animation
* Going back to just displaying some boxes
* Playfield is a class that manages the canvas
  * `constructor(canvasId)` - grabs the context and initializes a list of objects
  * `add(obj)` - adds an object to the list of objects on the playfield
  * `redraw()` - clears and redraws all the objects in the playfield
* Box is a class that draws a box on the canvas
  * `constructor()` creates the box at the x,y,w,h as well as the color and name of the box
  * `draw(ctx)` draws the box on the context
* Note that we've separated the Playfield classes from the main program
  * main.js now creates the Playfield instance
  * and the 4 boxes and adds them to the playfield
