QUnit.config.testTimeout = 5000;

// Before each test
var contains = function(str, element) {
        return str.indexOf(element) > -1;
    },
    beforeTest = function() {
        dry.apps = {};
    },
    afterTest = function() {
        // window.location.href = urlBeforeTest;
    };

QUnit.testStart(beforeTest);
QUnit.testDone(afterTest);
