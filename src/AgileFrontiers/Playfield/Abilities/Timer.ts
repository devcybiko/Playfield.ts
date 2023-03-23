/**
 * can be timed.
 * 
 * This object has its own Timer
 * It has its own _delay value
 * you must .start() the timer
 * and you may .stop() the timer
 * but you muse poll the timer with isTimedOut() or timeRemaining()
 * - this is not asynchronous and there is no callback
 */

export interface Timer { }
export class Timer {
    protected isTimer: boolean;
    protected _delay: number;
    protected _lastTime: number;
    protected _timeout: number;

    Timer() {
        this.isTimer = true;
        this._delay = 0;
        this._lastTime = Date.now();
        this._timeout = 0;
        return this;
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

    stopTimer() {
        this._timeout = 0;
    }

    timeRemaining() {
        this._lastTime = Date.now();
        return this._timeout - this._lastTime;
    }

    get isTimedOut(): boolean {
        return this.timeRemaining() > 0;
    }
    
}
