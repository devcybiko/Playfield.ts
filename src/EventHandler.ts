class EventHandler {
    private playfield: Playfield;
    private obj: any;
    public logger: Logger;
    constructor(playfield: Playfield, obj: any) {
        this.playfield = playfield;
        this.obj = obj;
        this.logger = new Logger("EventHandler");
        playfield.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        playfield.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        playfield.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }
    private handleMouseDown(event: any) {
        let playfield = this.playfield;
        if (!playfield) return this.logger.error('GREG: mousedown not associated with a playfield');
        this.mouseDown(event, playfield, this.obj);
    }
    private handleMouseUp(event: any) {
        let handler = this;
        let playfield = handler.playfield;
        if (!playfield) return this.logger.error('ERROR: mouseup not associated with a playfield');
        this.mouseUp(event, playfield, this.obj);
    }
    private handleMouseMove(event: any) {
        let handler = this;
        let playfield = handler.playfield;
        if (!playfield) return this.logger.error('ERROR: mousemove not associated with a playfield');
        this.mouseMove(event, playfield, this.obj);
    }

    private handleKeyDown(event: any) {
        let playfield = this.playfield;
        if (!playfield) return this.logger.error('ERROR: mousemove not associated with a playfield');
        let key = event.key;
        switch(key) {
            case "ArrowUp": return this.ArrowUp(event, this.playfield, this.obj);
            case "ArrowDown": return this.ArrowDown(event, this.playfield, this.obj);
            case "ArrowLeft": return this.ArrowLeft(event, this.playfield, this.obj);
            case "ArrowRight": return this.ArrowRight(event, this.playfield, this.obj);
            default: return this.defaultKey(event, this.playfield, this.obj);
        }
    }
    mouseUp(event: any, playfield: Playfield, obj: any) {
        this.logger.log("mouseUp: ", event);
    }
    mouseDown(event: any, playfield: Playfield, obj: any) {
        this.logger.log("mouseDown: ", event);
    }
    mouseMove(event: any, playfield: Playfield, obj: any) {
        this.logger.log("mouseMove: ", event);
    }
    defaultKey(event: any, playfield: Playfield, obj: any) {
        this.logger.log("unknown keypress: ", event.key, event);
    }
    ArrowUp(event: any, playfield: Playfield, obj: any) {
        this.logger.log("ArrowUp: ", event);
    }
    ArrowDown(event: any, playfield: Playfield, obj: any) {
        this.logger.log("ArrowDown: ", event);
    }
    ArrowLeft(event: any, playfield: Playfield, obj: any) {
        this.logger.log("ArrowLeft: ", event);
    }
    ArrowRight(event: any, playfield: Playfield, obj: any) {
        this.logger.log("ArrowRight: ", event);
    }
}
