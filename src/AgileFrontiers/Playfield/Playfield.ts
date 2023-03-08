import { Tile } from "./Tile";
import { Rect, Logger, applyMixins } from "./Utils";
import { Gfx, GfxParms } from "./Graphics";
import { RootTile } from "./RootTile";
import { EventQueue } from "./EventQueue";

/**
 * Playfield is a graphic area for rendering
 * And it collects human inputs and dispatches them to tiles
 * A Playfield has a tree of Tiles (rectangles)
 */

export class _Playfield { };
export interface _Playfield extends Logger, Rect { };
applyMixins(_Playfield, [Logger, Rect]);

export class Playfield extends _Playfield {
    private _rootTile: RootTile;
    private _gfx: Gfx;
    private _gparms: GfxParms;
    private _lastTime = 0;
    private _delay = 0;
    private _timerId = 0 as any;
    private _eventQueue: EventQueue;

    constructor(gfx: Gfx, eventQueue: EventQueue) {
        super();
        this._gfx = gfx;
        this._eventQueue = eventQueue;
        this.Rect(0, 0, this._gfx.width, this._gfx.height);
        this._rootTile = new RootTile(0, 0, this.w, this.h, this);
    }

    // --- Public Methods --- //

    clear() {
        this.gfx.rect(0, 0, this._gfx.width, this._gfx.height);
    }

    redraw() {
        this.clear();
        this.tile.redraw();
    }

    start(delay = 125) {
        this._delay = delay;
        this._lastTime = Date.now();
        this.redraw();
        this._timerId = setTimeout(this._tick.bind(this), this._delay, this);
    }

    // --- Private Methods --- //

    _tick() {
        clearTimeout(this._timerId);
        let now = Date.now();
        let extra = now - this._lastTime;
        this._handleEvents();
        this.tile.onTick(); // process all ticks
        this.redraw(); // redraw the playfield
        this._lastTime = Date.now();
        let delta = this._lastTime - now;
        if (this._delay && (delta > this._delay)) console.error(`WARNING: The tick() processing time (${delta}ms aka ${1000 / delta} fps) exceeds the _delay (${this._delay}ms aka ${1000 / this._delay} fps). This could cause latency and jitter problems. There is only ${extra}ms between frames`);
        this._timerId = setTimeout(this._tick.bind(this), this._delay, this);
    }

    _handleEvents() {
        let that = this;
        for (let pfEvent = next(); pfEvent; pfEvent = next()) {
            this._rootTile.onEvent(pfEvent);
        }
        function next() {
            return that._eventQueue.getEvent();
        }
    }

    // --- Accessors --- //

    get playfield(): Playfield {
        return this;
    }
    get tile(): Tile {
        return this._rootTile;
    }
    get gfx(): Gfx {
        return this._gfx;
    }

}
