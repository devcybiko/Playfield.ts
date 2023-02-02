const canvas = document.querySelector('#my_canvas');
const ctx = canvas.getContext('2d');
const intervalID = setInterval(timer, 500);

let color_0 = "red";
let x_0 = 0;
let y_0 = 0;
let w_0 = 100;
let h_0 = 100;

let color_1 = "green";
let x_1 = 250;
let y_1 = 250;
let w_1 = 50;
let h_1 = 50;

redraw_0();
redraw_1();

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    redraw_0();
    redraw_1();
}
function redraw_0() {
    ctx.fillStyle = color_0;
    ctx.strokeStyle = 'black';
    ctx.fillRect(x_0, y_0, w_0, h_0);
    ctx.strokeRect(x_0, y_0, w_0, h_0);
}
function redraw_1() {
    ctx.fillStyle = color_1;
    ctx.strokeStyle = 'black';
    ctx.fillRect(x_1, y_1, w_1, h_1);
    ctx.strokeRect(x_1, y_1, w_1, h_1);
}

function timer() {
    x_0 += 10;
    y_0 += 10;
    x_1 -= 10;
    y_1 -= 10;
    redraw();
}
