import { Hoverable } from "./HoverableMixin";
import { PlayfieldEvent } from "../PlayfieldEvents";

export interface Hoveer { };
export class Hoverer {
    Hoverer() {
        return this;
    }

    _hoverEvent(pfEvent: PlayfieldEvent, child: Hoverable): boolean {
        let anyChild = child as any;
        if (pfEvent.type === "mousemove") {
            if (anyChild.inBounds(pfEvent.x, pfEvent.y)) {
                if (child.isHovering) {
                    child.onHovering(pfEvent);
                } else {
                    child.isHovering = true;
                    child.onEnter(pfEvent);
                }
            } else {
                if (child.isHovering) {
                    child.isHovering = false;
                    child.onExit(pfEvent);
                }
            }
        }
        return true;
    }
}