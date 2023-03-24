
define(function (require) {
    console.log("Main.js...");
    var {TestClass} = require("Test/Test06");
    console.log(TestClass);
    let main = new TestClass();
    main.run();
});