import { Pressable } from "./PressableMixin";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

/**
 * can control Pressable
 */
export interface Presser { };
export class Presser {
    protected isPresser: boolean;
    Presser() {
        this.isPresser = true;
        return this;
    }

    // --- Public Methods --- //

    pressEvent(pfEvent: PlayfieldEvent, child: Pressable) {
        let tileChild = Tile.cast(child);
        if (pfEvent.isPress && tileChild.inBounds(pfEvent.x, pfEvent.y)) {
            child.isPressed = true;
            child.onPress(pfEvent);
        }
        if (pfEvent.isRelease && child.isPressed) {
            child.isPressed = false;
            child.onRelease(pfEvent);
        }
    }
}