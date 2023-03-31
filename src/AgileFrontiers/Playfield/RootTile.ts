import { Playfield } from "./Playfield";
import { Tile } from "./Tile";
import { Resizable, Dispatcher, Dragger, Selecter, Clicker, Presser, Editer, Hoverer } from "./Abilities";
import { applyMixins, Dimensions, Logger } from "../Utils";
import { PlayfieldEvent } from "./PlayfieldEvent";

export class _RootTile extends Tile { };
export interface _RootTile extends Resizable, Dispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editer, Hoverer { };
applyMixins(_RootTile, [Resizable, Dispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editer, Hoverer]);

export class RootTile extends _RootTile {
    constructor(name: string, parent: Tile, x0: number, y0: number, w: number, h: number) {
        super(name, parent, x0, y0, w, h);
    }

    // -- static members --- //
    public static cast(obj: any): RootTile {
        return obj as RootTile;
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
