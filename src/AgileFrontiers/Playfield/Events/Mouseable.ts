export interface Mouseable {    
    MouseUp(event: any): boolean;
    MouseDown(event: any): boolean;
    MenuUp(event: any): boolean;
    MenuDown(event: any): boolean;
    MiddleUp(event: any): boolean;
    MiddleDown(event: any): boolean;
    WheelUp(event: any, delta: number): boolean;
    WheelDown(event: any, delta: number): boolean;
    MouseMove(event: any): boolean;
}