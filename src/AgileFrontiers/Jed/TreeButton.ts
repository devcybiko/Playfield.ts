import { PlayfieldEvent, Tile } from "../Playfield";
import { Tree } from "../Utils/TreeMixin";
import { Button } from "./Button";
import { TreeItem } from "./TreeItem";

export class TreeButton extends Button {
    private _open: boolean;

    constructor(name: string, parent: Tile, x: number, y: number) {
        super(name, parent, x, y, 0, 0, "-");
        this._type += ".TreeByttib";
        this._open = false;
    }
    _openAll(obj: Tree, ctx: any) {
        let parent = obj as unknown as TreeItem;
        if (!parent._type.includes(".TreeItem")) return;
        let isOpen = ctx as boolean;
        let treeButton = parent._treeButton;
        parent.open = isOpen
        treeButton.open = isOpen;
    }
    override onPress(pfEvent: PlayfieldEvent) {
        let parent = this.parent as unknown as TreeItem;
        parent.open = !parent.open;
        this.open = parent.open;
        if (pfEvent.isShift) {
            parent.dfs(this._openAll, null, this.open);
        }
        pfEvent.isActive = false;
    }

    override draw(enable = true) {
        this.updateGparms(enable);
        this.updateRect();
        let parent = this.parent as unknown as TreeItem;
        if (parent.children.length > 2) {
            if (parent.open) this.label = "-";
            else this.label = "+";
            return super.draw(enable);
        }
        return this.dimensions;
    }
    public get open(): boolean {
        return this._open;
    }
    public set open(value: boolean) {
        this._open = value;
    }
    override onEvent(pfEvent: PlayfieldEvent, controller: Tile) {
        return super.onEvent(pfEvent, controller);
    }

    override objectify(): any {
        // don't report this object
        return null;
    }
}
