import { Item } from "./Item";
import { Tile } from "../Playfield";
import { applyMixins } from "../Playfield/Utils";
import { Draggable } from "../Playfield/Abilities";

export class _LabelItem extends Item { };
export interface _LabelItem extends Draggable { };
applyMixins(_LabelItem, [Draggable]);

export class LabelItem extends _LabelItem {
    _label: string;
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "", label = "") {
        super(name, parent, x, y, w, h, value);
        this.Draggable();
        this.Logger();
        this.options.fontSize = h;
        this._updateGparms();
        this._label = label;
    }

    // --- Overrides --- //
    draw() {
        let gfx = this._playfield.gfx;
        this._updateGparms();
        let w = this.w;
        let h = this.h;
        let x = this.x;
        let y = this.y;
        if (w < 0) {
            this.gparms.textAlign = "right";
            w = -w;
            x -= w;
        }
        gfx.clipRect(x, y, w, h, this.gparms);
        // gfx.rect(x, y, w, h);
        gfx.text(this._label, this.x, y, this.gparms, w);
        gfx.restore();
    }
}