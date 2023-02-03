class Actor {
    public name: string;
    public x: number;
    public y: number;
    public w: number;
    public h: number;
    public borderColor = "black";
    public fillColor = "white";
    public color = "black";
    public isSelected: boolean;
    public hasFocus: boolean;
    public logger: Logger;
    public playfield: Playfield;
    public parent: Playfield | Actor;
    public isDraggable = true;
    public eventHandler: EventHandler;
    public grabDX = 0;
    public grabDY = 0;
    public objs: Actor[];
    public gparms = new GraphicsParms();

    constructor(parent: Playfield | Actor, name: string, x: number, y: number, w: number, h: number) {
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
    get X(): number {
        return this.x + this.gparms.xOffset;
    }
    get Y(): number {
        return this.y + this.gparms.yOffset;
    }
    add(obj: Actor) {
        this.objs.push(obj);
        obj.parent = this;
        obj.playfield = this.playfield;
    }
    move(x: number, y: number, w = this.w, h = this.h): void {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    rmove(dx: number, dy: number, dw = 0, dh = 0): void {
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
    inBounds(x: number, y: number): Actor {
        let result =
            Utils.between(this.gparms.xOffset + this.x, x, this.gparms.xOffset + this.x + this.w) &&
            Utils.between(this.gparms.yOffset + this.y, y, this.gparms.yOffset + this.y + this.h);
        if (result) return this;
        for (let i = this.objs.length - 1; i >= 0; i--) {
            let obj = this.objs[i];
            let found = obj.inBounds(x, y);
            if (found) return this;
        }
        return null;
    }
    click(x: number, y: number) {
        this.logger.log("CLICK! " + this.name + ": " + x + "," + y);
    }
    drag(x: number, y: number) {
        this.move(x, y);
    }
    grab(dx: number, dy: number) {
        this.grabDX = dx;
        this.grabDY = dy;
    }
    drop() {
        // playfield is dropping me from dragging
    }
    keydown(key: string) {
        if (key === "ArrowUp") this.y -= 10;
        if (key === "ArrowDown") this.y += 10;
        if (key === "ArrowLeft") this.x -= 10;
        if (key === "ArrowRight") this.x += 10;
    }
    go(): void {
    }
    recompute() {
        let parentGparms = this.parent.gparms;
        if (parentGparms) {
            this.gparms.xOffset = this.parent.x + parentGparms.xOffset;
            this.gparms.yOffset = this.parent.y + parentGparms.yOffset;
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
