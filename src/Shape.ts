abstract class Shape extends Actor {
    private meander: Meander;

    constructor(name: string, x:number, y:number, w:number, h:number, color="black", borderColor="black", fillColor="white") {
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