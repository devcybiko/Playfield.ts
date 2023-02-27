import {applyMixins} from "../Utils";
import {Tile} from "./Tile";

export interface Draggable {}
export class Draggable {
    _draggable: Tile;
    Draggable(draggable: Tile) {
        this._draggable = draggable;
    }

    grab(): boolean {
        console.log("grab", this._draggable.name);
        return true;
    }
    drag(dx: number, dy: number): boolean {
        this._draggable.rmove(-dx, -dy);
        return true;
    }
    drop(): boolean {
        return true;
    }
}
