import { Tile } from "..";
import { ShapeTile } from "./ShapeTile"
import { applyMixins, random } from "../../Utils";
import { Draggable, Selectable } from "../Abilities";

export class _BoxTile extends ShapeTile { };
export interface _BoxTile extends Draggable, Selectable { };
applyMixins(_BoxTile, [Draggable, Selectable]);

export class BoxTile extends _BoxTile {
    _colors = ["red", "orange", "green", "blue", "indigo", "violet"];
    _color = 0;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number) {
        super(name, parent, x, y, w, h);
        this.Draggable();
        this.Selectable();
        this.gparms.fillColor = this._colors[2];

    }
    onGrab() {
        this.toFront();
        return true;
    }
    onClick() {
        this._color = (this._color + 1) % this._colors.length;
        this.warn(this._color);
    }
    draw() {
        // if (this.isSelected) this.gparms.borderColor = "black";
        // else this.gparms.borderColor = "";
        // this.gparms.fillColor = this._colors[this._color];
        this._playfield.gfx.rect(this.x, this.y, this.w, this.h, this.gparms);
    }
    onDrop() {
        this.toFront();
        return true;
    }
    tick() {
    }
}
