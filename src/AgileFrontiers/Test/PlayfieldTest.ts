import { Playfield } from "../Playfield";
import { CircleTestTile } from "./CircleTestTile";
import { BoxTestTile } from "./BoxTestTile";
import { random } from "../Playfield/Utils";
import { CircleTile, BoxTile } from "../Playfield/Shapes";
import { TextItem, ButtonItem, RadioItem, LabelItem, GroupItem, CheckboxItem } from "../Jed";
import { BrowserPlayfieldApp, BrowserGfx, BrowserEventPump } from "../Browser";
import { EventQueue } from "../Playfield";
import { GfxParms } from "../Playfield/Graphics";

function printGo() {
    console.log("GO!", this.name);
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
        this._playfield.gfx.rect(10, 10, 100, 100, this._playfield.gparms);
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
        lcircle.gparms.fillColor = "red";
        rcircle.gparms.fillColor = "red";

        let llcircle = new CircleTestTile("left", lcircle, -50, 50, 50, 50);
        let lrcircle = new CircleTestTile("right", lcircle, +50, 50, 50, 50);
        llcircle.gparms.fillColor = "blue";
        lrcircle.gparms.fillColor = "blue";

        let rlcircle = new CircleTestTile("left", rcircle, -50, 50, 50, 50);
        let rrcircle = new CircleTestTile("right", rcircle, +50, 50, 50, 50);
        rlcircle.gparms.fillColor = "green";
        rrcircle.gparms.fillColor = "green";

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
                // circle.gparms.fillColor = null;
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
        let x = 110;
        let y = 10;
        let dy = 25;
        
        let parent = this._playfield.tile;
        let textGroup1 = new GroupItem("G1", parent, 10, y, 0, 0, "Group 1");
        let textItem1 = new TextItem("textitem-1", textGroup1, 110, 0, 250, 14, "Hello World 1");
        let labelItem1 = new LabelItem("Label-1", textGroup1, 0, 0, -110, 14, "Label-1: ");

        let textGroup2 = new GroupItem("G2", textGroup1, 0, 25, 0, 0, "Group 1");
        let textItem2 = new TextItem("textitem-2", textGroup2, 110, 0, 100, 14, "Hello World 2");
        let labelItem2 = new LabelItem("Label-2", textGroup2, 0, 0, -110, 14, "Label-2: ");
        textGroup2.isBoxed = false;
        textGroup2.xMargin = 0;
        textGroup2.yMargin = 0;
        textGroup2.updateWidthHeight();
        textGroup1.updateWidthHeight();

        let textItem3 = new TextItem("textitem-3", parent, x, y += textGroup2.h + 10, 100, 14, "Hello World 3");
        let textItem4 = new TextItem("textitem-4", parent, x, y += dy, 100, 14, "Hello World 4 ");
        let buttonItem1 = new ButtonItem("ButtonItem1", parent, x, y += dy, 45, 14);
        buttonItem1.label = "Hello World";
        buttonItem1.value = "Greg Smith";
        let buttonItem2 = new ButtonItem("ButtonItem2", parent, x, y += dy, 45, 14, "Button Item 2");
        let buttonItem3 = new ButtonItem("ButtonItem3", parent, x, y += dy, 45, 14, "Button Item 3");

        buttonItem1.go = printGo.bind(buttonItem1);
        buttonItem2.go = printGo.bind(buttonItem2);
        buttonItem3.go = printGo.bind(buttonItem3);

        let radioItem0 = new RadioItem("RadioItem-0", parent, x, y += dy, 100, 14);
        let checkboxItem = new CheckboxItem("CheckboxItem-0", parent, x, y += dy, 100, 14);
        let resultLabel = labelItem1 = new LabelItem("ResultLabel", parent, x, y += dy, 100, 14, "Result Label");

        let buttonGroup = new GroupItem("ButtonGroup", parent, x, y+=50, 0, 0, "Radio Buttons");
        x = 0;
        y = 0;
        let radioItem1 = new RadioItem("RadioItem", buttonGroup, x, y, 45, 14,"R1", "Radio 1");
        let radioItem2 = new RadioItem("RadioItem", buttonGroup, x, y += dy, 45, 14, "R2", "Radio 2");
        let radioItem3 = new RadioItem("RadioItem", buttonGroup, x, y += dy, 45, 14, "R3", "Radio 3");

        let buttonGroup2 = new GroupItem("ButtonGroup2", parent, 10, y+=50, 0, 0, "CheckBoxes");
        x = 10;
        y = 0;
        let checkbox1 = new CheckboxItem("CheckboxItem1", buttonGroup2, x, y, 100, 14, "#1", "Number 1");
        let checkbox2 = new CheckboxItem("CheckboxItem2", buttonGroup2, x, y += dy, 50, 14, "#2", "Number 2");
        let checkbox3 = new CheckboxItem("CheckboxItem3", buttonGroup2, x, y += dy, 75, 14, "#3", "Number 3");
        // buttonGroup2.isBoxed = false;


        (this._playfield as any).resultLabel = resultLabel;
        this._playfield.start(0);
    }
}