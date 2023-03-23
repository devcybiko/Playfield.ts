import { Item } from "./Item";
import { Tile } from "../Playfield";
import { applyMixins } from "../Utils";
import { Draggable, Hoverable, Selectable } from "../Playfield/Abilities";
import { GfxParms } from "../Playfield/Graphics";

export class _Radio extends Item { };
export interface _Radio extends Draggable, Hoverable, Selectable { };
applyMixins(_Radio, [Draggable, Selectable, Hoverable]);

export class Radio extends _Radio {

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "", label = "") {
        super(name, parent, x, y, w, h, value || name);
        this.label = label || value || name;
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

    override draw() {
        let gparms = this.gfx.gparms;
        this._updateGparms();
        if (this.isSelected) gparms.fillColor = this.options.selectColor;
        else if (this.isHovering) gparms.fillColor = this.options.hoverColor;
        else gparms.fillColor = this.options.fillColor

        let boxX = this.X + 1;
        let boxY = this.Y + 1 ;
        let boxW = this.gfx.gparms.fontSize;
        let boxH = boxW + 2;

        let r = boxW / 2;

        let textX = boxX + boxW + 2;
        let textY = boxY;
        let textW = this.W - boxW - 2;
        let textH = boxH;

        this.gfx.gparms.textBaseline = GfxParms.BOTTOM;

        this.gfx.clipRect(this.X, this.Y, this.W, this.H);
        this.gfx.circle(boxX + r, boxY + r, r);
        this.gfx.text(this.label, textX, textY, textW, textH);
        this.gfx.restore();
    }

    // --- onActions  --- //
    override onSelect(): boolean {
        return this.go();
    }
}