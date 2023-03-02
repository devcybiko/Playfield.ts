import { Hoverable } from "./HoverableMixin";
import { MouseEvent } from "../Events/MouseEvent";

export interface Hoveer { };
export class Hoverer {
    Hoverer() {
        return this;
    }

    _hoverChild(child: Hoverable, myEvent: MouseEvent): boolean {
        if (child.isHoverable) {
            if (!child.isHovering) {
                child.isHovering = true;
                child.onEnter(myEvent);
                return true;
            } else {
                child.onHovering(myEvent);
                return true;
            }
        }
        return false;
    }
    _hoverExitChild(child: Hoverable, myEvent?: MouseEvent): boolean {
        if (child.isHovering) {
            child.isHovering = false;
            child.onExit(myEvent);
            return true;
        }
        return false;
    }
}