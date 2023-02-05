class Actor {
    constructor(parent, name, x, y, w, h) {
        this.borderColor = "black";
        this.fillColor = "white";
        this.color = "black";
        this.gparms = new GraphicsParms();
        this.node = new JedNode(parent.node, name);
        this.rect = new JedRect(x, y, w, h);
        this.logger = new Logger("Actor", "warn");
        this.objs = [];
        this.eventHandler = null;
        this.parent = parent;
        this.parent.add(this);
    }
    get X() {
        return this.rect.x + this.gparms.xOffset;
    }
    get Y() {
        return this.rect.y + this.gparms.yOffset;
    }
    add(obj) {
        this.objs.push(obj);
        obj.parent = this;
        obj.playfield = this.playfield;
    }
    move(x, y, w = this.rect.w, h = this.rect.h) {
        this.rect.x = x;
        this.rect.y = y;
        this.rect.w = w;
        this.rect.h = h;
    }
    rmove(dx, dy, dw = 0, dh = 0) {
        this.rect.x += dx;
        this.rect.y += dy;
        this.rect.w += dw;
        this.rect.h += dh;
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
        let result = Utils.between(this.gparms.xOffset + this.rect.x, x, this.gparms.xOffset + this.rect.x + this.rect.w) &&
            Utils.between(this.gparms.yOffset + this.rect.y, y, this.gparms.yOffset + this.rect.y + this.rect.h);
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
        this.logger.log("CLICK! " + this.node.name + ": " + x + "," + y);
    }
    keydown(key) {
        if (key === "ArrowUp")
            this.rect.y -= 10;
        if (key === "ArrowDown")
            this.rect.y += 10;
        if (key === "ArrowLeft")
            this.rect.x -= 10;
        if (key === "ArrowRight")
            this.rect.x += 10;
    }
    go() {
    }
    recompute() {
        let parentGparms = this.parent.gparms;
        if (parentGparms) {
            this.gparms.xOffset = this.parent.rect.x + parentGparms.xOffset;
            this.gparms.yOffset = this.parent.rect.y + parentGparms.yOffset;
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