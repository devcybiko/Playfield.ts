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
    log(msg) {
        if (this.level === "log")
            console.log(this.module + ": ", msg);
    }
    error(msg) {
        console.log(this.module + ": ", msg);
    }
}
//# sourceMappingURL=Logger.js.map
class Graphics {
    constructor(ctx) {
        this.fontSize = 12;
        this.fontFace = "sans-serif";
        this.textColor = "black";
        this.borderColor = "black";
        this.fillColor = "white";
        this.ctx = ctx;
        this.configContext();
    }
    configContext() {
        let ctx = this.ctx;
        ctx.font = this.fontSize + "px " + this.fontFace;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
    }
    rect(x, y, w, h, borderColor = this.borderColor, fillColor = this.fillColor) {
        if (fillColor) {
            this.ctx.fillStyle = fillColor;
            this.ctx.fillRect(x, y, w, h);
        }
        if (borderColor) {
            this.ctx.strokeStyle = borderColor;
            this.ctx.strokeRect(x, y, w, h);
        }
    }
    ellipse(x, y, w, h, borderColor = this.borderColor, fillColor = this.fillColor) {
        if (fillColor) {
            this.ctx.beginPath();
            this.ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
            this.ctx.fillStyle = fillColor;
            this.ctx.fill();
        }
        if (borderColor) {
            this.ctx.beginPath();
            this.ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
            this.ctx.strokeStyle = borderColor;
            this.ctx.stroke();
        }
    }
    circle(x, y, r, borderColor = this.borderColor, fillColor = this.fillColor) {
        this.ellipse(x - r, y - r, r, r, borderColor, fillColor);
    }
    line(x0, y0, x1, y1, color = this.borderColor) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();
    }
    text(msg, x = 0, y = 0, color = this.textColor, opts) {
        this.ctx.fillStyle = color;
        if (opts && opts.textAlign)
            this.ctx.textAlign = opts.textAlign;
        if (opts && opts.textBaseline)
            this.ctx.textBaseline = opts.textBaseline;
        console.log("text", msg, x, y, color, opts);
        this.ctx.fillText(msg, x, y);
    }
    textRect(msg, x = 0, y = 0, w = (msg.length * this.fontSize) / 2.0, h = this.fontSize, textColor = this.textColor, borderColor = this.borderColor, fillColor = this.fillColor) {
        this.rect(x, y, w, h, borderColor, fillColor);
        this.text(msg, x + w / 2, y + h / 2, textColor);
    }
}
//# sourceMappingURL=Graphics.js.map
class Playfield {
    constructor(canvasId) {
        this.canvas = document.querySelector(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.logger = new Logger("Playfield");
        this.gfx = new Graphics(this.ctx);
        this.objs = [];
        this.canvas.playfield = this;
        this.selectedObj = null;
        this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
        this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
        this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
        this.dragObj = null;
        this.grabDX = null;
        this.grabDY = null;
        this.body = document.querySelector('body');
        this.body.playfield = this;
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }
    add(obj) {
        obj.playfield = this;
        this.objs.push(obj);
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
    handleMouseDown(event) {
        let playfield = event.srcElement.playfield;
        if (!playfield)
            return this.logger.error("ERROR: mousedown not associated with a playfield");
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
            obj.click(event.offsetX, event.offsetY);
            this.logger.log("grabbing");
            playfield.dragObj = obj;
            playfield.grabDX = event.offsetX - obj.x;
            playfield.grabDY = event.offsetY - obj.y;
        }
        playfield.redraw();
    }
    handleMouseUp(event) {
        let playfield = event.srcElement.playfield;
        if (!playfield)
            return this.logger.error("ERROR: mouseup not associated with a playfield");
        this.logger.log("handleMouseUp");
        playfield.dragObj = null;
    }
    handleMouseMove(event) {
        let playfield = event.srcElement.playfield;
        if (!playfield)
            return this.logger.error("ERROR: mousedown not associated with a playfield");
        if (playfield.dragObj) {
            this.logger.log("handleMouseMove");
            playfield.dragObj.drag(event.offsetX - playfield.grabDX, event.offsetY - playfield.grabDY);
            playfield.redraw();
        }
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
class Actor {
    constructor(name, x, y, w, h) {
        this.borderColor = "black";
        this.fillColor = "white";
        this.color = "black";
        this.name = name;
        this.logger = new Logger("Actor");
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
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
class Shape extends Actor {
    constructor(name, x, y, w, h, color = "black", borderColor = "black", fillColor = "white") {
        super(name, x, y, w, h);
        this.color = color;
        this.borderColor = borderColor;
        this.fillColor = fillColor;
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
            this.playfield.gfx.textRect(this.name, this.x, this.y, this.w, this.h, "black", this.borderColor, this.color);
        }
        else {
            this.playfield.gfx.textRect(this.name, this.x, this.y, this.w, this.h, "black", null, this.color);
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
            this.playfield.gfx.circle(this.x + this.r, this.y + this.r, this.r, this.borderColor, this.color);
        }
        else {
            this.playfield.gfx.circle(this.x + this.r, this.y + this.r, this.r, null, this.color);
        }
        this.playfield.gfx.textRect(this.name, this.x, this.y, this.w, this.h, "black", null, null);
    }
}
//# sourceMappingURL=Circle.js.map
class Item extends Actor {
    constructor(name, label, value, x, y, w, h) {
        super(name, x, y, w, h);
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
}
//# sourceMappingURL=Item.js.map
class TextItem extends Item {
    constructor(name, label, value, x, y, w = 100, h = 24) {
        super(name, label, value, x, y, w, h);
        this.options = {
            textBaseline: "bottom",
            textAlign: "left"
        };
        this.xOffset = 2;
        this.yOffset = this.h - 4;
    }
    draw() {
        let gfx = this.playfield.gfx;
        gfx.rect(this.x, this.y, this.w, this.h);
        gfx.text(this.value(), this.x + this.xOffset, this.y + this.yOffset, this.color, this.options);
    }
}
//# sourceMappingURL=TextItem.js.map
