class Actor {
    public node: JedNode;
    public rect: JedRect;
    public borderColor = "black";
    public fillColor = "white";
    public color = "black";
    public isSelected: boolean;
    public hasFocus: boolean;
    public logger: Logger;
    public playfield: Playfield;
    public parent: Playfield | Actor;
    public draggable: Draggable;
    public eventHandler: EventHandler;
    public objs: Actor[];
    public gparms = new GraphicsParms();

    constructor(parent: Playfield | Actor, name: string, x: number, y: number, w: number, h: number) {
        this.node = new JedNode(parent.node, name);
        this.rect = new JedRect(x, y, w, h);
        this.logger = new Logger("Actor", "warn");
        this.objs = [];
        this.eventHandler = null;
        this.parent = parent;
        this.parent.add(this);
    }
    get X(): number {
        return this.rect.x + this.gparms.xOffset;
    }
    get Y(): number {
        return this.rect.y + this.gparms.yOffset;
    }
    add(obj: Actor) {
        this.objs.push(obj);
        obj.parent = this;
        obj.playfield = this.playfield;
    }
    move(x: number, y: number, w = this.rect.w, h = this.rect.h): void {
        this.rect.x = x;
        this.rect.y = y;
        this.rect.w = w;
        this.rect.h = h;
    }
    rmove(dx: number, dy: number, dw = 0, dh = 0): void {
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
    inBounds(x: number, y: number): Actor {
        let result =
            Utils.between(this.gparms.xOffset + this.rect.x, x, this.gparms.xOffset + this.rect.x + this.rect.w) &&
            Utils.between(this.gparms.yOffset + this.rect.y, y, this.gparms.yOffset + this.rect.y + this.rect.h);
        if (result) return this;
        for (let i = this.objs.length - 1; i >= 0; i--) {
            let obj = this.objs[i];
            let found = obj.inBounds(x, y);
            if (found) return this;
        }
        return null;
    }
    click(x: number, y: number) {
        this.logger.log("CLICK! " + this.node.name + ": " + x + "," + y);
    }
    keydown(key: string) {
        if (key === "ArrowUp") this.rect.y -= 10;
        if (key === "ArrowDown") this.rect.y += 10;
        if (key === "ArrowLeft") this.rect.x -= 10;
        if (key === "ArrowRight") this.rect.x += 10;
    }
    go(): void {
    }
    recompute() {
        let parentGparms = this.parent.gparms;
        if (parentGparms) {
            this.gparms.xOffset = this.parent.rect.x + parentGparms.xOffset;
            this.gparms.yOffset = this.parent.rect.y + parentGparms.yOffset;
        }
    }
    drawAll(): void {
        this.recompute();
        this.draw();
        if (this.objs.length) {
            for (let obj of this.objs) {
                obj.drawAll();
            }
        }
    }
    draw(): void {
    }
}
