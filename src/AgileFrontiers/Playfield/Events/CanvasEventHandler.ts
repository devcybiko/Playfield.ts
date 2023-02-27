import { Logger } from "../../Utils";
import { KeyboardDispatcher } from "./KeyboardDispatcher";
import { Keyboardable } from "./Keyboardable";
import { MouseDispatcher } from "./MouseDispatcher";
import { Mouseable } from "./Mouseable";

export class CanvasEventHandler {
    _keyboardDispatcher: KeyboardDispatcher;
    _mouseDispatcher: MouseDispatcher;
    _logger: Logger;
    _obj: Mouseable | Keyboardable;

    constructor(canvas: any, obj: Mouseable | Keyboardable) {
        this._logger = new Logger();
        this._obj = obj;
        this._registerEventHandlers(canvas);
    }
    private _registerEventHandlers(canvas: HTMLCanvasElement) {
        if ((this._obj as Mouseable).MouseDown) {
            this._mouseDispatcher = new MouseDispatcher(this._obj as Mouseable);
            canvas.addEventListener('mousedown', this._mouseDispatcher.dispatchEvent.bind(this._mouseDispatcher));
            canvas.addEventListener('mousemove', this._mouseDispatcher.dispatchEvent.bind(this._mouseDispatcher));
            canvas.addEventListener('mouseup', this._mouseDispatcher.dispatchEvent.bind(this._mouseDispatcher));
            canvas.addEventListener('wheel', this._mouseDispatcher.dispatchEvent.bind(this._mouseDispatcher), false);
        } else if ((this._obj as Keyboardable).KeyDown){
            this._keyboardDispatcher = new KeyboardDispatcher(this._obj as Keyboardable);
            addEventListener("keydown", this._keyboardDispatcher.dispatchEvent.bind(this._keyboardDispatcher));
            addEventListener("keyup", this._keyboardDispatcher.dispatchEvent.bind(this._keyboardDispatcher));
        }
    }
}