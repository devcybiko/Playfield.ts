class Playfield {
    constructor(canvasId) {
        this.canvas = document.querySelector(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.objs = [];
    }
    add(obj) {
        this.objs.push(obj);
    }
    moveAll() {
        for(let obj of this.objs) obj.move();
    }
    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for(let obj of this.objs) obj.draw(this.ctx);
    }
    timer() {
        playfield.moveAll();
        playfield.redraw();
    }    
    start() {
        this.redraw();
        setInterval(this.timer, 125);
    }
}

class Box {
    constructor(color, x, y, w, h, dx, dy) {
        this.color = color;
        this.x = x; this.y = y;
        this.w = w; this.h = h;
        this.dx = dx; this.dy = dy;
    }
    move() {
        this.x = this.x + this.dx;
        this.y = this.y + this.dy;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'black';
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
    
}

const playfield = new Playfield('#my_canvas');
playfield.add(new Box("red", 0, 0, 100, 100, 10, 10));
playfield.add(new Box("green", 250, 250, 50, 50, -10, -10));
playfield.add(new Box("orange", 200, 125, 50, 25, -5, 0));
playfield.add(new Box("blue", 250, 250, 50, 50, -20, -20));
playfield.start();