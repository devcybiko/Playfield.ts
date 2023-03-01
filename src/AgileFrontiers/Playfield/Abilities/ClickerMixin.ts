import { Clickable } from "./ClickableMixin";
import { MouseEvent } from "../Events";

export interface Clicker { };
export class Clicker {
    Clicker() {
        return this;
    }

    _clickChild(child: Clickable, mouseEvent: MouseEvent): boolean {
        child.onClick(mouseEvent);
        return true;
    }
}