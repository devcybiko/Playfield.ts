import { Tile } from "..";
import { ShapeTile } from "./ShapeTile"
import { applyMixins, random } from "../../Utils";
import { Draggable, Selectable, Clickable } from "../Abilities";

export class _BoxTile extends ShapeTile { };
export interface _BoxTile extends Draggable, Selectable, Clickable { };
applyMixins(_BoxTile, [Draggable, Selectable, Clickable]);

export class BoxTile extends _BoxTile {
    _colors = ["red", "orange", "green", "blue", "indigo", "violet"];
    _color = 0;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number) {
        super(name, parent, x, y, w, h);
        this.Draggable();
        this.Selectable();
        this.Clickable();
        this.gfx.gparms.fillColor = this._colors[2];

    }

    // --- Overrides ---//

    draw() {
        if (this.isSelected) this.gfx.gparms.borderColor = "black";
        else this.gfx.gparms.borderColor = "";
        this.gfx.gparms.fillColor = this._colors[this._color];
        this.playfield.gfx.rect(this.x, this.y, this.w, this.h);
    }

    // --- onActions --- //

    onGrab(dx: number, dy: number, event: any) {
        this.toFront();
        super.onGrab(dx, dy, event);
        return true;
    }
    onClick() {
        this._color = (this._color + 1) % this._colors.length;
        this.warn(this._color);
    }
    onDrop(event: any) {
        this.toFront();
        return super.onDrop(event);
    }
    onTick() {
        return true;
    }
}
