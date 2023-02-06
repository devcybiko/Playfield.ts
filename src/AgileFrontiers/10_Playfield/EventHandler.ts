class EventHandler {
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
    public playfield: Playfield;
    public obj: any;
    public logger: Logger;
    constructor(playfield: Playfield, obj: any) {
        this.playfield = playfield;
        this.obj = obj;
        this.logger = new Logger("EventHandler", "info");
    }
    handleEvent(event: any) {
        if (event.button !== undefined) return this.handleMouseEvent(event);
        else if (event.key !== undefined) return this.handleKeyboardEvent(event);
        else return this.handleUnknownEvent(event);
    }
    handleUnknownEvent(event: any) {
        this.logger.error("handleUnknownEvent:", event);
    }
    handleMouseEvent(event: any) {
        this.logger.log("handleMouseEvent:", event);
        let playfield = this.playfield;
        if (!playfield) return this.logger.error('ERROR: mousemove not associated with a playfield');
        if (event.type === "mousedown") {
            if (event.button === 0) return this.MouseDown(event, playfield, this.obj);
            if (event.button === 1) return this.MiddleDown(event, playfield, this.obj);
            if (event.button === 2) return this.MenuDown(event, playfield, this.obj);
        } else if (event.type === "mouseup") {
            if (event.button === 0) return this.MouseUp(event, playfield, this.obj);
            if (event.button === 1) return this.MiddleUp(event, playfield, this.obj);
            if (event.button === 2) return this.MenuUp(event, playfield, this.obj);
        } else if (event.type === "mousemove") {
            return this.MouseMove(event, playfield, this.obj);
        } else if (event.type === "wheel") {
            if (event.wheelDelta >= 0) return this.WheelDown(event, playfield, this.obj, event.wheelDelta);
            if (event.wheelDelta < 0) return this.WheelUp(event, playfield, this.obj, -event.wheelDelta);
        } else {
            return this.handleUnknownEvent(event);
        }
    }
    handleKeyboardEvent(event: any) {
        this.logger.log("handleKeyboardEvent:", event);
        let playfield = this.playfield;
        if (!playfield) return this.logger.error('ERROR: mousemove not associated with a playfield');
        let key = event.key;
        if (event.type === "keydown") {
            if (key.length > 1) return this.SpecialKey(event, this.playfield, this.obj);
            else if (key.length === 1 && event.ctrlKey) return this.ControlKey(event, this.playfield, this.obj);
            else if (key.length === 1 && event.metaKey) return this.MetaKey(event, this.playfield, this.obj);
            else if (key.length === 1 && event.altKey) return this.AltKey(event, this.playfield, this.obj);
            else if (key.length === 1) return this.OrdinaryKey(event, this.playfield, this.obj);
            else return this.defaultKey(event, this.playfield, this.obj);
        }
        else return this.defaultKey(event, this.playfield, this.obj);
    }
    MouseUp(event: any, playfield: Playfield, obj: any) {
        this.logger.log("MouseUp:", event);
    }
    MouseDown(event: any, playfield: Playfield, obj: any) {
        this.logger.log("MouseDown:", event);
    }
    MenuUp(event: any, playfield: Playfield, obj: any) {
        this.logger.log("MenuUp:", event);
    }
    MenuDown(event: any, playfield: Playfield, obj: any) {
        this.logger.log("MenuDown:", event);
    }
    MiddleUp(event: any, playfield: Playfield, obj: any) {
        this.logger.log("MiddleUp:", event);
    }
    MiddleDown(event: any, playfield: Playfield, obj: any) {
        this.logger.log("MiddleDown:", event);
    }
    WheelUp(event: any, playfield: Playfield, obj: any, delta: number) {
        this.logger.log("WheelUp:", delta, event);
    }
    WheelDown(event: any, playfield: Playfield, obj: any, delta: number) {
        this.logger.log("WheelDown:", delta, event);
    }
    MouseMove(event: any, playfield: Playfield, obj: any) {
        this.logger.log("MouseMove:", event);
    }
    OrdinaryKey(event: any, playfield: Playfield, obj: any) {
        this.logger.log("OrdinaryKey:", event);
        let key = event.key;
        if (Utils.between("A", key, "Z")) return this.UpperCase(event, this.playfield, this.obj);
        else if (Utils.between("a", key, "z")) return this.LowerCase(event, this.playfield, this.obj);
        else if (Utils.between("0", key, "9")) return this.Digit(event, this.playfield, this.obj);
        else if ("!@#$%^&*()-_+={}[]|\:;\"'<>,.?/".includes(key)) return this.Punctuation(event, this.playfield, this.obj);
        else return this.defaultKey(event, this.playfield, this.obj);
    }
    SpecialKey(event: any, playfield: Playfield, obj: any) {
        this.logger.warn("SpecialKey:", event);
        let key = event.key;
        if (key === "ArrowUp") return this.ArrowUp(event, this.playfield, this.obj);
        else if (key === "ArrowDown") return this.ArrowDown(event, this.playfield, this.obj);
        else if (key === "ArrowLeft") return this.ArrowLeft(event, this.playfield, this.obj);
        else if (key === "ArrowRight") return this.ArrowRight(event, this.playfield, this.obj);
        else if (key === "ArrowLeft") return this.ArrowLeft(event, this.playfield, this.obj);
        else if (key === "Shift") return this.Shift(event, this.playfield, this.obj);
        else if (key === "Meta") return this.Meta(event, this.playfield, this.obj);
        else if (key === "Alt") return this.Alt(event, this.playfield, this.obj);
        else if (key === "Control") return this.Control(event, this.playfield, this.obj);
        else if (key === "Backspace") return this.Backspace(event, this.playfield, this.obj);
        else if (key[0] === "F") return this.FunctionKey(event, this.playfield, this.obj);
        else return this.defaultKey(event, this.playfield, this.obj);
    }
    Shift(event: any, playfield: Playfield, obj: any) {
        this.logger.log("Shift:", event);
    }
    Meta(event: any, playfield: Playfield, obj: any) {
        this.logger.log("Meta:", event);
    }
    MetaKey(event: any, playfield: Playfield, obj: any) {
        this.logger.log("MetaKey:", event);
    }
    Alt(event: any, playfield: Playfield, obj: any) {
        this.logger.log("Alt:", event);
    }
    AltKey(event: any, playfield: Playfield, obj: any) {
        this.logger.log("AltKey:", event);
    }
    Control(event: any, playfield: Playfield, obj: any) {
        this.logger.log("Control:", event);
    }
    ControlKey(event: any, playfield: Playfield, obj: any) {
        this.logger.log("ControlKey:", event);
    }
    Backspace(event: any, playfield: Playfield, obj: any) {
        this.logger.log("Backspace:", event);
    }
    UpperCase(event: any, playfield: Playfield, obj: any) {
        this.logger.log("UpperCase:", event);
    }
    LowerCase(event: any, playfield: Playfield, obj: any) {
        this.logger.log("LowerCase:", event);
    }
    Digit(event: any, playfield: Playfield, obj: any) {
        this.logger.log("Digit:", event);
    }
    Punctuation(event: any, playfield: Playfield, obj: any) {
        this.logger.log("Punctuation:", event);
    }
    FunctionKey(event: any, playfield: Playfield, obj: any) {
        this.logger.log("FunctionKey:", event);
    }
    ArrowUp(event: any, playfield: Playfield, obj: any) {
        this.logger.log("ArrowUp:", event);
    }
    ArrowDown(event: any, playfield: Playfield, obj: any) {
        this.logger.log("ArrowDown:", event);
    }
    ArrowLeft(event: any, playfield: Playfield, obj: any) {
        this.logger.log("ArrowLeft:", event);
    }
    ArrowRight(event: any, playfield: Playfield, obj: any) {
        this.logger.log("ArrowRight:", event);
    }
    defaultKey(event: any, playfield: Playfield, obj: any) {
        this.logger.log("unknown keypress:", event.key, event);
    }
}
