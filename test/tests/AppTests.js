// Test Setup
// ----------

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
    var done = assert.async();

    // Create new app
    var app2 = dry.app('app2');

    // Default controller (root directory)
    app2.controller('default', {
        'default': null
    });

    // Start the app
    app2.init();

    // Check if the content was rendered (rendering is done asynchronously)
    setTimeout(function() {
        var htmlContent = jQuery('#qunit-fixture').html();
        assert.ok(contains(htmlContent, 'Dry.js test page'), "default route was called and rendered the correct content");
        done();
    }, 500);
});
