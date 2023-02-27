import { Tile } from "..";
import { ShapeTile } from "./ShapeTile"
import {Draggable} from "../DraggableMixin";
import { applyMixins } from "../../Utils";

export class _BoxTile extends ShapeTile { };
export interface _BoxTile extends Draggable { };
applyMixins(_BoxTile, [Draggable]);

export class BoxTile extends _BoxTile {
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number) {
        super(name, parent, x, y, w, h);
        this.Draggable(this);
    }
    draw() {
        this._playfield.gfx.rect(this.x, this.y, this.w, this.h, this.gparms);
    }
}
