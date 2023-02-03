abstract class Actor {
    public name: string;
    public x: number;
    public y: number;
    public w: number;
    public h: number;
    public borderColor = "black";
    public fillColor = "white";
    public color = "black";
    public isSelected: boolean;
    public logger: Logger;
    public playfield!: Playfield;
    public isDraggable = true;
    static focusItem: any;

    constructor(name: string, x: number, y: number, w: number, h: number) {
        this.name = name;
        this.logger = new Logger("Actor");
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    addMeToPlayfield(playfield: Playfield) {
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
    inBounds(x: number, y: number) {
        let result =
            Utils.between(this.x, x, this.x + this.w) &&
            Utils.between(this.y, y, this.y + this.h);
        return result;
    }
    click(x: number, y: number) {
        this.logger.log("CLICK! " + this.name + ": " + x + "," + y);
    }
    drag(x: number, y: number) {
        this.move(x, y);
    }
    keydown(key: string) {
        if (key === "ArrowUp") this.y -= 10;
        if (key === "ArrowDown") this.y += 10;
        if (key === "ArrowLeft") this.x -= 10;
        if (key === "ArrowRight") this.x += 10;
        this.playfield.redraw();
    }
    go(): void {
    }
    abstract draw(): void;
}
