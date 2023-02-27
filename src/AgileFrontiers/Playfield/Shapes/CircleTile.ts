import { Tile } from "..";
import { ShapeTile } from "./ShapeTile"
import {Draggable} from "../DraggableMixin";
import { applyMixins } from "../../Utils";

export class _CircleTile extends ShapeTile { };
export interface _CircleTile extends Draggable { };
applyMixins(_CircleTile, [Draggable]);

export class CircleTile extends _CircleTile {
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number) {
        super(name, parent, x, y, w, h);
        this.Draggable(this);
    }
    draw() {
        this._playfield.gfx.circle(this.x, this.y, this.w, this.gparms);
    }
}
