# project-530-playfield-other-shapes

## Playfield.js
```js
class PObject {
    constructor(name, color, x, y, w, h) {
        this.playfield = null;
        this.name = name;
        this.color = color;
        this.x = x; this.y = y;
        this.w = w; this.h = h;
        this.isSelected = false;
    }
    select() {
        this.isSelected = true;
    }
    deselect() {
        this.isSelected = false;
    }
    inBounds(x, y) {
        let result = _between(this.x, x, this.x + this.w) && _between(this.y, y, this.y + this.h);
        return result;
    }
    click(x, y) {
        _log("CLICK! " + x + "," + y);
    }
    drag(x, y) {
        this.x = x;
        this.y = y;
    }
    draw(enable = true) {} // abstract method
}

class Box extends PObject {
    constructor(name, color, x, y, w, h) {
        super(name, color, x, y, w, h);
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        ctx.font = '12px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.name, this.x + this.w / 2, this.y + this.h / 2);

        if (this.isSelected) {
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.w, this.h);
        }
    }
}
class Circle extends PObject {
    constructor(name, color, x, y, w, h) {
        super(name, color, x, y, w, h);
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, this.h / 2, 0, 0, 2 * Math.PI);
        ctx.fill();

        ctx.font = '12px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.name, this.x + this.w / 2, this.y + this.h / 2);

        if (this.isSelected) {
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, this.h / 2, 0, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
}
```

## Summary
* In this experiment we're extending the idea of a 'Box' to allow other shapes
* So, we generalize `Box` to `PObject` 
  * (so-named because `Object` already exists. This stands for "Playfield Object")
* And we extend `Box` and `Circle` from `PObject`
* We also add a new 'utils.js' file to hold generic, reusable methods
* NOTES:
  * No changes are made to `Playfield`
  * `PObject looks almost identical to the old `Box` class
  * `POobject::draw(ctx)` is now an 'abstract' method to be filled in by the child classes
* `Box::draw(ctx)` and `Circle::draw(ctx)` implement the only addition to the `PObject` class