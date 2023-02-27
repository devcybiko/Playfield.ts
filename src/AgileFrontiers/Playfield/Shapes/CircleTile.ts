import { Tile, hasTile, Playfield, hasPlayfield } from "..";
import {ShapeTile} from "./ShapeTile";

export class CircleTile extends ShapeTile {
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h = w) {
        super(name, parent, x, y, w, h);
    }
    draw() {
        this._playfield.gfx.circle(this.x, this.y, this.w, this.gparms);
    }
}
