import { Playfield } from "./Playfield";
import { Tile } from "./Tile";
import { Resizable, Dispatcher, Dragger, Selecter, Clicker, Presser, Editer, Hoverer } from "./Abilities";
import { applyMixins, Logger } from "../Utils";
import { PlayfieldEvent } from "./PlayfieldEvent";

export class _RootTile extends Tile { };
export interface _RootTile extends Resizable, Dispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editer, Hoverer { };
applyMixins(_RootTile, [Resizable, Dispatcher, Logger, Clicker, Presser, Selecter, Dragger, Editer, Hoverer]);

export class RootTile extends _RootTile {
    constructor(name: string, parent: Tile, x0: number, y0: number, x1: number, y1: number) {
        super(name, parent, x0, y0, x1, y1);
    }

    // --- Overrides --- //

    draw() {
        this.gfx.clipRect(this.X, this.Y, this.W, this.H);
        this.gfx.rect(this.X, this.Y, this.W, this.H);
        this.drawChildren();
        this.gfx.restore();
    }
}
