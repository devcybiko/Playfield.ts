class JedTest {
    constructor() {
        let playfield = new Playfield("#my_canvas");
        let TextItem1 = new TextItem(playfield, "first_name", "First Name:", "Gregory L. Smith", 10, 10, 100, 24);
        let labelBB = TextItem1.labelBB();
        let TextItem2 = new TextItem(playfield, "mi", "M.I.:", "Smith", 10, 40, 100, 24, labelBB.w, labelBB.h);
        let TextItem3 = new TextItem(playfield, "last_name", "Last Name:", "Smith", 10, 70, 100, 24, labelBB.w, labelBB.h);
        playfield.start();
    }
}

let jedTest = new JedTest();