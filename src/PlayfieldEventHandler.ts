class PlayfieldEventHandler extends EventHandler {
    constructor(playfield: Playfield, canvas: any) {
        super(playfield, canvas);
    }
    mouseMove(event: any, playfield: Playfield, canvas: any) {
        if (playfield.dragObj) {
            playfield.dragObj.drag(event.offsetX - playfield.grabDX, event.offsetY - playfield.grabDY);
            playfield.redraw();
        }
    }
    mouseUp(event: any, playfield: Playfield, canvas: any) {
        playfield.dragObj = null;
    }
    mouseDown(event: any, playfield: Playfield, convas: any) {
        let obj = playfield.findObjInBounds(event.offsetX, event.offsetY);
        if (obj) obj.click(event.offsetX, event.offsetY);
        if (playfield.selectedObj) playfield.selectedObj.deselect();
        playfield.selectedObj = obj;
        if (obj) {
            if (event.shiftKey) playfield.toBack(obj);
            else playfield.toFront(obj);
            obj.select();
            if (obj.isDraggable) {
                playfield.dragObj = obj;
                playfield.grabDX = event.offsetX - obj.x;
                playfield.grabDY = event.offsetY - obj.y;
            }
        }
    }
}