class Playfield {
    constructor(canvasId) {
        this.canvas = document.querySelector(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.objs = [];
        this.canvas.playfield = this;
        this.selectedObj = null;
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
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
        for (let obj of this.objs) {
            if (obj.inBounds(x, y)) return obj
        }
        return null;
    }
    handleMouseDown(event) {
        let playfield = event.srcElement.playfield;
        if (!playfield) return _error("ERROR: mousedown not associated with a playfield");
        let obj = playfield._findObjInBounds(event.offsetX, event.offsetY);
        if (obj) obj.click(event.offsetX, event.offsetY);
        if (playfield.selectedObj === obj) return;
        if (playfield.selectedObj) playfield.selectedObj.deselect();
        playfield.selectedObj = obj;
        if (obj) obj.select();
        playfield.redraw();
    }
}

class Box {
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