class Actor {
    constructor(parent, name, x, y, w, h) {
        this.borderColor = "black";
        this.fillColor = "white";
        this.color = "black";
        this.isDraggable = true;
        this.grabDX = 0;
        this.grabDY = 0;
        this.gparms = new GraphicsParms();
        this.name = name;
        this.logger = new Logger("Actor", "warn");
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.objs = [];
        this.eventHandler = null;
        this.parent = parent;
        this.parent.add(this);
    }
    get X() {
        return this.x + this.gparms.xOffset;
    }
    get Y() {
        return this.y + this.gparms.yOffset;
    }
    add(obj) {
        this.objs.push(obj);
        obj.parent = this;
        obj.playfield = this.playfield;
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
    focus() {
        this.hasFocus = true;
    }
    defocus() {
        this.hasFocus = false;
    }
    inBounds(x, y) {
        let result = Utils.between(this.gparms.xOffset + this.x, x, this.gparms.xOffset + this.x + this.w) &&
            Utils.between(this.gparms.yOffset + this.y, y, this.gparms.yOffset + this.y + this.h);
        if (result)
            return this;
        for (let i = this.objs.length - 1; i >= 0; i--) {
            let obj = this.objs[i];
            let found = obj.inBounds(x, y);
            if (found)
                return this;
        }
        return null;
    }
    click(x, y) {
        this.logger.log("CLICK! " + this.name + ": " + x + "," + y);
    }
    drag(x, y) {
        this.move(x, y);
    }
    grab(dx, dy) {
        this.grabDX = dx;
        this.grabDY = dy;
    }
    drop() {
        // playfield is dropping me from dragging
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
    }
    go() {
    }
    recompute() {
        let parentGparms = this.parent.gparms;
        if (parentGparms) {
            this.gparms.xOffset = this.parent.x + parentGparms.xOffset;
            this.gparms.yOffset = this.parent.y + parentGparms.yOffset;
        }
    }
    drawAll() {
        this.recompute();
        this.draw();
        if (this.objs.length) {
            for (let obj of this.objs) {
                obj.drawAll();
            }
        }
    }
    draw() {
    }
}
//# sourceMappingURL=Actor.js.map