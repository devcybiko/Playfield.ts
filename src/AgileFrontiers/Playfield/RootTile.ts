import {Playfield} from "./Playfield";
import {Tile} from "./Tile";

/**
 * The RootTile has some special capabilities
 */

export class RootTile extends Tile {
    constructor(x: number, y: number, w: number, h: number, playfield: Playfield) {
        super("_root", null, x, y, w, h, playfield);
    }
    draw() {
        this.redrawChildren();
    }
}
