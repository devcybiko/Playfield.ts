class Main {
    constructor() {
        let gparms = new GraphicsParms();
        gparms.color = "red";
        gparms.textAlign = "center";
        gparms.textBaseline = "middle";
        let playfield = new Playfield("#my_canvas");
        let x = 0;
        let y = 0;
        playfield.gfx.textRect("Hello Greg", x, (y += 24), undefined, undefined, gparms);
        playfield.gfx.textRect("  Two  ", x, (y += 24), undefined, undefined, gparms);
        playfield.gfx.textRect("Three", x, (y += 24), 100, 24, gparms);
        gparms.borderColor = "yellow";
        gparms.fillColor = "green";
        playfield.gfx.textRect("Four", x, (y += 24), 50, 48, gparms);
        playfield.gfx.circle(100, (y += 100), 25);
        playfield.gfx.circle(100, (y += 100), 25, gparms);
        playfield.gfx.circle(100, (y += 100), 25, gparms);
        playfield.gfx.ellipse(100, (y += 100), 50, 25, gparms);
    }
}
let main = new Main();
//# sourceMappingURL=Main.js.map