import { Tile } from "./Tile";
import { Tree, Rect, Logger, applyMixins } from "../Utils";
import { Gfx, hasGfx, GfxParms, hasGfxParms } from "../Graphics";
import { RootTile } from "./RootTile";
import { CanvasEventHandler } from "./Events/CanvasEventHandler";

/**
 * Playfield is a graphic area for rendering
 * And it collects human inputs and dispatches them to tiles
 * A Playfield has a tree of Tiles (rectangles)
 */

export class _Playfield { };
export interface _Playfield extends Logger, Rect { };
applyMixins(_Playfield, [Logger, Rect]);

export class Playfield extends _Playfield implements hasGfx, hasGfxParms {
    _canvas: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D;
    _rootTile: RootTile;
    _gfx: Gfx;
    _gparms: GfxParms;
    _lastTime = 0;
    _delay = 0;
    _timerId = 0 as any;
    _canvasEventHandler: CanvasEventHandler;

    constructor(canvasId: string) {
        super();
        this._canvas = document.querySelector(canvasId);
        this._ctx = this._canvas.getContext("2d");
        this._gfx = new Gfx(this._ctx);
        this._gparms = new GfxParms();
        this.Rect(0, 0, this._canvas.width, this._canvas.height);
        this._rootTile = new RootTile(0, 0, this.w, this.h, this);
        this._canvasEventHandler = new CanvasEventHandler(this._canvas, this._rootTile);
    }
    get playfield(): Playfield {
        return this;
    }
    get tile(): Tile {
        return this._rootTile;
    }
    get gparms(): GfxParms {
        return this._gparms;
    }
    get gfx(): Gfx {
        return this._gfx;
    }
    clear() {
        this.gfx.rect(0, 0, this._canvas.width, this._canvas.height, this.gparms);
    }
    redraw() {
        this.clear();
        this.tile.redraw();
    }
    tick() {
        clearTimeout(this._timerId);
        let now = Date.now();
        let extra = now - this._lastTime;
        this.tile.tick(); // process all ticks
        this.redraw(); // redraw the playfield
        this._lastTime = Date.now();
        let delta = this._lastTime - now;
        if (delta > this._delay) console.error(`WARNING: The tick() processing time (${delta}ms aka ${1000 / delta} fps) exceeds the _delay (${this._delay}ms aka ${1000 / this._delay} fps). This could cause latency and jitter problems. There is only ${extra}ms between frames`);
        this._timerId = setTimeout(this.tick.bind(this), this._delay, this);
    }
    start(delay = 125) {
        this._delay = delay;
        this._lastTime = Date.now();
        this.redraw();
        this._timerId = setTimeout(this.tick.bind(this), this._delay, this);
    }
}
