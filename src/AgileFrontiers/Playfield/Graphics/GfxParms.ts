export interface hasGfxParms {
    get gparms(): GfxParms;
}

export class GfxParms {
    static SANS_SERIF = "sans-serif";
    static SERIF = "serif";
    static MONOSPACE = "monospace";
    static DEFAULT_FONT = "sans-serif";
    static BOLD = "bold";
    static ITALIC = "italic";
    static REGULAR = "";
    static LEFT = "left" as CanvasTextAlign;
    static RIGHT = "right" as CanvasTextAlign;
    static CENTER = "center" as CanvasTextAlign;
    static TOP = "top" as CanvasTextBaseline;
    static MIDDLE = "middle" as CanvasTextBaseline;
    static BOTTOM = "bottom" as CanvasTextBaseline;

    private _fontSize: number;
    private _fontFace: string;
    private _fontStyle: string;

    private _enable = true; // turn off actual drawing (great for creating bounding boxes)
    private _color = "black";
    private _borderColor = "black";
    private _fillColor = "white";
    private _borderRadius = 0;
    private _textAlign: CanvasTextAlign;
    private _textBaseline: CanvasTextBaseline;
    private _font: string;

    constructor() {
        this.textAlign = GfxParms.LEFT;
        this.textBaseline = GfxParms.TOP;
        this.fontSize = 16;
        this.fontFace = GfxParms.DEFAULT_FONT;
        this.fontStyle = "";
    }
    public clone(): GfxParms {
        let gfxparms = new GfxParms();
        Object.assign(gfxparms, this);
        return gfxparms;
    }
    private _updateFont() {
        this._font = (this._fontStyle + " " + this._fontSize + "px " + this._fontFace).trim();
    }
    public get font(): string {
        return this._font;
    }
    public get fontSize(): number {
        return this._fontSize;
    }
    public set fontSize(n: number) {
        this._fontSize = n;
        this._updateFont();
    }
    public get fontFace(): string {
        return this._fontFace;
    }
    public set fontFace(n: string) {
        this._fontFace = n;
        this._updateFont();
    }
    public get fontStyle(): string {
        return this._fontStyle;
    }
    public set fontStyle(value: string) {
        this._fontStyle = value;
        this._updateFont();
    }
    public get enable() {
        return this._enable;
    }
    public set enable(value) {
        this._enable = value;
    }
    public get color() {
        return this._color;
    }
    public set color(value) {
        this._color = value;
    }
    public get borderColor() {
        return this._borderColor;
    }
    public set borderColor(value) {
        this._borderColor = value;
    }
    public get fillColor() {
        return this._fillColor;
    }
    public set fillColor(value) {
        this._fillColor = value;
    }
    public get borderRadius() {
        return this._borderRadius;
    }
    public set borderRadius(value) {
        this._borderRadius = value;
    }
    public get textAlign(): CanvasTextAlign {
        return this._textAlign;
    }
    public set textAlign(value: CanvasTextAlign) {
        this._textAlign = value;
    }
    public get textBaseline(): CanvasTextBaseline {
        return this._textBaseline;
    }
    public set textBaseline(value: CanvasTextBaseline) {
        this._textBaseline = value;
    }

}