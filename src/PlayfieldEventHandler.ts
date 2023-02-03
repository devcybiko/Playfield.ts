class PlayfieldEventHandler extends EventHandler {
    readonly SNAP = 10;
    constructor(playfield: Playfield, canvas: any) {
        super(playfield, canvas);
        this.logger = new Logger("PlayfieldEventHandler", "info");
    }
    MouseMove(event: any, playfield: Playfield, canvas: any) {
        if (playfield.dragObj) {
            playfield.dragObj.drag(Utils.snapTo(event.offsetX - playfield.grabDX, this.SNAP), Utils.snapTo(event.offsetY - playfield.grabDY, this.SNAP));
            playfield.redraw();
        }
    }
    MouseUp(event: any, playfield: Playfield, canvas: any) {
        playfield.dragObj = null;
    }
    MouseDown(event: any, playfield: Playfield, convas: any) {
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
                playfield.grabDX = Utils.snapTo(event.offsetX - obj.x, this.SNAP);
                playfield.grabDY = Utils.snapTo(event.offsetY - obj.y, this.SNAP);
            }
        }
    }
}