import { Playfield, HSplit, VSplit, Slider } from "../Playfield";
import { CircleTestTile } from "./CircleTestTile";
import { BoxTestTile } from "./BoxTestTile";
import { random, int } from "../Playfield/Utils";
import { CircleTile, BoxTile } from "../Playfield/Shapes";
import { TextItem, ButtonItem, RadioItem, LabelItem, GroupItem, CheckboxItem } from "../Jed";
import { BrowserPlayfieldApp, BrowserGfx, BrowserEventPump } from "../Browser";
import { EventQueue } from "../Playfield";
import { GfxParms } from "../Playfield/Graphics";

let resultLabel = null as any;

function showValue(value: number) {
    resultLabel.value = this.name + ": " + int(value);
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
    circleTestTile() {
        let parent = this._playfield.tile;
        let circleTile = new CircleTestTile("circle", parent, parent.w / 2, parent.h / 2, 50, 50);
        this._playfield.start();
    }
    groupTestTile() {
        let parent = this._playfield.tile;
        let lcircle = new CircleTestTile("left", parent, -75, +75, 50);
        let rcircle = new CircleTestTile("right", parent, +75, +75, 50);
        lcircle.gfx.gparms.fillColor = "red";
        rcircle.gfx.gparms.fillColor = "red";

        let llcircle = new CircleTestTile("left", lcircle, -50, 50, 50, 50);
        let lrcircle = new CircleTestTile("right", lcircle, +50, 50, 50, 50);
        llcircle.gfx.gparms.fillColor = "blue";
        lrcircle.gfx.gparms.fillColor = "blue";

        let rlcircle = new CircleTestTile("left", rcircle, -50, 50, 50, 50);
        let rrcircle = new CircleTestTile("right", rcircle, +50, 50, 50, 50);
        rlcircle.gfx.gparms.fillColor = "green";
        rrcircle.gfx.gparms.fillColor = "green";

        this._playfield.start();
    }
    tenthousandTestTile() {
        let parent = this._playfield.tile;
        let max = 100;
        for (let i = 0; i < max; i++) {
            for (let j = 0; j < 1000; j++) {
                let x = random(0, this._playfield.w);
                let y = random(0, this._playfield.h);
                let r = random(10, 50);
                let DX = random(-10, 10);
                let DY = random(-10, 10);
                let circle = new BoxTestTile("circle", parent, x, y, r, r);
                // circle.gfx.gparms.fillColor = null;
                (circle as any).DX = DX;
                (circle as any).DY = DY;
            }
        }
        max *= 1000;
        // let fps = 1;
        // let delay = Math.floor(1000/fps);
        let delay = 0;
        let fps = 1000 / delay;
        this._playfield.start(delay);
        // note: processing 10,000 Circles stressed the app at 55 FPS
        // note: processing 10,000 Boxes stressed the app at 142 FPS
        // note: processing 10,000 Empty Boxes stressed the app at 250 FPS

        // note: at 30FPS, about 18,500 circles could be processed
        // note: at 30FPS, about 20,000 boxes could be processed
        // note: at 30FPS, about 45,000 empty boxes could be processed

        // note: at 60FPS, about 8700 circles could be processed
        // note: at 60FPS, about 20,000 boxes could be processed
        // note: at 60FPS, about 28,000 empty boxes could be processed

        // 5,000,000 empty boxes per second
        // 2,000,000 filled boxes per second
        // 1,428,571 empty circles per second
        // 714,000 filled circles per second

        // 1 fps: 16ms/62.5fps
        // 2 fps: 16ms/62.5fps
        // 4 fps: 16ms/62.5fps
        // 8 fps: 13ms/77fps
        // 15 fps: 7ms/143fps
    }
    shapeTest() {
        let parent = this._playfield.tile;
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
    jedTest() {
        let x = 10;
        let y = 10;
        let dy = 25;

        let root = this._playfield.tile;
        let vsplit = new VSplit("vsplit", root, 0.5);
        let veast = vsplit.east;
        let vwest = vsplit.west;

        let hsplit = new HSplit("hsplit", veast, 0.5);
        let north = hsplit.north;
        let south = hsplit.south;

        let zsplit = new HSplit("hsplit", vwest, 0.5);
        let east = zsplit.north;
        let west = zsplit.south;

        // north
        let textItem1 = new TextItem("textitem-1", north, x, y += dy, 250, 14, "Hello World 1");
        resultLabel = new LabelItem("ResultLabel", north, x, y += dy, 200, 14, "Result Label");

        // south
        y = 10;
        let buttonItem1 = new ButtonItem("ButtonItem1", south, x, y += dy, 100, 0);
        buttonItem1.label = "Hello World";
        buttonItem1.value = "Greg Smith";
        let buttonItem2 = new ButtonItem("ButtonItem2", south, x, y += dy, 100, 0, "Button Item 2");
        let buttonItem3 = new ButtonItem("ButtonItem3", south, x, y += dy, 100, 0, "Button Item 3");
        buttonItem1.go = printGo.bind(buttonItem1);
        buttonItem2.go = printGo.bind(buttonItem2);
        buttonItem3.go = printGo.bind(buttonItem3);


        // east

        let buttonGroup = new GroupItem("ButtonGroup", east, 10, 10, 0, 0, "Radio Buttons");
        x = 0;
        y = 0;
        let radioItem1 = new RadioItem("RadioItem", buttonGroup, x, y, 0, 0, "R1", "Radio 1");
        let radioItem2 = new RadioItem("RadioItem", buttonGroup, x, y += dy, 0, 0, "R2", "Radio 2");
        let radioItem3 = new RadioItem("RadioItem", buttonGroup, x, y += dy, 0, 0, "R3", "Radio 3");
        radioItem1.go = printValue.bind(radioItem1);
        radioItem2.go = printValue.bind(radioItem2);
        radioItem3.go = printValue.bind(radioItem3);

        // west
        let buttonGroup2 = new GroupItem("ButtonGroup2", west, 10, 10, 0, 0, "CheckBoxes");
        x = 10;
        y = 0;
        let checkbox1 = new CheckboxItem("CheckboxItem1", buttonGroup2, x, y, 0, 0, "#1", "Number 1");
        let checkbox2 = new CheckboxItem("CheckboxItem2", buttonGroup2, x, y += dy, 0, 0, "#2", "Number 2");
        let checkbox3 = new CheckboxItem("CheckboxItem3", buttonGroup2, x, y += dy, 0, 0, "#3", "Number 3");
        checkbox1.go = printValue.bind(checkbox1);
        checkbox2.go = printValue.bind(checkbox2);
        checkbox3.go = printValue.bind(checkbox3);

        let hslider = new Slider("hslider", north, 20, north.h - 20, north.w - 20 - 1, 20, false, 0, 100, 50);
        let vslider = new Slider("vslider", north, 1, 1, 20, north.h - 20 - 1, true, 0, 100, 50);
        hslider.onChange = showValue.bind(hslider);
        vslider.onChange = showValue.bind(vslider);

        this._playfield.start(0);
    }
}