import { Playfield, PlayfieldEvent, Splitter, VSplitter, HSplitter } from "../Playfield";
import { random, int } from "../Utils";
import { CircleTile, BoxTile } from "../Playfield/Shapes";
import { Text, Button, Radio, Label, Group, Checkbox, Slider} from "../Jed";
import { BrowserPlayfieldApp, BrowserGfx, BrowserEventPump } from "../Browser";
import { EventQueue } from "../Playfield";



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