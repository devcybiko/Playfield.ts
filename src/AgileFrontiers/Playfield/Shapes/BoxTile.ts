import { Tile } from "..";
import { ShapeTile } from "./ShapeTile"
import { applyMixins, random, int, Dimensions } from "../../Utils";
import { Draggable, Selectable, Clickable } from "../Abilities";

export class _BoxTile extends ShapeTile { };
export interface _BoxTile extends Draggable, Selectable, Clickable { };
applyMixins(_BoxTile, [Draggable, Selectable, Clickable]);

export class BoxTile extends _BoxTile {
    _colors = ["","red", "orange", "green", "blue", "indigo", "violet"];
    _color = 0;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number) {
        super(name, parent, x, y, w, h);
        this._color = int(random(0, this._colors.length));

    }

    // --- Overrides ---//

    override draw(enable = true): Dimensions {
        if (this.isSelected) this.gfx.gparms.borderColor = "black";
        else this.gfx.gparms.borderColor = "";
        this.gfx.gparms.fillColor = ""; this._colors[this._color];
        this.gfx.rect(this.x, this.y, this.w, this.h);
        return super.draw(enable);
    }

    // --- onActions --- //

    onGrab(dx: number, dy: number, event: any): boolean {
        this.toFront();
        super.onGrab(dx, dy, event);
        return true;
    }
    onClick(): void {
        this._color = (this._color + 1) % this._colors.length;
        this.warn(this._color);
    }
    onDrop(event: any): void {
        this.toFront();
        super.onDrop(event);
    }
    onTick(): void {
    }
}
