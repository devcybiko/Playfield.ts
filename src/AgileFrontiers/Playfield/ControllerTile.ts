import { Tile } from "./Tile";
import { SwipeController, Resizable, DragController, SelectController, ClickController, PressController, EditController, HoverController } from "./Abilities";
import { applyMixins, Dimensions, Logger } from "../Utils";

export class _ControllerTile extends Tile { };
export interface _ControllerTile extends SwipeController, Resizable, Logger, ClickController, PressController, SelectController, DragController, EditController, HoverController { };
applyMixins(_ControllerTile, [ SwipeController, Resizable, Logger, ClickController, PressController, SelectController, DragController, EditController, HoverController]);

export class ControllerTile extends _ControllerTile {
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number) {
        super(name, parent, x, y, w, h);
        this._type = "ControllerTile";
    }

    // --- Overrides --- //

    override draw(enable = true): Dimensions {
        this.updateGparms(enable);
        this.gfx.clipRect(this.X, this.Y, this.W, this.H);
        // this.gfx.rect(this.X, this.Y, this.W, this.H);
        this.drawChildren(enable);
        this.gfx.restore();
        return this.dimensions;
    }
}
