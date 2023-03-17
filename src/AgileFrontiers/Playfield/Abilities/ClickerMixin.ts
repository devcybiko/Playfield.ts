import { Clickable } from "./ClickableMixin";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

export interface Clicker { };
export class Clicker {

    Clicker() {
        return this;
    }

    // --- Public Methods --- //
    
    clickEvent(pfEvent: PlayfieldEvent, child: Clickable) {
        if (pfEvent.isPress) {
            let tileChild = Tile.cast(child);
            if (tileChild.inBounds(pfEvent.x, pfEvent.y)) {
                child.onClick(pfEvent);
            }
        }
    }
}