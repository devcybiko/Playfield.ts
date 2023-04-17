import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

/**
 * can be Swiped (using the mouse wheel or two-finger swipe up or down or left or fith)
 */
export interface Swipeable { }
export class Swipeable {
    public _isSwipeableInitialized: boolean;
    public _asTile: Tile;

    Swipeable() {
        this._isSwipeableInitialized = true;
        return this;
    }

    // --- onActions --- //
    
    onSwipe(dx: number, dy: number, pfEvent: PlayfieldEvent): void {
    }
}
