import { Pressable } from "./PressableMixin";
import { MouseEvent } from "../Events";

export interface Presser { };
export class Presser {
    Presser() {
        return this;
    }

    _pressDownChild(child: Pressable, mouseEvent: MouseEvent): boolean {
        child.onPress(mouseEvent);
        return true;
    }
    _pressUpChild(child: Pressable, mouseEvent: MouseEvent): boolean {
        child.onRelease(mouseEvent);
        return true;
    }
}