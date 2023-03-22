import { Playfield, PlayfieldEvent, Splitter, VSplitter, HSplitter } from "../Playfield";
import { random, int } from "../Utils";
import { CircleTile, BoxTile } from "../Playfield/Shapes";
import { TextItem, ButtonItem, RadioItem, LabelItem, GroupItem, CheckboxItem, Slider} from "../Jed";
import { BrowserPlayfieldApp, BrowserGfx, BrowserEventPump } from "../Browser";
import { EventQueue } from "../Playfield";

let resultLabel = null as any;
let slider = null as any;
let hslider = null as any;
let vslider = null as any;

function updateCursor(rx: number, ry: number, pfEvent: PlayfieldEvent) {
    hslider.cursorSize(rx, 18);
    vslider.cursorSize(0, ry);
    slider.text = `(${int(slider.rx * 100)},${int(slider.ry*100)})`;
    hslider.text = `${int(hslider.rx * 100)}`;
}

function showValue(rx: number, ry: number, pfEvent: PlayfieldEvent) {
    resultLabel.value = this.name + ": " + int(rx * 100) + "," + int(ry * 100);
    hslider.text = `${int(hslider.rx * 100)}`;
}

function printGo() {
    resultLabel.value = "Result Label: " + this.name;
}

function printValue() {
    (this.parent as unknown as GroupItem).label = (this.parent as unknown as GroupItem).value;
}

export class PlayfieldTest {
    _playfieldApp: BrowserPlayfieldApp;
    _playfield: Playfield;
    _gfx: BrowserGfx;
    _eventQueue: EventQueue;
    _canvasEventPump: BrowserEventPump;

    constructor() {
        this._playfieldApp = new BrowserPlayfieldApp();
        this._playfield = this._playfieldApp.playfield;

    }
    boxTest() {
        this._playfield.gfx.rect(10, 10, 100, 100);
    }
    tenthousandTestTile() {
    }
    shapeTest() {
        let parent = this._playfield.rootTile;
        // for (let i=0; i<10; i++) {
        //     for(let j=0; j<1000; j++) {
        //         let boxTile = new BoxTile("box", parent, random(0,1000), random(0,1000), 50, 50);
        //     }
        // }
        let boxTile = new BoxTile("box", parent, random(0, 1000), random(0, 1000), 50, 50);
        let circleTile = new CircleTile("circle", parent, 50, 50, 50, 50);
        let boxTile2 = new BoxTile("box", parent, 200, 200, 50, 50);
        let fps = 16;
        this._playfield.start(Math.floor(1 / fps * 1000));
    }
}