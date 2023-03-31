# project-330-mouse-grabbing-perfected

```js
...
let grabDX = 0;
let grabDY = 0;
...
function handleMouseEvent(event) {
    if (event.type === "mouseup") drag = false;
    if (event.type === "mousedown") {
        if (event.offsetX > x 
            && event.offsetX < x + w 
            && event.offsetY > y 
            && event.offsetY < y + h) {
                drag = true;
                grabDX = event.offsetX - x;
                grabDY = event.offsetY -y;
            }
    }
    if (drag) {
        x = event.offsetX - grabDX;
        y = event.offsetY - grabDY;
        redraw(enable);
    }
}
```

* To complete the experiment, 
  * when the mouse is clicked, 
  * we compute the distance from the upper left of the rectangle to the mouse pointer
* We record that in `grabDX` and `grabDY` (D means `diff` or `delta`)
* When we draw the rectangle, we subtract the deltas from the current mouse pointer
* This gives the illusion that we're dragging the rectangle
  * from the point at which we 'grabbed' it on the rectangle
