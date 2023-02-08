import * as Utils from "../Utils";

import {EventDispatcher} from "./EventHandlers/EventDispatcher";
import {Playfield} from "./Playfield";

export class PlayfieldEventHandler extends EventDispatcher {
    constructor(playfield: Playfield, canvas: any) {
        super(playfield, canvas);
        this.logger = new Utils.Logger("warn");
        this._registerEventHandlers(canvas);
    }
    private _registerEventHandlers(canvas: HTMLCanvasElement) {
        canvas.addEventListener('mousedown', this.dispatchEvent.bind(this));
        canvas.addEventListener('mousemove', this.dispatchEvent.bind(this));
        canvas.addEventListener('mouseup', this.dispatchEvent.bind(this));
        canvas.addEventListener('wheel', this.dispatchEvent.bind(this), false);
        addEventListener("keydown", this.dispatchEvent.bind(this));
    }
    dispatchKeyboardEvent(event: any) {
        if (this.playfield.focusedObj && this.playfield.focusedObj.any.eventHandler) {
            this.playfield.focusedObj.any.eventHandler.handleEvent(event);
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
        this.logger.log("MouseDown", obj);
        playfield.selectObj(obj);
        if (obj) {
            obj.click(event.offsetX, event.offsetY);
            playfield.grabObj(obj, event.offsetX, event.offsetY, !event.shiftKey);
        }
    }
}