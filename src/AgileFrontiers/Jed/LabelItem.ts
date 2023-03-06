import { Item } from "./Item";
import { Tile } from "../Playfield";
import { applyMixins } from "../Utils";
import { Draggable } from "../Playfield/Abilities";
import { GfxParms } from "../Graphics";

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
    draw() {
        let gfx = this._playfield.gfx;
        this._updateGparms();
        let newX = this.x;
        if (this._rightJustify) {
            this.gparms.textAlign = GfxParms.RIGHT;
            newX += this.w;
        }
        gfx.clipRect(this.x, this.y, this.w, this.h, this.gparms);
        gfx.rect(this.x, this.y, this.w, this.h);
        gfx.text(this._label, newX, this.y+1, this.gparms, this.w);
        gfx.restore();
    }
}