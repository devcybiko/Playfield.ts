import { Item } from "./Item";
import { PlayfieldEvent, Tile } from "../Playfield";
import { applyMixins, Tree as BaseTree } from "../Utils";
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
        super.draw();
        return {w: this.W, h: this.H};
    }
    public get open(): boolean {
        return this._open;
    }
    public set open(value: boolean) {
        this._open = value;
        if (this._open) this.label = "+";
        else this.label = "-";
    }
}

class TreeLabel extends Label {
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, label: string) {
        super(name, parent, x, y, w, h, label);
        this.isDraggable = false;
        this.options.fontStyle = "";
    }
    draw() {
        super.draw();
        return {w: this.W, h: this.H};
    }
}

export class TreeItem extends Group {
    _treeButton: TreeButton;
    _treeLabel: TreeLabel;
    public _open: boolean;
    _margin = 5;

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

    _drawChild(child: TreeItem, x: number, y: number) {
        child.x = x;
        child.y = y;
        let {w, h} = child.draw();
        let deltas = child._drawChildren(x + 10, y + h);
        deltas.w = x + Math.max(deltas.w, w);
        deltas.h = h + deltas.h;
        return deltas;
    }
    _drawChildren(x: number, y: number) {
        let dw = 0;
        let dh = 0;
        for (let child of this.children) {
            let treeItemChild = TreeItem.cast(child);
            if (treeItemChild.name === "_button" || treeItemChild.name === "_label") continue;
            if (this._open) {
                let {w, h} = this._drawChild(treeItemChild, x, y + dh);
                dw = Math.max(dw, w);
                dh += h;
            }
        }
        return {w: dw, h: dh};
    }
    draw() {
        if (!this._treeButton) return {w: 0, h: 0};
        this._treeButton.draw();
        this._treeLabel.x = this._treeButton.x + this._treeButton.w + this._margin;
        this._treeLabel.draw();
        let deltas = {w: this._treeButton.W + this._treeLabel.W, h: Math.max(this._treeButton.H, this._treeLabel.H)};
        return deltas;
    }
    onEvent(pfEvent: PlayfieldEvent) {
        if (this._treeButton) this._treeButton.onEvent(pfEvent);
        if (this._treeLabel) this._treeLabel.onEvent(pfEvent);
        super.onEvent(pfEvent);
    }
}

export class Tree extends Group {
    _root: TreeItem;
    _margin = 5;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, label?: string) {
        super(name, parent, x, y, w, h, label);
        this._root = new TreeItem("_tree", this, 0, 0, 0, 0, "");
        this._root._open = true;
        this._root._treeButton.removeChild();
        this._root._treeLabel.removeChild();
        this._root._treeButton = null;
        this._root._treeLabel = null;
        this.isBoxed = true;
    }
    addNode(node: TreeItem, label: string): TreeItem {
        let newChild = new TreeItem(label, node, node.x, node.y, 0, 0, label);
        return newChild;
    }
    drawChildren() {
        return this._root._drawChildren(0, 0);
    }
    draw() {
        let deltas = this.drawChildren();
        this.w = deltas.w;
        this.h = deltas.h;
        this.gfx.gparms.fillColor = "";
        this.gfx.rect(this.X, this.Y, this.W, this.H);
    }
}