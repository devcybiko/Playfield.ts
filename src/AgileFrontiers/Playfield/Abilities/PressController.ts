import { Pressable } from "./Pressable";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

/**
 * can control Pressable
 */
export interface PressController { };
export class PressController {
    protected _isPressControllerInitialized: boolean;
    public _asTile: Tile;
    
    PressController() {
        this._isPressControllerInitialized = true;
        return this;
    }

    // --- Public Methods --- //

    pressEvent(pfEvent: PlayfieldEvent, child: Pressable) {
        let tileChild = child as unknown as Tile;
        if (pfEvent.isPress && tileChild.inBounds(pfEvent.x, pfEvent.y, pfEvent)) {
            child.isPressed = true;
            child.onPress(pfEvent);
        }
        if (pfEvent.isRelease && child.isPressed) {
            child.isPressed = false;
            child.onRelease(pfEvent);
        }
    }
}