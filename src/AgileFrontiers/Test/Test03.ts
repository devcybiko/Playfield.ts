import { Playfield } from "../Playfield";
import { CircleTile, BoxTile } from "../Playfield/Shapes"
import {BrowserPlayfieldApp} from "../Browser";

/**
 * Group test
 * - circle has left and right circle chilcren
 * - - left and right circles each have two children
 * They all move as a group
 */
export class TestClass {
    _playfieldApp: BrowserPlayfieldApp;
    _playfield: Playfield;

    constructor() {
        this._playfieldApp = new BrowserPlayfieldApp();
        this._playfield = this._playfieldApp.playfield;
    }
    circleTileTest() {
        let parent = this._playfield.rootTile;
        let lcircle = new CircleTile("left", parent, 175, +75, 50, 50);
        let rcircle = new CircleTile("right", parent, +75, +75, 50, 50);
        lcircle.gfx.gparms.fillColor = "red";
        rcircle.gfx.gparms.fillColor = "red";

        let llcircle = new CircleTile("left", lcircle, 150, 50, 50, 50);
        let lrcircle = new CircleTile("right", lcircle, +50, 50, 50, 50);
        llcircle.gfx.gparms.fillColor = "blue";
        lrcircle.gfx.gparms.fillColor = "blue";

        let rlcircle = new CircleTile("left", rcircle, 150, 50, 50, 50);
        let rrcircle = new CircleTile("right", rcircle, +50, 50, 50, 50);
        rlcircle.gfx.gparms.fillColor = "green";
        rrcircle.gfx.gparms.fillColor = "green";

        this._playfield.start();
    }
    run() {
        this.circleTileTest();
    }
}