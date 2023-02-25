import { Tile, hasTile, Playfield, hasPlayfield } from "../Playfield";
import { hasTree } from "../Utils";
import {BoxTestTile} from "./BoxTestTile";

export class CircleTestTile extends BoxTestTile {
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h = w) {
        super(name, parent, x, y, w, h);
        this.gparms.borderColor = "red";
        this.gparms.color = "blue";
        this.gparms.fillColor = "green";
    }
    draw() {
        this._playfield.gfx.circle(this.rect.x, this.rect.y, this.rect.w, this.gparms);
        this._playfield._count++;
    }
}
