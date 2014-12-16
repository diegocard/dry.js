QUnit.test("isArray", function (assert) {
    var test1 = [],
    test2 = [1, 2, 3],
    test3 = ["a", "b", "c"],
    invalidTests = [NaN, 1, {}, {a: 1}, undefined, function () {return 1;}],
    i, len;
    assert.ok(air.isArray(test1), "isArray: empty array");
    assert.ok(air.isArray(test2), "isArray: numeric array");
    assert.ok(air.isArray(test3), "isArray: string array");
    for (i = 0, len = invalidTests.length; i < len; i++) {
        assert.ok(!air.isArray(invalidTests[i]));
    }
});

QUnit.test("isObject", function (assert) {
    var test1 = {},
    test2 = {
        a: 1,
        b: {
            c: 2
        }
    },
    test3 = {
        a: 1,
        b: function () {
            return 1;
        }
    },
    test4 = [],
    test5 = [1, 2, 3],
    invalidTests = [NaN, 1, "str", undefined,
    function () {
        return 1;
    }],
    i, len;
    assert.ok(air.isObject(test1), "isObject: empty object");
    assert.ok(air.isObject(test2), "isObject: nested objects");
    assert.ok(air.isObject(test3), "isObject: includes a function");
    assert.ok(air.isObject(test3), "isObject: empty array");
    assert.ok(air.isObject(test3), "isObject: array with elements");
    for (i = 0, len = invalidTests.length; i < len; i++) {
        assert.ok(!air.isObject(invalidTests[i]));
    }
});

QUnit.test("isStrictlyObject", function (assert) {
    var test1 = {},
    test2 = {
        a: 1,
        b: {
            c: 2
        }
    },
    test3 = {
        a: 1,
        b: function () {
            return 1;
        }
    },
    invalidTests = [NaN, 1, "str", undefined, [], [1, 2, 3],
    function () {
        return 1;
    }],
    i, len;
    assert.ok(air.isStrictlyObject(test1), "isStrictlyObject: empty object");
    assert.ok(air.isStrictlyObject(test2), "isStrictlyObject: nested objects");
    assert.ok(air.isStrictlyObject(test3), "isStrictlyObject: includes a function");
    assert.ok(air.isStrictlyObject(test3), "isStrictlyObject: empty array");
    assert.ok(air.isStrictlyObject(test3), "isStrictlyObject: array with elements");
    for (i = 0, len = invalidTests.length; i < len; i++) {
        assert.ok(!air.isStrictlyObject(invalidTests[i]));
    }
});

QUnit.test("isBoolean", function (assert) {
    var invalidTests = [{}, {
        a: 1
    },
    NaN, 1, -1, 0, "str", undefined, [], [1, 2, 3],
    function () {
        return 1;
    }],
    i, len;
    assert.ok(air.isBoolean(true), "isStrictlyObject: true");
    assert.ok(air.isBoolean(false), "isStrictlyObject: false");
    for (i = 0, len = invalidTests.length; i < len; i++) {
        assert.ok(!air.isBoolean(invalidTests[i]));
    }
});

QUnit.test("isString", function (assert) {
    var invalidTests = [{}, {
        a: 1
    },
    NaN, 1, -1, 0, true, false, undefined, [], [1, 2, 3],
    function () {
        return 1;
    }],
    i, len;
    assert.ok(air.isString(""), "isString: empty string");
    assert.ok(air.isString('test1'), "isString: single quotes");
    assert.ok(air.isString("test2"), "isString: double quotes");
    assert.ok(air.isString(new String("asd")), "isString: String constructor");
    assert.ok(air.isString(new String()), "isString: Empty string constructor");
    for (i = 0, len = invalidTests.length; i < len; i++) {
        assert.ok(!air.isString(invalidTests[i]));
    }
});

QUnit.test("isFunction", function (assert) {
    var invalidTests = [{}, {
        a: 1
    },
    NaN, 1, -1, 0, true, false, undefined, [], [1, 2, 3], "str"],
    func = function func(a) {
        return a + 1;
    },
    i, len;
    assert.ok(air.isFunction(function (a, b) {
        return a + b;
    }), "isFunction: anonymous function");
    assert.ok(air.isFunction(func), "isFunction: names function");
    assert.ok(air.isFunction(new Function()), "isFunction: Empty function constructor");
    assert.ok(air.isFunction(new Function("x", "y", "return x+y;")), "isFunction: Empty function constructor");
    for (i = 0, len = invalidTests.length; i < len; i++) {
        assert.ok(!air.isFunction(invalidTests[i]));
    }
});

QUnit.test("isUndefined", function (assert) {
    var invalidTests = [{}, {
        a: 1
    },
    NaN, 1, -1, 0, true, false, [], [1, 2, 3], "str",
    function () {
        return 1;
    }],
    undef, i, len;
    assert.ok(air.isUndefined(undef), "isUndefined: Uninitialized variable");
    assert.ok(air.isUndefined(undefined), "isUndefined: Undefined pseudo-reserved word");
    for (i = 0, len = invalidTests.length; i < len; i++) {
        assert.ok(!air.isUndefined(invalidTests[i]));
    }
});

QUnit.test("isNumeric", function (assert) {
    var invalidTests = [{}, {
        a: 1
    },
    NaN, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, undefined, true, false, [], [1, 2, 3], "str",
    function () {
        return 1;
    }],
    i, len;
    assert.ok(air.isNumeric(-25), "isNumeric: Negative integer number");
    assert.ok(air.isNumeric(4), "isNumeric: Positive integer number");
    assert.ok(air.isNumeric(0), "isNumeric: Zero");
    assert.ok(air.isNumeric(-10.15), "isNumeric: Negative float number");
    assert.ok(air.isNumeric(1.15), "isNumeric: Positive float number");
    assert.ok(air.isNumeric(Number.MAX_VALUE), "isNumeric: Max number");
    assert.ok(air.isNumeric(Number.MIN_VALUE), "isNumeric: Min number");
    for (i = 0, len = invalidTests.length; i < len; i++) {
        assert.ok(!air.isNumeric(invalidTests[i]));
    }
});

QUnit.test("keys", function (assert) {
    var obj1 = {},
        obj2 = {
            prop1: 1,
            prop2: {},
            prop3: [1, 2, 3],
            prop4: function () {
                return null;
            },
        },
        obj2Props = ['prop1', ];
    assert.ok(air.keys(obj1).length === 0, "keys: Empty object");
    assert.ok(function () {
        var result2 = air.keys(obj2);
        return (
            result2[0] === 'prop1' &&
            result2[1] === 'prop2' &&
            result2[2] === 'prop3' &&
            result2[3] === 'prop4'
        );
    }, "keys: Several types of properties");
});

QUnit.test("each", function (assert) {
    var arr = [1, 2, 3, 4],
        sum1 = 0,
        sum2 = 0,
        obj = {
            a: 1,
            b: 2,
            c: 3,
        };
    air.each(arr, function (val) {
        sum1 += val;
    });
    air.each(obj, function (val) {
        sum2 += val;
    });
    assert.ok(sum1 === 10, "forEach: numeric array");
    assert.ok(sum2 === 6, "forEach: object properties");
});

QUnit.test("Ajax: get", function (assert) {
    // This test will retrieve my user's information from GitHub's user API.
    assert.expect(1);
    var done = assert.async(),
        url = 'https://api.github.com/users/diegocard',
        gitHubUserId = 4444386,
        checkDataFormat = function(data) {
            return data && (typeof data === "object") && data.id === gitHubUserId;
        };
    // Request with all parameters
    air.ajax({
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
    air.ajax({
        url: url
    });
});

QUnit.test("Ajax: getJSON", function (assert) {
    // This test will retrieve my user's information from GitHub's user API.
    assert.expect(1);
    var done = assert.async(),
        url = 'https://api.github.com/users/diegocard',
        gitHubUserId = 4444386,
        checkDataFormat = function(data) {
            return data && (typeof data === "object") && data.id === gitHubUserId;
        };
    // Request with all parameters
    air.getJSON(
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
    air.getJSON(url);
});

// get
QUnit.test("Ajax: get shortcut method", function (assert) {
    // This test will retrieve my user's information from GitHub's user API.
    assert.expect(1);
    var done = assert.async(),
    url = 'https://api.github.com/users/diegocard',
    gitHubUserId = 4444386,
    checkDataFormat = function(data) {
        return data && (typeof data === "object") && data.id === gitHubUserId;
    };
    // Request with all parameters
    air.get(
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
    air.get(url);
});

QUnit.test("Ajax: post shortcut method", function (assert) {
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
    air.post(
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
    air.post(url, data);
});

QUnit.test("Ajax: put shortcut method", function (assert) {
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
    air.put(
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
    air.put(url, data);
});

QUnit.test("Ajax: delete shortcut method", function (assert) {
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
    air.delete(
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
    air.delete(url, data);
});
