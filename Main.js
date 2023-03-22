
define(function (require) {
    console.log("Main.js...");
    var {TestClass} = require("Test/Test03");
    console.log(TestClass);
    let main = new TestClass();
    main.run();
});