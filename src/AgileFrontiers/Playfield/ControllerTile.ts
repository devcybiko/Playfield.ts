import { Playfield } from "./Playfield";
import { Tile } from "./Tile";
import { Resizable, Dispatcher, Dragger, Selecter, Clicker, Presser, Editer, Hoverer } from "./Abilities";
import { applyMixins, Dimensions, Logger } from "../Utils";
import { PlayfieldEvent } from "./PlayfieldEvent";

export class _ControllerTile extends Tile { };
export interface _ControllerTile extends Resizable, Dispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editer, Hoverer { };
applyMixins(_ControllerTile, [Resizable, Dispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editer, Hoverer]);

export class ControllerTile extends _ControllerTile {
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number) {
        super(name, parent, x, y, w, h);
        this._type = "ControllerTile";
    }

    // -- static members --- //
    public static cast(obj: any): ControllerTile {
        return obj as ControllerTile;
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

    onEvent(pfEvent: PlayfieldEvent) {
        this.dispatchEventToChildren(pfEvent);
    }
}
