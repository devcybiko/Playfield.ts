import { Hoverable } from "./Hoverable";
import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

/**
 * can control Hoverable
 */
export interface HoverController { };
export class HoverController {
    protected _isHoverController: boolean;
    public _asTile: Tile;

    HoverController() {
        this._isHoverController = true;
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