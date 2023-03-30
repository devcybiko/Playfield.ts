import { Item } from "./Item";
import { PlayfieldEvent, Tile } from "../Playfield";
import { applyMixins, Tree as BaseTree, Dimensions } from "../Utils";
import { Draggable, Pressable, Hoverable } from "../Playfield/Abilities";
import { Button } from "./Button";
import { Label } from "./Label";
import { Group } from "./Group";

export class _Tree extends Item { };
export interface _Tree extends Draggable, Pressable, Hoverable { };
applyMixins(_Tree, [Draggable, Pressable, Hoverable]);

class TreeButton extends Button {
    private _open: boolean;

    constructor(name: string, parent: Tile, x: number, y: number) {
        super(name, parent, x, y, 0, 0, "-");
        this._open = false;
        this.isDraggable = false;
    }
    onPress(pfEvent: PlayfieldEvent) {
        let parent = TreeItem.cast(this.parent);
        parent.open = !parent.open;
        this.open = parent.open;
        pfEvent.isActive = false;
    }

    draw() {
        let parent = TreeItem.cast(this.parent);
        if (parent.children.length > 2) {
            if (parent.open) this.label = "-";
            else this.label = "+";
            return super.draw();
        } 
        return this.dimensions;
    }
    public get open(): boolean {
        return this._open;
    }
    public set open(value: boolean) {
        this._open = value;
    }
}

class TreeLabel extends Label {
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, label: string) {
        super(name, parent, x, y, w, h, label);
        this.isDraggable = false;
        this.options.fontStyle = "";
        this.Logger("info", false);
    }
    draw(): Dimensions {
        super.draw();
        return new Dimensions(this.W, this.H);
    }
    get data(): any {
        let parent = TreeItem.cast(this.parent);
        if (parent) return parent.data;
        return null;
    }
    onClick(pfEvent: PlayfieldEvent) {
        console.log("onClick", this.name)
        let parent = TreeItem.cast(this.parent);
        return parent.onClick(pfEvent);
    }
    onMenu(pfEvent: PlayfieldEvent) {
        console.log("onMenu", this.name)
        let parent = TreeItem.cast(this.parent);
        return parent.onMenu(pfEvent);
    }
}

export class TreeItem extends Group {
    _treeButton: TreeButton;
    _treeLabel: TreeLabel;
    public _open: boolean;
    _margin = 5;
    _indent = 10;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, label: string) {
        super(name, parent, x, y, w, h);
        this._treeButton = new TreeButton("_button", this, x, y);
        this._treeLabel = new TreeLabel("_label", this, x + this._treeButton.w / 2, y, 0, 0, label);
        this._open = false;
        this._isBoxed = false;
    }

    public static cast(obj: any): TreeItem {
        return obj as TreeItem;
    }
    public get open(): boolean {
        return this._open;
    }
    public set open(value: boolean) {
        this._open = value && this.children.length > 2;
    }

    _drawChild(obj: TreeItem, x: number, y: number) {
        obj.x = x;
        obj.y = y;
        let dims = obj.draw();
        let childrenDims = obj._drawChildren(this._indent, this._margin + dims.h);
        dims.w = Math.max(x + dims.w, x + childrenDims.w + this._indent);
        dims.h = Math.max(dims.h + childrenDims.h + this._margin, 0);
        return dims;
    }
    _drawChildren(x: number, y: number): Dimensions {
        let dw = 0;
        let dh = 0;
        for (let child of this.children) {
            let treeItemChild = TreeItem.cast(child);
            if (treeItemChild.name === "_button" || treeItemChild.name === "_label") continue;
            if (this._open) {
                let deltas = this._drawChild(treeItemChild, x, y + dh);
                dw = Math.max(dw, deltas.w);
                dh += deltas.h;
            }
        }
        return new Dimensions(dw, dh);
    }
    override draw(): Dimensions {
        if (!this._treeButton) return new Dimensions(0,0); // don't try to draw() the root
        this._treeButton.draw();
        this._treeLabel.x = this._treeButton.x + this._treeButton.w + this._margin;
        this._treeLabel.draw();
        let deltas = new Dimensions(this._treeButton.W + this._treeLabel.W, Math.max(this._treeButton.H, this._treeLabel.H));
        return deltas;
    }
    onEvent(pfEvent: PlayfieldEvent) {
        if (this._treeButton) this._treeButton.onEvent(pfEvent);
        if (this._treeLabel) this._treeLabel.onEvent(pfEvent);
        super.onEvent(pfEvent);
    }
    addNode(label: string, data?: any): TreeItem {
        let newChild = new TreeItem(label, this, this.x, this.y, 0, 0, label);
        newChild.data = data;
        return newChild;
    }
    onClick(pfEvent: PlayfieldEvent) {
        console.log("TreeItem.onClick!", this.name)
    }
    onMenu(pfEvent: PlayfieldEvent) {
        console.log("TreeItem.onMenu!", this.name)
    }
}

export class Tree extends Group {
    _treeRoot: TreeItem;
    _margin = 5;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, label?: string) {
        super(name, parent, x, y, w, h, label);
        this._treeRoot = new TreeItem("_tree", this, 0, 0, 0, 0, "");
        this._treeRoot._open = true;
        this._treeRoot._treeButton.removeChild();
        this._treeRoot._treeLabel.removeChild();
        this._treeRoot._treeButton = null;
        this._treeRoot._treeLabel = null;
        this.isBoxed = true;
    }
    addNode(node: TreeItem, label: string, data?: any): TreeItem {
        let newChild = new TreeItem(label, node, node.x, node.y, 0, 0, label);
        newChild.data = data;
        return newChild;
    }
    override drawChildren(): Dimensions {
        return this._treeRoot._drawChildren(this._margin, this._margin);
    }
    override draw(): Dimensions {
        let deltas = this.drawChildren();
        this.w = deltas.w;
        this.h = deltas.h + this._margin * 2;
        this.gfx.gparms.fillColor = "";
        this.gfx.rect(this.X, this.Y, this.W, this.H);
        return this.dimensions;
    }
    public get treeRoot(): TreeItem {
        return this._treeRoot;
    }
    public set treeRoot(value: TreeItem) {
        this._treeRoot = value;
    }

}