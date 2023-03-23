
define(function (require) {
    console.log("Main.js...");
    var {TestClass} = require("Test/Test05");
    console.log(TestClass);
    let main = new TestClass();
    main.run();
});