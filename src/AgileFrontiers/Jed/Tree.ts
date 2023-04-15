import { Tile } from "../Playfield";
import { Dimensions } from "../Utils";
import { Group } from "./Group";
import { TreeItem } from "./TreeItem";

export class Tree extends Group {
    static readonly TREE_ROOT_NAME = "_treeRoot";
    _treeRoot: TreeItem;
    _margin = 5;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, label?: string) {
        super(name, parent, x, y, w, h, label);
        this._type += ".Tree";
        this._treeRoot = new TreeItem(Tree.TREE_ROOT_NAME, this, 0, 0, 0, 0, "");
        this._treeRoot.isVisible = true;
        this._treeRoot._open = true;
        this._treeRoot._treeButton.removeChild();
        this._treeRoot._treeLabel.removeChild();
        this._treeRoot._treeButton = null;
        this._treeRoot._treeLabel = null;
        this.isBoxed = true;
    }
    override drawChildren(): Dimensions {
        return this._treeRoot._drawChildren(this._margin, this._margin);
    }
    override draw(enable = true): Dimensions {
        this.updateGparms(enable);
        this.updateRect();
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