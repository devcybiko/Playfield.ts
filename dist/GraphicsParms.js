class GraphicsParms {
    constructor() {
        this.color = "black";
        this.borderColor = "black";
        this.fillColor = "white";
        this.xOffset = 0;
        this.yOffset = 0;
        this.textAlign = "left";
        this.textBaseline = "top";
        this.fontSize = 24;
        this.fontFace = "sans-serif";
    }
    clone() {
        return Object.assign({}, this);
    }
    _updateFont() {
        this._font = "" + this._fontSize + "px " + this._fontFace;
    }
    get font() {
        return this._font;
    }
    get fontSize() {
        return this._fontSize;
    }
    set fontSize(n) {
        this._fontSize = n;
        this._updateFont();
    }
    get fontFace() {
        return this._fontFace;
    }
    set fontFace(n) {
        this._fontFace = n;
        this._updateFont();
    }
}
//# sourceMappingURL=GraphicsParms.js.map