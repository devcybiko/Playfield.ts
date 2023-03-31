const canvas = document.querySelector('#my_canvas');
document.addEventListener("keydown", handleKeyEvent);
canvas.addEventListener('mousemove', handleMouseEvent);
canvas.addEventListener('mouseup', handleMouseEvent);
canvas.addEventListener('mousedown', handleMouseEvent);

const ctx = canvas.getContext('2d');

let color = "red";
let x = 0;
let y = 0;
let w = 100;
let h = 100;
let grabDX = 0;
let grabDY = 0;
let drag = false;

redraw(enable);

function redraw(enable = true) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.strokeStyle = 'black';
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
}

function handleKeyEvent(event) {
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
    redraw(enable);
}

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

