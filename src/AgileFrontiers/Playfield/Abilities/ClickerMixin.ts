import { Clickable } from "./ClickableMixin";
import { MyEvent } from "../Events";

export interface Clicker { };
export class Clicker {
    Clicker() {
        return this;
    }

    _clickChild(child: Clickable, myEvent: MyEvent): boolean {
        child.onClick(myEvent);
        return true;
    }
}