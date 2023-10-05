import { Playfield, PlayfieldEvent, Tile } from "../Playfield";
import { BrowserPlayfieldApp } from "../Browser";
import { Text, Label, Button, Slider, Checkbox, Group, Radio, Menu, MenuItem } from "../Jed";
import { int, random } from "../Utils";

/*
 * creates a from from a JSON file
 */

let formStrings = ["test"];

// let formStrings = [
//     "Label| !Label 02|   Label 02|   10| 30| 50| 20| Label 02",
//     "Text|  Text 01|    Text 01|    10| 50| 50| 20| Text 01",
//     "Button| Button 03| Button 03|   10| 80| 50| 20| Button 03",
//     "Slider| Slider 06|   Slider 06|   10|170| 50| 20| Slider 06",
//     "Group| !Group 07|   Group 07|   10|200| 50| 20| Group 07",
//     "Menu| Menu 08|   Menu 08|   10|230| 50| 20| Menu 08",
//     "Checkbox| Checkbox 04|   Checkbox 04|   10|10| 50| 20| Checkbox 04| Group 07",
//     "Checkbox| Checkbox 05|   Checkbox 05|   10|40| 50| 20| Checkbox 04| Group 07",
//     "Radio| Radio 05|   Radio 05|   10|70| 50| 20| Radio 05| Group 07",
//     "Radio| Radio 06|   Radio 06|   10|110| 50| 20| Radio 05| Group 07",
// ]

// let formObjects = [
//     {
//         type: "Label",
//         name: "Label 01",
//         value: "Label 01",
//         x: 10,
//         y: 10,
//         w: 50,
//         h: 20,
//     }
// ]

export class Form {
    _playfieldApp: BrowserPlayfieldApp;
    _playfield: Playfield;
    _root: Tile;
    _parent: Tile;
    _jed: any;
    _templates: any;
    objects: any[];

    constructor(canvasSelector: string) {
        this._playfieldApp = new BrowserPlayfieldApp(canvasSelector, 1.0);
        this._playfield = this._playfieldApp.playfield;
        this._root = this._playfield.rootTile;
        this._parent = this._root; // temporary parent for items that need a parent
        this._jed = {
            "Button": (item: any) => { return new Button(item.name, this._parent, item.x, item.y, item.w, item.h, item.value, item.label) },
            "Checkbox": (item: any) => { return new Checkbox(item.name, this._parent, item.x, item.y, item.w, item.h, item.value, item.label) },
            "Group": (item: any) => { return new Group(item.name, this._parent, item.x, item.y, item.w, item.h, item.label) },
            "Label": (item: any) => { return new Label(item.name, this._parent, item.x, item.y, item.w, item.h, item.value, item.label) },
            "Menu": (item: any) => { return new Menu(item.name, this._parent, item.x, item.y, item.w, item.h, item.label) },
            "MenuItem": (item: any) => { return new MenuItem(item.name, this._parent as Menu, item.x, item.y, item.label) },
            "Text": (item: any) => { return new Text(item.name, this._parent, item.x, item.y, item.w, item.h, item.value, item.label) },
            "Radio": (item: any) => { return new Radio(item.name, this._parent, item.x, item.y, item.w, item.h, item.value, item.label) },
            "Slider": (item: any) => { return new Slider(item.name, this._parent, item.x, item.y, item.w, item.h, item.value, item.label) },
        }
        this._templates = {
            "Button": ["type", "name", "value", ".x", ".y", ".w", ".h", "label", "parent", "go"],
            "Checkbox": ["type", "name", "value", ".x", ".y", ".w", ".h", "label", "parent", "go"],
            "Group": ["type", "name", "value", ".x", ".y", ".w", ".h", "label", "parent", "go"],
            "Label": ["type", "name", "value", ".x", ".y", ".w", ".h", "label", "parent", "go"],
            "Menu": ["type", "name", "value", ".x", ".y", ".w", ".h", "label", "parent", "go"],
            "MenuItem": ["type", "name", "value", ".x", ".y", ".w", ".h", "label", "parent", "go"],
            "Text": ["type", "name", "value", ".x", ".y", ".w", ".h", "label", "parent", "go"],
            "Radio": ["type", "name", "value", ".x", ".y", ".w", ".h", "label", "parent", "go"],
            "Slider": ["type", "name", "value", ".x", ".y", ".w", ".h", "label", "parent", "go"],
        }
        this.objects = [];
    }
    fromObject(item: any) {
        console.log("Form.fromObject", item);
        let fn = this._jed[item.type];
        if (fn) {
            if (item.parent) {
                this._parent = this._root.find(item.parent); // assign temporary parent
            }
            item.isDraggable = false;
            if (item.name.startsWith("!")) {
                item.name = item.name.slice(1);
                item.isDraggable = true;
            }
            let obj = fn(item) as any;
            this.objects.push(obj);
            obj.formType = item.type; // save type
            obj.form = this; // create a handle to this form
            if (item.go) {
                obj.formGo = item.go; // save go function
                obj.go = () => { eval(item.go) }; // set go function
            }
            if (item.parent) obj.formParent = item.parent; // save parent
            obj.isDraggable = item.isDraggable; // set draggable
            this._parent = this._root; // restore root as parent
            return obj;
        }
        console.error("Form.fromObject: unknown type", item)
        return null;
    }
    fromObjects(items: any[]) {
        for (let item of items) item.obj = this.fromObject(item);
    }
    fromString(item: string) {
        console.log("Form.parseLine", item)
        let tokens = item.split("|");
        let type = tokens[0].trim();
        let template = this._templates[type];
        if (!template) {
            console.error("Form.parseLine: unknown type", type)
            return null;
        }
        let obj = {} as any;
        for (let i = 0; i < template.length; i++) {
            let token = (tokens[i] || "").trim() as any;
            let key = template[i];
            if (key[0] === ".") {
                key = key.slice(1);
                token = Number(token);
            }
            obj[key] = token;
        }
        return obj;
    }
    fromStrings(strings: string[]) {
        for (let item of strings) {
            let obj = this.fromString(item);
            this.fromObject(obj);
        }
    }
    getValues() {
        return this.objects.map((o) => { return { name: o.name, value: o.value } });
    }
    getReport() {
        let report = [];
        for (let o of this.objects) {
            let line = o.formType;
            line += "|" + o.name;
            line += "|" + o.value;
            line += "|" + o.x;
            line += "|" + o.y;
            line += "|" + o.w;
            line += "|" + o.h;
            line += "|" + o.label;
            line += "|" + (o.formParent ? o.formParent : "");
            line += "|" + (o.formGo ? o.formGo : "");
            report.push(line);
        }
        return report;
    }
    getJSON() {
        let report = [];
        let obj = {} as any;
        for (let o of this.objects) {
            obj.type = o.formType;
            obj.name = o.name;
            obj.value =  o.value;
            obj.x = o.x;
            obj.y = o.y;
            obj.w = o.w;
            obj.h = o.h;
            obj.label = o.label;
            obj.parent = (o.formParent ? o.formParent : "");
            obj.go = (o.formGo ? o.formGo : "");
            report.push(obj);
        }
        return report;
    }
    run(formStrings: string[], formObjects: any[]) {
        this.fromObjects(formObjects || []);
        this.fromStrings(formStrings || []);
        this._playfield.rootTile.printTree();
        console.log("starting playfield", formObjects)
        this._playfield.start(0);
    }
}