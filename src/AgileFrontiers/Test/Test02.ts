import { Playfield } from "../Playfield";
import { CircleTile, BoxTile } from "../Playfield/Shapes"

import {BrowserPlayfieldApp} from "../Browser";

export class TestClass {
    _playfieldApp: BrowserPlayfieldApp;
    _playfield: Playfield;

    constructor() {
        this._playfieldApp = new BrowserPlayfieldApp();
        this._playfield = this._playfieldApp.playfield;
    }
    circleTileTest() {
        let parent = this._playfield.rootTile;
        let circleTile = new CircleTile("circle", parent, parent.w / 2, parent.h / 2, 50, 50);
        let boxTile = new BoxTile("box", parent, 10, 10, 50, 50);
        this._playfield.start();
    }
    run() {
        this.circleTileTest();
    }
}