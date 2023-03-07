import { Item } from "./Item";
import { Tile } from "../Playfield";
import { applyMixins } from "../Playfield/Utils";
import { Draggable, Clickable, Hoverable } from "../Playfield/Abilities";

export class _ToggleItem extends Item { };
export interface _ToggleItem extends Draggable, Clickable, Hoverable { };
applyMixins(_ToggleItem, [Draggable, Clickable, Hoverable]);

export class ToggleItem extends _ToggleItem {
    private _label = "";
    private _isOn = false;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, value = "", label = "") {
        super(name, parent, x, y, w, h, value || name);
        this.Draggable();
        this.Clickable();
        this.Logger();
        this.isDraggable = false;
        this._label = label || value || name;
    }
    
    // --- Public Methods --- //

    go(): boolean {
        console.log(this.value);
        return true;
    }

    // --- Overrides --- //

    draw() {
        let gfx = this.playfield.gfx;
        this._updateGparms();
        if (this.isOn) this.gparms.fillColor = this.options.selectColor;
        else if (this.isHovering) this.gparms.fillColor = this.options.hoverColor;
        else this.gparms.fillColor = "white";
        gfx.clipRect(this.x, this.y, this.w, this.h);
        gfx.textRect(this._label, this.x, this.y, this.w, this.h, this.gparms);
        gfx.restore();
    }

    // --- onAcations --- //

    onClick(): boolean {
        this.isOn = !this.isOn;
        this.go();
        return true;
    }

    // --- Accessors --- //

    public get label() {
        return this._label;
    }
    public set label(value) {
        this._label = value;
    }
    public get isOn() {
        return this._isOn;
    }
    public set isOn(value) {
        this._isOn = value;
    }
    public get value(): string {
        if (this.isOn) return super.value;
        else return "";
    }
    public set value(s: string) {
        super.value  = s;
    }
}