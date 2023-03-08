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

    color = "black";
    borderColor = "black";
    fillColor = "white";
    borderRadius = 0;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
    dx = 0;
    dy = 0;
    private _font: string;

    constructor() {
        this.textAlign = GfxParms.LEFT;
        this.textBaseline = GfxParms.TOP;
        this.fontSize = 24;
        this.fontFace = GfxParms.DEFAULT_FONT;
        this.fontStyle = "";
    }
    public clone(): GfxParms {
        let gfxparms = new GfxParms;
        return Object.assign(gfxparms, this);
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

}