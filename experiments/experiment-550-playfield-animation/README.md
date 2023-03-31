# project-550-playefield-animation

## Playfield.js
```js
class Playfield {
    ...
    timer(playfield) {
        playfield.goAll();
        playfield.redraw(enable);
    }
    start() {
        this.redraw(enable);
        setInterval(this.timer, 125, this);
    }
    goAll() {
        for (let obj of this.objs) obj.go();
    }
    collisions(theObj) {
        let results = [];
        for (let obj of this.objs) {
            if (theObj === obj) continue;
            if (obj.inBounds(theObj.x, theObj.y) ||
                obj.inBounds(theObj.x + theObj.w, theObj.y) ||
                obj.inBounds(theObj.x, theObj.y + theObj.h) ||
                obj.inBounds(theObj.x + theObj.w, theObj.y + theObj.h))
                results.push(obj);
        }
        return results;
    }
}
class PObject {
    ...
        go() { } // abstract method
}
class Meanderer extends PObject {
    constructor(name, color, x, y, w, h) {
        super(name, color, x, y, w, h);
        this.dx = random(-10, 10);
        this.dy = random(-10, 10);
    }
    go() {
        if (this.isSelected) return;
        this.x += this.dx;
        this.y += this.dy;

        let collisions = this.playfield.collisions(this);
        if (collisions.length) {
            this.dx = random(-10, 10);
            this.dy = random(-10, 10);
        }

        if (this.x < 0) {
            this.x = 0;
            this.dx = -this.dx;
        }
        if (this.x + this.w > this.playfield.canvas.width) {
            this.x = this.playfield.canvas.width - this.w;
            this.dx = -this.dx;
        }
        if (this.y < 0) {
            this.y = 0;
            this.dy = -this.dy;
        }
        if (this.y + this.h > this.playfield.canvas.height) {
            this.y = this.playfield.canvas.height - this.h;
            this.dy = -this.dy;
        }
    }
}
class Box extends Meanderer {
    ...
}
class Circle extends Meanderer {
    ...
}
```

## Summary
* To add animation, we update `Playfield` with the `timer` and `start` methods
  * `start()` kicks off a timer which calls `timer` every "tick" of our clock (1/8 sec or 125 msecs)
  * `timer()` is called every "tick" and calls `goAll()` and `redraw(enable)`
  * `goAll()` iterates overall the objects and calls its `go()` method
    * `go()` is intended to be a generic method that just animates the object
  * `collisions(obj)` compares the rect of the `obj` to all the other objects
    * and returns an array of objects that intersect
* A new class `Meanderer` is created that inherits from `PObject`
  * `Meanderer` implements a `go()` method that allows the objects to wander around the playfield randomly
  * It also detects collisions between the objects so they bounce off each other
    * by calling `Playfield::collisions(obj)`
* The only changes to `Box` and `Circle` is that they now inherit from `Meanderer` which in turn inherits from `PObject`
* NOTE: This exposes a problem with JavaScript (and other single-inheritance languages) in that we had to change the object inheritance hierarchy to make the Box and Circle classes "Meander"
  * A better solution would be "mixins" that allow us to override the 'go()' method