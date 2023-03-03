import { Logger } from "../../Utils";
import { PlayfieldEvent, iEventQueue } from "../PlayfieldEvents";
import {MouseDispatcher, KeyboardDispatcher} from "../Events";
import {Mouseable, Keyboardable, MouseEvent, KeyEvent} from "../Events";

export class CanvasEventPump {
    private _logger: Logger;
    private _eventQueue: iEventQueue;
    public _rootTile: any; // stopgap measure
    public _mouseDispatcher: any; // stopgap
    public _keyboardDispatcher: any; // stopgap

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
    public setRootTile(rootTile: any) {
        this._rootTile = rootTile;
        this._mouseDispatcher = new MouseDispatcher(this._rootTile as Mouseable);
        this._keyboardDispatcher = new KeyboardDispatcher(this._rootTile as Keyboardable);
}
    private _handler(event: any) {
        if (event.type[0] === 'm') this._mouseDispatcher.dispatchEvent(event);
        if (event.type[0] === 'w') this._mouseDispatcher.dispatchEvent(event);
        if (event.type[0] === 'k') this._keyboardDispatcher.dispatchEvent(event);
    }
}