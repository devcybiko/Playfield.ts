import { PlayfieldEvent } from "../PlayfieldEvent"
import { Tile } from "../Tile";
import { Logger } from "../../Utils";

/**
 * can dispatch an event to other handlers
 */
export interface Eventable { }
export class Eventable {
    protected _isEventableInitialized: boolean;
    public _logger: Logger;
    public _asTile: Tile;

    Eventable() {
        this._isEventableInitialized = true;
    }

    // --- static methods --- //
    public static cast(obj: any): Eventable {
        return obj as unknown as Eventable;
    }

    dispatchEvent(pfEvent: PlayfieldEvent, controller: any): void {
        let anyThis = this as any;
        if (pfEvent.isMouseEvent) {
            if (pfEvent.isActive && anyThis._isHoverableInitialized && controller.hoverEvent) controller.hoverEvent(pfEvent, this);
            if (anyThis.inBounds(pfEvent.x, pfEvent.y, pfEvent)) {
                if (pfEvent.isActive && anyThis._isSelectableInitialized && controller.selectEvent) controller.selectEvent(pfEvent, this);
                if (pfEvent.isActive && anyThis._isClickableInitialized && controller.clickEvent) controller.clickEvent(pfEvent, this);
                if (pfEvent.isActive && anyThis._isPressableInitialized && controller.pressEvent) controller.pressEvent(pfEvent, this);
                if (pfEvent.isActive && anyThis.isFocusable && controller.editEvent) controller.editEvent(pfEvent, this);
                if (pfEvent.isActive && anyThis._isSwipeableInitialized && controller.swipeEvent) controller.swipeEvent(pfEvent, this);
                if (pfEvent.isActive && anyThis.isDragEnabled && controller.dragEvent) controller.dragEvent(pfEvent, this);
            }
        } else if (pfEvent.isKeyboardEvent) {
            console.log("xxx", this, pfEvent);
            if (pfEvent.isActive && anyThis.isFocusable && controller.editEvent) controller.editEvent(pfEvent, this);
        }
    }

    // --- On Actions --- //

    // onEvent is a visitor pattern method
    // if it returns 'truthy' then all processing stops.
    // if it returns "stop-children" then no child objects are processed
    onEvent(pfEvent: PlayfieldEvent, controller: Tile): any {
        // by default we dispatch all events
        // if you want to stop child or other processing
        // you must override THIS method (not the dispatheEvent) and return truthy values or "stop-children"
        pfEvent.touchedBy.push((this as any).fullName);
        this.dispatchEvent(pfEvent, controller);
    }

}
