import { Item } from "./Item";
import { Tile } from "../Playfield";
import { applyMixins } from "../Playfield/Utils";
import { Draggable, Hoverable, Clickable } from "../Playfield/Abilities";
import { GroupItem } from "./GroupItem";

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
    }
    
    // --- Public Methods --- //

    go(): boolean {
        (this.parent as unknown as GroupItem).label = (this.parent as unknown as GroupItem).value;
        return false;
    }

    // --- Overrides --- //

    draw() {
        let gfx = this.playfield.gfx;
        this._updateGparms();
        if (this.isChecked) this.gparms.fillColor = this.options.selectColor;
        else if (this.isHovering) this.gparms.fillColor = this.options.hoverColor;
        else this.gparms.fillColor = "white";
        gfx.clipRect(this.x, this.y, this.w, this.h, this.gparms);
        gfx.textRect(this._label, this.x, this.y, this.w, this.h, this.gparms);
        gfx.restore();
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