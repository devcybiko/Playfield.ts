class JedTest {
    constructor() {
        let playfield = new Playfield("#my_canvas");
        let textItem1 = new TextItem("first_name", "First Name: ", "Gregory", 10, 10);
        let textItem2 = new TextItem("last_name", "Last Name: ", "Smith", 10, 40);
        let textItem3 = new TextItem("last_name", undefined, "Smith", 10, 70);
        playfield.add(textItem1);
        playfield.add(textItem2);
        playfield.add(textItem3);
        playfield.start();
    }
}
let jedTest = new JedTest();
//# sourceMappingURL=JedTest.js.map