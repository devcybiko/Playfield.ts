import { Hoverable } from "./HoverableMixin";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

export interface Hoveer { };
export class Hoverer {
    Hoverer() {
        return this;
    }

    // --- Public Methods --- //
    
    hoverEvent(pfEvent: PlayfieldEvent, child: Hoverable): boolean {
        let treeChild = child as unknown as Tile;
        if (pfEvent.isMove) {
            if (treeChild.inBounds(pfEvent.x, pfEvent.y)) {
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
            return true;
        }
        return false;
    }
}