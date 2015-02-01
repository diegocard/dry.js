// Test Setup
// ----------

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

QUnit.test("App: Default route is called on application start", function(assert) {
    assert.expect(1);
    // Create new app
    var app1 = dry.app('app1');

    // Default controller (root directory)
    app1.controller('default', {
        'default': function() {
            assert.ok(true, "default route was called and rendered the correct content");
        }
    });

    // Start the app
    app1.init();
});

QUnit.test("App: Default controller method renders appropriate content", function(assert) {
    assert.expect(1);
    // Create new app
    var app2 = dry.app('app2');

    // Default controller (root directory)
    app2.controller('default', {
        'default': null
    });

    // Start the app
    app2.init();

    var htmlContent = jQuery('#qunit-fixture').html();
    assert.ok(contains(htmlContent, 'Dry.js test page'), "default route was called and rendered the correct content");
});
