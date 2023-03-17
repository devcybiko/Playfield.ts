import { Playfield, } from "../Playfield";
import { BrowserPlayfieldApp } from "../Browser";

export class TestClass {
    _playfieldApp: BrowserPlayfieldApp;
    _playfield: Playfield;

    constructor() {
        this._playfieldApp = new BrowserPlayfieldApp();
        this._playfield = this._playfieldApp.playfield;
    }
    run() {
        this._playfield.gfx.rect(10, 10, 100, 100);
    }
}