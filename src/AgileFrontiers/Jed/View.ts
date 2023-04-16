import { Tile } from "../Playfield";
import { Dimensions, Rect, int } from "../Utils";
import { Group } from "./Group";
import { Slider } from "./Slider";

export class View extends Group {

    protected _vSlider: Slider;
    protected _hSlider: Slider;
    protected _view: Group;
    protected _body: Group;
    protected _sliderSize = 20;
    protected _lastBodyRect: Rect;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, label="") {
        super(name, parent, x, y, w, h, label);
        this._type += ".View";

        let vSliderRect = new Rect(0, 0, this._sliderSize, h-this._sliderSize);
        let hSliderRect = new Rect(this._sliderSize, h-this._sliderSize, w-this._sliderSize, this._sliderSize);
        let viewRect = new Rect(this._sliderSize+1, 1, w - this._sliderSize - 1, h-this._sliderSize - 1);
        let bodyRect = new Rect(0, 0, 0, 0);
        this._lastBodyRect = bodyRect;

        this._vSlider = new Slider("_vSlider", this, vSliderRect.x, vSliderRect.y, vSliderRect.w, vSliderRect.h);
        this._hSlider = new Slider("_hSlider", this, hSliderRect.x, hSliderRect.y, hSliderRect.w, hSliderRect.h);
        this._view = new Group("_view", this, viewRect.x, viewRect.y, viewRect.w, viewRect.h);
        this._body = new Group("_body", this._view, bodyRect.x, bodyRect.y, bodyRect.w, bodyRect.h, label);
        this._body.autoResize = true;

        this._vSlider.cursorSize(1.0, 0.5);
        this._vSlider.cursorMove(0.0, 0.0);
        this._hSlider.cursorSize(0.5, 1.0);
        this._hSlider.cursorMove(0.0, 0.0);

        this._vSlider.onSlide = this._vChange.bind(this);
        this._hSlider.onSlide = this._hChange.bind(this);
        this.isBoxed = true;
        this._view.isBoxed = true;
    }

    get body(): Group {
        return this._body;
    }

    _vUpdate() {
        let rcursor = this._vSlider.rcursor;
        let percentH = this._view.h / this._body.h;
        if (percentH > 1.0) percentH = 1.0;
        this._vSlider.cursorSize(rcursor.w, percentH);

        let dh = this._body.h - this._view.h;
        if (dh > 0) {
            let newRY = -this._body.y / dh ;
            this._vSlider.cursorMove(rcursor.x, newRY);
        } else {
            this._vSlider.cursorMove(rcursor.x, 0);
        }
    }

    _vChange(rx: number, ry: number) {
        let dh = this._body.h - this._view.h;
        if (dh < 0) dh = 0;
        this._body.y = - int(ry * dh);
    }

    _hUpdate() {
        let rcursor = this._hSlider.rcursor;
        let percentW = this._view.w / this._body.w;
        if (percentW > 1.0) percentW = 1.0;
        this._hSlider.cursorSize(percentW, rcursor.h);

        let dw = this._body.w - this._view.w;
        if (dw > 0) {
            let newRX = -this._body.x / dw ;
            this._vSlider.cursorMove(newRX, rcursor.y);
        } else {
            this._vSlider.cursorMove(0, rcursor.y);
        }
    }

    _hChange(rx: number, ry: number) {
        let dw = this._body.w - this._view.w;
        if (dw < 0) dw = 0;
        this._body.x = -int(rx * dw);
    }

    override draw(enable = true): Dimensions {
        this.updateGparms(enable);
        this.updateRect();
        this.gfx.clipRect(this.X, this.Y, this.W, this.H);
        if (this.isBoxed) this.gfx.rect(this.X, this.Y, this.W, this.H);
        if (this._vSlider) this._vSlider.draw(enable);
        if (this._hSlider) this._hSlider.draw(enable);
        this._lastBodyRect = this._body.rect;
        this._view.draw(enable);
        if (this._lastBodyRect.h !== this._body.h) this._vUpdate();
        if (this._lastBodyRect.w !== this._body.w) this._hUpdate();
        this.gfx.restore();
        return this.dimensions;
    }
}