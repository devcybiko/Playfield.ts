import { PlayfieldEvent } from "./PlayfieldEvent";

export interface Mouseable {}
export class Mouseable {
    MouseDown(pfEvent: PlayfieldEvent): boolean {
        return false;
    }
    MouseMove(pfEvent: PlayfieldEvent): boolean {
        return false;
    }
    MouseUp(pfEvent: PlayfieldEvent): boolean {
        return false;
    }
    MenuUp(pfEvent: PlayfieldEvent): boolean {
        return false;
    }
    MenuDown(pfEvent: PlayfieldEvent): boolean {
        return false;
    }
    MiddleUp(pfEvent: PlayfieldEvent): boolean {
        return false;
    }
    MiddleDown(pfEvent: PlayfieldEvent): boolean {
        return false;
    }    
    WheelUp(delta: number, pfEvent: PlayfieldEvent): boolean {
        return false;
    }
    WheelDown(delta: number, pfEvent: PlayfieldEvent): boolean {
        return false;
    }
}