import { Item } from "./Item";
import { Tile } from "../Playfield";
import { applyMixins } from "../Playfield/Utils";
import { Draggable, Hoverable, Selectable } from "../Playfield/Abilities";
import { GroupItem } from "./GroupItem";
import { GfxParms } from "../Playfield/Graphics";

export class _RadioItem extends Item { };
export interface _RadioItem extends Draggable, Hoverable, Selectable { };
applyMixins(_RadioItem, [Draggable, Selectable, Hoverable]);

export class RadioItem extends _RadioItem {
    private _label = "";

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "", label = "") {
        super(name, parent, x, y, w, h, value || name);
        this.Draggable();
        this.Selectable();
        this.Logger();
        this._label = label || value || name;
        this.options.fontSize = 14;
        this.gparms.fontSize = 14;
        let bb = this.gfx.boundingBox(label, this.gparms);
        this.w = this.w || bb.w + 2 + this.options.fontSize;
        this.h = this.h || bb.h + 2;
    }
    
    // --- Public Methods --- //

    go(): boolean {
        return false;
    }

    // --- Overrides --- //

    draw() {
        let gfx = this.playfield.gfx;
        this._updateGparms();
        if (this.isSelected) this.gparms.fillColor = this.options.selectColor;
        else if (this.isHovering) this.gparms.fillColor = this.options.hoverColor;
        else this.gparms.fillColor = "white";

        let boxX = this.x + 1;
        let boxY = this.y + 1 ;
        let boxW = this.gparms.fontSize;
        let boxH = boxW + 2;

        let r = boxW / 2;

        let textX = boxX + boxW + 2;
        let textY = boxY;
        let textW = this.w - boxW - 2;
        let textH = boxH;

        this.gparms.textBaseline = GfxParms.BOTTOM;

        gfx.clipRect(this.x, this.y, this.w, this.h, this.gparms);
        gfx.circle(boxX + r, boxY + r, r, this.gparms);
        gfx.text(this._label, textX, textY, this.gparms, textW, textH);
        gfx.restore();
    }

    // --- onActions  --- //
    onSelect(): boolean {
        return this.go();
    }

    // --- Accessors --- //

    public get label() {
        return this._label;
    }
    public set label(value) {
        this._label = value;
    }
    public get value(): string {
        if (this.isSelected) return super.value;
        else return "";
    }
    public set value(s: string) {
        super.value  = s;
    }
}