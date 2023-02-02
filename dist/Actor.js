class Actor {
    constructor(name, x, y, w, h) {
        this.borderColor = "black";
        this.fillColor = "white";
        this.color = "black";
        this.name = name;
        this.logger = new Logger("Actor");
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    move(x, y, w = this.w, h = this.h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    rmove(dx, dy, dw = 0, dh = 0) {
        this.x += dx;
        this.y += dy;
        this.w += dw;
        this.h += dh;
    }
    select() {
        this.isSelected = true;
    }
    deselect() {
        this.isSelected = false;
    }
    inBounds(x, y) {
        let result = Utils.between(this.x, x, this.x + this.w) &&
            Utils.between(this.y, y, this.y + this.h);
        return result;
    }
    click(x, y) {
        this.logger.log("CLICK! " + this.name + ": " + x + "," + y);
    }
    drag(x, y) {
        this.move(x, y);
    }
    keydown(key) {
        if (key === "ArrowUp")
            this.y -= 10;
        if (key === "ArrowDown")
            this.y += 10;
        if (key === "ArrowLeft")
            this.x -= 10;
        if (key === "ArrowRight")
            this.x += 10;
        this.playfield.redraw();
    }
    go() {
    }
}
//# sourceMappingURL=Actor.js.map