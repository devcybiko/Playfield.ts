import { Item } from "./Item";
import { Tile } from "../Playfield";
import { applyMixins } from "../Utils";
import { Draggable, Hoverable, Clickable } from "../Playfield/Abilities";
import { GfxParms } from "../Playfield/Graphics";

export class _Checkbox extends Item { };
export interface _Checkbox extends Draggable, Hoverable, Clickable { };
applyMixins(_Checkbox, [Draggable, Clickable, Hoverable]);

export class Checkbox extends _Checkbox {
    protected _isChecked = false;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "", label = "") {
        super(name, parent, x, y, w, h, value || name);
        this.label = label || value || name;
        let bb = this.gfx.boundingBox(label);
        this.w = this.w || bb.w + 2 + this.options.fontSize;
        this.h = this.h || bb.h + 2;
    }
    
    // --- Public Methods --- //

    go(): boolean {
        return false;
    }

    // --- Overrides --- //

    override draw() {
        let gparms = this.gfx.gparms;
        gparms.borderRadius = 0;
        this._updateGparms();
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
    }

    // --- onActions  --- //
    override onClick(): boolean {
        this.isChecked = !this.isChecked;
        return this.go();
    }

    // --- Accessors --- //

    public get isChecked() {
        return this._isChecked;
    }
    public set isChecked(value) {
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