
define(function (require) {
    console.log("Main.js...");
    var {TestClass} = require("Test/GUIEditor");
    console.log(TestClass);
    let main = new TestClass();
    main.run();
});