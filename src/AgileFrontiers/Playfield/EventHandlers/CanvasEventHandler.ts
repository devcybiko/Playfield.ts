import {Logger} from "../../Utils";

import {EventDispatcher} from "./EventDispatcher";
import {Playfield} from "../Playfield";

export class CanvasEventHandler {
    private _eventDispatcher: EventDispatcher;
    private _logger: Logger;

    constructor(canvas: any, obj: any) {
        this._logger = new Logger("warn");
        this._eventDispatcher = new EventDispatcher(obj);
        this._registerEventHandlers(canvas);
    }
    private _registerEventHandlers(canvas: HTMLCanvasElement) {
        canvas.addEventListener('mousedown', this._eventDispatcher.dispatchEvent.bind(this));
        canvas.addEventListener('mousemove', this._eventDispatcher.dispatchEvent.bind(this));
        canvas.addEventListener('mouseup', this._eventDispatcher.dispatchEvent.bind(this));
        canvas.addEventListener('wheel', this._eventDispatcher.dispatchEvent.bind(this), false);
        addEventListener("keydown", this._eventDispatcher.dispatchEvent.bind(this));
        addEventListener("keyup", this._eventDispatcher.dispatchEvent.bind(this));
    }
}