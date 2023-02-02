# project-110-drawboxes

* when you draw objects, they draw in order and may overlap
* these are not "objects" you can move around
* but we're overwriting the pixels on the canvas

```js
const canvas = document.querySelector('#my_canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'green';
ctx.fillRect(10, 10, 100, 100);
ctx.fillStyle = 'red';
ctx.fillRect(30, 30, 100, 100);
```

* We draw one rectangle 
* then we draw another

