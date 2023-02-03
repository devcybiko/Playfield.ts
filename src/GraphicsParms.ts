class GraphicsParms {
    private _fontSize: number;
    private _fontFace: string;
    color = "black";
    borderColor = "black";
    fillColor = "white";
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
    xOffset = 0;
    yOffset = 0;
    private _font: string;

    constructor() {
        this.textAlign = "left";
        this.textBaseline = "top";
        this.fontSize = 24;
        this.fontFace = "san-serif"
    }
    public clone(): GraphicsParms {
        return { ...this } as GraphicsParms;
    }
    private _updateFont() {
        this._font = "" + this._fontSize + "px " + this._fontFace;
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
}