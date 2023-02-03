class Circle extends Shape {
    private r: number;
    constructor(
        name: string,
        x: number,
        y: number,
        r: number,
        color?: string,
        borderColor?: string,
        fillColor?: string
    ) {
        super(name, x - r, y - r, r, r, color, borderColor, fillColor);
        this.logger = new Logger("Circle");
        this.r = r;
    }
    draw() {
        if (this.isSelected) {
            this.playfield.gfx.circle(
                this.x + this.r,
                this.y + this.r,
                this.r,
                this.selectedGparms
            );
        } else {
            this.playfield.gfx.circle(
                this.x + this.r,
                this.y + this.r,
                this.r,
                this.gparms
            );
        }
        let gparm2 =  this.gparms.clone();
        gparm2.borderColor = null;
        gparm2.fillColor = null;
        this.playfield.gfx.textRect(
            this.name,
            this.x,
            this.y,
            this.w,
            this.h,
            gparm2
        );
    }
}
