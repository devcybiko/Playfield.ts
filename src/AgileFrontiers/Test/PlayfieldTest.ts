import {Playfield, Tile} from "../Playfield";
import {CircleTile} from "./CircleTile";

export class PlayfieldTest {
    _playfield: Playfield;
    constructor() {
        this._playfield = new Playfield("#my_canvas")
    }
    boxTest() {
        this._playfield._gfx.rect(10,10,100,100, this._playfield.gparms);
    }
    tileTest() {
        let parent = this._playfield.tile;
        let circleTile = new CircleTile("_root", parent, parent.rect.w/2, parent.rect.h/2, 50, 50);
        this._playfield.redraw();
    }
}