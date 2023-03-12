import { PlayfieldEvent } from "../PlayfieldEvent";
import { Tile } from "../Tile";

export interface EventDispatcher { };
export class EventDispatcher {

    EventDispatcher() {
        return this;
    }

    // --- Public Methods --- //

    dispatchEventToChildren(pfEvent: PlayfieldEvent) {
        let thisTile = this as unknown as Tile;
        for (let _child of thisTile.children.reverse()) {
            let child = _child as any;
            if (pfEvent.isActive) this.dispatchEventToChild(pfEvent, child);
        }
    }

    dispatchEventToChild(pfEvent: PlayfieldEvent, child: any, callOnEvent = true) {
        let that = this as any;
        if (callOnEvent) child.onEvent(pfEvent, child);
        if (!pfEvent.isActive) return;
        if (child.isHoverable) that.hoverEvent(pfEvent, child);
        if (child.isDraggable) that.dragEvent(pfEvent, child);
        if (child.isSelectable) that.selectEvent(pfEvent, child);
        if (child.isClickable) that.clickEvent(pfEvent, child);
        if (child.isPressable) that.pressEvent(pfEvent, child);
        if (child.isFocusable) that.editorEvent(pfEvent, child);
    }
}