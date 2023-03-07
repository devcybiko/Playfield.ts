import { GfxParms } from "./GfxParms";

export interface Gfx {
    get width(): number;
    get height(): number;
    rect(x: number, y: number, w: number, h: number, _gparms: GfxParms): void;
    ellipse(x: number, y: number, w: number, h: number, _gparms: GfxParms): void;
    circle(x: number, y: number, r: number, _gparms: GfxParms): void;
    line(x0: number, y0: number, x1: number, y1: number, _gparms0?: GfxParms,_gparms1?: GfxParms): void;
    text(msg: string, x: number, y: number, _gparms: GfxParms, w?: number): void;
    textRect(msg: string, x:number, y:number, w?: number, h?: number, _gparms?: GfxParms): void;
    boundingBox(msg: string, _gparms: GfxParms): any;
    clipRect(x: number, y:number, w: number, h: number, _gparms?: GfxParms): void;
    save(): void;
    restore(): void;
}
