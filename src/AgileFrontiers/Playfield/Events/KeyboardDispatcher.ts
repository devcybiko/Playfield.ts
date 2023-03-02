import { inclusive, Logger } from "../../Utils";
import {Keyboardable} from "./KeyboardableMixin";
import {KeyEvent} from "./KeyEvent";

export interface hasKeyboardDispatcher {
    get keyboardDispatcher(): KeyboardDispatcher;
}

export class KeyboardDispatcher {
    _obj: Keyboardable;
    _logger: Logger;
    _doKeyDown = true;
    _doKeyUp = false;

    constructor(obj: Keyboardable, options = {} as any) {
        this._obj = obj;
        this._logger = new Logger();
        this._logger.Logger();
        this._doKeyDown = options.doKeyDown || this._doKeyDown;
        this._doKeyUp = options.doKeyUp || this._doKeyUp;
    }
    _keyEvent(event: any): KeyEvent {
        let myEvent = new KeyEvent(event);
        return myEvent;
    }

    dispatchEvent(event: any) {
        event.preventDefault();
        if (event.key !== undefined) this.dispatchKeyboardEvent(event);
        else this.dispatchUnknownKeyboardEvent(event);
        return false;
    }
    dispatchUnknownKeyboardEvent(event: any) {
        this._logger.error("dispatchUnknownKeyboardEvent:", event);
    }
    dispatchKeyboardEvent(event: any) {
        let keyEvent = this._keyEvent(event);
        this._logger.log("dispatchKeyboardEvent:", event);
        let obj = this._obj;
        let stop = false;
        if (event.type === "keydown" && this._doKeyDown) {
            stop = obj.KeyDown(keyEvent);
            stop = this.dispatchMoreKeys(event);
        }
        if (!stop && event.type === "keyup" && this._doKeyUp) {
            stop = obj.KeyUp(event);
            stop = this.dispatchMoreKeys(event);
        }
    }
    dispatchMoreKeys(event: any) {
        this._logger.log("dispatchMoreKeys:", event);
        let keyEvent = this._keyEvent(event);
        let key = event.key;
        let obj = this._obj;
        if (key.length > 1) return this._specialKey(keyEvent);
        else if (key.length === 1 && event.ctrlKey) return obj.ControlKey(keyEvent);
        else if (key.length === 1 && event.metaKey) return obj.MetaKey(keyEvent);
        else if (key.length === 1 && event.altKey) return obj.AltKey(keyEvent);
        else if (key.length === 1) return this._ordinaryKey(keyEvent);
        else return obj.defaultKey(keyEvent);
    }
    _ordinaryKey(keyEvent: KeyEvent) {
        this._logger.log("OrdinaryKey:", keyEvent);
        let obj = this._obj;
        let key = keyEvent.key;
        if (obj.OrdinaryKey(keyEvent)) return true;

        if (inclusive("A", key, "Z")) return obj.UpperCase(keyEvent);
        else if (inclusive("a", key, "z")) return obj.LowerCase(keyEvent);
        else if (inclusive("0", key, "9")) return obj.Digit(keyEvent);
        else if ("!@#$%^&*()-_+={}[]|\:;\"'<>,.?/".includes(key)) return obj.Punctuation(keyEvent);
        else return obj.defaultKey(keyEvent);
    }
    _specialKey(keyEvent: KeyEvent) {
        console.log("special key", event);
        let key = keyEvent.key;
        let obj = this._obj;
        if (obj.SpecialKey(keyEvent)) return true;
        console.log("////special key", keyEvent);

        if (key === "ArrowUp") return obj.ArrowUp(keyEvent);
        else if (key === "ArrowDown") return obj.ArrowDown(keyEvent);
        else if (key === "ArrowLeft") return obj.ArrowLeft(keyEvent);
        else if (key === "ArrowRight") return obj.ArrowRight(keyEvent);
        else if (key === "ArrowLeft") return obj.ArrowLeft(keyEvent);
        else if (key === "Shift") return obj.Shift(keyEvent);
        else if (key === "Meta") return obj.Meta(keyEvent);
        else if (key === "Alt") return obj.Alt(keyEvent);
        else if (key === "Control") return obj.Control(keyEvent);
        else if (key === "Backspace") return obj.Backspace(keyEvent);
        else if (key === "Tab") return obj.TabKey(keyEvent);
        else if (key[0] === "F") return obj.FunctionKey(keyEvent);
        else return obj.defaultKey(keyEvent);
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