# project-520-playfield-drag

## Playfield.js
```js
class Playfield {
    constructor(canvasId) {
        ...
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.dragObj = null;
        this.dragDX = null;
        this.dragDY = null;
    }
    handleMouseDown(event) {
        let playfield = event.srcElement.playfield;
        if (!playfield) return _error("ERROR: mousedown not associated with a playfield");
        let obj = playfield._findObjInBounds(event.offsetX, event.offsetY);
        if (playfield.selectedObj) playfield.selectedObj.deselect();
        playfield.selectedObj = obj;
        if (obj) {
            obj.select();
            obj.click(event.offsetX, event.offsetY);
            _log("grabbing");
            playfield.dragObj = obj;
            playfield.grabDX = event.offsetX - obj.x;
            playfield.grabDY = event.offsetY - obj.y;
        }
        playfield.redraw();
    }
    handleMouseUp(event) {
        let playfield = event.srcElement.playfield;
        if (!playfield) return _error("ERROR: mouseup not associated with a playfield");
        playfield.dragObj = null;
    }
    handleMouseMove(event) {
        let playfield = event.srcElement.playfield;
        if (!playfield) return _error("ERROR: mousemove not associated with a playfield");
        if (playfield.dragObj) {
            playfield.dragObj.drag(event.offsetX - playfield.grabDX, event.offsetY - playfield.grabDY);
            playfield.redraw();
        }
    }
}

class Box {
    ...
    drag(x, y) {
        this.x = x;
        this.y = y;
    }
    ...
}
```

## Summary
* Now, let's see if we can 'grab' an object and move it around with the mouse
* `Playfield`
  * `this.dragObj` - tracks the currently dragging object
  * `this.dragDX`and `this.dragDY` captures the deltas for the mouse grab
  * `handleMouseDown` is modified to update `dragObj`, `dragDX`, and `dragDY` 
  * `handleMouseMove` is added to call `obj.drag(x, y)` for each mouse movement
  * `handleMouseUp` is added to nullify `this.dragObj` once the user lets go
* Some additions to `Box`
  * the `drag(x,y)` method allows the object to update its position and do anything else necessary
* SOME BUGS
  * the 'back-most' object (the one furthest from the user) is always selected. 
    * If the objects overlap, the one in the back is selected
  * it would be nice if the selected object was moved to the front
  * it would also be nice if 'shift-click' moved the object to the back
  * these will be fixed in the next project