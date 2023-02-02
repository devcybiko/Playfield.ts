const canvas = document.querySelector('#my_canvas');
const ctx = canvas.getContext('2d');
const intervalID = setInterval(timer, 250);

let color = ["red", "green", "orange"];
let x = [0,250,200];
let y = [0, 250,125];
let w = [100, 50, 50];
let h = [100, 50, 25];
let dx = [10, -10, -5];
let dy = [10, -10, 0]

redraw();

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=0; i<color.length; i++) {
        draw(i);
    }
}

function draw(n) {
    ctx.fillStyle = color[n];
    ctx.strokeStyle = 'black';
    ctx.fillRect(x[n], y[n], w[n], h[n]);
    ctx.strokeRect(x[n], y[n], w[n], h[n]);
}

function move(n) {
    x[n] = x[n] + dx[n];
    y[n] = y[n] + dy[n];
}

function timer() {
    for(let i=0; i<color.length; i++) {
        move(i);
    }
    redraw();
}
