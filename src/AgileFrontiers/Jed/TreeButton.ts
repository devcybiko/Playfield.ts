import { PlayfieldEvent, Tile } from "../Playfield";
import { Button } from "./Button";
import { TreeItem } from "./TreeItem";

export class TreeButton extends Button {
    private _open: boolean;

    constructor(name: string, parent: Tile, x: number, y: number) {
        super(name, parent, x, y, 0, 0, "-");
        this._open = false;
        this.isDraggable = false;
    }
    onPress(pfEvent: PlayfieldEvent) {
        if (!pfEvent.isMove) console.log("onPress", this);
        let parent = this.parent as unknown as TreeItem;
        parent.open = !parent.open;
        this.open = parent.open;
        pfEvent.isActive = false;
    }

    draw(enable = true) {
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
    onEvent(pfEvent: PlayfieldEvent) {
        super.onEvent(pfEvent);
    }

    objectify(): any {
        // don't report this object
        return null;
    }
}
