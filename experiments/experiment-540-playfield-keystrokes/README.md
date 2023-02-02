# project-540-playfield-keystrokes

## Playfield.js
```js
class Playfield {
    ...
        this.body = document.querySelector('body');
        this.body.playfield = this;
        document.addEventListener("keydown", this.handleKeyDown);
    ...
    handleKeyDown(event) {
        let playfield = event.srcElement.playfield;
        if (!playfield) return _error("ERROR: mousemove not associated with a playfield");
        if (playfield.selectedObj) playfield.selectedObj.keydown(event.key);
    }
}
class PObject {
    ...
    keydown(key) {
        if (key === "ArrowUp") this.y -= 10;
        if (key === "ArrowDown") this.y += 10;
        if (key === "ArrowLeft") this.x -= 10;
        if (key === "ArrowRight") this.x += 10;
        this.playfield.redraw();
    }
}
```

## Summary
* Now, let's add keyboard control of the object position
* `Playfield` gets a new `handleKeyDown` method
  * It finds the currently selected object (if there is one)
  * And sends the keystroke to that object
* `PObject::keydown(key)` receives the key
  * and updates the x or y variable based on up, down, left, or right