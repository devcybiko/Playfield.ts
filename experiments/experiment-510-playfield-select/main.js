const playfield = new Playfield('#my_canvas');
playfield.add(new Box("RED", "red", 0, 0, 100, 100, 10, 10));
playfield.add(new Box("GREEN", "green", 100, 200, 50, 50, -10, -10));
playfield.add(new Box("ORANGE", "orange", 200, 125, 50, 25, -5, 0));
playfield.add(new Box("BLUE", "blue", 200, 200, 50, 50, -20, -20));
playfield.redraw(enable);