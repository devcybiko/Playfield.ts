import { Tile } from "../Playfield";
import {BoxTestTile} from "./BoxTestTile";

export class CircleTestTile extends BoxTestTile {
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h = w) {
        super(name, parent, x, y, w, h);
        this.gfx.gparms.borderColor = "red";
        this.gfx.gparms.color = "blue";
        this.gfx.gparms.fillColor = "green";
    }
    draw() {
        this.playfield.gfx.circle(this.x, this.y, this.w);
    }
}
