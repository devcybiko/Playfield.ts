import { PlayfieldEvent } from "../PlayfieldEvent"
import { Tile } from "../Tile";
import { Logger } from "../../Utils";

/**
 * can dispatch an event to other handlers
 */
export interface DispatchController { }
export class DispatchController {
    protected _isDispatchControllerInitialized: boolean;
    public _logger: Logger;
    public _asTile: Tile;

    DispatchController() {
        this._isDispatchControllerInitialized = true;
    }

    // --- static methods --- //
    public static cast(obj: any): DispatchController {
        return obj as unknown as DispatchController;
    }

    _dispatchEvent(pfEvent: PlayfieldEvent, controller: any): any {
        let anyThis = this as any;
        let inBounds = anyThis.inBounds(pfEvent.x, pfEvent.y, pfEvent);
        if (pfEvent.isMouseEvent) {
            if (pfEvent.isActive && anyThis._isHoverableInitialized && controller.hoverEvent) controller.hoverEvent(pfEvent, this);
            if (pfEvent.isActive && anyThis.isDraggable && controller.dragEvent) controller.dragEvent(pfEvent, this);
            if (pfEvent.isActive && anyThis._isSlideableInitialized && controller.slideEvent) controller.slideEvent(pfEvent, this);
            if (inBounds) {
                // if (!pfEvent.isMove) console.log(controller);
                // if (!pfEvent.isMove) console.log(anyThis);
                if (pfEvent.isActive && anyThis._isSwipeableInitialized && controller.swipeEvent) controller.swipeEvent(pfEvent, this);
                if (pfEvent.isActive && anyThis._isSelectableInitialized && controller.selectEvent) controller.selectEvent(pfEvent, this);
                if (pfEvent.isActive && anyThis._isClickableInitialized && controller.clickEvent) controller.clickEvent(pfEvent, this);
                if (pfEvent.isActive && anyThis._isPressableInitialized && controller.pressEvent) controller.pressEvent(pfEvent, this);
                if (pfEvent.isActive && anyThis.isFocusable && controller.editEvent) controller.editEvent(pfEvent, this);
            }
        } else if (pfEvent.isKeyboardEvent) {
            if (pfEvent.isActive && anyThis.isFocusable && controller.editEvent) controller.editEvent(pfEvent, this);
        }
        return false;
    }

    // --- On Actions --- //

    // onEvent is a visitor pattern method
    // if it returns 'truthy' then all processing stops.
    // if it returns "stop-children" then no child objects are processed
    onEvent(pfEvent: PlayfieldEvent, controller: Tile): any {
        let anyThis = this as any;
        // by default we dispatch all events
        // if you want to stop child or other processing
        // you must override THIS method and return truthy values or "stop-children"
        // pfEvent.touchedBy.push((this as any).fullName);
        if (anyThis.isVisible) {
            let stop = this._dispatchEvent(pfEvent, this._asTile.parent);
            return stop || !pfEvent.isActive; // stop processing if we've swallowed the event
        } else {
            return "stop-children";
        }
    }

}
