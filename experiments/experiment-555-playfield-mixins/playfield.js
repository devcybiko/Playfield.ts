class Mixin {
    static mixin(_mixer) {
        let name = this.varToString(_mixer);
        let functions =  _mixer[name];
        let initializers = this._initializers || [];
        initializers.push({name, functions});
        functions._initializers = initializers;
        Object.assign(this.prototype, functions);
    }
    _initialize() {
        let initializers = this._initializers || [];
        for (let initializer of initializers) {
            let name = initializer.name;
            let init = initializer.functions[name];
            init.bind(this);
            init(this);
        }
    }
    static varToString(varObj) {
        if (typeof varObj !== "object") throw new Error("ERROR - Mixin should be a Dict of functions - {Name}");
        let name = Object.keys(varObj)[0];
        if (typeof name !== "string") throw new Error("ERROR - Mixin should be a Dict of functions - {Name}");
        let dict = varObj[name];
        if (typeof dict !== "object") throw new Error("ERROR - Mixin should be a Dict of functions - {"+name+"}");
        let fn = dict[name];
        if (typeof fn !== "function") throw new Error("ERROR - {"+name+"} - should have a init function '"+name+"(obj)'");
        return name;
    }
}

class Playfield extends Mixin {
    constructor(canvasId) {
        super();
        this.canvas = document.querySelector(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.objs = [];
        this.canvas.playfield = this;
        this.selectedObj = null;
        this.canvas.addEventListener('mousedown', this.__handleMouseDown);
        this.canvas.addEventListener('mousemove', this.__handleMouseMove);
        this.canvas.addEventListener('mouseup', this.__handleMouseUp);
        this.dragObj = null;
        this.dragDX = null;
        this.dragDY = null;
        this.body = document.querySelector('body');
        this.body.playfield = this;
        document.addEventListener("keydown", this.__handleKeyDown);
    }
    __handleMouseDown(event) {
        return (event.srcElement.playfield._handleMouseDown(event));
    }
    __handleMouseUp(event) {
        return (event.srcElement.playfield._handleMouseUp(event));
    }
    __handleMouseMove(event) {
        return (event.srcElement.playfield._handleMouseMove(event));
    }
    __handleKeyDown(event) {
        return (event.srcElement.playfield._handleKeyDown(event));
    }
    _findObjInBounds(x, y) {
        for (let i = this.objs.length - 1; i >= 0; i--) {
            let obj = this.objs[i];
            if (obj.inBounds(x, y)) return obj
        }
        return null;
    }
    _handleKeyDown(event) {
        let stopProcessing = false
        for (let i = this.objs.length - 1; i >= 0; i--) {
            let obj = this.objs[i];
            stopProcessing = obj.keydown(event.key, event);
            if (stopProcessing) break;
        }
        if (!stopProcessing) {
            this.keydown(event.key, event);
        }
    }
    _handleMouseDown(event) {
        let stopProcessing = false;
        for (let i = this.objs.length - 1; i >= 0; i--) {
            let obj = this.objs[i];
            if (!obj.inBounds(event.offsetX, event.offsetY)) continue;
            stopProcessing = obj.click(event.offsetX - obj.x, event.offsetY - obj.y, event);
            if (stopProcessing) break;
        }
        if (!stopProcessing) {
            this.click(event.offsetX, event.offsetY, event);
        }
    }
    _handleMouseUp(event) {
        this._dragStop();
    }
    _handleMouseMove(event) {
        this._dragging(event.offsetX - playfield.grabDX, event.offsetY - playfield.grabDY, event);
        this._mousing(event.offsetX - playfield.grabDX, event.offsetY - playfield.grabDY, event);
    }
    _dragging(x, y) {
        if (this.dragObj) {
            this.dragObj.dragging(x, y);
        }
    }
    _dragStop() {
        if (this.dragObj) {
            this.dragObj.dragStopped();
            this.dragObj = null;
        }
    }
    _timer(playfield) {
        playfield._goAll();
        playfield.redraw(enable);
    }
    _goAll() {
        for (let obj of this.objs) obj.go();
    }
    add(obj) {
        obj.playfield = this;
        this.objs.push(obj);
    }
    redraw(enable = true) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let obj of this.objs) obj.draw(this.ctx);
    }
    dragStart(obj, event) {
        let dx = obj.x;
        let dy = obj.y;
        if (event) {
            dx = event.offsetX;
            dy = event.offsetY;
        }
        this._dragStop();
        this.dragObj = obj;
        this.grabDX = dx - obj.x;
        this.grabDY = dy - obj.y;
        this.dragObj.dragStarted();
    }
    select(obj) {
        if (this.selectedObj) this.selectedObj.deselected();
        this.selectedObj = obj;
        this.selectedObj.selected();
    }
    deselect() {
        if (this.selectedObj) this.selectedObj.deselected();
        this.selectedObj = null;
    }
    toFront(obj) {
        let i = this.objs.indexOf(obj);
        if (i === -1) return;
        this.objs.splice(i, 1);
        this.objs.push(obj);
    }
    toBack(obj) {
        let i = this.objs.indexOf(obj);
        if (i === -1) return;
        this.objs.splice(i, 1);
        this.objs.splice(0, 0, obj);
    }
    start(tick=125) {
        this.redraw(enable);
        this._timerId = setInterval(this._timer, tick, this);
    }
    stop() {
        if (this._timerId) {
            clearInterval(this._timerId);
            this.redraw(enable);
        }
    }
    collisions(theObj, x = theObj.x, y = theObj.y, w = theObj.w, h = theObj.h) {
        let results = [];
        for (let obj of this.objs) {
            if (theObj === obj) continue;
            if (obj.inBounds(x, y) ||
                obj.inBounds(x + w, y) ||
                obj.inBounds(x, y + h) ||
                obj.inBounds(x + w, y + h))
                results.push(obj);
        }
        return results;
    }
    click(x, y, event) {
        this.deselect();
    }
    keydown(key, event) {
        //
    }
    _mousing(x, y, event) {
        let stopProcessing = false;
        for (let i = this.objs.length - 1; i >= 0; i--) {
            let obj = this.objs[i];
            if (!obj.inBounds(event.offsetX, event.offsetY)) continue;
            stopProcessing = obj.mousing(event.offsetX - obj.x, event.offsetY - obj.y, event);
            if (stopProcessing) break;
        }
        if (!stopProcessing) {
            this.mousing(event.offsetX, event.offsetY, event);
        }
    }
    mousing(x, y, event) {
    }
}

class PObject extends Mixin {
    constructor(name, color, x, y, w, h) {
        super();
        this.playfield = null;
        this.name = name;
        this.color = color;
        this.x = x; this.y = y;
        this.w = w; this.h = h;
    }
    toBack() {
        this.playfield.toBack(this);
    }
    toFront() {
        this.playfield.toFront(this);
    }
    inBounds(x, y) {
        let result = _between(this.x, x, this.x + this.w) && _between(this.y, y, this.y + this.h);
        return result;
    }
    dragging(x, y, event) {
        this.x = x;
        this.y = y;
    }
    mousing(x, y, event) {}; // abstract method
    selected() { }
    deselected() { }
    click(x, y, event) { } // abstract method
    dragStarted() { } // abstract method
    dragStopped() { } // abstract method
    draw(ctx) { } // abstract method
    go() { } // abstract method
    keydown(key, event) { } // abstract method
}