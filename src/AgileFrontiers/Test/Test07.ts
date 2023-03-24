import { Playfield, PlayfieldEvent, Tile, Splitter } from "../Playfield";
import { BrowserPlayfieldApp } from "../Browser";
import { Text, Label, Button, Slider, Checkbox, Group, Radio } from "../Jed";
import { int, random } from "../Utils";

/**
 * Jed Test with Splitters and Relative Positioning
 * Setting up N/S and E/W splitters only
 */

let resultLabel = null as any;
let bigSlider = null as any;
let hslider = null as any;
let vslider = null as any;

export class TestClass {
    _playfieldApp: BrowserPlayfieldApp;
    _playfield: Playfield;

    constructor() {
        this._playfieldApp = new BrowserPlayfieldApp("#playfield", 1.0);
        this._playfield = this._playfieldApp.playfield;
    }
    jedTest() {
        function fourLabels(name: string, parent: Splitter) {
            new Label(name + ".NE", parent.ne, 10, 10, 0, 0, name + ".NE");
            new Label(name + ".NW", parent.nw, 10, 10, 0, 0, name + ".NW");
            new Label(name + ".SE", parent.se, 10, 10, 0, 0, name + ".SE");
            new Label(name + ".SW", parent.sw, 10, 10, 0, 0, name + ".SW");
        }
        function makeSplitter(parent: Tile) {
            let splitter = new Splitter("splitter", parent, 0.5, 0.5);
            let splitterNE = new Splitter("splitterNE", splitter.ne, 0.5, 0);
            let splitterNW = new Splitter("splitterNw", splitter.nw, 0, 0.5);
            let splitterSE = new Splitter("splitterSE", splitter.se, 1, 0.5);
            let splitterSW = new Splitter("splitterSW", splitter.sw, 0.5, 1);
            fourLabels("label.NE", splitterNE);
            fourLabels("label.NW", splitterNW);
            fourLabels("label.SE", splitterSE);
            fourLabels("label.SW", splitterSW);
            return;
        }
        let root = this._playfield.rootTile;
        makeSplitter(root);

        this._playfield.rootTile.printTree();
        this._playfield.start(0);
    }
    run() {
        this.jedTest();
    }
}