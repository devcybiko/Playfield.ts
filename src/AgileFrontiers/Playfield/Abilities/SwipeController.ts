import { Swipeable } from "./Swipeable";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

/**
 * can control Swipeable
 */
export interface SwipeController { };
export class SwipeController {
    protected _isSwipeController: boolean;
    public _asTile: Tile;

    SwipeController() {
        this._isSwipeController = true;
        return this;
    }

    // --- Public Methods --- //

    swipeEvent(pfEvent: PlayfieldEvent, child: Swipeable) {
        if (pfEvent.isSwipe) child.onSwipe(pfEvent.swipeX, pfEvent.swipeY, pfEvent);
    }
}