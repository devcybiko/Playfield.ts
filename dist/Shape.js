class Shape extends Actor {
    constructor(name, x, y, w, h, color = "black", borderColor = "black", fillColor = "white") {
        super(name, x, y, w, h);
        this.color = color;
        this.borderColor = borderColor;
        this.fillColor = fillColor;
        this.meander = new Meander(this);
    }
    go() {
        this.meander.go();
    }
}
//# sourceMappingURL=Shape.js.map