import { inclusive, Logger } from "../../Utils";
import { Mouseable } from "./MouseableMixin";
import { MyEvent } from "./MyEvent";

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
    _myEvent(event: any): MyEvent {
        let myEvent = new MyEvent(event.offsetX, event.offsetY, event.button, event.type);
        return myEvent;
    }
    dispatchEvent(event: any) {
        let myEvent = this._myEvent(event);
        if (event.button !== undefined) return this.dispatchMouseEvent(myEvent);
        else return this.dispatchUnknownMouseEvent(event);
    }
    dispatchUnknownMouseEvent(event: any) {
        this._logger.error("dispatchUnknownMouseEvent:", event);
    }
    dispatchMouseEvent(myEvent: MyEvent) {
        this._logger.warn("dispatchMouseEvent:", myEvent);
        let obj = this._obj;
        if (!obj) return this._logger.error('ERROR: mousemove not associated with an object');
        if (myEvent.type === "mousedown") {
            if (myEvent.button === "select") return obj.MouseDown(myEvent);
            if (myEvent.button === "middle") return obj.MiddleDown(myEvent);
            if (myEvent.button === "menu") return obj.MenuDown(myEvent);
        } else if (myEvent.type === "mouseup") {
            if (myEvent.button === "select") return obj.MouseUp(myEvent);
            if (myEvent.button === "middle") return obj.MiddleUp(myEvent);
            if (myEvent.button === "menu") return obj.MenuUp(myEvent);
        } else if (myEvent.type === "mousemove") {
            return obj.MouseMove(myEvent);
        } else if (myEvent.type === "wheel") {
            if (myEvent.wheelDelta >= 0) return obj.WheelDown(myEvent, myEvent.wheelDelta);
            if (myEvent.wheelDelta < 0) return obj.WheelUp(myEvent, -myEvent.wheelDelta);
        } else {
            return this.dispatchUnknownMouseEvent(myEvent);
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