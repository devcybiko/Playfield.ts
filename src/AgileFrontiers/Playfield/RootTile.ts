import { Tile } from "./Tile";
import { ControllerTile } from "./ControllerTile";
import { Playfield } from "./Playfield";

export class RootTile extends ControllerTile {
    constructor(name: string, playfield: Playfield) {
        super(name, null, 0, 0, 0, 0);
        this._type += ".RootTile";
        this.playfield = playfield;
        this._gfx = playfield.gfx.clone();
        this.w = playfield.gfx.width;
        this.h = playfield.gfx.height;
        this._initTile();
    }

    override get parent(): Tile {
        // this is a "trick". I always return "this" so that default values are returned to caller
        // this prevents me from having to constantly check if (this.parent)
        // if one wants the actual parent, use this._parent (which could potentially be null)
        return this;
    }

    override get X(): number {
        // Special case of root - it's always 0 for parent.X()
        return 0;
    }
    override get Y(): number {
        // Special case of root - it's always 0 for parent.Y()
        return 0;
    }

}
