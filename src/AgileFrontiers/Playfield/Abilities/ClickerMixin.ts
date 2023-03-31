import { Clickable } from "./ClickableMixin";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

/** 
 * can control Clickable
 */
export interface Clicker { };
export class Clicker {
    protected isClicker: boolean;

    Clicker() {
        this.isClicker = true;
        return this;
    }

    // --- Public Methods --- //
    
    clickEvent(pfEvent: PlayfieldEvent, child: Clickable) {
        if (pfEvent.isPress) {
            let tileChild = child as unknown as Tile;
            if (tileChild.inBounds(pfEvent.x, pfEvent.y, pfEvent)) {
                child.onClick(pfEvent);
            }
        } else if (pfEvent.isMenu) {
            let tileChild = child as unknown as Tile;
            if (tileChild.inBounds(pfEvent.x, pfEvent.y, pfEvent)) {
                child.onMenu(pfEvent);
            }
        }
    }
}