
define(function (require) {
    console.log("Main.js...");
    var {TestClass} = require("Test/TestBrowserFiles");
    console.log(TestClass);
    let main = new TestClass();
    main.run();
});