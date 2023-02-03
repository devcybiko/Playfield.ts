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