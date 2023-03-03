import { Logger } from "../../Utils";
import { PlayfieldEvent, iEventQueue } from "../PlayfieldEvents";

export class CanvasEventPump {
    private _logger: Logger;
    private _eventQueue: iEventQueue;

    constructor(canvas: HTMLCanvasElement, eventQueue: iEventQueue) {
        this._logger = new Logger();
        this._eventQueue = eventQueue;
        this._registerEventHandlers(canvas);
    }
    private _registerEventHandlers(canvas: HTMLCanvasElement) {
            canvas.addEventListener('mousedown', this._handler.bind(this));
            canvas.addEventListener('mousemove', this._handler.bind(this));
            canvas.addEventListener('mouseup', this._handler.bind(this));
            canvas.addEventListener('wheel', this._handler.bind(this));
            addEventListener("keydown", this._handler.bind(this));
            addEventListener("keyup", this._handler.bind(this));
    }
    private _handler(event: any) {
        let pfEvent = new PlayfieldEvent(event);
        this._eventQueue.pushEvent(pfEvent);
    }
}