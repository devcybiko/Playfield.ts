import { inclusive, Logger } from "../../Utils";
import {Mouseable} from "./Mouseable";

export interface hasMouseDispatcher {
    get mouseDispatcher(): MouseDispatcher;
}

export class MouseDispatcher {
    _obj: Mouseable;
    _logger: Logger;
    constructor(obj: Mouseable, options = {} as any) {
        this._obj = obj;
        this._logger = new Logger();
    }
    dispatchEvent(event: any) {
        if (event.button !== undefined) return this.dispatchMouseEvent(event);
    }
    dispatchUnknownMouseEvent(event: any) {
        this._logger.error("dispatchUnknownMouseEvent:", event);
    }
    dispatchMouseEvent(event: any) {
        this._logger.info("dispatchMouseEvent:", event);
        let obj = this._obj;
        if (!obj) return this._logger.error('ERROR: mousemove not associated with an object');
        if (event.type === "mousedown") {
            if (event.button === 0) return obj.MouseDown(event);
            if (event.button === 1) return obj.MiddleDown(event);
            if (event.button === 2) return obj.MenuDown(event);
        } else if (event.type === "mouseup") {
            if (event.button === 0) return obj.MouseUp(event);
            if (event.button === 1) return obj.MiddleUp(event);
            if (event.button === 2) return obj.MenuUp(event);
        } else if (event.type === "mousemove") {
            return obj.MouseMove(event);
        } else if (event.type === "wheel") {
            if (event.wheelDelta >= 0) return obj.WheelDown(event, event.wheelDelta);
            if (event.wheelDelta < 0) return obj.WheelUp(event, -event.wheelDelta);
        } else {
            return this.dispatchUnknownMouseEvent(event);
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