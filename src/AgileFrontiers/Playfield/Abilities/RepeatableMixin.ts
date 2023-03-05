export interface Repeatable { }
export class Repeatable {
    private _isRepeatable: boolean;
    private _delay: number;
    private _timerId: any;

    Repeatable(delay: number) {
        this.isRepeatable = true;
        this._delay = delay;
        return this;
    }

    public get isRepeatable(): boolean {
        return this._isRepeatable;
    }
    public set isRepeatable(value: boolean) {
        this._isRepeatable = value;
    }
    public get delay(): number {
        return this._delay;
    }
    public set delay(value: number) {
        this._delay = value;
    }

    startRepeat(delay?: number) {
        if (delay !== undefined) this._delay = delay;
        this.stopRepeat();
        this._timerId = setInterval(this.onRepeat.bind(this), this._delay, this);
    }

    stopRepeat() {
        if (this._timerId) clearInterval(this._timerId);
        this._timerId = null;
    }
    
    onRepeat(): boolean {
        return false;
    }

}
