class Utils {
    static between(a, b, c) {
        let result = a <= b && b <= c;
        return result;
    }
    static random(low, high) {
        let result = Math.random() * (high - low) + low;
        return result;
    }
}
//# sourceMappingURL=Utils.js.map
class Logger {
    constructor(module) {
        this.level = "log";
        this.module = module;
        this.level = "log";
    }
    setLogLevel(level) {
        this.level = level;
    }
    log(...args) {
        if (this.level === "log")
            console.log(this.module + ": ", ...args);
    }
    error(...args) {
        console.log(this.module + ": ", ...args);
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
        this.fontFace = "san-serif";
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
            this.ctx.fillRect(x, y, w, h);
        }
        if (gparms.borderColor) {
            this.ctx.strokeStyle = gparms.borderColor;
            this.ctx.strokeRect(x, y, w, h);
        }
    }
    ellipse(x, y, w, h, gparms = this.gparms) {
        if (gparms.fillColor) {
            this.ctx.beginPath();
            this.ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
            this.ctx.fillStyle = gparms.fillColor;
            this.ctx.fill();
        }
        if (gparms.borderColor) {
            this.ctx.beginPath();
            this.ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
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
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();
    }
    text(msg, x = 0, y = 0, gparms = this.gparms) {
        this.ctx.fillStyle = gparms.color;
        this.ctx.font = gparms.font;
        this.ctx.textAlign = gparms.textAlign;
        this.ctx.textBaseline = gparms.textBaseline;
        x += gparms.xOffset;
        y += gparms.yOffset;
        this.ctx.fillText(msg, x, y);
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
        this.logger = new Logger("EventHandler");
        playfield.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        playfield.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        playfield.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }
    handleMouseDown(event) {
        let playfield = this.playfield;
        if (!playfield)
            return this.logger.error('GREG: mousedown not associated with a playfield');
        this.mouseDown(event, playfield, this.obj);
    }
    handleMouseUp(event) {
        let handler = this;
        let playfield = handler.playfield;
        if (!playfield)
            return this.logger.error('ERROR: mouseup not associated with a playfield');
        this.mouseUp(event, playfield, this.obj);
    }
    handleMouseMove(event) {
        let handler = this;
        let playfield = handler.playfield;
        if (!playfield)
            return this.logger.error('ERROR: mousemove not associated with a playfield');
        this.mouseMove(event, playfield, this.obj);
    }
    handleKeyDown(event) {
        let playfield = this.playfield;
        if (!playfield)
            return this.logger.error('ERROR: mousemove not associated with a playfield');
        let key = event.key;
        switch (key) {
            case "ArrowUp": return this.ArrowUp(event, this.playfield, this.obj);
            case "ArrowDown": return this.ArrowDown(event, this.playfield, this.obj);
            case "ArrowLeft": return this.ArrowLeft(event, this.playfield, this.obj);
            case "ArrowRight": return this.ArrowRight(event, this.playfield, this.obj);
            default: return this.defaultKey(event, this.playfield, this.obj);
        }
    }
    mouseUp(event, playfield, obj) {
        this.logger.log("mouseUp: ", event);
    }
    mouseDown(event, playfield, obj) {
        this.logger.log("mouseDown: ", event);
    }
    mouseMove(event, playfield, obj) {
        this.logger.log("mouseMove: ", event);
    }
    defaultKey(event, playfield, obj) {
        this.logger.log("unknown keypress: ", event.key, event);
    }
    ArrowUp(event, playfield, obj) {
        this.logger.log("ArrowUp: ", event);
    }
    ArrowDown(event, playfield, obj) {
        this.logger.log("ArrowDown: ", event);
    }
    ArrowLeft(event, playfield, obj) {
        this.logger.log("ArrowLeft: ", event);
    }
    ArrowRight(event, playfield, obj) {
        this.logger.log("ArrowRight: ", event);
    }
}
//# sourceMappingURL=EventHandler.js.map
class PlayfieldEventHandler extends EventHandler {
    constructor(playfield, canvas) {
        super(playfield, canvas);
    }
    mouseMove(event, playfield, canvas) {
        if (playfield.dragObj) {
            playfield.dragObj.drag(event.offsetX - playfield.grabDX, event.offsetY - playfield.grabDY);
            playfield.redraw();
        }
    }
    mouseUp(event, playfield, canvas) {
        playfield.dragObj = null;
    }
    mouseDown(event, playfield, convas) {
        let obj = playfield.findObjInBounds(event.offsetX, event.offsetY);
        if (obj)
            obj.click(event.offsetX, event.offsetY);
        if (playfield.selectedObj)
            playfield.selectedObj.deselect();
        playfield.selectedObj = obj;
        if (obj) {
            if (event.shiftKey)
                playfield.toBack(obj);
            else
                playfield.toFront(obj);
            obj.select();
            if (obj.isDraggable) {
                playfield.dragObj = obj;
                playfield.grabDX = event.offsetX - obj.x;
                playfield.grabDY = event.offsetY - obj.y;
            }
        }
    }
}
//# sourceMappingURL=PlayfieldEventHandler.js.map
class Playfield {
    constructor(canvasId) {
        this.canvas = document.querySelector(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.logger = new Logger("Playfield");
        this.gfx = new Graphics(this.ctx);
        this.objs = [];
        this.selectedObj = null;
        this.eventHandler = new PlayfieldEventHandler(this, this.canvas);
        // this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
        // this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
        // this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
        // document.addEventListener("keydown", this.handleKeyDown.bind(this));
        this.dragObj = null;
        this.grabDX = null;
        this.grabDY = null;
        this.body = document.querySelector('body');
        this.body.playfield = this;
    }
    add(obj) {
        obj.playfield = this;
        this.objs.push(obj);
        obj.addMeToPlayfield(this);
    }
    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let obj of this.objs)
            obj.draw(this.ctx);
    }
    findObjInBounds(x, y) {
        for (let i = this.objs.length - 1; i >= 0; i--) {
            let obj = this.objs[i];
            if (obj.inBounds(x, y))
                return obj;
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
    timer(playfield) {
        playfield.goAll();
        playfield.redraw();
    }
    start() {
        this.redraw();
        setInterval(this.timer, 125, this);
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
    constructor(name, x, y, w, h) {
        this.borderColor = "black";
        this.fillColor = "white";
        this.color = "black";
        this.isDraggable = true;
        this.name = name;
        this.logger = new Logger("Actor");
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    addMeToPlayfield(playfield) {
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
    inBounds(x, y) {
        let result = Utils.between(this.x, x, this.x + this.w) &&
            Utils.between(this.y, y, this.y + this.h);
        return result;
    }
    click(x, y) {
        this.logger.log("CLICK! " + this.name + ": " + x + "," + y);
    }
    drag(x, y) {
        this.move(x, y);
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
        this.playfield.redraw();
    }
    go() {
    }
}
//# sourceMappingURL=Actor.js.map
class Meander {
    constructor(obj) {
        this.obj = obj;
        this.orig_dx = Utils.random(-10, 10);
        this.orig_dy = Utils.random(-10, 10);
        this.dx = this.orig_dx;
        this.dy = this.orig_dy;
    }
    go() {
        if (this.obj.isSelected)
            return;
        this.obj.rmove(this.dx, this.dy);
        let collisions = this.obj.playfield.collisions(this.obj);
        if (collisions.length) {
            this.dx = Utils.random(-10, 10);
            this.dy = Utils.random(-10, 10);
        }
        if (this.obj.x < 0) {
            this.obj.x = 0;
            this.dx = -this.dx;
        }
        if (this.obj.x + this.obj.w > this.obj.playfield.canvas.width) {
            this.obj.x = this.obj.playfield.canvas.width - this.obj.w;
            this.dx = -this.dx;
        }
        if (this.obj.y < 0) {
            this.obj.y = 0;
            this.dy = -this.dy;
        }
        if (this.obj.y + this.obj.h > this.obj.playfield.canvas.height) {
            this.obj.y = this.obj.playfield.canvas.height - this.obj.h;
            this.dy = -this.dy;
        }
    }
}
//# sourceMappingURL=Meander.js.map
class Shape extends Actor {
    constructor(name, x, y, w, h, color = "black", borderColor = "black", fillColor = "white") {
        super(name, x, y, w, h);
        this.gparms = new GraphicsParms();
        this.selectedGparms = new GraphicsParms();
        this.gparms.color = "black";
        this.gparms.borderColor = borderColor;
        this.gparms.fillColor = color;
        this.gparms.textAlign = "center";
        this.gparms.textBaseline = "middle";
        this.selectedGparms.color = color;
        this.selectedGparms.borderColor = "black";
        this.selectedGparms.fillColor = color;
        this.selectedGparms.textAlign = "center";
        this.selectedGparms.textBaseline = "middle";
        this.meander = new Meander(this);
    }
    go() {
        this.meander.go();
    }
}
//# sourceMappingURL=Shape.js.map
class Box extends Shape {
    constructor(name, x, y, w, h, color, borderColor, fillColor) {
        super(name, x, y, w, h, color, borderColor, fillColor);
        this.logger = new Logger("Box");
    }
    draw() {
        if (this.isSelected) {
            this.playfield.gfx.textRect(this.name, this.x, this.y, this.w, this.h, this.selectedGparms);
        }
        else {
            this.playfield.gfx.textRect(this.name, this.x, this.y, this.w, this.h, this.gparms);
        }
    }
}
//# sourceMappingURL=Box.js.map
class Circle extends Shape {
    constructor(name, x, y, r, color, borderColor, fillColor) {
        super(name, x - r, y - r, r, r, color, borderColor, fillColor);
        this.logger = new Logger("Circle");
        this.r = r;
    }
    draw() {
        if (this.isSelected) {
            this.playfield.gfx.circle(this.x + this.r, this.y + this.r, this.r, this.selectedGparms);
        }
        else {
            this.playfield.gfx.circle(this.x + this.r, this.y + this.r, this.r, this.gparms);
        }
        let gparm2 = this.gparms.clone();
        gparm2.borderColor = null;
        gparm2.fillColor = null;
        this.playfield.gfx.textRect(this.name, this.x, this.y, this.w, this.h, gparm2);
    }
}
//# sourceMappingURL=Circle.js.map
class Item extends Actor {
    constructor(name, label, value, x, y, w, h) {
        super(name, x, y, w, h);
        this.hasFocus = false;
        this._label = label;
        this._value = value;
    }
    label(newLabel) {
        if (newLabel)
            this._label = newLabel;
        return this._label;
    }
    value(newValue) {
        if (newValue)
            this._value = newValue;
        return this._value;
    }
    loseFocus() {
        this.hasFocus = false;
        Actor.focusItem = null;
    }
    takeFocus() {
        if (Actor.focusItem) {
            Actor.focusItem.loseFocus();
        }
        Actor.focusItem = this;
        this.hasFocus = true;
    }
}
//# sourceMappingURL=Item.js.map
class TextItemEventHandler extends EventHandler {
    constructor(textItem) {
        super(textItem.playfield, textItem);
    }
    mouseDown(event, playfield, textItem) {
        if (textItem.inBounds(event.x, event.y)) {
            textItem.takeFocus();
            textItem.gparms.color = "red";
            textItem.gparms.borderColor = "red";
        }
    }
    mouseUp(event, playfield, textItem) {
        textItem.gparms.color = "black";
        textItem.gparms.borderColor = "black";
    }
}
//# sourceMappingURL=TextItemEventHandler.js.map
class TextItem extends Item {
    constructor(name, label, value, x, y, w = 100, h = 24) {
        super(name, label, value, x, y, w, h);
        this.cursorOn = true;
        this.gparms = new GraphicsParms();
        this.rectWidth = w;
        this.timerId = setInterval(this.blink.bind(this), 500);
    }
    blink() {
        this.cursorOn = !this.cursorOn;
    }
    addMeToPlayfield(playfield) {
        this.eventHandler = new TextItemEventHandler(this);
    }
    drawCursor(labelBB) {
        if (!this.cursorOn)
            return;
        if (!this.hasFocus)
            return;
        let gfx = this.playfield.gfx;
        let valueBB = gfx.boundingBox(this.value(), this.gparms);
        let x0 = this.x + labelBB.w + valueBB.w + 4;
        let x1 = x0;
        let y0 = this.y + 2;
        let y1 = y0 + valueBB.h - 4;
        gfx.line(x0, y0, x1, y1, this.gparms);
    }
    drawLabel() {
        if (!this.label())
            return { w: 0, h: this.gparms.fontSize };
        let gfx = this.playfield.gfx;
        let bb = gfx.boundingBox(this.label(), this.gparms);
        gfx.text(this.label(), this.x, this.y, this.gparms);
        return bb;
    }
    drawValue(labelBB) {
        let gfx = this.playfield.gfx;
        gfx.rect(this.x + labelBB.w, this.y, this.rectWidth, this.h, this.gparms);
        gfx.text(this.value(), this.x + labelBB.w + 2, this.y + 1, this.gparms);
    }
    draw() {
        let gfx = this.playfield.gfx;
        let labelBB = this.drawLabel();
        this.drawValue(labelBB);
        this.drawCursor(labelBB);
        this.w = labelBB.w + this.rectWidth + 4;
    }
}
//# sourceMappingURL=TextItem.js.map
