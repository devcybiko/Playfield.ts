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
class JedNode {
    constructor(parent, name) {
        this.name = name;
        this.parent = parent;
        this.objs = [];
    }
}
//# sourceMappingURL=JedNode.js.map
class JedRect {
    constructor(x, y, w, h) {
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}
//# sourceMappingURL=JedRect.js.map
class Draggable {
    constructor(actor) {
        this.origX = 0; // original x
        this.origY = 0; // original y
        this.snap = 10;
        this.obj = actor;
    }
    drag(dx, dy) {
        let newX = Utils.snapTo(this.origX + dx, this.snap);
        let newY = Utils.snapTo(this.origY + dy, this.snap);
        this.obj.move(newX, newY);
    }
    grab() {
        this.origX = this.obj.rect.x;
        this.origY = this.obj.rect.y;
    }
    drop() {
    }
}
//# sourceMappingURL=Draggable.js.map
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
        this.logger = new Logger("Graphics", "info");
        this.ctx = ctx;
        this.gparms = new GraphicsParms();
        this.ctx.fontKerning = "none";
        this.ctx.letterSpacing = "1px";
        this.ctx.textRendering = "geometricPrecision";
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
        this.text(msg, x, y, gparms);
    }
    boundingBox(msg, gparms = this.gparms) {
        this.ctx.font = gparms.font;
        let boundingBox = this.ctx.measureText(msg);
        return { w: Math.floor(boundingBox.width + 0.5), h: gparms.fontSize };
    }
    clipRect(x = 0, y = 0, w = this.ctx.canvas.width, h = this.ctx.canvas.height, gparms = this.gparms) {
        this.save();
        let region = new Path2D();
        region.rect(x + gparms.xOffset, y + gparms.yOffset, w, h);
        this.ctx.clip(region);
    }
    save() {
        this.ctx.save();
    }
    restore() {
        this.ctx.restore();
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
            playfield.grabObj(obj, event.offsetX, event.offsetY, event.shiftKey);
        }
    }
}
//# sourceMappingURL=PlayfieldEventHandler.js.map
class Playfield {
    constructor(canvasId) {
        this.SNAP = 10;
        this.grabX = 0;
        this.grabY = 0;
        this.gparms = null;
        this.canvas = document.querySelector(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.node = new JedNode(null, "_playfield");
        this.rect = new JedRect(0, 0, this.ctx.canvas.clientWidth, this.ctx.canvas.clientHeight);
        this.logger = new Logger("Playfield", "info");
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
    grabObj(obj, x, y, toFront) {
        if (obj && obj.draggable) {
            this.dropObj();
            if (toFront)
                this.toFront(obj);
            else
                this.toBack(obj);
            this._dragObj = obj;
            this.grabX = x;
            this.grabY = y;
            obj.draggable.grab();
        }
    }
    dragObj(x, y) {
        if (this._dragObj) {
            let dx = x - this.grabX;
            let dy = y - this.grabY;
            this.logger.log(dx, dy);
            this._dragObj.draggable.drag(dx, dy);
        }
    }
    dropObj() {
        if (this._dragObj)
            this._dragObj.draggable.drop();
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
            if (obj.inBounds(theObj.rect.x, theObj.rect.y) ||
                obj.inBounds(theObj.rect.x + theObj.rect.w, theObj.rect.y) ||
                obj.inBounds(theObj.rect.x, theObj.rect.y + theObj.rect.h) ||
                obj.inBounds(theObj.rect.x + theObj.rect.w, theObj.rect.y + theObj.rect.h))
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
        this.gparms = new GraphicsParms();
        this.node = new JedNode(parent.node, name);
        this.rect = new JedRect(x, y, w, h);
        this.logger = new Logger("Actor", "warn");
        this.objs = [];
        this.eventHandler = null;
        this.parent = parent;
        this.parent.add(this);
    }
    get X() {
        return this.rect.x + this.gparms.xOffset;
    }
    get Y() {
        return this.rect.y + this.gparms.yOffset;
    }
    add(obj) {
        this.objs.push(obj);
        obj.parent = this;
        obj.playfield = this.playfield;
    }
    move(x, y, w = this.rect.w, h = this.rect.h) {
        this.rect.x = x;
        this.rect.y = y;
        this.rect.w = w;
        this.rect.h = h;
    }
    rmove(dx, dy, dw = 0, dh = 0) {
        this.rect.x += dx;
        this.rect.y += dy;
        this.rect.w += dw;
        this.rect.h += dh;
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
        let result = Utils.between(this.gparms.xOffset + this.rect.x, x, this.gparms.xOffset + this.rect.x + this.rect.w) &&
            Utils.between(this.gparms.yOffset + this.rect.y, y, this.gparms.yOffset + this.rect.y + this.rect.h);
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
        this.logger.log("CLICK! " + this.node.name + ": " + x + "," + y);
    }
    keydown(key) {
        if (key === "ArrowUp")
            this.rect.y -= 10;
        if (key === "ArrowDown")
            this.rect.y += 10;
        if (key === "ArrowLeft")
            this.rect.x -= 10;
        if (key === "ArrowRight")
            this.rect.x += 10;
    }
    go() {
    }
    recompute() {
        let parentGparms = this.parent.gparms;
        if (parentGparms) {
            this.gparms.xOffset = this.parent.rect.x + parentGparms.xOffset;
            this.gparms.yOffset = this.parent.rect.y + parentGparms.yOffset;
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
        this.value(value);
        this.draggable = new Draggable(this);
    }
    value(newValue) {
        if (newValue !== undefined)
            this._value = newValue;
        return this._value;
    }
}
//# sourceMappingURL=Item.js.map
class EditItemEventHandler extends EventHandler {
    constructor(editItem) {
        super(editItem.playfield, editItem);
        this.logger = new Logger("EditItemEventHandler", "info");
    }
    ArrowLeft(event, playfield, obj) {
        obj.cursorInc(-1);
    }
    ArrowRight(event, playfield, obj) {
        obj.cursorInc(+1);
    }
    Backspace(event, playfield, obj) {
        this.logger.log(obj.cursor, obj._value);
        if (obj.cursor > 0) {
            let c = obj.cursor;
            let left = obj._value.substring(0, c - 1);
            let right = obj._value.substring(c);
            obj.value(left + right);
            obj.cursorInc(-1);
            this.logger.log(left, right, obj.cursor, obj._value);
        }
    }
    OrdinaryKey(event, playfield, obj) {
        let c = obj.cursor;
        obj.value(obj._value.substring(0, c) + event.key + obj._value.substring(c));
        obj.cursorInc(+1);
    }
}
//# sourceMappingURL=EditItemEventHandler.js.map
class EditItem extends Item {
    constructor(parent, name, value, x, y, w = 100, h = 24) {
        super(parent, name, value, x, y, w, h);
        this.cursor = 0;
        this.left = 0;
        this.right = 0;
        this.cursorOn = true;
        this.cursorBlinkRate = 500;
        this.nchars = 0;
        this.nchars2 = 0;
        this.gparms.fontFace = "monospace";
        this.eventHandler = new EditItemEventHandler(this);
        this.nchars = Math.ceil(this.rect.w / this.playfield.gfx.boundingBox("m", this.gparms).w);
        this.nchars2 = Math.ceil(this.rect.w / this.playfield.gfx.boundingBox("m", this.gparms).w / 2);
        this.left = 0;
        this.right = this.computeRight();
        this._setIntervalTimer();
        this.logger = new Logger("EditItem", "none");
    }
    _setIntervalTimer() {
        this.cursorOn = true;
        if (this.timerId)
            clearInterval(this.timerId);
        this.timerId = setInterval(this.blink.bind(this), this.cursorBlinkRate);
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
        let valueBB = gfx.boundingBox(this.value().substring(this.left, this.cursor), this.gparms);
        let dw = valueBB.w;
        if (dw <= 0)
            dw = 1;
        else if (dw >= this.rect.w)
            dw = this.rect.w - 1;
        let x0 = this.rect.x + dw;
        if (x0 <= this.rect.x)
            x0 = this.rect.x + 1;
        let x1 = x0;
        let y0 = this.rect.y;
        let y1 = y0 + valueBB.h;
        gfx.line(x0, y0, x1, y1, this.gparms);
        gfx.line(x0 + 1, y0, x1 + 2, y1, this.gparms);
    }
    draw() {
        let gfx = this.playfield.gfx;
        if (this.hasFocus)
            this.gparms.color = "red";
        else
            this.gparms.color = "black";
        gfx.clipRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h, this.gparms);
        gfx.textRect(this.value().substring(this.left), this.rect.x, this.rect.y, this.rect.w, this.rect.h, this.gparms);
        this.drawCursor();
        gfx.restore();
    }
    computeRight() {
        // let gfx = this.playfield.gfx;
        // let right = this.left;
        // for(let i=this.left; i<=this._value.length; i++) {
        //     let bb = gfx.boundingBox(this._value.substring(this.left, i));
        //     right = i;
        //     if (bb.w > this.rect.w) break;
        // }
        let right = this.left + this.nchars2 * 2;
        if (right >= this._value.length)
            right = this._value.length - 1;
        return right;
    }
    computeLeft() {
        // let gfx = this.playfield.gfx;
        // let left = this.right;
        // for(let i=this.right; i>=0; i--) {
        //     let bb = gfx.boundingBox(this._value.substring(i, this.right));
        //     if (bb.w > this.rect.w) break;
        //     left = i;
        // }
        let left = this.right - this.nchars2 * 2 + 1;
        if (left < 0)
            left = 0;
        return left;
    }
    cursorInc(delta) {
        this.cursor += delta;
        this._setIntervalTimer();
        this.cursorOn = true;
        if (this.cursor < 0)
            this.cursor = 0;
        if (this.cursor > this._value.length)
            this.cursor = this._value.length;
        this.left = this.cursor - this.nchars2;
        if (this.left < 0)
            this.left = 0;
        this.right = this.left + this.nchars;
        if (this.right > this._value.length)
            this.right = this._value.length;
        if (this.right === this._value.length)
            this.left = Math.max(this.right - this.nchars + 1, 0);
        this.logger.log(this.left, this.cursor, this.right, this.nchars, this.nchars2);
    }
}
//# sourceMappingURL=EditItem.js.map
class LabelItem extends Item {
    constructor(parent, name, value, x, y, w = 0, h = 0) {
        super(parent, name, value, x, y, w, h);
        this.gparms.fontFace = "serif";
        this.bb = this.playfield.gfx.boundingBox(this.value(), this.gparms);
        if (!w)
            this.rect.w = this.bb.w;
        if (!h)
            this.rect.h = this.bb.h;
    }
    draw() {
        let gfx = this.playfield.gfx;
        // this.bb = gfx.boundingBox(this.value(), this.gparms);
        // this.w = this.bb.w;
        // this.h = this.bb.h;
        gfx.text(this.value(), this.rect.x, this.rect.y, this.gparms);
    }
}
//# sourceMappingURL=LabelItem.js.map
class TextItem extends Item {
    constructor(parent, name, label, value, x, y, w = 0, h = 0, ww = 0, hh = 0) {
        super(parent, name, value, x, y, 0, 0);
        this.cursorOn = true;
        this.labelItem = new LabelItem(this, name + "-label", label, 0, 0, ww, hh);
        this.editItem = new EditItem(this, name + "-editor", value, this.labelItem.rect.w + 2, 0, w, h);
    }
    click(x, y) {
        this.playfield.focusObj(this.editItem);
    }
    labelBB() {
        return this.labelItem.bb;
    }
}
//# sourceMappingURL=TextItem.js.map
