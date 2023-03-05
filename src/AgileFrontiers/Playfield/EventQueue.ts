import {PlayfieldEvent} from "./PlayfieldEvent";

export class EventQueue {
    private _eventQueue: Array<PlayfieldEvent>;

    constructor() {
        this._eventQueue = [];
    }
    public getEvent(): PlayfieldEvent {
        return this._eventQueue.shift();
    }
    public pushEvent(pfEvent: PlayfieldEvent): void {
        this._eventQueue.push(pfEvent);
    }

}