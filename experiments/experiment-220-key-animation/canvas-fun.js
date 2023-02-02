const canvas = document.querySelector('#my_canvas');
document.addEventListener("keydown", handleKeyDown);
const ctx = canvas.getContext('2d');

let color = "black";
let x = 0;
let y = 0;

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
    if (event.key === 'ArrowUp') y += -10;
    if (event.key === 'ArrowDown') y += 10;
    if (event.key === 'ArrowLeft') x += -10;
    if (event.key === 'ArrowRight') x += 10;
    ctx.fillStyle = color;
    ctx.strokeStyle = 'black';
    ctx.fillRect(x, y, 100, 100);
    ctx.strokeRect(x, y, 100, 100);
}

