import { Playfield, PlayfieldEvent, Splitter, VSplitter, HSplitter } from "../Playfield";
import { CircleTestTile } from "./CircleTestTile";
import { BoxTestTile } from "./BoxTestTile";
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
    circleTestTile() {
        let parent = this._playfield.rootTile;
        let circleTile = new CircleTestTile("circle", parent, parent.w / 2, parent.h / 2, 50, 50);
        this._playfield.start();
    }
    groupTestTile() {
        let parent = this._playfield.rootTile;
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
        let parent = this._playfield.rootTile;
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
    jedTest() {
        let x = 10;
        let y = 10;
        let dy = 25;

        let root = this._playfield.rootTile;
        let splitter = new Splitter("splitter", root);
        let sw = new VSplitter("vsplitter", splitter.sw, 0.5);
        let se = new HSplitter("hsplitter", splitter.se, 0.5);

        let sliders = splitter.ne;
        let buttons = se.north;
        let buttons2 = se.south;
        let radios = sw.east;
        let status = sw.west;
        let checkboxes = splitter.nw;

        // sw
        let textItem1 = new TextItem("textitem-1", status, x, y += dy, 250, 14, "Hello World 1");
        resultLabel = new LabelItem("ResultLabel", status, x, y += dy, 200, 14, "Result Label");

        // south
        y = 10;
        let buttonItem1 = new ButtonItem("ButtonItem1", buttons, x, y += dy, 100, 0);
        buttonItem1.label = "Hello World";
        buttonItem1.value = "Greg Smith";
        let buttonItem2 = new ButtonItem("ButtonItem2", buttons2, x, y += dy, 100, 0, "Button Item 2");
        let buttonItem3 = new ButtonItem("ButtonItem3", buttons2, x, y += dy, 100, 0, "Button Item 3");
        buttonItem1.go = printGo.bind(buttonItem1);
        buttonItem2.go = printGo.bind(buttonItem2);
        buttonItem3.go = printGo.bind(buttonItem3);


        // east

        let buttonGroup = new GroupItem("ButtonGroup", radios, 10, 10, 0, 0, "Radio Buttons");
        x = 0;
        y = 0;
        let radioItem1 = new RadioItem("RadioItem", buttonGroup, x, y, 0, 0, "R1", "Radio 1");
        let radioItem2 = new RadioItem("RadioItem", buttonGroup, x, y += dy, 0, 0, "R2", "Radio 2");
        let radioItem3 = new RadioItem("RadioItem", buttonGroup, x, y += dy, 0, 0, "R3", "Radio 3");
        radioItem1.go = printValue.bind(radioItem1);
        radioItem2.go = printValue.bind(radioItem2);
        radioItem3.go = printValue.bind(radioItem3);

        // west
        let buttonGroup2 = new GroupItem("ButtonGroup2", checkboxes, 10, 10, 0, 0, "CheckBoxes");
        x = 10;
        y = 10;
        let checkbox1 = new CheckboxItem("CheckboxItem1", buttonGroup2, x, y, 0, 0, "#1", "Number 1");
        let checkbox2 = new CheckboxItem("CheckboxItem2", buttonGroup2, x, y += dy, 0, 0, "#2", "Number 2");
        let checkbox3 = new CheckboxItem("CheckboxItem3", buttonGroup2, x, y += dy, 0, 0, "#3", "Number 3");
        checkbox1.go = printValue.bind(checkbox1);
        checkbox2.go = printValue.bind(checkbox2);
        checkbox3.go = printValue.bind(checkbox3);

        // north
        slider = new Slider("xxx", sliders, 30, 20, 200, 200);
        slider.onChange = updateCursor.bind(slider);

        hslider = new Slider("hslider", sliders, 20, sliders.h - 20, sliders.w - 20 - 1, 20);
        hslider.vslide = false;
        hslider.onChange = showValue.bind(hslider);

        vslider = new Slider("vslider", sliders, 1, 1, 20, sliders.h - 20 - 1);
        vslider.hslide = false;
        vslider.onChange = showValue.bind(vslider);

        this._playfield.rootTile.printTree();
        this._playfield.start(0);
    }
}