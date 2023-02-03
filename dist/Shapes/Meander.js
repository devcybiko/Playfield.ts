class Meander {
    constructor(obj) {
        this.obj = obj;
        this.orig_dx = Utils.random(-10, 10);
        this.orig_dy = Utils.random(-10, 10);
        this.dx = this.orig_dx;
        this.dy = this.orig_dy;
    }
    go() {
        if (this.obj.isSelected)
            return;
        this.obj.rmove(this.dx, this.dy);
        let collisions = this.obj.playfield.collisions(this.obj);
        if (collisions.length) {
            this.dx = Utils.random(-10, 10);
            this.dy = Utils.random(-10, 10);
        }
        if (this.obj.x < 0) {
            this.obj.x = 0;
            this.dx = -this.dx;
        }
        if (this.obj.x + this.obj.w > this.obj.playfield.canvas.width) {
            this.obj.x = this.obj.playfield.canvas.width - this.obj.w;
            this.dx = -this.dx;
        }
        if (this.obj.y < 0) {
            this.obj.y = 0;
            this.dy = -this.dy;
        }
        if (this.obj.y + this.obj.h > this.obj.playfield.canvas.height) {
            this.obj.y = this.obj.playfield.canvas.height - this.obj.h;
            this.dy = -this.dy;
        }
    }
}
//# sourceMappingURL=Meander.js.map