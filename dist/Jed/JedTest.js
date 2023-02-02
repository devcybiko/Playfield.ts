class JedTest {
    constructor() {
        let playfield = new Playfield("#my_canvas");
        let textItem1 = new TextItem("first_name", "First Name: ", "Gregory", 10, 10);
        playfield.add(textItem1);
        playfield.start();
    }
}
let jedTest = new JedTest();
//# sourceMappingURL=JedTest.js.map