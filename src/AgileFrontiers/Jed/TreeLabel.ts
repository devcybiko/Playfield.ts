import { Tile, PlayfieldEvent } from "../Playfield";
import { Dimensions } from "../Utils";
import { Label } from "./Label";
import { TreeItem } from "./TreeItem";

export class TreeLabel extends Label {
    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, label: string) {
        super(name, parent, x, y, w, h, label);
        this.isDraggable = false;
        this.options.fontStyle = "";
        this.Logger("info", false);
    }
    draw(enable = true): Dimensions {
        this.updateGparms(enable);
        this.updateRect();
        return super.draw(enable);
    }
    get data(): any {
        let parent = this.parent as unknown as TreeItem;
        return parent.data;
    }
    onClick(pfEvent: PlayfieldEvent) {
        // console.log("onClick", this.name)
        let parent = this.parent as unknown as TreeItem;
        return parent.onClick(pfEvent);
    }
    onMenu(pfEvent: PlayfieldEvent) {
        // if (!pfEvent.isMove) console.log(this.fullName, "onEvent");
        // console.log("onMenu", this.name)
        let parent = this.parent as unknown as TreeItem;
        return parent.onMenu(pfEvent);
    }
    onEvent(pfEvent: PlayfieldEvent) {
        // if (!pfEvent.isMove) console.log(this.fullName, "onEvent");
        super.onEvent(pfEvent);
    }
    objectify(): any {
        // don't report this object
        return null;
    }
}

