import { Swipeable } from "./Swipeable";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

/**
 * can control Swipeable
 */
export interface SwipeController { };
export class SwipeController {
    protected _isSwipeController: boolean;
    protected _swipeObj: Swipeable;
    protected _swipeX: number;
    protected _swipeY: number;
    public _asTile: Tile;

    SwipeController() {
        this._isSwipeController = true;
        this._swipeObj = null;
        this._swipeX = 0;
        this._swipeY = 0;
        return this;
    }

    // --- Public Methods --- //

    swipeEvent(pfEvent: PlayfieldEvent, child: Swipeable) {
        if (pfEvent.isMove) return this._swipeChild(pfEvent, child);
        else if (pfEvent.isPress) return this._swipeStart(pfEvent, child);
        else if (pfEvent.isRelease) return this._swipeEnd(pfEvent, child);
    }

    // --- Private Methods --- //

    _swipeChild(pfEvent: PlayfieldEvent, child: Swipeable) {
        if (!child._isSwipeableInitialized) return;
        if (this._swipeObj) {
            this._swipeObj.onSwipe(pfEvent.x - this._swipeX, pfEvent.y - this._swipeY, pfEvent);
            this._swipeX = pfEvent.x;
            this._swipeY = pfEvent.y;
        }
    }

    _swipeStart(pfEvent: PlayfieldEvent, child: Swipeable) {
        if (!child._isSwipeableInitialized) return;
        if (child._asTile.inBounds(pfEvent.x, pfEvent.y, pfEvent)) {
            let dx = pfEvent.x - child._asTile.X;
            let dy = pfEvent.y - child._asTile.Y;
            console.log(dx, dy, this._asTile.X, this._asTile.Y);
            console.log(this, this._asTile);
            if (child.onSwipeStart(dx, dy, pfEvent)) {
                // if the child does not reject the "grab"
                this._swipeEnd(pfEvent, child);
                this._swipeX = pfEvent.x;
                this._swipeY = pfEvent.y;
                this._swipeObj = child;
            }
        }
    }

    _swipeEnd(pfEvent: PlayfieldEvent, child: Swipeable) {
        if (this._swipeObj) {
            this._swipeObj.onSwipeEnd(pfEvent);
            this._swipeObj = null;
        }
    }

}