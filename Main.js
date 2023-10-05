
// define(function (require) {
//     var TestClasses = require("Test/index");
//     let main = new TestClasses[_testcase_]();
//     main.run();
// });

define(function (require) {
    var Apps = require("Apps/index");
    let main = new Apps["Form"]();
    main.run(formStrings, formObjects); // formstrings loaded in index.html
});