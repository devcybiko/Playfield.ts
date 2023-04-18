import { Tile } from "./Tile";
import { Rect, Logger, applyMixins } from "../Utils";
import { Gfx, GfxParms } from "./Graphics";
import { RootTile } from "./RootTile";
import { EventQueue } from "./EventQueue";
import { Options } from "./Options";

/**
 * Playfield is a graphic area for rendering
 * And it collects human inputs and dispatches them to tiles
 * A Playfield has a tree of Tiles (rectangles)
 */

export class PlayfieldOptions extends Options {
}

export class _Playfield { };
export interface _Playfield extends Logger, Rect { };
applyMixins(_Playfield, [Logger, Rect]);

export class Playfield extends _Playfield {
    private _rootTile: RootTile;
    private _gfx: Gfx;
    private _lastTime = 0;
    private _delay = -1;
    private _timerId = 0 as any;
    private _eventQueue: EventQueue;
    private _useInterval = true;
    private _eventObject: Tile;

    constructor(gfx: Gfx, eventQueue: EventQueue) {
        super();
        this._gfx = gfx;
        this._eventQueue = eventQueue;
        this.Rect(0, 0, this._gfx.width, this._gfx.height);
        this._rootTile = new RootTile("_root", this);
    }

    // --- Public Methods --- //

    clear() {
        this.gfx.rect(0, 0, this._gfx.width, this._gfx.height);
    }

    redraw() {
        this.clear();
        this.rootTile.draw();
    }

    start(delay = 125) {
        this._delay = delay;
        this._lastTime = Date.now();
        this.redraw();
        if (this._useInterval) {
            if (this._delay >= 0) this._timerId = setInterval(this._tick.bind(this), this._delay, this);
        } else {
            if (this._delay >= 0) this._timerId = setTimeout(this._tick.bind(this), this._delay, this);
        }
    }

    stop() {
        this._delay = -1;
        if (this._useInterval) {
            clearInterval(this._timerId);
        } else {
            clearTimeout(this._timerId);
        }
    }

    // --- Private Methods --- //

    _tick() {
        // clearTimeout(this._timerId);
        let now = Date.now();
        let beginning = now;
        let extra = now - this._lastTime;
        let eventCounts = this._handleEvents();
        let then = Date.now();
        let handleEventsDelta = then - now;
        now = Date.now();
        this.rootTile.onTick(); // process all ticks
        then = Date.now();
        let onTickDelta = then - now;
        now = Date.now();
        this.redraw(); // redraw the playfield
        then = Date.now();
        let redrawDelta = then - now;
        this._lastTime = Date.now();
        let delta = this._lastTime - beginning;
        if (this._delay > 0 && (delta > this._delay)) {
            console.log({ handleEventsDelta, onTickDelta, redrawDelta, eventCounts });
            console.error(`WARNING: The tick() processing time (${delta}ms aka ${1000 / delta} fps) exceeds the _delay (${this._delay}ms aka ${1000 / this._delay} fps). This could cause latency and jitter problems. There is only ${extra}ms between frames`);
        }
        if (!this._useInterval) {
            this._timerId = setTimeout(this._tick.bind(this), this._delay, this);
        }
    }

    _onEventVistor(obj: any, pfEvent: any): any {
        if (obj.onEvent) return obj.onEvent(pfEvent, this._rootTile);
        return null;
    }
    _handleEvents() {
        let that = this;
        function next() {
            return that._eventQueue.getEvent();
        }
        let cnt = 0;
        for (let pfEvent = next(); pfEvent; pfEvent = next()) {
            if (this._eventObject) {
                this._eventObject.onEvent(pfEvent, this._rootTile);
                // console.log(pfEvent);
        } else {
                this._rootTile.dfs(this._onEventVistor.bind(this), null, pfEvent, -1, true);
            }
            cnt += pfEvent.counter;
            // if (!pfEvent.isMove) console.log(pfEvent.event.type, pfEvent.counter, pfEvent.touchedBy);
        }
        return cnt;
    }

    // --- Accessors --- //

    get playfield(): Playfield {
        return this;
    }
    get rootTile(): Tile {
        return this._rootTile;
    }
    get gfx(): Gfx {
        return this._gfx;
    }
    public get eventObject(): Tile {
        return this._eventObject;
    }
    public set eventObject(value: Tile) {
        this._eventObject = value;
    }

}
