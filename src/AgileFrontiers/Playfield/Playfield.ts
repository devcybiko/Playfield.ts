import * as Utils from "../Utils";
import * as Mixins from "../Mixins";
import {Gfx, GfxParms} from "../Graphics";

import {Actor} from "./Actor";
import {EventHandler} from "./EventHandler";
import {PlayfieldEventHandler} from "./PlayfieldEventHandler";

export class Playfield extends Mixins.BaseRectTree {
    readonly SNAP = 10;
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public logger: Utils.Logger;
    public gfx!: Gfx;
    public selectedObj: Actor; // mouse object
    public focusedObj: Actor; // keyboard object
    public _dragObj: Actor;
    public grabX = 0;
    public grabY = 0;
    public body: any;
    public eventHandler: EventHandler;
    // Actor compatibility
    public playfield: Playfield; 
    public gparms = null as GfxParms;

    constructor(canvasId: string) {
        super();
        this.canvas = document.querySelector(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.Base("_playfield");
        this.Rect(0, 0, this.ctx.canvas.clientWidth, this.ctx.canvas.clientHeight);
        this.Tree(null);
        this.logger = new Utils.Logger("Playfield", "info");
        this.gfx = new Gfx(this.ctx);
        this.selectedObj = null; // mouse object
        this.focusedObj = null; // keyboard object
        this.eventHandler = new PlayfieldEventHandler(this, this.canvas);
        this._dragObj = null;
        this.body = document.querySelector('body');
        this.body.playfield = this;
        this.playfield = this;
    }
    selectObj(obj: Actor) {
        if (this.selectedObj) this.selectedObj.deselect();
        this.selectedObj = obj;
        if (obj !== null) obj.select();
    }
    focusObj(obj: Actor) {
        if (this.focusedObj) this.focusedObj.defocus();
        this.focusedObj = obj;
        if (obj !== null) obj.focus();
    }
    add(obj: Actor) {
        super.add(obj);
        obj.playfield = this;
        obj.gfx = this.gfx;
    }
    grabObj(obj: Actor, x: number, y: number, toFront: boolean) {
        if (obj && obj.draggable) {
            this.dropObj();
            if (toFront) this.toFront(obj);
            else this.toBack(obj);
            this._dragObj = obj;
            this.grabX = x;
            this.grabY = y;
            obj.draggable.grab();
        }
    }
    dragObj(x: number, y: number) {
        if (this._dragObj) {
            let dx = x - this.grabX;
            let dy = y - this.grabY;
            this.logger.log(dx, dy);
            this._dragObj.draggable.drag(dx, dy);
        }
    }
    dropObj() {
        if (this._dragObj) this._dragObj.draggable.drop();
        this._dragObj = null;
    }
    recompute() {
        //for Actor compatibility
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // for partial actor compatibility
    }
    drawObj(obj: Actor) {
        // visitor method for drawAll()
        obj.recompute();
        obj.draw();
    }
    drawAll() {
        this.dfs(this.drawObj);
    }
    findObjInBounds(x: number, y: number): any {
        for (let i = this._children.length - 1; i >= 0; i--) {
            let obj = this._children[i];
            let found = obj.inBounds(x, y);
            if (found) return found;
        }
        return null;
    }
    handleKeyDown(event: any) {
        let playfield = event.srcElement.playfield as Playfield;
        if (!playfield)
            return this.logger.error(
                "ERROR: keydown not associated with a playfield"
            );
        if (playfield.selectedObj) playfield.selectedObj.keydown(event.key);
    }
    timer() {
        this.goAll();
        this.drawAll();
    }
    start() {
        this.drawAll();
        setInterval(this.timer.bind(this), 125, this);
    }
    goAll() {
        for (let obj of this._children) obj.go();
    }
    collisions(theObj: Actor) {
        let results = [];
        for (let obj of this._children) {
            if (theObj === obj) continue;
            if (obj.inBounds(theObj.x(), theObj.y()) ||
                obj.inBounds(theObj.x() + theObj.w(), theObj.y()) ||
                obj.inBounds(theObj.x(), theObj.y() + theObj.h()) ||
                obj.inBounds(theObj.x() + theObj.w(), theObj.y() + theObj.h()))
                results.push(obj);
        }
        return results;
    }
}