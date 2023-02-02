class Playfield {
    constructor(canvasId) {
        this.canvas = document.querySelector(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.objs = [];
        this.canvas.playfield = this;
        this.selectedObj = null;
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.dragObj = null;
        this.dragDX = null;
        this.dragDY = null;
        this.body = document.querySelector('body');
        this.body.playfield = this;
        document.addEventListener("keydown", this.handleKeyDown);
    }
    add(obj) {
        obj.playfield = this;
        this.objs.push(obj);
    }
    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let obj of this.objs) obj.draw(this.ctx);
    }
    _findObjInBounds(x, y) {
        for (let i = this.objs.length - 1; i >= 0; i--) {
            let obj = this.objs[i];
            if (obj.inBounds(x, y)) return obj
        }
        return null;
    }
    handleMouseDown(event) {
        let playfield = event.srcElement.playfield;
        if (!playfield) return _error("ERROR: mousedown not associated with a playfield");
        let obj = playfield._findObjInBounds(event.offsetX, event.offsetY);
        if (playfield.selectedObj) playfield.selectedObj.deselect();
        playfield.selectedObj = obj;
        if (obj) {
            if (event.shiftKey) playfield.toBack(obj);
            else playfield.toFront(obj);
            obj.select();
            obj.click(event.offsetX, event.offsetY);
            playfield.dragObj = obj;
            playfield.grabDX = event.offsetX - obj.x;
            playfield.grabDY = event.offsetY - obj.y;
        }
        playfield.redraw();
    }
    handleMouseUp(event) {
        let playfield = event.srcElement.playfield;
        if (!playfield) return _error("ERROR: mouseup not associated with a playfield");
        playfield.dragObj = null;
    }
    handleMouseMove(event) {
        let playfield = event.srcElement.playfield;
        if (!playfield) return _error("ERROR: mousemove not associated with a playfield");
        if (playfield.dragObj) {
            _log("handleMouseMove");
            playfield.dragObj.drag(event.offsetX - playfield.grabDX, event.offsetY - playfield.grabDY);
            playfield.redraw();
        }
    }
    toFront(obj) {
        let i = this.objs.indexOf(obj);
        if (i === -1) return;
        this.objs.splice(i, 1);
        this.objs.push(obj);
    }
    toBack(obj) {
        let i = this.objs.indexOf(obj);
        if (i === -1) return;
        this.objs.splice(i, 1);
        this.objs.splice(0, 0, obj);
    }
    handleKeyDown(event) {
        let playfield = event.srcElement.playfield;
        if (!playfield) return _error("ERROR: mousemove not associated with a playfield");
        if (playfield.selectedObj) playfield.selectedObj.keydown(event.key);
    }
    timer(playfield) {
        playfield.goAll();
        playfield.redraw();
    }
    start() {
        this.redraw();
        setInterval(this.timer, 125, this);
    }
    goAll() {
        for (let obj of this.objs) obj.go();
    }
    collisions(theObj) {
        let results = [];
        for (let obj of this.objs) {
            if (theObj === obj) continue;
            if (obj.inBounds(theObj.x, theObj.y) ||
                obj.inBounds(theObj.x + theObj.w, theObj.y) ||
                obj.inBounds(theObj.x, theObj.y + theObj.h) ||
                obj.inBounds(theObj.x + theObj.w, theObj.y + theObj.h))
                results.push(obj);
        }
        return results;
    }
}

class PObject {
    constructor(name, color, x, y, w, h) {
        this.playfield = null;
        this.name = name;
        this.color = color;
        this.x = x; this.y = y;
        this.w = w; this.h = h;
        this.isSelected = false;
    }
    select() {
        this.isSelected = true;
    }
    deselect() {
        this.isSelected = false;
    }
    inBounds(x, y) {
        let result = _between(this.x, x, this.x + this.w) && _between(this.y, y, this.y + this.h);
        return result;
    }
    click(x, y) {
        _log("CLICK! " + x + "," + y);
    }
    drag(x, y) {
        this.x = x;
        this.y = y;
    }
    draw() { } // abstract method
    go() { } // abstract method

    keydown(key) {
        if (key === "ArrowUp") this.y -= 10;
        if (key === "ArrowDown") this.y += 10;
        if (key === "ArrowLeft") this.x -= 10;
        if (key === "ArrowRight") this.x += 10;
        this.playfield.redraw();
    }
}

class Meanderer extends PObject {
    constructor(name, color, x, y, w, h) {
        super(name, color, x, y, w, h);
        this.dx = random(-10, 10);
        this.dy = random(-10, 10);
    }
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

class Box extends Meanderer {
    constructor(name, color, x, y, w, h) {
        super(name, color, x, y, w, h);
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
}
class Circle extends Meanderer {
    constructor(name, color, x, y, w, h) {
        super(name, color, x, y, w, h);
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
}