import { Clickable } from "./ClickableMixin";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

export interface Clicker { };
export class Clicker {
    Clicker() {
        return this;
    }

    clickEvent(pfEvent: PlayfieldEvent, child: Clickable): boolean {
        if (pfEvent.type === "mousedown") {
            let tileChild = child as unknown as Tile;
            if (tileChild.inBounds(pfEvent.x, pfEvent.y)) {
                child.onClick(pfEvent);
            }
        }
        return true;
    }
}