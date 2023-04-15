import { PlayfieldEvent, Tile } from "../Playfield";
import { Button } from "./Button";
import { TreeItem } from "./TreeItem";

export class TreeButton extends Button {
    private _open: boolean;

    constructor(name: string, parent: Tile, x: number, y: number) {
        super(name, parent, x, y, 0, 0, "-");
        this._open = false;
    }
    override onPress(pfEvent: PlayfieldEvent) {
        let parent = this.parent as unknown as TreeItem;
        parent.open = !parent.open;
        this.open = parent.open;
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
