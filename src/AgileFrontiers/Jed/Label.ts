import { Item } from "./Item";
import { Tile } from "../Playfield";
import { applyMixins } from "../Utils";
import { Draggable } from "../Playfield/Abilities";
import { GfxParms } from "../Playfield/Graphics";

/**
 * Label has a value and a label which are the same value
 */
export class _Label extends Item { };
export interface _Label extends Draggable { };
applyMixins(_Label, [Draggable]);

export class Label extends _Label {

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "") {
        super(name, parent, x, y, w, h, value, value);
        this.label = value;
        this.options.fontStyle = GfxParms.BOLD;
        this._updateGparms();
        let bb = this.gfx.boundingBox(this.label);
        if (!w) this.w = bb.w;
        if (!h) this.h = bb.h;
        this.options.borderColor = "red";
    }

    // --- Overrides --- //
    draw() {
        this._updateGparms();
        let x = this.X;
        let y = this.Y;
        let w = this.W;
        let h = this.H;
        this.gfx.clipRect(x, y, w, h);
        this.gfx.textRect(this.label, x, y, w, h);
        this.gfx.restore();
    }

    get label(): string {
        return super.label;
    }
    set label(s: string) {
        super.label = s;
        super.value = s;
    }
    get value(): string {
        return super.value;
    }
    set value(s: string) {
        super.label = s;
        super.value = s;
    }
}