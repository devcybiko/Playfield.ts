import { Loggable } from "../Utils";
import { Named, Tree, iTree, Rect, Base } from "../Mixins";
import { Actor } from "./Actor";
import { CanvasEventHandler } from "./EventHandlers/CanvasEventHandler";
import { iFocusable, iDraggable, iSelectable, Drawable, iDrawable, Playable, iPlayable } from "./Capabilities";
import { MouseEnabled, iMouseEnabled} from "./EventHandlers/Capabilities";

interface iAddable extends iPlayable, iDrawable, iTree {}

const PlayfieldBase = MouseEnabled(Playable(Loggable(Drawable(Named(Tree(Rect(Base)))))));
export class Playfield extends PlayfieldBase {
    private _canvas: HTMLCanvasElement;
    public _ctx: CanvasRenderingContext2D;
    private _selectedObj: iSelectable; // mouse object
    private _focusedObj: iFocusable; // keyboard object
    private _dragObj: iDraggable;
    private _grabX = 0;
    private _grabY = 0;
    private _body: any;
    private _eventHandler: CanvasEventHandler;

    constructor(canvasId: string) {
        super();
        this._canvas = document.querySelector(canvasId);
        this._ctx = this._canvas.getContext("2d");
        this.Named("_playfield");
        this.Rect(0, 0, this._ctx.canvas.clientWidth, this._ctx.canvas.clientHeight);
        this.Tree(null);
        this.Loggable();
        this.Drawable(this._ctx)
        this.Playable(this);
        this.MouseEnabled();
        this._selectedObj = null;
        this._focusedObj = null;
        this._eventHandler = new CanvasEventHandler(this._canvas, this);
        this._dragObj = null;
        this._body = document.querySelector('body');
        this._body.playfield = this;
    }
    get selectedObj() {
        return this._selectedObj
    }
    set selectedObj(obj: iSelectable) {
        this._selectedObj = obj;
    }
    get focusedObj() :iFocusable {
        return this._focusedObj
    }
    set focusedObj(obj: iFocusable) {
        this._focusedObj = obj;
    }
    selectObj(obj: iSelectable) {
        if (this._selectedObj) this._selectedObj.deselect();
        this._selectedObj = obj;
        if (obj !== null) obj.select();
    }
    focusObj(obj: iFocusable) {
        if (this._focusedObj) this._focusedObj.defocus();
        this.focusedObj = obj;
        if (obj !== null) obj.focus();
    }
    add(obj: iAddable) {
        super.add(obj);
        obj.playfield = this;
        obj.gfx = this.gfx;
    }
    grabObj(obj: iDraggable, x: number, y: number, toFront: boolean) {
        if (obj && obj.isDraggable) {
            this.dropObj();
            if (toFront) this.toFront(obj);
            else this.toBack(obj);
            this._dragObj = obj;
            this._grabX = x;
            this._grabY = y;
            obj.grab();
        }
    }
    dragObj(x: number, y: number) {
        if (this._dragObj) {
            let dx = x - this._grabX;
            let dy = y - this._grabY;
            this.info(dx, dy);
            this._dragObj.drag(dx, dy);
        }
    }
    dropObj() {
        if (this._dragObj) this._dragObj.drop();
        this._dragObj = null;
    }
    recompute() {
        //for Actor compatibility
    }
    draw() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
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
            return this.error(
                "ERROR: keydown not associated with a playfield"
            );
        if (playfield._selectedObj) playfield._selectedObj.any.keydown(event.key);
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
            if (obj.inBounds(theObj.x, theObj.y) ||
                obj.inBounds(theObj.x + theObj.w, theObj.y) ||
                obj.inBounds(theObj.x, theObj.y + theObj.h) ||
                obj.inBounds(theObj.x + theObj.w, theObj.y + theObj.h))
                results.push(obj);
        }
        return results;
    }
    MouseMove(event: any): void {
        this.dragObj(event.offsetX, event.offsetY);
    }
    MouseUp(event: any) {
        this.dropObj();
    }
    MouseDown(event: any) {
        let obj = this.findObjInBounds(event.offsetX, event.offsetY);
        this.log("MouseDown", obj);
        this.selectObj(obj);
        if (obj) {
            obj.click(event.offsetX, event.offsetY);
            this.grabObj(obj, event.offsetX, event.offsetY, !event.shiftKey);
        }
    }
    KeyDown(event: any) {
        if (this.focusedObj) {
            if ()
        }
    }

}