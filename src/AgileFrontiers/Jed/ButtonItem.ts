import { Item } from "./Item";
import { Tile } from "../Playfield";
import { applyMixins } from "../Playfield/Utils";
import { Draggable, Pressable, Hoverable } from "../Playfield/Abilities";

export class _ButtonItem extends Item { };
export interface _ButtonItem extends Draggable, Pressable, Hoverable { };
applyMixins(_ButtonItem, [Draggable, Pressable, Hoverable]);

export class ButtonItem extends _ButtonItem {
    private _label = "";

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "", label = "") {
        super(name, parent, x, y, w, h, value);
        this.Draggable();
        this.Pressable();
        this.Hoverable();
        this.Logger();
        this.isDraggable = false;
        this._label = label || value;
    }
    
    public get label() {
        return this._label;
    }
    public set label(value) {
        this._label = value;
    }

    draw() {
        let gfx = this._playfield.gfx;
        this._updateGparms();
        if (this.isHovering && this.isPressed) this.gparms.fillColor = this.options.selectColor;
        else if (this.isHovering && !this.isPressed) this.gparms.fillColor = this.options.hoverColor;
        else this.gparms.fillColor = this.options.fillColor;
        gfx.clipRect(this.x, this.y, this.w, this.h);
        gfx.textRect(this._label, this.x, this.y, this.w, this.h, this.gparms);
        gfx.restore();
    }
    onRelease(): boolean {
        if (this.isHovering) this.go();
        return true;
    }
    go(): boolean {
        window.alert(this.value);
        return true;
    }
}