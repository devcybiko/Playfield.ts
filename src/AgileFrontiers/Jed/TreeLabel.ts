import { Tile, PlayfieldEvent } from "../Playfield";
import { Dimensions } from "../Utils";
import { Label } from "./Label";
import { TreeItem } from "./TreeItem";

export class TreeLabel extends Label {
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, label: string) {
        super(name, parent, x, y, w, h, label);
        this.options.fontStyle = "";
        this.Logger("info", false);

    }
    override draw(enable = true): Dimensions {
        this.updateGparms(enable);
        this.updateRect();
        return super.draw(enable);
    }
    override get data(): any {
        let parent = this.parent as unknown as TreeItem;
        return parent.data;
    }
    override onClick(pfEvent: PlayfieldEvent) {
        let parent = this.parent as unknown as TreeItem;
        return parent.onClick(pfEvent);
    }
    override onMenu(pfEvent: PlayfieldEvent) {
        let parent = this.parent as unknown as TreeItem;
        return parent.onMenu(pfEvent);
    }
    override onEvent(pfEvent: PlayfieldEvent, controller: Tile) {
        return super.onEvent(pfEvent, controller);
    }
    override objectify(): any {
        // don't report this object
        return null;
    }
}

