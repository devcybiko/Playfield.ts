import { Item } from "./Item";
import { Tile } from "../Playfield";
import { applyMixins } from "../Utils";
import { Draggable } from "../Playfield/Abilities";
import { GfxParms } from "../Playfield/Graphics";

export class _LabelItem extends Item { };
export interface _LabelItem extends Draggable { };
applyMixins(_LabelItem, [Draggable]);

export class LabelItem extends _LabelItem {

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "") {
        super(name, parent, x, y, w, h, value);
        this.Draggable();
        this.Logger();
        this.options.fontSize = h;
        this.options.fontStyle = GfxParms.BOLD;
        this._updateGparms();
    }

    // --- Overrides --- //
    draw() {
        this._updateGparms();
        this.gfx.gparms.borderColor = "";
        let w = this.w;
        let h = this.h;
        let x = this.x;
        let y = this.y;
        this.gfx.clipRect(x, y, w, h);
        this.gfx.textRect(this.value, x, y, w, h);
        this.gfx.restore();
    }
}