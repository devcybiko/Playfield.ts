import { Playfield, PlayfieldEvent, Tile } from "../Playfield";
import { BrowserPlayfieldApp } from "../Browser";
import { Splitter, VSplitter, HSplitter } from "../Playfield";
import { Text, Label, Button, Slider, Checkbox, Group, Radio } from "../Jed";
import { int, random } from "../Utils";

/**
 * Jed Test
 */

let resultLabel = null as any;
let bigSlider = null as any;
let hslider = null as any;
let vslider = null as any;


export class TestClass {
    _playfieldApp: BrowserPlayfieldApp;
    _playfield: Playfield;

    constructor() {
        this._playfieldApp = new BrowserPlayfieldApp();
        this._playfield = this._playfieldApp.playfield;
    }
    jedTest() {
        function makeSliders(parent: Tile, x=10, y=10, dy=25) {
            function updateCursor(rx: number, ry: number, pfEvent: PlayfieldEvent) {
                hslider.cursorSize(rx, 18);
                vslider.cursorSize(18, ry);
                bigSlider.text = `(${int(bigSlider.rx * 100)},${int(bigSlider.ry * 100)})`;
                hslider.text = `${int(hslider.rx * 100)}`;
                vslider.text = `${int(vslider.ry * 100)}`;
            }
            function showValue(rx: number, ry: number, pfEvent: PlayfieldEvent) {
                resultLabel.value = this.name + ": " + int(rx * 100) + "," + int(ry * 100);
                hslider.text = `${int(hslider.rx * 100)}`;
            }

            let sliderW = 30;
            bigSlider = new Slider("bigSlider", parent, x + sliderW* 2, y, 200, 200);
            bigSlider.onChange = updateCursor.bind(bigSlider);

            hslider = new Slider("hslider", parent, x + sliderW, parent.h - sliderW, parent.w - x -sliderW - 1, sliderW);
            hslider.vslide = false;
            hslider.onChange = showValue.bind(hslider);

            vslider = new Slider("vslider", parent, x, y, sliderW, y - sliderW - 1);
            vslider.hslide = false;
            vslider.onChange = showValue.bind(vslider);
            return { bigSlider, hslider, vslider };
        }

        function makeRadioButtons(parent: Tile, x=10, y=10, dy=25) {
            function printValue() {
                resultLabel.value = ("Radio Value: " + this.name);
            }
            // let buttonGroup = new Group("ButtonGroup", parent, 10, 10, 0, 0, "Radio Buttons");
            let buttonGroup = parent;
            let radio1 = new Radio("Radio-1", buttonGroup, x, y, 0, 0, "R1", "Radio 1");
            let radio2 = new Radio("Radio-2", buttonGroup, x, y += dy, 0, 0, "R2", "Radio 2");
            let radio3 = new Radio("Radio-3", buttonGroup, x, y += dy, 0, 0, "R3", "Radio 3");
            radio1.go = printValue.bind(radio1);
            radio2.go = printValue.bind(radio2);
            radio3.go = printValue.bind(radio3);
            return buttonGroup;
        }
        function makeOneButton(parent: Tile, x=10, y=10, dy=25) {
            function printGo() {
                resultLabel.value = ("Button Value: " + this.name);
            }
            let button1 = new Button("Button1", parent, x, y, 100, 0);
            button1.label = "Hello World";
            button1.value = "Greg Smith";
            button1.isDraggable = false;

            button1.go = printGo.bind(button1);
        }
        function makeTwoButtons(parent: Tile, x=10, y=10, dy=25) {
            function printGo() {
                resultLabel.value = ("Button Value: " + this.name);
            }
            let button2 = new Button("Button2", parent, x, y, 100, 0, "Button  2");
            let button3 = new Button("Button3", parent, x, y += dy, 100, 0, "Button  3");
            let button4 = new Button("Button4", parent, x, y += dy, 100, 0, "Button  4");
            button2.go = printGo.bind(button2);
            button3.go = printGo.bind(button3);
            button4.go = printGo.bind(button4);
        }
        function makeStatus(parent: Tile, x=10, y=10, dy=25) {
            let text1 = new Text("textitem-1", parent, x, y, 250, 14, "Hello World 1");
            resultLabel = new Label("ResultLabel", parent, x, y += dy, 200, 14, "Result Value");
        }
        function makeCheckboxes(parent: Tile, x=10, y=10, dy=25) {
            function printValue() {
                resultLabel.value = ("Checkbox Value: " + this.name, this.value);
            }
            let buttonGroup2 = parent;
            // let buttonGroup2 = new Group("ButtonGroup2", parent, 10, 10, 0, 0, "CheckBoxes");
            let checkbox1 = new Checkbox("Checkbox-1", buttonGroup2, x, y, 0, 0, "#1", "Number 1");
            let checkbox2 = new Checkbox("Checkbox-2", buttonGroup2, x, y += dy, 0, 0, "#2", "Number 2");
            let checkbox3 = new Checkbox("Checkbox-3", buttonGroup2, x, y += dy, 0, 0, "#3", "Number 3");
            checkbox1.go = printValue.bind(checkbox1);
            checkbox2.go = printValue.bind(checkbox2);
            checkbox3.go = printValue.bind(checkbox3);
        }
        let root = this._playfield.rootTile;
        makeRadioButtons(root, 10, 10);
        makeCheckboxes(root, 250, 10);
        makeOneButton(root, 10, 100);
        makeTwoButtons(root, 10, 125);
        makeStatus(root, 250, 125);
        makeSliders(root, 0, 250);

        this._playfield.rootTile.printTree();
        this._playfield.start(0);
    }
    run() {
        this.jedTest();
    }
}