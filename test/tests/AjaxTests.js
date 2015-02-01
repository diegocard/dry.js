QUnit.test("Ajax: dry.get", function (assert) {
    // This test will retrieve my user's information from GitHub's user API.
    assert.expect(1);
    var done = assert.async(),
        url = 'https://api.github.com/users/diegocard',
        gitHubUserId = 4444386,
        checkDataFormat = function(data) {
            return data && (typeof data === "object") && data.id === gitHubUserId;
        };
    // Request with all parameters
    dry.ajax({
        type: 'GET',
        url: url,
        timeout: 5000,
        success: function(data){
            if (checkDataFormat(data)) {
                assert.ok(true, "ajax: correct request with all parameters");
            }
            done();
        },
        error: function() {
            assert.ok(false, "ajax: entered error callback function");
        }
    });
    // Request with only the required parameters
    dry.ajax({
        url: url
    });
});

QUnit.test("Ajax: dry.getJSON", function (assert) {
    // This test will retrieve my user's information from GitHub's user API.
    assert.expect(1);
    var done = assert.async(),
        url = 'https://api.github.com/users/diegocard',
        gitHubUserId = 4444386,
        checkDataFormat = function(data) {
            return data && (typeof data === "object") && data.id === gitHubUserId;
        };
    // Request with all parameters
    dry.getJSON(
        url,
        function(data){
            if (checkDataFormat(data)) {
                assert.ok(true, "getJSON: correct request with all parameters");
            }
            done();
        },
        function() {
            assert.ok(false, "getJSON: entered error callback function");
        }
    );
    // Request with only the required parameters
    dry.getJSON(url);
});

// get
QUnit.test("Ajax: dry.get shortcut method", function (assert) {
    // This test will retrieve my user's information from GitHub's user API.
    assert.expect(1);
    var done = assert.async(),
    url = 'https://api.github.com/users/diegocard',
    gitHubUserId = 4444386,
    checkDataFormat = function(data) {
        return data && (typeof data === "object") && data.id === gitHubUserId;
    };
    // Request with all parameters
    dry.get(
        url,
        function(data){
            if (checkDataFormat(data)) {
                assert.ok(true, "get: correct request with all parameters");
            }
            done();
        },
        function() {
            assert.ok(false, "get: entered error callback function");
        }
    );
    // Request with only the required parameters
    dry.get(url);
});

QUnit.test("Ajax: dry.post shortcut method", function (assert) {
    // This test will post to a service which returns the same data posted
    assert.expect(1);
    var done = assert.async(),
        url = 'http://httpbin.org/post',
        data = {
            name: "John",
            time: "2pm",
            nested:{
                a:1, b:2, c: {d:4}
            }
        },
        checkDataFormat = function(data) {
            return (
                data &&
                (typeof data === "object") &&
                data.form.name === "John" &&
                data.form['nested[a]'] === "1" &&
                data.form['nested[b]'] === "2" &&
                data.form['nested[c][d]'] === "4" &&
                data.form.time === "2pm"
            );
        };
    // Request with all parameters
    dry.post(
        url,
        data,
        function(data){
            if (checkDataFormat(data)) {
                assert.ok(true, "post: correct request with all parameters");
            }
            done();
        },
        function() {
            assert.ok(false, "post: entered error callback function");
        }
    );
    // Request with only the required parameters
    dry.post(url, data);
});

QUnit.test("Ajax: dry.put shortcut method", function (assert) {
    // This test will send a PUT to a service which returns the same data sent
    assert.expect(1);
    var done = assert.async(),
    url = 'http://httpbin.org/put',
    data = {
        name: "John",
        time: "2pm",
        nested:{
            a:1, b:2, c: {d:4}
        }
    },
    checkDataFormat = function(data) {
        return (
            data &&
            (typeof data === "object") &&
            data.form.name === "John" &&
            data.form['nested[a]'] === "1" &&
            data.form['nested[b]'] === "2" &&
            data.form['nested[c][d]'] === "4" &&
            data.form.time === "2pm"
        );
    };
    // Request with all parameters
    dry.put(
        url,
        data,
        function(data){
            if (checkDataFormat(data)) {
                assert.ok(true, "put: correct request with all parameters");
            }
            done();
        },
        function() {
            assert.ok(false, "put: entered error callback function");
        }
    );
    // Request with only the required parameters
    dry.put(url, data);
});

QUnit.test("Ajax: dry.delete shortcut method", function (assert) {
    // This test will send a DELETE to a service which returns the same data sent
    assert.expect(1);
    var done = assert.async(),
    url = 'http://httpbin.org/delete',
    data = {
        name: "John",
        time: "2pm",
        nested:{
            a:1, b:2, c: {d:4}
        }
    },
    checkDataFormat = function(data) {
        return (
            data &&
            (typeof data === "object") &&
            data.form.name === "John" &&
            data.form['nested[a]'] === "1" &&
            data.form['nested[b]'] === "2" &&
            data.form['nested[c][d]'] === "4" &&
            data.form.time === "2pm"
        );
    };
    // Request with all parameters
    dry.delete(
        url,
        data,
        function(data){
            if (checkDataFormat(data)) {
                assert.ok(true, "delete: correct request with all parameters");
            }
            done();
        },
        function() {
            assert.ok(false, "delete: entered error callback function");
        }
    );
    // Request with only the required parameters
    dry.delete(url, data);
});
