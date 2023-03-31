import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";
import { Dispatchable } from "./DispatchableMixin";

/**
 * dispatches events to children
 */
export interface Dispatcher { };
export class Dispatcher {
    protected isDispatcher: boolean;

    Dispatcher() {
        this.isDispatcher = true;
        return this;
    }

    // --- Public Methods --- //

    dispatchEventToChildren(pfEvent: PlayfieldEvent): void {
        // Note: this passes the event to every immediate child
        //       if the children have children it is the 
        //       responsibility of the children to pass the event down
        let thisTile = this as unknown as Tile;
        if (pfEvent.isMouseEvent && thisTile.inBounds(pfEvent.x, pfEvent.y, pfEvent)) {
            this._forEachChild(pfEvent);
        } else if (pfEvent.isKeyboardEvent) {
            this._forEachChild(pfEvent);
        }
    }


    _forEachChild(pfEvent: PlayfieldEvent) {
        let thisTile = this as unknown as Tile;
        pfEvent.touchedBy.push(thisTile.fullName);
        for (let child of thisTile.children.reverse()) {
            let dispatchableChild = child as unknown as Dispatchable;
            if (pfEvent.isActive) {
                dispatchableChild.onEvent(pfEvent);
            }
        }
    }

    onEvent(pfEvent: PlayfieldEvent) {
        let thisTile = this as unknown as Tile;
        thisTile.dispatchEvent(pfEvent, thisTile as unknown as Dispatchable);
    }
}