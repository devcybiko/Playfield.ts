import { GfxParms } from "./GfxParms";

export interface Gfx {
    get width(): number;
    get height(): number;
    rect(x: number, y: number, w: number, h: number): void;
    ellipse(x: number, y: number, w: number, h: number): void;
    circle(x: number, y: number, r: number): void;
    line(x0: number, y0: number, x1: number, y1: number): void;
    text(msg: string, x: number, y: number, w?: number, h?: number): void;
    textRect(msg: string, x:number, y:number, w?: number, h?: number): void;
    boundingBox(msg: string): any;
    clipRect(x: number, y:number, w: number, h: number): void;
    save(): void;
    restore(): void;
    clone(): Gfx;
    get gparms(): GfxParms;
}
