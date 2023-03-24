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

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "", label = "") {
        super(name, parent, x, y, w, h, value, label);
        this.options.fontStyle = GfxParms.BOLD;
        this.options.textBaseline = "bottom";
        this.options.borderColor = "";
    }

    // --- Overrides --- //
    draw() {
        this._updateGparms();
        let x = this.X;
        let y = this.Y;
        let w = this.W;
        let h = this.H;
        let rectX = x;
        let rectY = y;
        if (this.options.textAlign === "center") {
            rectX -= w / 2;
        } else if (this.options.textAlign === "right") {
            rectX -= w;
        }
        this.gfx.clipRect(rectX, rectY, w, h);
        // this.gfx.rect(rectX, rectY, w, h);
        // this.gfx.text(this.label, rectX, y, w, h);
        this.gfx.textRect(this.label, rectX, rectY, w, h);
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