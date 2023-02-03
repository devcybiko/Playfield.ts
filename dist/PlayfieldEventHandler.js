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