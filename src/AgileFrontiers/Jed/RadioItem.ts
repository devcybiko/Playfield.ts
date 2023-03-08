import { Item } from "./Item";
import { Tile } from "../Playfield";
import { applyMixins } from "../Playfield/Utils";
import { Draggable, Hoverable, Selectable } from "../Playfield/Abilities";
import { GroupItem } from "./GroupItem";

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
        if (this.isSelected) this.gparms.fillColor = this.options.selectColor;
        else if (this.isHovering) this.gparms.fillColor = this.options.hoverColor;
        else this.gparms.fillColor = "white";
        gfx.clipRect(this.x, this.y, this.w, this.h, this.gparms);
        gfx.textRect(this._label, this.x, this.y, this.w, this.h, this.gparms);
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