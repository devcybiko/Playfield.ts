import { Item } from "./Item";
import { Tile } from "../Playfield";
import { applyMixins } from "../Utils";
import { Draggable } from "../Playfield/Abilities";
import { GfxParms } from "../Playfield/Graphics";

export class _Label extends Item { };
export interface _Label extends Draggable { };
applyMixins(_Label, [Draggable]);

export class Label extends _Label {

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "", label = "") {
        super(name, parent, x, y, w, h, value, label);
        this.label = label || value;
        this.options.fontSize = h;
        this.options.fontStyle = GfxParms.BOLD;
        this._updateGparms();
    }

    // --- Overrides --- //
    draw() {
        this._updateGparms();
        this.gfx.gparms.borderColor = "";
        let x = this.X;
        let y = this.Y;
        let w = this.W;
        let h = this.H;
        this.gfx.clipRect(x, y, w, h);
        this.gfx.textRect(this.value, x, y, w, h);
        this.gfx.restore();
    }
}