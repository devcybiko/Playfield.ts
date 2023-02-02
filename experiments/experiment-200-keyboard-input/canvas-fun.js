const canvas = document.querySelector('#my_canvas');
document.addEventListener("keydown", handleKeyDown);
const ctx = canvas.getContext('2d');
let i = 0;
handleKeyDown();

function handleKeyDown(event) {
    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'black';
    ctx.fillRect(i, i, 100, 100);
    ctx.strokeRect(i, i, 100, 100);
    i = i + 10;
}

ctx.strokeStyle = "black";
ctx.strokeRect(0,0,canvas.width,canvas.height);
