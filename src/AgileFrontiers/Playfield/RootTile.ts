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
    }

    // -- static members --- //
    public static cast(obj: any): RootTile {
        return obj as RootTile;
    }

    get parent(): Tile {
        // this is a "trick". I always return "this" so that default values are returned to caller
        // this prevents me from having to constantly check if (this.parent)
        // if one wants the actual parent, use this._parent (which could potentially be null)
        return this;
    }
    get X(): number {
        return this._x;
    }
    get Y(): number {
        return this._y;
    }
}
