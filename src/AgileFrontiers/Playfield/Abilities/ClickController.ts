import { Clickable } from "./Clickable";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

/** 
 * can control Clickable
 */
export interface ClickController { };
export class ClickController {
    protected _isClickControllerInitialized: boolean;

    ClickController() {
        this._isClickControllerInitialized = true;
        return this;
    }

    // --- Public Methods --- //
    
    clickEvent(pfEvent: PlayfieldEvent, child: Clickable) {
        if (pfEvent.isPress) {
            let tileChild = child._asTile;
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