class Main {
  constructor() {
    let playfield = new Playfield("#my_canvas");
    let x = 0;
    let y = 0;
    playfield.gfx.textRect("Hello Greg", x, (y += 24));
    playfield.gfx.textRect(
      "  Two  ",
      x,
      (y += 24),
      undefined,
      undefined,
      "red"
    );
    playfield.gfx.textRect("Three", x, (y += 24), 100, 24, "red");
    playfield.gfx.textRect(
      "Four",
      x,
      (y += 24),
      50,
      48,
      "red",
      "yellow",
      "green"
    );
    playfield.gfx.circle(100, (y += 100), 25);
    playfield.gfx.circle(100, (y += 100), 25, "red");
    playfield.gfx.circle(100, (y += 100), 25, "red", "green");
    playfield.gfx.ellipse(100, (y += 100), 50, 25, "red", "green");
  }
}
