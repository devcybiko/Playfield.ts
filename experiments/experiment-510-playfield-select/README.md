# project-510-playfield-select

## Playfield.js
```js
class Playfield {
    constructor(canvasId) {
        ...
        this.canvas.playfield = this;
        this.selectedObj = null;
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
    }
    ...
    _findObjInBounds(x, y) {
        for(let obj of this.objs) {
            if (obj.inBounds(x, y)) return obj
        }
        return null;
    }
    handleMouseDown(event) {
        let playfield = event.srcElement.playfield;
        if (!playfield) return _error("ERROR: mousedown not associated with a playfield");
        let obj = playfield._findObjInBounds(event.offsetX, event.offsetY);
        if (obj) obj.click(event.offsetX, event.offsetY);
        if (playfield.selectedObj === obj) return;
        if (playfield.selectedObj) playfield.selectedObj.deselect();
        playfield.selectedObj = obj;
        if (obj) obj.select();
        playfield.redraw();
}

class Box {
    constructor(name, color, x, y, w, h) {
        ...
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
    draw(ctx) {
        ...
        if (this.isSelected) {
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.w, this.h);
        }
    }
}
```

## Summary
* Here, we're creating the ability to click on an object
  * and make it the 'selected' object.
  * The 'selected' object will have a black border around it
* `Playfield.constructor()`
  * `this.canvas.playfield = this;` - this allows us to get at the playfield from the canvas inside the listeners
  * `this.selectedObj` - keep track of the currently selected object
  * `this.canvas.addEventListener('mousedown', this.handleMouseDown);` - add the mouse listener
  * `_findObjInBounds(x, y)` - a utility function that finds an object that encloses the mouse pointer
  * `handleMouseDown(event)` - the mouse down event
    * it calls `_findObjInBounds` to see if any of the objects are clicked on
    * it calls `obj.click()` so that the object can deal with the mouse click
    * it calls `playfield.selectedObj.deselect()` to deselect the old obj
    * it calls `obj.select()` to select the new obj
    * it resets `playfield.selectedObj = obj`
    * and finally, calls `redraw()`
* Some additions to `Box`
  * `this.isSelected` to let the box render differently if it is selected
  * the `select()` and `deselect()` methods to handle updating the selected state
  * the `click(x,y)` method to do something special if the box is clicked upon
  * the `inBounds(x, y)` method is used to see if the object encompasses the mouse click
  * finally the `draw()` method has been updated to only display a black border if the box is selected
* Also, we added the `utils.js` file for utility methods