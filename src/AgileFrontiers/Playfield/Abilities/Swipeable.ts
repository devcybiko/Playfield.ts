import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

/**
 * can be swipeged
 */
export interface Swipeable { }
export class Swipeable {
    public _isSwipeableInitialized: boolean;
    protected _isSwiping: boolean;
    public _asTile: Tile;

    Swipeable() {
        this._isSwipeableInitialized = true;
        this.isSwiping = false;
        return this;
    }

    // --- onActions --- //

    onSwipeStart(dx: number, dy: number, pfEvent: PlayfieldEvent): boolean {
        this.isSwiping = true;
        pfEvent.isActive = false;
        return true;
    }
    
    onSwipe(dx: number, dy: number, pfEvent: PlayfieldEvent): void {
    }
    
    onSwipeEnd(pfEvent: PlayfieldEvent): void {
        if (this.isSwiping) {
            this.isSwiping = false;
            pfEvent.isActive = false;
        }
    }

    // --- Accessors --- //

    public get isSwiping(): boolean {
        return this._isSwiping;
    }
    public set isSwiping(value: boolean) {
        this._isSwiping = value;
    }

}
