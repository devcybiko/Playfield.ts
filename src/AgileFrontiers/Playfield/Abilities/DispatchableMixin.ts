import { PlayfieldEvent } from "../PlayfieldEvent"
import { Tile } from "../Tile";

/**
 * can dispatch an event to other handlers
 */
export interface Dispatchable { }
export class Dispatchable {
    protected _isDispatchable: boolean;

    Dispatchable() {
        this.isDispatchable = true;
    }

    // --- static methods --- //
    public static cast(obj: any): Dispatchable {
        return obj as unknown as Dispatchable;
    }

    dispatchEvent(pfEvent: PlayfieldEvent, controller: any): void {
        let anyThis = this as any;
        if (pfEvent.isActive && anyThis.isHoverable && controller.hoverEvent) controller.hoverEvent(pfEvent, this);
        if (pfEvent.isActive && anyThis.isSelectable && controller.selectEvent) controller.selectEvent(pfEvent, this);
        if (pfEvent.isActive && anyThis.isClickable && controller.clickEvent) controller.clickEvent(pfEvent, this);
        if (pfEvent.isActive && anyThis.isPressable && controller.pressEvent) controller.pressEvent(pfEvent, this);
        if (pfEvent.isActive && anyThis.isFocusable && controller.editerEvent) controller.editerEvent(pfEvent, this);
        if (pfEvent.isActive && anyThis.isDraggable && controller.dragEvent) controller.dragEvent(pfEvent, this);
    }

    // --- On Actions --- //
    
    onEvent(pfEvent: PlayfieldEvent): void {
        this.dispatchEvent(pfEvent, (this as any).parent);
    }

    // --- Accessors --- //

    public get isDispatchable(): boolean {
        return this._isDispatchable;
    }
    public set isDispatchable(value: boolean) {
        this._isDispatchable = value;
    }

}
