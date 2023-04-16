import { PlayfieldEvent, Tile } from "../Playfield";
import { Dimensions, between } from "../Utils";
import { Group } from "./Group";
import { Tree } from "./Tree";
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

    override inBounds(dx: number, dy: number, pfEvent?: PlayfieldEvent): Tile {
        if (this._treeButton && this._treeButton.inBounds(dx, dy, pfEvent)) return this._treeButton;
        if (this._treeLabel && this._treeLabel.inBounds(dx, dy, pfEvent)) return this._treeLabel;
        return super.inBounds(dx, dy);
    }

    _drawChild(enable: boolean, obj: TreeItem, x: number, y: number) {
        obj.x = x;
        obj.y = y;
        let dims = obj.draw();
        let childrenDims = obj._drawChildren(enable, this._indent, this._margin + dims.h);
        dims.w = Math.max(x + dims.w, x + childrenDims.w + this._indent);
        dims.h = Math.max(dims.h + childrenDims.h + this._margin, 0);
        return dims;
    }

    _drawChildren(enable: boolean, x: number, y: number): Dimensions {
        let dw = 0;
        let dh = 0;
        if (!this.isVisible) return new Dimensions();
        for (let child of this.children) {
            let treeItemChild = child as unknown as TreeItem;
            if (treeItemChild.name === "_button" || treeItemChild.name === "_label") continue;
            if (this._open) {
                let deltas = this._drawChild(enable, treeItemChild, x, y + dh);
                dw = Math.max(dw, deltas.w);
                dh += deltas.h;
            }
        }
        return new Dimensions(dw, dh);
    }

    override draw(enable = true): Dimensions {
        this.updateGparms(enable);
        this.updateRect();
        // console.log(this.parent.parent.parent.parent.name, this.parent.parent.parent.name, this.parent.parent.name, this.parent.name, this.name);
        // console.log(this.parent.parent.parent.parent.y, this.parent.parent.parent.y, this.parent.parent.y, this.parent.y, this.y);
        // console.log(this.parent.parent.parent.parent.Y, this.parent.parent.parent.Y, this.parent.parent.Y, this.parent.Y, this.Y);

        if (!this.isVisible) return new Dimensions();
        if (this._treeButton && this._treeLabel) {
            this._treeButton.draw(enable);
            this._treeLabel.x = this._treeButton.x + this._treeButton.w + this._margin;
            this._treeLabel.draw(enable);
            return new Dimensions(this._treeButton.W + this._treeLabel.W, Math.max(this._treeButton.H, this._treeLabel.H));
        } else {
            return this._drawChildren(enable, this._margin, this._margin);
        }
    }

    override onEvent(pfEvent: PlayfieldEvent, controller: Tile) {
        let stop = false as any;
        if (!stop && this._treeButton) stop = this._treeButton.onEvent(pfEvent, controller);
        if (!stop && this._treeLabel) stop = this._treeLabel.onEvent(pfEvent, controller);
        if (!stop && !this._open) {
            // if we're collapsed, don't process child nodes
            stop = "stop-children";
        }
        return stop;
    }

    addNode(label: string, data?: any): TreeItem {
        let newChild = new TreeItem(label, this, 0, 0, 0, 0, label);
        if (this.name == Tree.TREE_ROOT_NAME) newChild.isVisible = true;
        newChild.data = data;
        return newChild;
    }
    override onClick(pfEvent: PlayfieldEvent) {
    }
    override onMenu(pfEvent: PlayfieldEvent) {
    }
}
