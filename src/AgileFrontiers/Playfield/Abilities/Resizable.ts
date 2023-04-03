import { PlayfieldEvent } from "../PlayfieldEvent"
import { Tile } from "../Tile";

/**
 * can be Resized
 */
export interface Resizable { }
export class Resizable {
    protected _isResizableInitialized: boolean;
    public _asTile: Tile;

    Resizable() {
        this._isResizableInitialized = true;
    }

    public static cast(obj: any): Resizable {
        return obj as Resizable;
    }

    resize(w: number, h: number): void {
        let thisTile = this as unknown as Tile;
        thisTile.w = w;
        thisTile.h = h;
    }

    relResize(dw: number, dh: number): void {
        let thisTile = this as unknown as Tile;
        thisTile.w += dw;
        thisTile.h += dh;
    }

    // --- onActions --- //
    
    onResize(w: number, h: number, pfEvent: PlayfieldEvent): void {
        this.resize(w, h);
        this.onResizeChildren(w, h, pfEvent);
    }

    onRelResize(dw: number, dh: number, pfEvent: PlayfieldEvent): void {
        let thisTile = this as unknown as Tile;
        this.relResize(dw, dh);
        this.onRelResizeChildren(dw, dh, pfEvent);
    }

    onResizeChildren(w: number, h: number, pfEvent: PlayfieldEvent) {
        let thisTile = this as unknown as Tile;
        for(let _child of thisTile.children) {
            let child = _child as unknown as Resizable;
            if (child._isResizableInitialized) child.onResize(w, h, pfEvent);
        }
    }

    onRelResizeChildren(dw: number, dh: number, pfEvent: PlayfieldEvent) {
        let thisTile = this as unknown as Tile;
        for(let _child of thisTile.children) {
            let child = _child as unknown as Resizable;
            if (child._isResizableInitialized) child.onRelResize(dw, dh, pfEvent);
        }
    }
}
