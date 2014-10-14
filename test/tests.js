// Test Setup
// ----------

// Before each test
var testSetup = function() {
    // window.location.href = 'tests.html';
};
QUnit.testStart(testSetup);

// Test 1
QUnit.test("Default route", function(assert) {
    assert.expect(1);
    // Create new app
    var app1 = air.app('app1');

    // Default controller (root directory)
    app1.controller('default', {
        'default': function() {
            assert.ok(true, "default route was called");
        }
    });

    // Register another dummy controller which should not be used
    app1.controller('main', {
        'default': function() {
            assert.ok(false, "this route should not be called");
        },
        'hello': null
    });

    // Start the app
    app1.init();
});