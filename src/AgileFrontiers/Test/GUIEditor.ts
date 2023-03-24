import { Playfield, PlayfieldEvent, Tile, Splitter, RootTile } from "../Playfield";
import { BrowserPlayfieldApp } from "../Browser";
import * as Jed from "../Jed";
import { int, random, Logger } from "../Utils";
import { Item } from "../Jed/Item";

export class TestClass {
    _playfieldApp: BrowserPlayfieldApp;
    _playfield: Playfield;
    public static counter = 1;
    root: RootTile;
    splitter: Splitter;
    left: RootTile;
    right: RootTile;
    isEditMode = true;
    groupItem = null as any as Jed.Group;
    logger = new Logger().Logger("info", false);
    preferences : any;
    currentItem: Item;

    constructor() {
        this._playfieldApp = new BrowserPlayfieldApp("#playfield", 1.0);
        this._playfield = this._playfieldApp.playfield;
    }
    log(...args: any[]) {
        this.logger.log(...args);
    }
    makeUnDraggable(item: any) {
        item.isDraggable = false;
    }
    makeDraggable(item: any) {
        item.isDraggable = true;
    }
    addItem() {
        let buttonClicked = Tile.cast(this);
        let that = buttonClicked.data as TestClass;
        let x = 10;
        let y = 10;
        let w = 200;
        let h = 30;
        let item;
        if (buttonClicked.name.includes("Button")) {
            that.log("add button");
            item = new Jed.Button("button-" + (TestClass.counter++), that.right, x, y, w, h);
        } else if (buttonClicked.name.includes("Checkbox")) {
            that.log("add checkox");
            item = new Jed.Checkbox("checkbox-" + (TestClass.counter++), that.right, x, y, w, h);
        } else if (buttonClicked.name.includes("Group")) {
            that.log("add group");
            let name = "group-" + (TestClass.counter++);
            item = new Jed.Group(name, that.right, x, y, 0, 0, "greg");
            that.groupItem = item;
        } else if (buttonClicked.name.includes("Label")) {
            that.log("add label");
            item = new Jed.Label("label-" + (TestClass.counter++), that.right, x, y, 0, 0);
        } else if (buttonClicked.name.includes("Text")) {
            that.log("add text");
            let name = "text-" + (TestClass.counter++);
            item = new Jed.Text(name, that.right, x, y, w, h, name);
        } else if (buttonClicked.name.includes("Radio")) {
            that.log("add radio");
            if (that.groupItem) item = new Jed.Radio("radio-" + (TestClass.counter++), that.groupItem, x, y, 0, 0);
            else item = new Jed.Radio("radio-" + (TestClass.counter++), that.right, x, y, 0, 0);
        } else if (buttonClicked.name.includes("addVSlider")) {
            that.log("add vslider");
            item = new Jed.Slider("vslider-" + (TestClass.counter++), that.right, x, y, h, w);
            item.hslide = false;
        } else if (buttonClicked.name.includes("addHSlider")) {
            that.log("add hslider");
            item = new Jed.Slider("hslider-" + (TestClass.counter++), that.right, x, y, w, h);
            item.vslide = false;
        } else if (buttonClicked.name.includes("addSlider")) {
            that.log("add slider");
            item = new Jed.Slider("slider-" + (TestClass.counter++), that.right, x, y, w, w);
        }
        if (item) {
            item.isDraggable = that.isEditMode;
            item.onMenu = that.onMenu.bind(item);
            item.data = that;
            that.populateProperties(item, that);
            that.log(item);
        } else {
            that.logger.error("Problem with " + buttonClicked.name, buttonClicked);
        }
    }
    onMenu(pfEvent: PlayfieldEvent) {
        let item = Item.cast(this);
        let that = item.data as TestClass;
        that.populateProperties(item, that);
    }
    editMode() {
        let thisTile = Tile.cast(this);
        let isOn = thisTile.name.includes("on");
        let that = thisTile.data;
        if (isOn) {
            that.right.dfs(that.makeDraggable, this.right);
            that.right.options.backgroundColor = "white";
            thisTile.data.isEditMode = true;
        } else {
            that.right.dfs(that.makeUnDraggable, this.right);
            that.right.options.backgroundColor = "#ddd";
            thisTile.data.isEditMode = false;
        }
    }
    setData(obj: any, data: any) {
        obj.data = data;
    }
    createAddPanel(parent: RootTile, that: TestClass) {
        let x = 10;
        let y = 20;
        let w = 180;
        let h = 30;
        let dy = 40
        let editMode = new Jed.Group("editMode", this.left, x, y, w, 0, "Edit Mode");
        let editModeOn = new Jed.Radio("on", editMode, 10, 10, 0, 0, "On");
        let editModeOff = new Jed.Radio("off", editMode, 10, 40, 0, 0, "Off");
        editModeOn.go = this.editMode.bind(editModeOn);
        editModeOff.go = this.editMode.bind(editModeOff);

        y = -dy / 2;
        let addButtonGroup = new Jed.Group("addButtonGroup", this.left, x, 130, 0, 0, "Add Item");
        let addButton = new Jed.Button("addButton", addButtonGroup, x, y += dy, w, h, "Add Button");
        let addCheckbox = new Jed.Button("addCheckbox", addButtonGroup, x, y += dy, w, h, "Add Checkbox");
        let addGroup = new Jed.Button("addGroup", addButtonGroup, x, y += dy, w, h, "Add Group");
        let addLabel = new Jed.Button("addLabel", addButtonGroup, x, y += dy, w, h, "Add Label");
        let addRadio = new Jed.Button("addRadio", addButtonGroup, x, y += dy, w, h, "Add Radio");
        let addSlider = new Jed.Button("addSlider", addButtonGroup, x, y += dy, w, h, "Add Slider");
        let addVSlider = new Jed.Button("addVSlider", addButtonGroup, x, y += dy, w, h, "Add VSlider");
        let addHSlider = new Jed.Button("addHSlider", addButtonGroup, x, y += dy, w, h, "Add HSlider");
        let addText = new Jed.Button("addText", addButtonGroup, x, y += dy, w, h, "Add Text");

        this.left.dfs(this.makeUnDraggable);
        this.left.dfs(this.setData, this);
        addButtonGroup.children.forEach((obj: any) => { obj.go = that.addItem.bind(obj) });

        this._playfield.rootTile.printTree();
        this._playfield.start(0);

        editMode.selectChild(editModeOn);
    }
    makeText(name: string, parent: Tile, x: number, y: number, w: number, h: number, label: string) {
        let text = new Jed.Text(name, parent, x, y, w, h, name);
        let title = new Jed.Label(name+"-label", parent, x, y, 100, h, label, label);
        title.options.textAlign = "right";
        return text;
    }
    createPreferencesPanel(parent: RootTile, that: TestClass) {
        let x = parent.w / 2;
        let y = 20;
        let w = 200;
        let h = 30;
        let dy = 40;

        let title = new Jed.Label("title", parent, x, y, 0, 0, "Preferences");
        title.options.textAlign = "center";
        let name = this.makeText("name", parent, x, y+=dy, w, h, "Name: ");
        let label = this.makeText("label", parent, x, y+=dy, w, h, "Label: ");
        let submit = new Jed.Button("submit", parent, x, y+=dy, w, h, "Submit");
        submit.x -= submit.w / 2;
        submit.go = that.updateItemProperties.bind(that);
        parent.dfs(this.makeUnDraggable);
        return {title, name, label}
    }
    populateProperties(item: Item, that: TestClass) {
        that.currentItem = item;
        that.preferences.name.value = item.value;
        that.preferences.label.value = item.label;
    }
    updateItemProperties() {
        this.currentItem.value = this.preferences.label.value;
        this.currentItem.label = this.preferences.label.value;
    }
    GUIEditor() {
        this.root = RootTile.cast(this._playfield.rootTile);
        this.splitter = new Splitter("splitter", this.root, 0.65, 0.25);

        this.left = this.splitter.ne;
        this.right = this.splitter.nw;
        this.createAddPanel(this.left, this);
        this.preferences = this.createPreferencesPanel(this.splitter.sw, this);
    }
    run() {
        this.GUIEditor();
    }

}