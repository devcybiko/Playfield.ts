import { Tile } from "..";

export class ShapeTile extends Tile {
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h = w) {
        super(name, parent, x, y, w, h);
        this._type = "ShapeTile";
    }
}
