# project-210-key-capture


```js
const canvas = document.querySelector('#my_canvas');
document.addEventListener("keydown", handleKeyDown);
const ctx = canvas.getContext('2d');

let i = 0;
let color = "black";

handleKeyDown({});

function handleKeyDown(event) {
    console.log(event.key);
    if (event.key === 'r') color = 'red';
    if (event.key === 'o') color = 'orange';
    if (event.key === 'y') color = 'yellow';
    if (event.key === 'g') color = 'green';
    if (event.key === 'b') color = 'blue';
    if (event.key === 'i') color = 'indigo';
    if (event.key === 'v') color = 'violet';
    ctx.fillStyle = color;
    ctx.strokeStyle = 'black';
    ctx.fillRect(i, i, 100, 100);
    ctx.strokeRect(i, i, 100, 100);
    i = i + 10;
}
```

* here, we introduce conditionals - if/then
  - We're not going to spend a lot of time teaching JavaScript
  - but conditionals test a value and execute one or more commands if true
* also, we introduce console.log - a debugging command that prints things on the console
* we check the `event` to see if the `key` pressed was one of `r,o,y,g,b,i,v`
  - red, orange, yellow, green, blue, indigo, or violet
  - and we reset the fill color based on that value
* note - if you press some other key, the last color is used
  - and... you can look in the inspect/debugger to see what the name of that key is
  - in case you want to capture it
  - (we'll capture the up, down, left, right keys in the next exercise)
* also NOTE: be sure that you click in the canvas when you hit the keys.
  - if you have the 'inspect' debugger open and hit a key 
  - it will be sent to the debugger, not the canvas
* You can also use this program to get the key names of special keys
