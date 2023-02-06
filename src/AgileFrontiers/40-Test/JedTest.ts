class JedTest {
    constructor() {
        let playfield = new Playfield("#my_canvas");
        let TextItem1 = new JedTextItem(playfield, "first_name", "First Name:", "Gregory L. Smith", 10, 10, 75, 24);
        let labelBB = TextItem1.labelBB();
        let TextItem2 = new JedTextItem(playfield, "mi", "M.I.:", "Smith", 10, 40, 150, 24, labelBB.w, labelBB.h);
        let TextItem3 = new JedTextItem(playfield, "last_name", "Last Name:", "Smith", 10, 70, 8, 24, labelBB.w, labelBB.h);
        playfield.start();
    }
}

let jedTest = new JedTest();