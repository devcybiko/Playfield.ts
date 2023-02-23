import { Tile, hasTile, Playfield, hasPlayfield } from "../Playfield";
import { hasTree } from "../Utils";

export class CircleTile extends Tile {
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number) {
        super(name, parent, x, y, w, h);
    }
    draw() {
        this.gparms.borderColor = "red";
        this.gparms.color = "blue";
        this.gparms.fillColor = "green";
        this._playfield.gfx.circle(this.rect.x, this.rect.y, this.rect.w, this.gparms);
    }
    tick(): void {
        throw new Error("Method not implemented.");
    }
    go(): void {
        throw new Error("Method not implemented.");
    }
}
