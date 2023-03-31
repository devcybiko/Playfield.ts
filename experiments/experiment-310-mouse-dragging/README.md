# project-310-mouse-dragging

```js
...
document.addEventListener('mouseup', handleMouseEvent);
document.addEventListener('mousedown', handleMouseEvent);
...
let drag = false;
...
function handleMouseEvent(event) {
    console.log(event.button, event.buttons, event.type);
    if (event.type === "mouseup") drag = false;
    if (event.type === "mousedown") drag = true;
    if (drag) {
        x = event.offsetX - 50;
        y = event.offsetY - 50;
        redraw(enable);
    }
}
```

* We've added an `EventListener` for mouseup and mousedown
  - in this case we're using the same `EventListener` for all the mouse events
  - but you could use different functions for each of the different events
* We've added a new variable to keep track of whether we're "dragging" the rectangle
* In the `handleMouseEvent()` we detect if the mouse button is down or up
  * If the mouse button is "down" we change the `drag` flag to `true` indicating that we want to move the rectangle to the same location as the mouse
  * If the mouse button is "up" we change the `drag` flag to `false` indicating that we don't want to move the rectangle any more
* We also use the `drag` flag to indicate that we ONLY move the rectangle if the mouse button is down
* BUG: it looks like the rectangle "jumps" around
  * it leaps to the mouse position every time we click the mouse
  * this seems unnatural
  * it would be better if we moved the rectangle ONLY when the mouse pointer is inside the bounds of the rectangle
  * That's the topic of the next experiment