import { EventQueue } from "../Playfield";
import { BrowserPlayfieldEvent } from "./BrowserPlayfieldEvent";

export class BrowserEventPump {
    private _eventQueue: EventQueue;
    private _ratio = 1.0;

    constructor(canvas: HTMLCanvasElement, eventQueue: EventQueue) {
        this._eventQueue = eventQueue;
        this._registerEventHandlers(canvas);

    }

    // --- Private Methods --- //

    private _registerEventHandlers(canvas: HTMLCanvasElement) {
        canvas.addEventListener('mousedown', this._handler.bind(this));
        canvas.addEventListener('mousemove', this._handler.bind(this));
        canvas.addEventListener('mouseup', this._handler.bind(this));
        canvas.addEventListener('wheel', this._handler.bind(this));
        addEventListener("keydown", this._handler.bind(this));
        addEventListener("keyup", this._handler.bind(this));
        this._ratio = (canvas as any)._ratio;
    }

    private _handler(event: any) {
        event.preventDefault();
        let pfEvent = new BrowserPlayfieldEvent(event, this._ratio);
        this._eventQueue.pushEvent(pfEvent);
    }
}