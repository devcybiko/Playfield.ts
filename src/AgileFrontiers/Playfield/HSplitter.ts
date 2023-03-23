import { Tile } from "./Tile";
import { int } from "../Utils";
import { PlayfieldEvent } from "./PlayfieldEvent";
import { RootTile } from "./RootTile";
import { Splitter } from "./Splitter";

export class HSplitter extends Splitter {

    private _north: RootTile;
    private _south: RootTile;

    constructor(name: string, parent: Tile, topPercent = 0.5) {
        super(name, parent, topPercent, 0);
    }

    override _initOnFirstCall() {
        if (!this._north) {
            this._hGutterInit(this._topPercent);
            this._north = new RootTile("ne", this, 0, 0, 0, 0);
            this._south = new RootTile("se", this, 0, 0, 0, 0);
            this._resize();
        }
    }
    _resize() {
        this._northSize();
        this._southSize();
    }

    _northSize() {
        this._north.x0 = this._margins.left;
        this._north.y0 = this._margins.top;
        this._north.x1 = this.x1 - this._margins.right;
        this._north.y1 = this._hGutter.y;
    }

    _southSize() {
        this._south.x0 = this._margins.left;
        this._south.y0 = this._hGutter.y;
        this._south.x1 = this.x1 - this._margins.right;
        this._south.y1 = this.y1 - this._margins.bottom;
    }

    // --- Overrides --- //

    addChild(child: Tile) {
        if (this.children.length < 2) super.addChild(child);
        else throw new Error("You must use HSplitter.north or HSplitter.south");
    }

    // --- Overrides --- //

    override relResize(dw: number, dh: number) {
        this._northSize();
        this._southSize();
    }

    override draw() {

        this._drawGutter(this._hGutter, this._hGutterHover);
        this.gfx.gparms.borderColor = "black";
        this._drawChild(this.north);
        this._drawChild(this.south);
    }

    // --- onActions --- //

    override onRelResize(dw: number, dh: number, pfEvent: PlayfieldEvent) {
        let thisTile = Tile.cast(this);
        if (dw) {
            this._hGutter.rsize(dw, 0);
        }
        if (dh) {
            this._south.onRelResize(0, dh, pfEvent);
        }
    }

    override onDrag(dx: number, dy: number, pfEvent: PlayfieldEvent) {
        if (this._hGutterHover) {
            this._hGutter.rmove(0, dy);
            this._north.onRelResize(0, dy, pfEvent);
            this._south.rmove(0, dy);
            this._south.onRelResize(0, -dy, pfEvent);
            pfEvent.isActive = false;
        }
    }

    // --- Accessors --- //

    public get north(): RootTile {
        this._initOnFirstCall();
        return this._north;
    }
    public set north(value: RootTile) {
        this._north = value;
    }
    public get south(): RootTile {
        this._initOnFirstCall();
        return this._south;
    }
    public set south(value: RootTile) {
        this._south = value;
    }
}