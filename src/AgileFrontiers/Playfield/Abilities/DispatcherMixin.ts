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
        let thisTile = Tile.cast(this);
        if (pfEvent.isMouseEvent && thisTile.inBounds(pfEvent.x, pfEvent.y)) {
            this._forEachChild(pfEvent);
        } else if (pfEvent.isKeyboardEvent) {
            this._forEachChild(pfEvent);
        }
    }


    _forEachChild(pfEvent: PlayfieldEvent) {
        let thisTile = Tile.cast(this);
        for (let child of thisTile.children.reverse()) {
            let dispatchableChild = Dispatchable.cast(child);
            if (pfEvent.isActive) dispatchableChild.onEvent(pfEvent);
        }
    }

    onEvent(pfEvent: PlayfieldEvent) {
        Dispatchable.cast(this).dispatchEvent(pfEvent, Tile.cast(this).parent);
        this.dispatchEventToChildren(pfEvent);
    }
}