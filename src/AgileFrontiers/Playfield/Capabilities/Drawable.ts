import * as Utils from "../../Utils";
import { Mixin, Base, iBase } from "../../Mixins";
import { Gfx, GfxParms } from "../../Graphics";

export interface iDrawable extends iBase {
    Drawable(ctx: CanvasRenderingContext2D): void;
    get gfx(): Gfx;
    set gfx(g: Gfx);
    get gparms(): GfxParms;
    set gparms(g: GfxParms);
}

export const DrawableBase = Drawable(Base);
export abstract class DrawableClass extends DrawableBase { };
export function Drawable<TBase extends Mixin>(_base: TBase) {
    return class extends _base {
        _gfx: Gfx;
        _gparms: GfxParms;

        Drawable(ctx: CanvasRenderingContext2D) {
            this._gfx = new Gfx(ctx);
            this._gparms = new GfxParms();
        }
        get gfx(): Gfx {
            return this._gfx;
        }
        set gfx(g: Gfx) {
            this._gfx = g;
        }
        get gparms(): GfxParms {
            return this._gparms;
        }
        set gparms(g: GfxParms) {
            this._gparms = g;
        }
    };
}