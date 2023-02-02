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

ctx.strokeStyle = "black";
ctx.strokeRect(0,0,canvas.width,canvas.height);
