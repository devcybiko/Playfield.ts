import { Pressable } from "./PressableMixin";
import { MouseEvent } from "../Events";
import { PlayfieldEvent } from "../PlayfieldEvents";

export interface Presser { };
export class Presser {
    Presser() {
        return this;
    }

    _pressDownChild(child: Pressable, pfEvent: PlayfieldEvent): boolean {
        child.onPress(pfEvent);
        return true;
    }
    _pressUpChild(child: Pressable, pfEvent: PlayfieldEvent): boolean {
        child.onRelease(pfEvent);
        return true;
    }
}