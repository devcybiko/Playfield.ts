import { Item } from "./Item";
import { Tile } from "../Playfield";
import { applyMixins } from "../Playfield/Utils";
import { Draggable, Hoverable, Clickable } from "../Playfield/Abilities";
import { GroupItem } from "./GroupItem";
import { GfxParms } from "../Playfield/Graphics";

export class _CheckboxItem extends Item { };
export interface _CheckboxItem extends Draggable, Hoverable, Clickable { };
applyMixins(_CheckboxItem, [Draggable, Clickable, Hoverable]);

export class CheckboxItem extends _CheckboxItem {
    private _label = "";
    private _isChecked = false;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "", label = "") {
        super(name, parent, x, y, w, h, value || name);
        this.Draggable();
        this.Clickable();
        this.Logger();
        this._label = label || value || name;
        this.options.fontSize = 14;
        this.gfx.gparms.fontSize = 14;
        let bb = this.gfx.boundingBox(label);
        this.w = this.w || bb.w + 2 + this.options.fontSize;
        this.h = this.h || bb.h + 2;
    }
    
    // --- Public Methods --- //

    go(): boolean {
        return false;
    }

    // --- Overrides --- //

    draw() {
        let gparms = this.gfx.gparms;
        this._updateGparms();
        if (this.isChecked) gparms.fillColor = this.options.selectColor;
        else if (this.isHovering) gparms.fillColor = this.options.hoverColor;
        else gparms.fillColor = "white";

        let boxX = this.x;
        let boxY = this.y;
        let boxW = gparms.fontSize;
        let boxH = boxW;

        let textX = boxX + boxW + 2;
        let textY = boxY;
        let textW = this.w - boxW - 2;
        let textH = boxH + 2;

        gparms.textBaseline = GfxParms.BOTTOM;

        this.gfx.clipRect(this.x, this.y, this.w, this.h);
        this.gfx.rect(boxX, boxY, boxW, boxH);
        this.gfx.text(this._label, textX, textY, textW, textH);
        this.gfx.restore();
    }

    // --- onActions  --- //
    onClick(): boolean {
        this.isChecked = !this.isChecked;
        return this.go();
    }

    onUnselect(): boolean {
        this.isChecked = false;
        return this.go();
    }

    // --- Accessors --- //

    public get label() {
        return this._label;
    }
    public set label(value) {
        this._label = value;
    }
    public get isChecked() {
        return this._isChecked;
    }
    public set isChecked(value) {
        this._isChecked = value;
    }
    public get value(): string {
        if (this.isChecked) return super.value;
        else return "";
    }
    public set value(s: string) {
        super.value  = s;
    }
}