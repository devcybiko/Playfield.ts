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
            let splitter = new Splitter("splitter", parent, 0, 1);
            let splitterNE = new Splitter("splitterNE", splitter.ne);
            let splitterNW = new Splitter("splitterNw", splitter.nw);
            let splitterSE = new Splitter("splitterSE", splitter.se);
            let splitterSW = new Splitter("splitterSW", splitter.sw);
            fourLabels("label.NE", splitterNE);
            fourLabels("label.NW", splitterNW);
            fourLabels("label.SE", splitterSE);
            fourLabels("label.SW", splitterSW);
            return;
            // new Label("label", splitterNE.ne, 0, 0, 0, 0, "Lable.NE.NE");
            // new Label("label", splitterNE.nw, 0, 0, 0, 0, "Lable.NE.NW");
            // new Label("label", splitterNE.se, 0, 0, 0, 0, "Lable.NE.SE");
            // new Label("label", splitterNE.sw, 0, 0, 0, 0, "Lable.SE.SW");

            // new Label("label", splitterSE.ne, 0, 0, 0, 0, "Lable.SE.NE");
            // new Label("label", splitterSE.nw, 0, 0, 0, 0, "Lable.SE.NW");
            // new Label("label", splitterSE.se, 0, 0, 0, 0, "Lable.SE.SE");
            // new Label("label", splitterSE.sw, 0, 0, 0, 0, "Lable.SE.SW");

            // new Label("label", splitterNW.ne, 0, 0, 0, 0, "Lable.NW.NE");
            // new Label("label", splitterNW.nw, 0, 0, 0, 0, "Lable.NW.NW");
            // new Label("label", splitterNW.se, 0, 0, 0, 0, "Lable.NW.SE");
            // new Label("label", splitterNW.sw, 0, 0, 0, 0, "Lable.SW.SW");

            // new Label("label", splitterSW.ne, 0, 0, 0, 0, "Lable.SW.NE");
            // new Label("label", splitterSW.nw, 0, 0, 0, 0, "Lable.SW.NW");
            // new Label("label", splitterSW.se, 0, 0, 0, 0, "Lable.SW.SE");
            // new Label("label", splitterSW.sw, 0, 0, 0, 0, "Lable.SW.SW");

        }
        function makeSliders(parent: Tile, x = 10, y = 10, dy = 25) {
            function updateCursor(rx: number, ry: number, pfEvent: PlayfieldEvent) {
                hslider.cursorSize(rx, 18);
                vslider.cursorSize(18, ry);
                bigSlider.text = `(${int(bigSlider.rx * 100)},${int(bigSlider.ry * 100)})`;
                hslider.text = `${int(hslider.rx * 100)}`;
                vslider.text = `${int(vslider.ry * 100)}`;
            }
            function showValue(rx: number, ry: number, pfEvent: PlayfieldEvent) {
                resultLabel.value = this.name + ": " + int(rx * 100) + "," + int(ry * 100);
                if (this.name[0] === 'h') this.text = `${int(this.rx * 100)}`;
                if (this.name[0] === 'v') this.text = `${int(this.ry * 100)}`;
            }

            let sliderW = 30;
            bigSlider = new Slider("bigSlider", parent, x + sliderW * 2, y, 200, 200);
            bigSlider.onSlide = updateCursor.bind(bigSlider);

            hslider = new Slider("hslider", parent, x + sliderW, parent.h - sliderW, parent.w - x - sliderW - 1, sliderW);
            hslider.vslide = false;
            hslider.onSlide = showValue.bind(hslider);

            vslider = new Slider("vslider", parent, x, y, sliderW, y - sliderW - 1);
            vslider.hslide = false;
            vslider.onSlide = showValue.bind(vslider);
            return { bigSlider, hslider, vslider };
        }

        function makeRadioButtons(parent: Tile, x = 10, y = 10, dy = 25) {
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
        function makeOneButton(parent: Tile, x = 10, y = 10, dy = 25) {
            function printGo() {
                resultLabel.value = ("Button Value: " + this.name);
            }
            let button1 = new Button("Button1", parent, x, y, 100, 0);
            button1.label = "Hello World";
            button1.value = "Greg Smith";
            button1.isDraggable = false;

            button1.go = printGo.bind(button1);
        }
        function makeTwoButtons(parent: Tile, x = 10, y = 10, dy = 25) {
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
        function makeStatus(parent: Tile, x = 10, y = 10, dy = 25) {
            let text1 = new Text("textitem-1", parent, x, y, 250, 14, "Hello World 1");
            resultLabel = new Label("ResultLabel", parent, x, y += dy, 200, 14, "Result Value");
        }
        function makeCheckboxes(parent: Tile, x = 10, y = 10, dy = 25) {
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
        // makeRadioButtons(root, 10, 10);
        // makeCheckboxes(root, 250, 10);
        // makeOneButton(root, 10, 100);
        // makeTwoButtons(root, 10, 125);
        // makeStatus(root, 250, 125);
        // makeSliders(root, 0, 250);
        makeSplitter(root);

        this._playfield.rootTile.printTree();
        this._playfield.start(0);
    }
    run() {
        this.jedTest();
    }
}