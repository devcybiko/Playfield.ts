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