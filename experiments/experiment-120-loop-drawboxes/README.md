# project-120-loop-drawboxes

* canvas methods: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
* here, we're looping to draw a bunch of rectanctangles

```js
const canvas = document.querySelector('#my_canvas');
const ctx = canvas.getContext('2d');
for(let i=0; i<250; i+=10) {
    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'black';
    ctx.fillRect(i, i, 100, 100);
    ctx.strokeRect(i, i, 100, 100);
}
```

* the `for` command sets an initializer, termination criteria, and incrementer
* notice that we set the `fillStyle` to green
* but the `strokeStyle` to black
* to draw a filled rectangle with a border, we need two calls
  - fillRect()
  - strokeRect()
* NOTE: we're using the variable `i` to set both the 'x' and 'y' values - this creates a diagonal look
