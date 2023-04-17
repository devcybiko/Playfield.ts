import { PlayfieldEvent, Tile } from "../Playfield";
import { Dimensions, Rect, int } from "../Utils";
import { Group } from "./Group";
import { Slider } from "./Slider";

export class View extends Group {

    protected _vSlider: Slider;
    protected _hSlider: Slider;
    private _vSliderShow: boolean;
    private _hSliderShow: boolean;
    protected _port: Group;
    protected _body: Group;
    protected _sliderSize = 20;
    protected _lastBodyRect: Rect;

    constructor(name: string, parent: Tile, x: number, y: number, w: number, h: number, label="") {
        super(name, parent, x, y, w, h, label);
        this._type += ".View";

        let vSliderRect = new Rect(0, 0, this._sliderSize, h-this._sliderSize);
        let hSliderRect = new Rect(this._sliderSize, h-this._sliderSize, w-this._sliderSize, this._sliderSize);
        let portRect = new Rect(this._sliderSize+1, 1, w - this._sliderSize - 1, h-this._sliderSize - 1);
        let bodyRect = new Rect(0, 0, 0, 0);
        this._lastBodyRect = bodyRect;

        this._vSlider = new Slider("_vSlider", this, vSliderRect.x, vSliderRect.y, vSliderRect.w, vSliderRect.h);
        this._hSlider = new Slider("_hSlider", this, hSliderRect.x, hSliderRect.y, hSliderRect.w, hSliderRect.h);
        this._port = new Group("_port", this, portRect.x, portRect.y, portRect.w, portRect.h);
        this._body = new Group("_body", this._port, bodyRect.x, bodyRect.y, bodyRect.w, bodyRect.h, label);
        this._body.autoResize = true;

        this._vSlider.cursorSize(1.0, 0.5);
        this._vSlider.cursorMove(0.0, 0.0);
        this._hSlider.cursorSize(0.5, 1.0);
        this._hSlider.cursorMove(0.0, 0.0);

        this._vSliderShow = false;
        this._hSliderShow = false;

        this._vSlider.onChange = this._vChange.bind(this);
        this._hSlider.onChange = this._hChange.bind(this);
        this.isBoxed = true;
        this._port.isBoxed = true;
        this._port.onSwipe = this._onSwipe.bind(this);
    }

    _vUpdate() {
        let rcursor = this._vSlider.rcursor;
        let percentH = this._port.h / this._body.h;
        if (percentH > 1.0) percentH = 1.0;
        this._vSlider.cursorSize(rcursor.w, percentH);

        let dh = this._body.h - this._port.h;
        if (dh > 0) {
            let newRY = -this._body.y / dh ;
            this._vSlider.cursorMove(rcursor.x, newRY);
        } else {
            this._vSlider.cursorMove(rcursor.x, 0);
        }
    }

    _vChange(rx: number, ry: number) {
        let dh = this._body.h - this._port.h;
        if (dh < 0) dh = 0;
        this._body.y = - int(ry * dh);
    }

    _hUpdate() {
        let rcursor = this._hSlider.rcursor;
        let percentW = this._port.w / this._body.w;
        if (percentW > 1.0) percentW = 1.0;
        this._hSlider.cursorSize(percentW, rcursor.h);

        let dw = this._body.w - this._port.w;
        if (dw > 0) {
            let newRX = -this._body.x / dw ;
            this._vSlider.cursorMove(newRX, rcursor.y);
        } else {
            this._vSlider.cursorMove(0, rcursor.y);
        }
    }

    _hChange(rx: number, ry: number) {
        let dw = this._body.w - this._port.w;
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
        this._port.draw(enable);
        if (this._lastBodyRect.h !== this._body.h) this._vUpdate();
        if (this._lastBodyRect.w !== this._body.w) this._hUpdate();
        this.gfx.restore();
        return this.dimensions;
    }

    _onSwipe(dx: number, dy: number, pf: PlayfieldEvent): void {
        if (dy === 0) this._hSlider.onSlide(-dx/2, -dy/2, pf);
        if (dx === 0) this._vSlider.onSlide(-dx/2, -dy/2, pf);
    }

    public get vSliderShow(): boolean {
        return this._vSliderShow;
    }
    public set vSliderShow(value: boolean) {
        this._vSliderShow = value;
        if (this._vSliderShow) {
            this._vSlider.w = this._sliderSize;
            this._port.x = this._sliderSize + 1;
            this._port.w = this.w - this._port.x;
        } else {
            this._vSlider.w = 0;
            this._port.x = 0;
            this._port.w = this.w;
        }
    }
    public get hSliderShow(): boolean {
        return this._hSliderShow;
    }
    public set hSliderShow(value: boolean) {
        this._hSliderShow = value;
        if (this._hSliderShow) {
            this._hSlider.h = this._sliderSize;
            this._port.h = this.h - this._hSlider.h;
        } else {
            this._hSlider.h = 0;
            this._port.h = this.h;
        }
    }
    public get vSliderEnable(): boolean {
        return this._vSlider.isEnabled;
    }
    public set vSliderEnable(value: boolean) {
        this._vSlider.isEnabled = value;
    }
    public get hSliderEnable(): boolean {
        return this._hSlider.isEnabled;
    }
    public set hSliderEnable(value: boolean) {
        this._hSlider.isEnabled = value;
    }
    get body(): Group {
        return this._body;
    }
}