class EventHandler {
    constructor(playfield, obj) {
        this.playfield = playfield;
        this.obj = obj;
        this.logger = new Logger("EventHandler", "info");
        playfield.canvas.addEventListener('mousedown', this.handleEvent.bind(this));
        playfield.canvas.addEventListener('mousemove', this.handleEvent.bind(this));
        playfield.canvas.addEventListener('mouseup', this.handleEvent.bind(this));
        playfield.canvas.addEventListener('wheel', this.handleEvent.bind(this), false);
        document.addEventListener("keydown", this.handleEvent.bind(this));
    }
    handleEvent(event) {
        if (event.button !== undefined)
            return this.handleMouseEvent(event);
        else if (event.key !== undefined)
            return this.handleKeyboardEvent(event);
        else
            return this.handleUnknownEvent(event);
    }
    handleUnknownEvent(event) {
        this.logger.error("handleUnknownEvent:", event);
    }
    handleMouseEvent(event) {
        this.logger.log("handleMouseEvent:", event);
        let playfield = this.playfield;
        if (!playfield)
            return this.logger.error('ERROR: mousemove not associated with a playfield');
        if (event.type === "mousedown") {
            if (event.button === 0)
                return this.MouseDown(event, playfield, this.obj);
            if (event.button === 1)
                return this.MiddleDown(event, playfield, this.obj);
            if (event.button === 2)
                return this.MenuDown(event, playfield, this.obj);
        }
        else if (event.type === "mouseup") {
            if (event.button === 0)
                return this.MouseUp(event, playfield, this.obj);
            if (event.button === 1)
                return this.MiddleUp(event, playfield, this.obj);
            if (event.button === 2)
                return this.MenuUp(event, playfield, this.obj);
        }
        else if (event.type === "mousemove") {
            return this.MouseMove(event, playfield, this.obj);
        }
        else if (event.type === "wheel") {
            if (event.wheelDelta >= 0)
                return this.WheelDown(event, playfield, this.obj, event.wheelDelta);
            if (event.wheelDelta < 0)
                return this.WheelUp(event, playfield, this.obj, -event.wheelDelta);
        }
        else {
            return this.handleUnknownEvent(event);
        }
    }
    handleKeyboardEvent(event) {
        this.logger.log("handleKeyboardEvent:", event);
        let playfield = this.playfield;
        if (!playfield)
            return this.logger.error('ERROR: mousemove not associated with a playfield');
        let key = event.key;
        let code = event.code;
        if (event.type === "keydown") {
            if (key.length > 1)
                return this.SpecialKey(event, this.playfield, this.obj);
            else if (key.length === 1 && event.ctrlKey)
                return this.ControlKey(event, this.playfield, this.obj);
            else if (key.length === 1 && event.metaKey)
                return this.MetaKey(event, this.playfield, this.obj);
            else if (key.length === 1 && event.altKey)
                return this.AltKey(event, this.playfield, this.obj);
            else if (key.length === 1)
                return this.OrdinaryKey(event, this.playfield, this.obj);
            else
                return this.defaultKey(event, this.playfield, this.obj);
        }
        else
            return this.defaultKey(event, this.playfield, this.obj);
    }
    MouseUp(event, playfield, obj) {
        this.logger.log("MouseUp:", event);
    }
    MouseDown(event, playfield, obj) {
        this.logger.log("MouseDown:", event);
    }
    MenuUp(event, playfield, obj) {
        this.logger.log("MenuUp:", event);
    }
    MenuDown(event, playfield, obj) {
        this.logger.log("MenuDown:", event);
    }
    MiddleUp(event, playfield, obj) {
        this.logger.log("MiddleUp:", event);
    }
    MiddleDown(event, playfield, obj) {
        this.logger.log("MiddleDown:", event);
    }
    WheelUp(event, playfield, obj, delta) {
        this.logger.log("WheelUp:", delta, event);
    }
    WheelDown(event, playfield, obj, delta) {
        this.logger.log("WheelDown:", delta, event);
    }
    MouseMove(event, playfield, obj) {
        this.logger.log("MouseMove:", event);
    }
    OrdinaryKey(event, playfield, obj) {
        this.logger.log("OrdinaryKey:", event);
        let key = event.key;
        if (Utils.between("A", key, "Z"))
            return this.UpperCase(event, this.playfield, this.obj);
        else if (Utils.between("a", key, "z"))
            return this.LowerCase(event, this.playfield, this.obj);
        else if (Utils.between("0", key, "9"))
            return this.Digit(event, this.playfield, this.obj);
        else if ("!@#$%^&*()-_+={}[]|\:;\"'<>,.?/".includes(key))
            return this.Punctuation(event, this.playfield, this.obj);
        else
            return this.defaultKey(event, this.playfield, this.obj);
    }
    SpecialKey(event, playfield, obj) {
        this.logger.warn("SpecialKey:", event);
        let key = event.key;
        if (key === "ArrowUp")
            return this.ArrowUp(event, this.playfield, this.obj);
        else if (key === "ArrowDown")
            return this.ArrowDown(event, this.playfield, this.obj);
        else if (key === "ArrowLeft")
            return this.ArrowLeft(event, this.playfield, this.obj);
        else if (key === "ArrowRight")
            return this.ArrowRight(event, this.playfield, this.obj);
        else if (key === "ArrowLeft")
            return this.ArrowLeft(event, this.playfield, this.obj);
        else if (key === "Shift")
            return this.Shift(event, this.playfield, this.obj);
        else if (key === "Meta")
            return this.Meta(event, this.playfield, this.obj);
        else if (key === "Alt")
            return this.Alt(event, this.playfield, this.obj);
        else if (key === "Control")
            return this.Control(event, this.playfield, this.obj);
        else if (key === "Backspace")
            return this.Backspace(event, this.playfield, this.obj);
        else if (key[0] === "F")
            return this.FunctionKey(event, this.playfield, this.obj);
        else
            return this.defaultKey(event, this.playfield, this.obj);
    }
    Shift(event, playfield, obj) {
        this.logger.log("Shift:", event);
    }
    Meta(event, playfield, obj) {
        this.logger.log("Meta:", event);
    }
    MetaKey(event, playfield, obj) {
        this.logger.log("MetaKey:", event);
    }
    Alt(event, playfield, obj) {
        this.logger.log("Alt:", event);
    }
    AltKey(event, playfield, obj) {
        this.logger.log("AltKey:", event);
    }
    Control(event, playfield, obj) {
        this.logger.log("Control:", event);
    }
    ControlKey(event, playfield, obj) {
        this.logger.log("ControlKey:", event);
    }
    Backspace(event, playfield, obj) {
        this.logger.log("Backspace:", event);
    }
    UpperCase(event, playfield, obj) {
        this.logger.log("UpperCase:", event);
    }
    LowerCase(event, playfield, obj) {
        this.logger.log("LowerCase:", event);
    }
    Digit(event, playfield, obj) {
        this.logger.log("Digit:", event);
    }
    Punctuation(event, playfield, obj) {
        this.logger.log("Punctuation:", event);
    }
    FunctionKey(event, playfield, obj) {
        this.logger.log("FunctionKey:", event);
    }
    ArrowUp(event, playfield, obj) {
        this.logger.log("ArrowUp:", event);
    }
    ArrowDown(event, playfield, obj) {
        this.logger.log("ArrowDown:", event);
    }
    ArrowLeft(event, playfield, obj) {
        this.logger.log("ArrowLeft:", event);
    }
    ArrowRight(event, playfield, obj) {
        this.logger.log("ArrowRight:", event);
    }
    defaultKey(event, playfield, obj) {
        this.logger.log("unknown keypress:", event.key, event);
    }
    mouseUp(event, playfield, obj) {
        this.logger.log("mouseUp:", event);
    }
    mouseDown(event, playfield, obj) {
        this.logger.log("mouseDown:", event);
    }
    mouseMove(event, playfield, obj) {
        this.logger.log("mouseMove:", event);
    }
}
//# sourceMappingURL=EventHandler.js.map