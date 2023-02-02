const playfield = new Background('#my_canvas');
playfield.add(new Box("RED", "red", 0, 0, 100, 100));
playfield.add(new Box("GREEN", "green", 100, 200, 50, 50));
playfield.add(new Box("ORANGE", "orange", 200, 125, 50, 25));
playfield.add(new Box("BLUE", "blue", 200, 200, 50, 50, -20, -20));
playfield.add(new Circle("VIOLET", "violet", 200, 200, 100, 50));
playfield.start();