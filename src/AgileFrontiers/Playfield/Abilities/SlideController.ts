import { Slideable } from "./Slideable";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

/**
 * can control Slideable
 */
export interface SlideController { };
export class SlideController {
    protected _isSlideController: boolean;
    protected _slideObj: Slideable;
    protected _slideX: number;
    protected _slideY: number;
    public _asTile: Tile;

    SlideController() {
        this._isSlideController = true;
        this._slideObj = null;
        this._slideX = 0;
        this._slideY = 0;
        return this;
    }

    // --- Public Methods --- //

    slideEvent(pfEvent: PlayfieldEvent, child: Slideable) {
        if (pfEvent.isMove) return this._slideChild(pfEvent, child);
        else if (pfEvent.isPress) return this._slideStart(pfEvent, child);
        else if (pfEvent.isRelease) return this._slideEnd(pfEvent, child);
    }

    // --- Private Methods --- //

    _slideChild(pfEvent: PlayfieldEvent, child: Slideable) {
        if (!child._isSlideableInitialized) return;
        if (this._slideObj) {
            this._slideObj.onSlide(pfEvent.x - this._slideX, pfEvent.y - this._slideY, pfEvent);
            this._slideX = pfEvent.x;
            this._slideY = pfEvent.y;
            console.log("_slideChild", this._asTile.fullName);
        }
    }

    _slideStart(pfEvent: PlayfieldEvent, child: Slideable) {
        if (!child._isSlideableInitialized) return;
        if (child._asTile.inBounds(pfEvent.x, pfEvent.y, pfEvent)) {
            let dx = pfEvent.x - child._asTile.X;
            let dy = pfEvent.y - child._asTile.Y;
            if (child.onSlideStart(dx, dy, pfEvent)) {
                // if the child does not reject the "grab"
                this._slideEnd(pfEvent, child);
                this._slideX = pfEvent.x;
                this._slideY = pfEvent.y;
                this._slideObj = child;
                this._asTile.playfield.eventObject = child._asTile;
                console.log("_slideStart", child._asTile.fullName);
            }
        }
    }

    _slideEnd(pfEvent: PlayfieldEvent, child: Slideable) {
        if (this._slideObj) {
            this._slideObj.onSlideEnd(pfEvent);
            this._slideObj = null;
            this._asTile.playfield.eventObject = null;
            console.log("_slideEnd", this._asTile.fullName);
        }
    }

}