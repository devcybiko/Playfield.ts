import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

export interface EventDispatcher { };
export class EventDispatcher {

    EventDispatcher() {
        return this;
    }

    // --- Public Methods --- //

    dispatchEventToChildren(pfEvent: PlayfieldEvent): boolean {
        let thisTile = this as unknown as Tile;
        let processed = false;
        for (let _child of thisTile.children) {
            let child = _child as any;
            processed = this.dispatchEventToChild(pfEvent, child) || processed;
        }
        return processed;
    }

    dispatchEventToChild(pfEvent: PlayfieldEvent, child: any): boolean {
        let that = this as any;
        let processed = false;
        if (child.isHoverable) processed = that.hoverEvent(pfEvent, child) || processed;
        if (child.isDraggable) processed = that.dragEvent(pfEvent, child) || processed;
        if (child.isSelectable) processed = that.selectEvent(pfEvent, child) || processed;
        if (child.isClickable) processed = that.clickEvent(pfEvent, child) || processed;
        if (child.isPressable) processed = that.pressEvent(pfEvent, child) || processed;
        if (child.isFocusable) processed = that.editorEvent(pfEvent, child) || processed;
        processed = child.onEvent(pfEvent) || processed;
        return processed;
    }

}