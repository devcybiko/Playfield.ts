import { Tile } from "..";
import { ShapeTile } from "./ShapeTile"
import { Draggable, Selectable } from "../Abilities";
import { Dimensions, applyMixins } from "../../Utils";

export class _CircleTile extends ShapeTile { };
export interface _CircleTile extends Draggable, Selectable { };
applyMixins(_CircleTile, [Draggable, Selectable]);

export class CircleTile extends _CircleTile {
    _dx = 0;
    _dy = 0;
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number) {
        super(name, parent, x, y, w, h);
    }

    // --- Overrides --- //

    inBounds(x: number, y: number): Tile {
        let dx = this.X - x;
        let dy = this.Y - y;
        let dr = dx * dx + dy * dy;
        let dw = this.w * this.w;
        if (dr <= dw) return this;
    }

    override draw(enable = true): Dimensions {
        this.gfx.gparms.borderColor = "black";
        this.gfx.gparms.fillColor = "gray";
        this.gfx.circle(this.X, this.Y, this.W);

        if (this.isSelected && this._dx && this._dy) {
            let oldColor = this.gfx.gparms.fillColor;
            this.gfx.gparms.fillColor = "red";
            let r = Math.floor(Math.sqrt(this._dx * this._dx + this._dy * this._dy));
            this.playfield.gfx.circle(this.X, this.Y, r);
            this.gfx.gparms.fillColor = oldColor;
        }
        return super.draw(enable);
    }

    // --- onActions --- //

    onGrab(dx: number, dy: number, event: any) {
        this._dx = this.X - event.x;
        this._dy = this.Y - event.y;
        this.toFront();
        this.isSelected = true;
        return super.onGrab(dx, dy, event);
    }

    onDrop() {
        this.toFront();
        this._dx = 0;
        this._dy = 0;
        this.isSelected = false;
    }
}
