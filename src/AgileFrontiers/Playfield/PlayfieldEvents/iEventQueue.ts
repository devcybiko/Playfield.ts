import { PlayfieldEvent } from "./PlayfieldEvent";

export interface iEventQueue {
    getEvent(): PlayfieldEvent;
    pushEvent(pfEvent: PlayfieldEvent): void;
}