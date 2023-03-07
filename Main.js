
define(function (require) {
    console.log("Main.js...");
    var TestClass = require("Test/PlayfieldTest").PlayfieldTest;
    console.log(TestClass);
    let main = new TestClass();
    // main.boxTest();
    // main.circleTestTile();
    // main.groupTestTile();
    // main.tenthousandTestTile();
    // main.shapeTest();
    main.jedTest();
});
 