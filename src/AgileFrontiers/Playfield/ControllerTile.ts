import { Playfield } from "./Playfield";
import { Tile } from "./Tile";
import { Resizable, DragController, Selecter, Clicker, Presser, Editer, Hoverer } from "./Abilities";
import { applyMixins, Dimensions, Logger } from "../Utils";
import { PlayfieldEvent } from "./PlayfieldEvent";

export class _ControllerTile extends Tile { };
export interface _ControllerTile extends Resizable, Logger, Clicker, Presser, Selecter, DragController, Editer, Hoverer { };
applyMixins(_ControllerTile, [Resizable, Logger, Clicker, Presser, Selecter, DragController, Editer, Hoverer]);

export class ControllerTile extends _ControllerTile {
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number) {
        super(name, parent, x, y, w, h);
        this._type = "ControllerTile";
    }

    // --- Overrides --- //

    override draw(enable = true): Dimensions {
        this.updateGparms(enable);
        this.gfx.clipRect(this.X, this.Y, this.W, this.H);
        this.gfx.rect(this.X, this.Y, this.W, this.H);
        this.drawChildren(enable);
        this.gfx.restore();
        return this.dimensions;
    }
}
