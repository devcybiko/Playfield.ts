import { inclusive, Logger } from "../../Utils";

export class EventDispatcher {
    _obj: any;
    _logger: Logger;
    _doKeyDown = true;
    _doKeyUp = false;
    constructor(obj: any, options = {} as any) {
        this._obj = obj;
        this._logger = new Logger("log");
        this._doKeyDown = options.doKeyDown || this._doKeyDown;
        this._doKeyUp = options.doKeyUp || this._doKeyUp;
    }
    dispatchEvent(event: any) {
        if (event.button !== undefined) return this.dispatchMouseEvent(event);
        else if (event.key !== undefined) return this.dispatchKeyboardEvent(event);
        else return this.dispatchUnknownEvent(event);
    }
    dispatchUnknownEvent(event: any) {
        this._logger.error("dispatchUnknownEvent:", event);
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
            return this.dispatchUnknownEvent(event);
        }
    }
    dispatchKeyboardEvent(event: any) {
        this._logger.log("dispatchKeyboardEvent:", event);
        let obj = this._obj;
        let stop = false;
        if (event.type === "keydown" && this._doKeyDown) {
            stop = obj.KeyDown(event);
            stop = this.dispatchMoreKeys(event);
        }
        if (!stop && event.type === "keyup" && this._doKeyUp) {
            stop = obj.KeyUp(event);
            stop = this.dispatchMoreKeys(event);
        }
    }
    dispatchMoreKeys(event: any) {
        this._logger.log("dispatchMoreKeys:", event);
        let key = event.key;
        let obj = this._obj;
        let stop = false;
        if (key.length > 1) return obj.SpecialKey(event);
        else if (key.length === 1 && event.ctrlKey) return obj.ControlKey(event);
        else if (key.length === 1 && event.metaKey) return obj.MetaKey(event);
        else if (key.length === 1 && event.altKey) return obj.AltKey(event);
        else if (key.length === 1) return obj.OrdinaryKey(event);
        else return obj.defaultKey(event);
    }
    OrdinaryKey(event: any) {
        this._logger.log("OrdinaryKey:", event);
        let key = event.key;
        let obj = this._obj;
        if (inclusive("A", key, "Z")) return obj.UpperCase(event);
        else if (inclusive("a", key, "z")) return obj.LowerCase(event);
        else if (inclusive("0", key, "9")) return obj.Digit(event);
        else if ("!@#$%^&*()-_+={}[]|\:;\"'<>,.?/".includes(key)) return obj.Punctuation(event);
        else return obj.defaultKey(event);
    }
    SpecialKey(event: any) {
        this._logger.log("SpecialKey:", event);
        let key = event.key;
        let obj = this._obj;
        if (key === "ArrowUp") return obj.ArrowUp(event);
        else if (key === "ArrowDown") return obj.ArrowDown(event);
        else if (key === "ArrowLeft") return obj.ArrowLeft(event);
        else if (key === "ArrowRight") return obj.ArrowRight(event);
        else if (key === "ArrowLeft") return obj.ArrowLeft(event);
        else if (key === "Shift") return obj.Shift(event);
        else if (key === "Meta") return obj.Meta(event);
        else if (key === "Alt") return obj.Alt(event);
        else if (key === "Control") return obj.Control(event);
        else if (key === "Backspace") return obj.Backspace(event);
        else if (key[0] === "F") return obj.FunctionKey(event);
        else return obj.defaultKey(event);
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
