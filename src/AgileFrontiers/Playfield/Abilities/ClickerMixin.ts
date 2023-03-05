import { Clickable } from "./ClickableMixin";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

export interface Clicker { };
export class Clicker {

    Clicker() {
        return this;
    }

    // --- Public Methods --- //
    
    clickEvent(pfEvent: PlayfieldEvent, child: Clickable): boolean {
        if (pfEvent.isPress) {
            let tileChild = child as unknown as Tile;
            if (tileChild.inBounds(pfEvent.x, pfEvent.y)) {
                child.onClick(pfEvent);
            }
        }
        return true;
    }
}