class TextItem extends Item {
    private xOffset: number;
    private yOffset: number;
    private options = {
        textBaseline: "bottom",
        textAlign: "left"
    }
    constructor(name: string, label: string, value: string, x: number, y:number, w=100, h=24) {
        super(name, label, value, x, y, w, h);
        this.xOffset = 2;
        this.yOffset = this.h - 4;
    }
    draw() {
        let gfx = this.playfield.gfx;
        gfx.rect(this.x, this.y, this.w, this.h);
        gfx.text(this.value(), this.x + this.xOffset, this.y + this.yOffset, this.color, this.options);
    }
}