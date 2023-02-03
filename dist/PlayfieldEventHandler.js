class PlayfieldEventHandler extends EventHandler {
    constructor(playfield, canvas) {
        super(playfield, canvas);
        this.SNAP = 10;
        this.logger = new Logger("PlayfieldEventHandler", "info");
    }
    MouseMove(event, playfield, canvas) {
        if (playfield.dragObj) {
            playfield.dragObj.drag(Utils.snapTo(event.offsetX - playfield.grabDX, this.SNAP), Utils.snapTo(event.offsetY - playfield.grabDY, this.SNAP));
            playfield.redraw();
        }
    }
    MouseUp(event, playfield, canvas) {
        playfield.dragObj = null;
    }
    MouseDown(event, playfield, convas) {
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
                playfield.grabDX = Utils.snapTo(event.offsetX - obj.x, this.SNAP);
                playfield.grabDY = Utils.snapTo(event.offsetY - obj.y, this.SNAP);
            }
        }
    }
}
//# sourceMappingURL=PlayfieldEventHandler.js.map