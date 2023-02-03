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