import { Tile, hasTile, Playfield, hasPlayfield } from "..";
import { ShapeTile } from "./ShapeTile"
import {Draggable} from "../Draggable";


export class BoxTile extends ShapeTile implements Draggable {
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number) {
        super(name, parent, x, y, w, h);
    }
    grab(): boolean {
        console.log("grab", this.name);
        return true;
    }
    drag(dx: number, dy: number): boolean {
        this.rmove(-dx, -dy);
        return true;
    }
    drop(): boolean {
        return true;
    }
    draw() {
        this._playfield.gfx.rect(this.x, this.y, this.w, this.h, this.gparms);
    }
}
