import { Item } from "./Item";
import { Tile } from "../Playfield";
import { applyMixins } from "../Utils";
import { Draggable, Pressable, Hoverable } from "../Playfield/Abilities";
import { GfxParms } from "../Playfield/Graphics";

export class _ButtonItem extends Item { };
export interface _ButtonItem extends Draggable, Pressable, Hoverable { };
applyMixins(_ButtonItem, [Draggable, Pressable, Hoverable]);

export class ButtonItem extends _ButtonItem {
    private _label = "";

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "", label = "") {
        super(name, parent, x, y, w, h, value || name);
        this.Draggable();
        this.Pressable();
        this.Hoverable();
        this.Logger("info", false);
        this.isDraggable = true;
        this._label = label || value || name;
        this.gfx.gparms.borderRadius = 10;
        this.options.textAlign = GfxParms.CENTER;
        this.gfx.gparms.textAlign = GfxParms.CENTER;
        this.options.textBaseline = GfxParms.MIDDLE;
        this.gfx.gparms.textBaseline = GfxParms.MIDDLE;
        this.gfx.gparms.fontSize = 14;
        this.options.fontSize = 14;
        let bb = this.gfx.boundingBox(label);
        this.w = this.w || bb.w;
        this.h = this.h || bb.h;

    }

    // --- Overrides --- //

    go(): boolean {
        return false;
    }

    draw() {
        let gparms = this.gfx.gparms;
        this._updateGparms();
        let x = this.x;
        let y = this.y;
        let bb = this.gfx.boundingBox(this._label);
        let w = this.w || bb.w;
        let h = this.h || bb.h;
        if (this.isHovering && this.isPressed) gparms.fillColor = this.options.selectColor;
        else if (this.isHovering && !this.isPressed) gparms.fillColor = this.options.hoverColor;
        else gparms.fillColor = this.options.fillColor;
        this.gfx.clipRect(x, y, w, h);
        this.gfx.textRect(this._label, x, y, w, h);
        this.gfx.restore();
    }

    onPress(): boolean { 
        return true;
    }
    // --- onActions --- //
    onRelease(): boolean {
        if (this.isHovering) this.go();
        return true;
    }

    // --- Accessors --- //

    public get label() {
        return this._label;
    }
    public set label(value) {
        this._label = value;
    }

}