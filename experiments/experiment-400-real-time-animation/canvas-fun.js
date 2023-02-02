const canvas = document.querySelector('#my_canvas');
const ctx = canvas.getContext('2d');
const intervalID = setInterval(timer, 500);

let color = "red";
let x = 0;
let y = 0;
let w = 100;
let h = 100;

redraw();

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.strokeStyle = 'black';
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
}

function timer() {
    x += 10;
    y += 10;
    redraw();
}
