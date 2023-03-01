import { MouseEvent } from "./MouseEvent";

export interface Mouseable {}
export class Mouseable {
    MouseDown(event: any): boolean {
        return false;
    }
    MouseMove(event: any): boolean {
        return false;
    }
    MouseUp(event: any): boolean {
        return false;
    }
    MenuUp(event: any): boolean {
        return false;
    }
    MenuDown(event: any): boolean {
        return false;
    }
    MiddleUp(event: any): boolean {
        return false;
    }
    MiddleDown(event: any): boolean {
        return false;
    }    
    WheelUp(event: any, delta: number): boolean {
        return false;
    }
    WheelDown(event: any, delta: number): boolean {
        return false;
    }
}