class JedTest {
    constructor() {
        let playfield = new Playfield("#my_canvas");
        let TextItem1 = new TextItem(playfield, "first_name", "First Name:", "Gregory", 10, 10);
        let TextItem2 = new TextItem(playfield, "mi", "M.I.:", "Smith", 10, 40, 100, 0, 150, 0);
        let TextItem3 = new TextItem(playfield, "last_name", "Last Name:", "Smith", 10, 70, 100, 0, 150, 0);
        playfield.start();
    }
}

let jedTest = new JedTest();