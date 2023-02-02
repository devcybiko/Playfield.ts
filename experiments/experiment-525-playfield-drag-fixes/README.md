# project-500-playfields

## Playfield.js
```js
class Playfield {
    ...
    handleMouseDown(event) {
        ...
        if (event.shiftKey) playfield.toBack(obj);
        else playfield.toFront(obj);
        ...
    }
    _findObjInBounds(x, y) {
        for (let i=this.objs.length-1; i>=0; i--) {
            let obj = this.objs[i];
            if (obj.inBounds(x, y)) return obj
        }
        return null;
    }
    toFront(obj) {
        let i = this.objs.indexOf(obj);
        if (i === -1) return;
        this.objs.splice(i, 1);
        this.objs.push(obj);
    }
    toBack(obj) {
        let i = this.objs.indexOf(obj);
        if (i === -1) return;
        this.objs.splice(i, 1);
        this.objs.splice(0, 0, obj);
    }
    ...
}
```

## Summary
* To fix some of the foreground/background issues
* To select the front-most object, the `_findObjInBounds(x,y)` method is adjusted to search `this.objs` in reverse order (from the one 'closest' to the user, to the one furthest away)
* When the `handleMouseDown` is called, the new functions `toFront(obj)` and `toBack(obj)` are called when the object is clicked
  * `toBack(obj)` is called if the `shiftkey` was pressed when the object was selected
  * `toFront(obj)` is called otherwise, when the object is clicked