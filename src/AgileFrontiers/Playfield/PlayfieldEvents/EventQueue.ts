import {PlayfieldEvent} from "./PlayfieldEvent";
import {iEventQueue} from "./iEventQueue";

export class EventQueue implements iEventQueue {
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