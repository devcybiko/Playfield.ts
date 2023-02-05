class PlayfieldEventHandler extends EventHandler {
    readonly SNAP = 10;
    constructor(playfield: Playfield, canvas: any) {
        super(playfield, canvas);
        this.logger = new Logger("PlayfieldEventHandler", "info");
        this._registerEventHandlers(playfield);
    }
    private _registerEventHandlers(playfield: Playfield) {
        playfield.canvas.addEventListener('mousedown', this.handleEvent.bind(this));
        playfield.canvas.addEventListener('mousemove', this.handleEvent.bind(this));
        playfield.canvas.addEventListener('mouseup', this.handleEvent.bind(this));
        playfield.canvas.addEventListener('wheel', this.handleEvent.bind(this), false);
        document.addEventListener("keydown", this.handleEvent.bind(this));
    }
    handleKeyboardEvent(event: any) {
        if (this.playfield.focusedObj && this.playfield.focusedObj.eventHandler) {
            this.playfield.focusedObj.eventHandler.handleEvent(event);
        }
    }
    MouseMove(event: any, playfield: Playfield, canvas: any) {
        playfield.dragObj(event.offsetX, event.offsetY);
    }
    MouseUp(event: any, playfield: Playfield, canvas: any) {
        playfield.dropObj();
    }
    MouseDown(event: any, playfield: Playfield, convas: any) {
        let obj = playfield.findObjInBounds(event.offsetX, event.offsetY);
        playfield.selectObj(obj);
        if (obj) {
            obj.click(event.offsetX, event.offsetY);
            playfield.grabObj(obj, event.offsetX, event.offsetY, event.shiftKey);
        }
    }
}
