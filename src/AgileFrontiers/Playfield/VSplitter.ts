import { Tile } from "./Tile";
import { Margins, Rect, int, between } from "../Utils";
import { PlayfieldEvent } from "./PlayfieldEvent";
import { RootTile } from "./RootTile";
import { Splitter } from "./Splitter";

export class VSplitter extends Splitter {

    private _east: RootTile;
    private _west: RootTile;

    constructor(name: string, parent: Tile, leftPercent = 0.5) {
        super(name, parent, 0, leftPercent);
    }

    _initOnFirstCall() {
        if (!this._east) {
            this._vGutterInit(this._leftPercent);
            this._east = new RootTile("east", this, 0, 0, 0, 0);
            this._west = new RootTile("west", this, 0, 0, 0, 0);
            this._resize();
        }
    }
    _resize() {
        this._eastSize();
        this._westSize();
    }

    _eastSize() {
        this._east.x = this._margins.left;
        this._east.y = this._vGutter.y;
        this._east.w = this._vGutter.x - this.x0;
        this._east.h = this.h - this._margins.bottom;
    }

    _westSize() {
        this._west.x = this._vGutter.x;
        this._west.y = this._margins.top;
        this._west.w = this.w - this._vGutter.x - this._margins.right;
        this._west.h = this.h - this._margins.bottom;
    }

    // --- Overrides --- //

    override addChild(child: Tile) {
        if (this.children.length < 2) super.addChild(child);
        else throw new Error("You must use VSplitter.east or VSplitter.west");
    }

    // --- Overrides --- //

    override relResize(dw: number, dh: number) {
        this._eastSize();
        this._westSize();
    }

    override draw() {
        this._drawGutter(this._vGutter, this._vGutterHover);
        this.gfx.gparms.borderColor = "black";
        this._drawChild(this.east);
        this._drawChild(this.west);
    }

    // --- onActions --- //

    override onRelResize(dw: number, dh: number, pfEvent: PlayfieldEvent) {
        let thisTile = Tile.cast(this);
        if (dw) {
            this._west.onRelResize(dw, 0, pfEvent);
        }
        if (dh) {
            this._vGutter.rsize(0, dh);
        }
    }

    override onDrop(pfEvent: PlayfieldEvent) {
        this._vGutterHover = false;
        super.onDrop(pfEvent);
    }

    override onDrag(dx: number, dy: number, pfEvent: PlayfieldEvent) {
        if (this._vGutterHover) {
            this._vGutter.rmove(dx, 0);
            this._east.onRelResize(dx, 0, pfEvent);
            this._west.rmove(dx, 0);
            this._west.onRelResize(-dx, 0, pfEvent);
            pfEvent.isActive = false;
        }
    }

    override onEvent(pfEvent: PlayfieldEvent) {
        pfEvent.isActive = true;
        this.dispatchEventToChild(pfEvent, this, false);
        this.dispatchEventToChildren(pfEvent);
    }

    override onHovering(pfEvent: PlayfieldEvent) {
        if (this.isDragging) return;
        this._vGutterHover = this._hoverGutter(this._vGutter, pfEvent);
    }

    onExit(pfEvent: PlayfieldEvent) {
        if (this.isDragging) return;
        super.onExit(pfEvent);
    }

    // --- Accessors --- //

    public get east(): RootTile {
        this._initOnFirstCall();
        return this._east;
    }
    public set east(value: RootTile) {
        this._east = value;
    }
    public get west(): RootTile {
        this._initOnFirstCall();
        return this._west;
    }
    public set west(value: RootTile) {
        this._west = value;
    }
}