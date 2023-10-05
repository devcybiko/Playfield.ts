import { Item } from "./Item";
import { Tile, PlayfieldEvent } from "../Playfield";
import { Dimensions, applyMixins } from "../Utils";
import { Draggable, Pressable } from "../Playfield/Abilities";
import { GfxParms } from "../Playfield/Graphics";

/**
 * Label has a value and a label which are the same value
 */
export class _Label extends Item { };
export interface _Label extends Draggable, Pressable { };
applyMixins(_Label, [Draggable, Pressable]);

export class Label extends _Label {
    private _hMargin = 2;
    private _vMargin = 1;
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "", label = "") {
        super(name, parent, x, y, w, h, value, label);
        this._type += ".Label";
        this._w += this._hMargin * 2;
        this._h += this._vMargin * 2;
        this.options.fontStyle = GfxParms.BOLD;
        this.options.textBaseline = "bottom";
    }

    // --- Overrides --- //
    override draw(enable = true): Dimensions {
        this.updateGparms(enable);
        this.updateRect();
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
        if (this.isBoxed) this.gfx.gparms.borderColor = this.options.borderColor;
        else this.gfx.gparms.borderColor = this.options.backgroundColor;
        // this.gfx.text(this.label, rectX, y, w, h);
        this.gfx.textRect(this.label, rectX, rectY, w, h);
        this.gfx.restore();
        return new Dimensions(this.W, this.H);
    }

    override get label(): string {
        return super.label;
    }
    override set label(s: string) {
        super.label = s;
        super.value = s;
    }
    override get value(): string {
        return super.value;
    }
    override set value(s: string) {
        super.label = s;
        super.value = s;
    }

    override onClick(pfEvent: PlayfieldEvent) {
        this.go();
    }
}