import * as Utils from "../Utils";

import {EventHandler} from "./EventHandler";
import {Playfield} from "./Playfield";

export class PlayfieldEventHandler extends EventHandler {
    readonly SNAP = 10;
    constructor(playfield: Playfield, canvas: any) {
        super(playfield, canvas);
        this.logger = new Utils.Logger("warn");
        this._registerEventHandlers(canvas);
    }
    private _registerEventHandlers(canvas: HTMLCanvasElement) {
        canvas.addEventListener('mousedown', this.handleEvent.bind(this));
        canvas.addEventListener('mousemove', this.handleEvent.bind(this));
        canvas.addEventListener('mouseup', this.handleEvent.bind(this));
        canvas.addEventListener('wheel', this.handleEvent.bind(this), false);
        addEventListener("keydown", this.handleEvent.bind(this));
    }
    handleKeyboardEvent(event: any) {
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