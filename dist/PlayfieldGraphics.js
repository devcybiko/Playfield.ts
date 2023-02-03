class Utils {
    static between(a, b, c) {
        let result = a <= b && b <= c;
        return result;
    }
    static random(low, high) {
        let result = Math.random() * (high - low) + low;
        return result;
    }
    static snapTo(n, snap) {
        let x = n % snap;
        if (x === 0)
            return n;
        return Math.floor(n / snap) * snap;
    }
}
//# sourceMappingURL=Utils.js.map
class Logger {
    constructor(module, logLevel = "error") {
        this.level = "log";
        this.module = module;
        this.level = logLevel;
    }
    setLogLevel(level) {
        this.level = level;
    }
    info(...args) {
        // most verbose
        if (["warn", "log", "info"].includes(this.level))
            console.log("INFO:", this.module + ": ", ...args);
    }
    log(...args) {
        // less verbose
        if (["warn", "log"].includes(this.level))
            console.log("LOG:", this.module + ": ", ...args);
    }
    warn(...args) {
        // less verbose
        if (["warn"].includes(this.level))
            console.log("WARN:", this.module + ": ", ...args);
    }
    error(...args) {
        // always show errors
        console.error("ERROR:", this.module + ": ", ...args);
    }
}
//# sourceMappingURL=Logger.js.map
class GraphicsParms {
    constructor() {
        this.color = "black";
        this.borderColor = "black";
        this.fillColor = "white";
        this.xOffset = 0;
        this.yOffset = 0;
        this.textAlign = "left";
        this.textBaseline = "top";
        this.fontSize = 24;
        this.fontFace = "sans-serif";
    }
    clone() {
        return Object.assign({}, this);
    }
    _updateFont() {
        this._font = "" + this._fontSize + "px " + this._fontFace;
    }
    get font() {
        return this._font;
    }
    get fontSize() {
        return this._fontSize;
    }
    set fontSize(n) {
        this._fontSize = n;
        this._updateFont();
    }
    get fontFace() {
        return this._fontFace;
    }
    set fontFace(n) {
        this._fontFace = n;
        this._updateFont();
    }
}
//# sourceMappingURL=GraphicsParms.js.map
class Graphics {
    constructor(ctx) {
        this.ctx = ctx;
        this.gparms = new GraphicsParms();
    }
    rect(x, y, w, h, gparms = this.gparms) {
        if (gparms.fillColor) {
            this.ctx.fillStyle = gparms.fillColor;
            this.ctx.fillRect(gparms.xOffset + x, gparms.yOffset + y, w, h);
        }
        if (gparms.borderColor) {
            this.ctx.strokeStyle = gparms.borderColor;
            this.ctx.strokeRect(gparms.xOffset + x, gparms.yOffset + y, w, h);
        }
    }
    ellipse(x, y, w, h, gparms = this.gparms) {
        if (gparms.fillColor) {
            this.ctx.beginPath();
            this.ctx.ellipse(gparms.xOffset + x + w / 2, gparms.yOffset + y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
            this.ctx.fillStyle = gparms.fillColor;
            this.ctx.fill();
        }
        if (gparms.borderColor) {
            this.ctx.beginPath();
            this.ctx.ellipse(gparms.xOffset + x + w / 2, gparms.yOffset + y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
            this.ctx.strokeStyle = gparms.borderColor;
            this.ctx.stroke();
        }
    }
    circle(x, y, r, gparms = this.gparms) {
        this.ellipse(x - r, y - r, r, r, gparms);
    }
    line(x0, y0, x1, y1, gparms = this.gparms) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = gparms.color;
        this.ctx.moveTo(gparms.xOffset + x0, gparms.yOffset + y0);
        this.ctx.lineTo(gparms.xOffset + x1, gparms.yOffset + y1);
        this.ctx.stroke();
    }
    text(msg, x = 0, y = 0, gparms = this.gparms) {
        this.ctx.fillStyle = gparms.color;
        this.ctx.font = gparms.font;
        this.ctx.textAlign = gparms.textAlign;
        this.ctx.textBaseline = gparms.textBaseline;
        this.ctx.fillText(msg, gparms.xOffset + x, gparms.yOffset + y);
    }
    textRect(msg, x = 0, y = 0, w, h, gparms = this.gparms) {
        this.ctx.font = gparms.font;
        let boundingBox = this.boundingBox(msg, gparms);
        if (!w)
            w = boundingBox.w;
        if (!h)
            h = boundingBox.h;
        this.rect(x, y, w, h, gparms);
        this.text(msg, x + w / 2, y + h / 2 + 1, gparms);
    }
    boundingBox(msg, gparms = this.gparms) {
        this.ctx.font = gparms.font;
        let boundingBox = this.ctx.measureText(msg);
        return { w: Math.floor(boundingBox.width + 0.5), h: gparms.fontSize };
    }
}
//# sourceMappingURL=Graphics.js.map
class EventHandler {
    constructor(playfield, obj) {
        this.playfield = playfield;
        this.obj = obj;
        this.logger = new Logger("EventHandler", "info");
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
}
//# sourceMappingURL=EventHandler.js.map
class PlayfieldEventHandler extends EventHandler {
    constructor(playfield, canvas) {
        super(playfield, canvas);
        this.SNAP = 10;
        this.logger = new Logger("PlayfieldEventHandler", "info");
        this._registerEventHandlers(playfield);
    }
    _registerEventHandlers(playfield) {
        playfield.canvas.addEventListener('mousedown', this.handleEvent.bind(this));
        playfield.canvas.addEventListener('mousemove', this.handleEvent.bind(this));
        playfield.canvas.addEventListener('mouseup', this.handleEvent.bind(this));
        playfield.canvas.addEventListener('wheel', this.handleEvent.bind(this), false);
        document.addEventListener("keydown", this.handleEvent.bind(this));
    }
    handleKeyboardEvent(event) {
        if (this.playfield.focusedObj && this.playfield.focusedObj.eventHandler) {
            this.playfield.focusedObj.eventHandler.handleEvent(event);
        }
    }
    MouseMove(event, playfield, canvas) {
        playfield.dragObj(event.offsetX, event.offsetY);
    }
    MouseUp(event, playfield, canvas) {
        playfield.dropObj();
    }
    MouseDown(event, playfield, convas) {
        let obj = playfield.findObjInBounds(event.offsetX, event.offsetY);
        playfield.selectObj(obj);
        if (obj) {
            obj.click(event.offsetX, event.offsetY);
            if (event.shiftKey)
                playfield.toBack(obj);
            else
                playfield.toFront(obj);
            if (obj.isDraggable) {
                this.playfield.grabObj(obj, Utils.snapTo(event.offsetX - obj.x, this.SNAP), Utils.snapTo(event.offsetY - obj.y, this.SNAP));
            }
        }
    }
}
//# sourceMappingURL=PlayfieldEventHandler.js.map
class Playfield {
    constructor(canvasId) {
        this.SNAP = 10;
        this.x = 0;
        this.y = 0;
        this.X = 0;
        this.Y = 0;
        this.gparms = null;
        this.canvas = document.querySelector(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.logger = new Logger("Playfield", "warn");
        this.gfx = new Graphics(this.ctx);
        this.objs = [];
        this.selectedObj = null; // mouse object
        this.focusedObj = null; // keyboard object
        this.eventHandler = new PlayfieldEventHandler(this, this.canvas);
        this._dragObj = null;
        this.body = document.querySelector('body');
        this.body.playfield = this;
        // Actor compatibility
        this.parent = this;
        this.playfield = this;
    }
    selectObj(obj) {
        if (this.selectedObj)
            this.selectedObj.deselect();
        this.selectedObj = obj;
        if (obj !== null)
            obj.select();
    }
    focusObj(obj) {
        if (this.focusedObj)
            this.focusedObj.defocus();
        this.focusedObj = obj;
        if (obj !== null)
            obj.focus();
    }
    add(obj) {
        this.objs.push(obj);
        obj.parent = this;
        obj.playfield = this;
    }
    grabObj(obj, dx, dy) {
        this.dropObj();
        this._dragObj = obj;
        if (obj)
            obj.grab(dx, dy);
    }
    dragObj(x, y) {
        if (this._dragObj) {
            let dx = Utils.snapTo(x - this._dragObj.grabDX, this.SNAP);
            let dy = Utils.snapTo(y - this._dragObj.grabDY, this.SNAP);
            this._dragObj.drag(dx, dy);
        }
    }
    dropObj() {
        if (this._dragObj)
            this._dragObj.drop();
        this._dragObj = null;
    }
    drawAll() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let obj of this.objs)
            obj.drawAll();
    }
    findObjInBounds(x, y) {
        for (let i = this.objs.length - 1; i >= 0; i--) {
            let obj = this.objs[i];
            let found = obj.inBounds(x, y);
            if (found)
                return found;
        }
        return null;
    }
    toFront(obj) {
        let i = this.objs.indexOf(obj);
        if (i === -1)
            return;
        this.objs.splice(i, 1);
        this.objs.push(obj);
    }
    toBack(obj) {
        let i = this.objs.indexOf(obj);
        if (i === -1)
            return;
        this.objs.splice(i, 1);
        this.objs.splice(0, 0, obj);
    }
    handleKeyDown(event) {
        let playfield = event.srcElement.playfield;
        if (!playfield)
            return this.logger.error("ERROR: keydown not associated with a playfield");
        if (playfield.selectedObj)
            playfield.selectedObj.keydown(event.key);
    }
    timer() {
        this.goAll();
        this.drawAll();
    }
    start() {
        this.drawAll();
        setInterval(this.timer.bind(this), 125, this);
    }
    goAll() {
        for (let obj of this.objs)
            obj.go();
    }
    collisions(theObj) {
        let results = [];
        for (let obj of this.objs) {
            if (theObj === obj)
                continue;
            if (obj.inBounds(theObj.x, theObj.y) ||
                obj.inBounds(theObj.x + theObj.w, theObj.y) ||
                obj.inBounds(theObj.x, theObj.y + theObj.h) ||
                obj.inBounds(theObj.x + theObj.w, theObj.y + theObj.h))
                results.push(obj);
        }
        return results;
    }
}
//# sourceMappingURL=Playfield.js.map
class Actor {
    constructor(parent, name, x, y, w, h) {
        this.borderColor = "black";
        this.fillColor = "white";
        this.color = "black";
        this.isDraggable = true;
        this.grabDX = 0;
        this.grabDY = 0;
        this.gparms = new GraphicsParms();
        this.name = name;
        this.logger = new Logger("Actor", "warn");
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.objs = [];
        this.eventHandler = null;
        this.parent = parent;
        this.parent.add(this);
    }
    get X() {
        return this.x + this.gparms.xOffset;
    }
    get Y() {
        return this.y + this.gparms.yOffset;
    }
    add(obj) {
        this.objs.push(obj);
        obj.parent = this;
        obj.playfield = this.playfield;
    }
    move(x, y, w = this.w, h = this.h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    rmove(dx, dy, dw = 0, dh = 0) {
        this.x += dx;
        this.y += dy;
        this.w += dw;
        this.h += dh;
    }
    select() {
        this.isSelected = true;
    }
    deselect() {
        this.isSelected = false;
    }
    focus() {
        this.hasFocus = true;
    }
    defocus() {
        this.hasFocus = false;
    }
    inBounds(x, y) {
        let result = Utils.between(this.gparms.xOffset + this.x, x, this.gparms.xOffset + this.x + this.w) &&
            Utils.between(this.gparms.yOffset + this.y, y, this.gparms.yOffset + this.y + this.h);
        if (result)
            return this;
        for (let i = this.objs.length - 1; i >= 0; i--) {
            let obj = this.objs[i];
            let found = obj.inBounds(x, y);
            if (found)
                return this;
        }
        return null;
    }
    click(x, y) {
        this.logger.log("CLICK! " + this.name + ": " + x + "," + y);
    }
    drag(x, y) {
        this.move(x, y);
    }
    grab(dx, dy) {
        this.grabDX = dx;
        this.grabDY = dy;
    }
    drop() {
        // playfield is dropping me from dragging
    }
    keydown(key) {
        if (key === "ArrowUp")
            this.y -= 10;
        if (key === "ArrowDown")
            this.y += 10;
        if (key === "ArrowLeft")
            this.x -= 10;
        if (key === "ArrowRight")
            this.x += 10;
    }
    go() {
    }
    recompute() {
        let parentGparms = this.parent.gparms;
        if (parentGparms) {
            this.gparms.xOffset = this.parent.x + parentGparms.xOffset;
            this.gparms.yOffset = this.parent.y + parentGparms.yOffset;
        }
    }
    drawAll() {
        this.recompute();
        this.draw();
        if (this.objs.length) {
            for (let obj of this.objs) {
                obj.drawAll();
            }
        }
    }
    draw() {
    }
}
//# sourceMappingURL=Actor.js.map
class Item extends Actor {
    constructor(parent, name, value, x, y, w, h) {
        super(parent, name, x, y, w, h);
        this._value = value;
        this.isDraggable = true;
    }
    value(newValue) {
        if (newValue)
            this._value = newValue;
        return this._value;
    }
}
//# sourceMappingURL=Item.js.map
class EditItemEventHandler extends EventHandler {
    constructor(textItem) {
        super(textItem.playfield, textItem);
    }
    MouseDown(event, playfield, textItem) {
        if (textItem.inBounds(event.x, event.y)) {
            textItem.playfield.focusObj(textItem);
            textItem.gparms.color = "red";
            textItem.gparms.borderColor = "red";
        }
    }
    MouseUp(event, playfield, textItem) {
        textItem.gparms.color = "black";
        textItem.gparms.borderColor = "black";
    }
}
//# sourceMappingURL=EditItemEventHandler.js.map
class EditItem extends Item {
    constructor(parent, name, value, x, y, w = 100, h = 24) {
        super(parent, name, value, x, y, w, h);
        this.cursorOn = true;
        this.timerId = setInterval(this.blink.bind(this), 500);
        this.eventHandler = new EditItemEventHandler(this);
    }
    blink() {
        this.cursorOn = !this.cursorOn;
    }
    click(x, y) {
        this.playfield.focusObj(this);
    }
    drawCursor() {
        if (!this.hasFocus)
            return;
        if (!this.cursorOn)
            return;
        let gfx = this.playfield.gfx;
        let valueBB = gfx.boundingBox(this.value(), this.gparms);
        let x0 = this.x + valueBB.w + 4;
        let x1 = x0;
        let y0 = this.y + 2;
        let y1 = y0 + valueBB.h - 4;
        gfx.line(x0, y0, x1, y1, this.gparms);
    }
    draw() {
        let gfx = this.playfield.gfx;
        if (this.hasFocus)
            this.gparms.color = "red";
        else
            this.gparms.color = "black";
        gfx.rect(this.x, this.y, this.w, this.h, this.gparms);
        gfx.text(this.value(), this.x + 2, this.y + 1, this.gparms);
        this.drawCursor();
    }
}
//# sourceMappingURL=EditItem.js.map
class LabelItem extends Item {
    constructor(parent, name, value, x, y, w = 0, h = 0) {
        super(parent, name, value, x, y, w, h);
        this.gparms.fontFace = "serif";
        this.bb = this.playfield.gfx.boundingBox(this.value(), this.gparms);
        if (!w)
            this.w = this.bb.w;
        if (!h)
            this.h = this.bb.h;
    }
    draw() {
        let gfx = this.playfield.gfx;
        // this.bb = gfx.boundingBox(this.value(), this.gparms);
        // this.w = this.bb.w;
        // this.h = this.bb.h;
        gfx.text(this.value(), this.x, this.y, this.gparms);
    }
}
//# sourceMappingURL=LabelItem.js.map
class TextItem extends Item {
    constructor(parent, name, label, value, x, y, w = 0, h = 0, ww = 0, hh = 0) {
        super(parent, name, value, x, y, w, h);
        this.cursorOn = true;
        this.label = new LabelItem(this, name + "-label", label, 0, 0, ww, hh);
        this.editor = new EditItem(this, name + "-editor", value, this.label.w + 2, 0, w, h);
    }
    click(x, y) {
        this.playfield.focusObj(this.editor);
    }
}
//# sourceMappingURL=TextItem.js.map
