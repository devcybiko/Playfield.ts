import { Tile } from "../Playfield";
import { random } from "../Utils";

export class BoxTestTile extends Tile {
    DX: number;
    DY: number;
    
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h = w) {
        super(name, parent, x, y, w, h);
        this.gparms.borderColor = "red";
        this.gparms.color = "blue";
        this.gparms.fillColor = "green";
        this.DX = random(-10, 10)
        this.DY = random(-10, 10);
    }
    draw() {
        this._playfield.gfx.rect(this.x, this.y, this.w, this.h, this.gparms);
        this.tick();
    }
    tick(): void {
        let obj = this as any;
        this.rmove(obj.DX || 10, obj.DY || 10);
        if (this.X > this._playfield.w || this.X <= 0) {
            if (obj.DX === undefined) this.rmove(-this.x, 0);
            else obj.DX = -obj.DX;
        }
        if (this.Y> this._playfield.h || this.Y <= 0) {
            if (obj.DY === undefined) this.rmove(0, -this.y);
            else obj.DY = -obj.DY;
        }
        // notice - does not move children
    }
    go(): void {
        throw new Error("Method not implemented.");
    }
}
