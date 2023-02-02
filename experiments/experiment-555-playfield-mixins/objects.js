const Meanderer = {
    Meanderer(obj) { // all mixins must have an init method
        obj.dx = random(-10, 10);
        obj.dy = random(-10, 10);
    },
    go() {
        if (this.isSelected) return;
        this.x += this.dx;
        this.y += this.dy;

        let collisions = this.playfield.collisions(this);
        if (collisions.length) {
            this.dx = random(-10, 10);
            this.dy = random(-10, 10);
        }

        if (this.x < 0) {
            this.x = 0;
            this.dx = -this.dx;
        }
        if (this.x + this.w > this.playfield.canvas.width) {
            this.x = this.playfield.canvas.width - this.w;
            this.dx = -this.dx;
        }
        if (this.y < 0) {
            this.y = 0;
            this.dy = -this.dy;
        }
        if (this.y + this.h > this.playfield.canvas.height) {
            this.y = this.playfield.canvas.height - this.h;
            this.dy = -this.dy;
        }
    }
}

class Box extends PObject {
    static {
        this.mixin({Meanderer});
    }
    constructor(name, color, x, y, w, h) {
        super(name, color, x, y, w, h);
        this._initialize(this);
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        ctx.font = '12px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.name, this.x + this.w / 2, this.y + this.h / 2);

        if (this.isSelected) {
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.w, this.h);
        }
    }
    click(x, y, event) {
        this.playfield.select(this);
        this.playfield.dragStart(this, event);
        return true;
    }
    selected() {
        this.isSelected = true;
        this.toFront();
    }
    deselected() {
        this.isSelected = false;
    }
    keydown(key, event) {
        if (this.isSelected) {
            console.log(this.name, key);
            return true;
        }
    }
}

class Circle extends PObject {
    static {
        this.mixin({Meanderer});
    }
    constructor(name, color, x, y, w, h) {
        super(name, color, x, y, w, h);
        this._initialize(this);
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, this.h / 2, 0, 0, 2 * Math.PI);
        ctx.fill();

        ctx.font = '12px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.name, this.x + this.w / 2, this.y + this.h / 2);

        if (this.isSelected) {
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, this.h / 2, 0, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
    keydown(key, event) {
        console.log(this.name, key);
        return true;
    }
}

class Background extends Playfield {
    constructor(canvasId) {
        super(canvasId);
    }
    keydown(key, event) {
        console.log("Background::keydown", key);
    }
}