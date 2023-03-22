import { Playfield } from "../Playfield";
import { CircleTile, BoxTile } from "../Playfield/Shapes"
import { BrowserPlayfieldApp } from "../Browser";

/**
 * Group test
 * - circle has left and right circle chilcren
 * - - left and right circles each have two children
 * They all move as a group
 */
import { random, int } from "../Utils";

export class TestClass {
    _playfieldApp: BrowserPlayfieldApp;
    _playfield: Playfield;

    constructor() {
        this._playfieldApp = new BrowserPlayfieldApp();
        this._playfield = this._playfieldApp.playfield;
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
    run() {
        this.jedTest();
    }
}