import { Hoverable } from "./HoverableMixin";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

/**
 * can control Hoverable
 */
export interface Hoveer { };
export class Hoverer {
    protected isHoverer: boolean;

    Hoverer() {
        this.isHoverer = true;
        return this;
    }

    // --- Public Methods --- //
    
    hoverEvent(pfEvent: PlayfieldEvent, child: Hoverable) {
        let tileChild = child as unknown as Tile;
        if (pfEvent.isMove) {
            if (tileChild.inBounds(pfEvent.x, pfEvent.y, pfEvent)) {
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
    }
}