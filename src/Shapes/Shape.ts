abstract class Shape extends Actor {
    public meander: Meander;
    public gparms = new GraphicsParms();
    public selectedGparms = new GraphicsParms();
    constructor(name: string, x:number, y:number, w:number, h:number, color="black", borderColor="black", fillColor="white") {
        super(name, x, y, w, h);
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