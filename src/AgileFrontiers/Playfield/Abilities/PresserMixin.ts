import { Pressable } from "./PressableMixin";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

export interface Presser { };
export class Presser {
    Presser() {
        return this;
    }

    // --- Public Methods --- //
    
    pressEvent(pfEvent: PlayfieldEvent, child: Pressable) {
        let treeChild = child as unknown as Tile;
        if (treeChild.inBounds(pfEvent.x, pfEvent.y)) {
            if (pfEvent.isPress) {
                child.isPressed = true;
                child.onPress(pfEvent);
            }
        }
        if (pfEvent.isRelease && child.isPressed) {
            child.isPressed = false;
            child.onPress(pfEvent);
        }
    }
}