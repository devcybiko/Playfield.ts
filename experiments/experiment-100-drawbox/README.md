# project-100-drawbox

* edit files
* open index.html - to run the project in a browser
* inpsect - to demonstrate the debugger
* html - bare minimum - 
* naming - to make sure do differentiate between the objects and their names (eg: `<canvas>` vs `let canvas=xxx`)
* experiment with it
  - change the color of the box
  - change the position of the box 

```html
<html>
<body>
<canvas height="256" width="256" id="my_canvas">There's no canvas capability in this browser</canvas>
<script src="canvas-fun.js"></script>
</body>
</html>
```

* we're not going to talk about html much
* `<canvas>` - defines the canvas height, width, and id
* `<script>` - reads the script into the html
  - NOTE: scripts often must be at the end so that they run after the page is loaded

```js
const canvas = document.querySelector('#my_canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'red';
ctx.fillRect(30, 30, 100, 100);
```

* querySelector - pulls in the canvas by name
* ctx - the 'context' which stores things like the color of the 'pen' to draw with
  - and all the methods or functions associated with drawing on the canvas
* fillStyle - color, pattern, etc... of how to draw
* fillRect(x,y ,w, h)  - method to draw a filled-in rectangle
