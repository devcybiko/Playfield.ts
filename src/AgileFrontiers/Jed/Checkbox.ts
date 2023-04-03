import { Item } from "./Item";
import { Tile } from "../Playfield";
import { Dimensions, applyMixins } from "../Utils";
import { Draggable, Hoverable, Clickable } from "../Playfield/Abilities";
import { GfxParms } from "../Playfield/Graphics";

export class _Checkbox extends Item { };
export interface _Checkbox extends Draggable, Hoverable, Clickable { };
applyMixins(_Checkbox, [Draggable, Clickable, Hoverable]);

export class Checkbox extends _Checkbox {
    protected _isChecked = false;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "", label = "") {
        super(name, parent, x, y, w, h, value || name);
        this._type += ".Checkbox";
    }
    
    // --- Overrides --- //

    override draw(enable = true): Dimensions {
        let gparms = this.gfx.gparms;
        gparms.borderRadius = 0;
        this.updateGparms(enable);
        this.updateRect();
        if (this.isChecked) gparms.fillColor = this.options.selectColor;
        else if (this.isHovering) gparms.fillColor = this.options.hoverColor;
        else gparms.fillColor = this.options.backgroundColor

        let boxX = this.X;
        let boxY = this.Y;
        let boxW = gparms.fontSize;
        let boxH = boxW;

        let textX = boxX + boxW + 2;
        let textY = boxY;
        let textW = this.w - boxW - 2;
        let textH = boxH + 2;

        gparms.textBaseline = GfxParms.BOTTOM;

        this.gfx.clipRect(this.X, this.Y, this.W, this.H);
        this.gfx.rect(boxX, boxY, boxW, boxH);
        this.gfx.text(this.label, textX, textY, textW, textH);
        this.gfx.restore();
        return this.dimensions;
    }

    // --- onActions  --- //
    override onClick() {
        this.isChecked = !this.isChecked;
        this.go();
    }

    // --- Accessors --- //

    public get isChecked() {
        return this._isChecked;
    }
    public set isChecked(value: boolean) {
        this._isChecked = value;
    }
    override get value(): string {
        if (this.isChecked) return super.value;
        else return "";
    }
    override set value(s: string) {
        super.value  = s;
    }
}