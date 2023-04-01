import { PlayfieldEvent, Tile } from "../Playfield";
import { Dimensions } from "../Utils";
import { Group } from "./Group";
import { TreeButton } from "./TreeButton";
import { TreeLabel } from "./TreeLabel";

export class TreeItem extends Group {
    _treeButton: TreeButton;
    _treeLabel: TreeLabel;
    public _open: boolean;
    _margin = 5;
    _indent = 10;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, label: string) {
        super(name, parent, x, y, w, h);
        this._type += ".TreeItem";
        this._treeButton = new TreeButton("_button", this, 0, 0); // x,y,w,h filled in during draw()
        this._treeLabel = new TreeLabel("_label", this, 0, 0, 0, 0, label); // x,y,w,h filled in during draw()
        this.open = false;
        this.isVisible = false;
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
        if (this._open) {
            this.children.forEach(child => (child as Tile).isVisible = true)
        } else {
            this.children.forEach(child => (child as Tile).isVisible = false)
        }
        this._treeButton.isVisible = true; // oops, it's a proper child, so turn it back on
        this._treeLabel.isVisible = true; // oops, it's a proper child, so turn it back on
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
        if (!this.isVisible) return new Dimensions();
        for (let child of this.children) {
            let treeItemChild = child as unknown as TreeItem;
            if (treeItemChild.name === "_button" || treeItemChild.name === "_label") continue;
            if (this._open) {
                let deltas = this._drawChild(treeItemChild, x, y + dh);
                dw = Math.max(dw, deltas.w);
                dh += deltas.h;
            }
        }
        return new Dimensions(dw, dh);
    }

    override draw(enable = true): Dimensions {
        this.updateGparms(enable);
        this.updateRect();
        if (!this.isVisible) return new Dimensions();
        this.updateGparms(enable);
        if (!this._treeButton) return new Dimensions(0, 0); // don't try to draw() the root
        this._treeButton.draw(enable);
        this._treeLabel.x = this._treeButton.x + this._treeButton.w + this._margin;
        this._treeLabel.draw(enable);
        let deltas = new Dimensions(this._treeButton.W + this._treeLabel.W, Math.max(this._treeButton.H, this._treeLabel.H));
        return deltas;
    }

    onEvent(pfEvent: PlayfieldEvent) {
        if (this._treeButton) this._treeButton.onEvent(pfEvent);
        if (this._treeLabel) this._treeLabel.onEvent(pfEvent);
        if (!this._open) {
            return;
        }
        let thisTile = this as unknown as Tile;
        if (pfEvent.isMouseEvent && thisTile.inBounds(pfEvent.x, pfEvent.y, pfEvent)) {
            this._forEachChild(pfEvent);
        } else if (pfEvent.isKeyboardEvent) {
            this._forEachChild(pfEvent);
        }
    }

    addNode(label: string, data?: any): TreeItem {
        let newChild = new TreeItem(label, this, 0, 0, 0, 0, label);
        if (this.name == "_treeRoot") newChild.isVisible = true;
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