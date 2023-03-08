export interface Timer { }
export class Timer {
    private _isTimer: boolean;
    private _delay: number;
    private _lastTime: number;
    private _timeout: number;

    Timer(delay: number) {
        this.isTimer = true;
        this._delay = delay;
        this._lastTime = Date.now();
        this._timeout = this._lastTime + this._delay;
        return this;
    }

    public get isTimer(): boolean {
        return this._isTimer;
    }
    public set isTimer(value: boolean) {
        this._isTimer = value;
    }
    public get delay(): number {
        return this._delay;
    }
    public set delay(value: number) {
        this._delay = value;
    }

    startTimer(delay?: number) {
        if (delay !== undefined) this._delay = delay;
        this._lastTime = Date.now();
        this._timeout = this._lastTime + this._delay;
    }

    get isTimedOut(): boolean {
        this._lastTime = Date.now();
        return this._lastTime > this._timeout;
    }
    
}
