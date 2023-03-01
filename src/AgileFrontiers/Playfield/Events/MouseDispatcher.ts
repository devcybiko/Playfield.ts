import { inclusive, Logger } from "../../Utils";
import { Mouseable } from "./MouseableMixin";
import { MouseEvent } from "./MouseEvent";

export class MouseDispatcher {
    _obj: Mouseable;
    _logger: Logger;
    constructor(obj: Mouseable, options = {} as any) {
        this._obj = obj;
        this._logger = new Logger();
    }
    _mouseEvent(event: any): MouseEvent {
        let mouseEvent = new MouseEvent(event.offsetX, event.offsetY, event.button, event.type);
        return mouseEvent;
    }
    dispatchEvent(event: any) {
        let mouseEvent = this._mouseEvent(event);
        if (event.button !== undefined) return this.dispatchMouseEvent(mouseEvent);
        else return this.dispatchUnknownMouseEvent(event);
    }
    dispatchUnknownMouseEvent(event: any) {
        this._logger.error("dispatchUnknownMouseEvent:", event);
    }
    dispatchMouseEvent(mouseEvent: MouseEvent) {
        this._logger.warn("dispatchMouseEvent:", mouseEvent);
        let obj = this._obj;
        if (!obj) return this._logger.error('ERROR: mousemove not associated with an object');
        if (mouseEvent.type === "mousedown") {
            if (mouseEvent.button === "select") return obj.MouseDown(mouseEvent);
            if (mouseEvent.button === "middle") return obj.MiddleDown(mouseEvent);
            if (mouseEvent.button === "menu") return obj.MenuDown(mouseEvent);
        } else if (mouseEvent.type === "mouseup") {
            if (mouseEvent.button === "select") return obj.MouseUp(mouseEvent);
            if (mouseEvent.button === "middle") return obj.MiddleUp(mouseEvent);
            if (mouseEvent.button === "menu") return obj.MenuUp(mouseEvent);
        } else if (mouseEvent.type === "mousemove") {
            return obj.MouseMove(mouseEvent);
        } else if (mouseEvent.type === "wheel") {
            if (mouseEvent.wheelDelta >= 0) return obj.WheelDown(mouseEvent, mouseEvent.wheelDelta);
            if (mouseEvent.wheelDelta < 0) return obj.WheelUp(mouseEvent, -mouseEvent.wheelDelta);
        } else {
            return this.dispatchUnknownMouseEvent(mouseEvent);
        }
    }
}
    /**
* Event Hierarchy
- handleEvent
- handleMouseEvent
- MouseDown (left button only)
- MouseUp (left button only)
- MenuDown (right button only)
- MenuUp (right button only)
- MiddleDown (middle button only)
- MiddleUp (middle button only)
- WheelDown (wheel scrolling)
- WheelUp (wheel scrolling)
- handleMouseMove
- handleKeyboardEvent
- keydown: 
- SpecialKey (Shift, Meta, Alt, Control)
- ArrowUp
- ArrowDown
- ArrowRight
- ArrowLeft
- Meta
- Shift
- Alt
- Control
- Backspace
- FunctionKey
- defaultKey
- ControlKey (Control-xxx)
- MetaKey (Meta-xxx)
- AltKey (Alt-xxx)
- OrdinaryKey (a-z, A-Z, etc...)
- UpperCase
- LowerCase
- Digit
- Punctuation
- defaultKey
- defaultKey (any others)
- defaultKey (keyup, etc...)
- handleUnknownEvent
* 
*/