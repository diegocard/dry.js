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

QUnit.test("ajax with GET", function (assert) {
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

QUnit.test("getJSON", function (assert) {
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
QUnit.test("get", function (assert) {
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

// post http://httpbin.org/post
