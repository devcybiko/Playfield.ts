class Shape extends Actor {
    constructor(name, x, y, w, h, color = "black", borderColor = "black", fillColor = "white") {
        super(name, x, y, w, h);
        this.gparms = new GraphicsParms();
        this.selectedGparms = new GraphicsParms();
        this.gparms.color = "black";
        this.gparms.borderColor = borderColor;
        this.gparms.fillColor = color;
        this.gparms.textAlign = "center";
        this.gparms.textBaseline = "middle";
        this.selectedGparms.color = color;
        this.selectedGparms.borderColor = "black";
        this.selectedGparms.fillColor = color;
        this.selectedGparms.textAlign = "center";
        this.selectedGparms.textBaseline = "middle";
        this.meander = new Meander(this);
    }
    go() {
        this.meander.go();
    }
}
//# sourceMappingURL=Shape.js.map