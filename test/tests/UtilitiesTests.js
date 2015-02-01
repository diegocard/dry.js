QUnit.test("Utilities: dry.isArray", function (assert) {
    var test1 = [],
    test2 = [1, 2, 3],
    test3 = ["a", "b", "c"],
    invalidTests = [NaN, 1, {}, {a: 1}, undefined, function () {return 1;}],
    i, len;
    assert.ok(dry.isArray(test1), "isArray: empty array");
    assert.ok(dry.isArray(test2), "isArray: numeric array");
    assert.ok(dry.isArray(test3), "isArray: string array");
    for (i = 0, len = invalidTests.length; i < len; i++) {
        assert.ok(!dry.isArray(invalidTests[i]));
    }
});

QUnit.test("Utilities: dry.isObject", function (assert) {
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
    assert.ok(dry.isObject(test1), "isObject: empty object");
    assert.ok(dry.isObject(test2), "isObject: nested objects");
    assert.ok(dry.isObject(test3), "isObject: includes a function");
    assert.ok(dry.isObject(test3), "isObject: empty array");
    assert.ok(dry.isObject(test3), "isObject: array with elements");
    for (i = 0, len = invalidTests.length; i < len; i++) {
        assert.ok(!dry.isObject(invalidTests[i]));
    }
});

QUnit.test("Utilities: dry.isStrictlyObject", function (assert) {
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
    assert.ok(dry.isStrictlyObject(test1), "isStrictlyObject: empty object");
    assert.ok(dry.isStrictlyObject(test2), "isStrictlyObject: nested objects");
    assert.ok(dry.isStrictlyObject(test3), "isStrictlyObject: includes a function");
    assert.ok(dry.isStrictlyObject(test3), "isStrictlyObject: empty array");
    assert.ok(dry.isStrictlyObject(test3), "isStrictlyObject: array with elements");
    for (i = 0, len = invalidTests.length; i < len; i++) {
        assert.ok(!dry.isStrictlyObject(invalidTests[i]));
    }
});

QUnit.test("Utilities: dry.isBoolean", function (assert) {
    var invalidTests = [{}, {
        a: 1
    },
    NaN, 1, -1, 0, "str", undefined, [], [1, 2, 3],
    function () {
        return 1;
    }],
    i, len;
    assert.ok(dry.isBoolean(true), "isStrictlyObject: true");
    assert.ok(dry.isBoolean(false), "isStrictlyObject: false");
    for (i = 0, len = invalidTests.length; i < len; i++) {
        assert.ok(!dry.isBoolean(invalidTests[i]));
    }
});

QUnit.test("Utilities: dry.isString", function (assert) {
    var invalidTests = [{}, {
        a: 1
    },
    NaN, 1, -1, 0, true, false, undefined, [], [1, 2, 3],
    function () {
        return 1;
    }],
    i, len;
    assert.ok(dry.isString(""), "isString: empty string");
    assert.ok(dry.isString('test1'), "isString: single quotes");
    assert.ok(dry.isString("test2"), "isString: double quotes");
    assert.ok(dry.isString(new String("asd")), "isString: String constructor");
    assert.ok(dry.isString(new String()), "isString: Empty string constructor");
    for (i = 0, len = invalidTests.length; i < len; i++) {
        assert.ok(!dry.isString(invalidTests[i]));
    }
});

QUnit.test("Utilities: dry.isFunction", function (assert) {
    var invalidTests = [{}, {
        a: 1
    },
    NaN, 1, -1, 0, true, false, undefined, [], [1, 2, 3], "str"],
    func = function func(a) {
        return a + 1;
    },
    i, len;
    assert.ok(dry.isFunction(function (a, b) {
        return a + b;
    }), "isFunction: anonymous function");
    assert.ok(dry.isFunction(func), "isFunction: names function");
    assert.ok(dry.isFunction(new Function()), "isFunction: Empty function constructor");
    assert.ok(dry.isFunction(new Function("x", "y", "return x+y;")), "isFunction: Empty function constructor");
    for (i = 0, len = invalidTests.length; i < len; i++) {
        assert.ok(!dry.isFunction(invalidTests[i]));
    }
});

QUnit.test("Utilities: dry.isUndefined", function (assert) {
    var invalidTests = [{}, {
        a: 1
    },
    NaN, 1, -1, 0, true, false, [], [1, 2, 3], "str",
    function () {
        return 1;
    }],
    undef, i, len;
    assert.ok(dry.isUndefined(undef), "isUndefined: Uninitialized variable");
    assert.ok(dry.isUndefined(undefined), "isUndefined: Undefined pseudo-reserved word");
    for (i = 0, len = invalidTests.length; i < len; i++) {
        assert.ok(!dry.isUndefined(invalidTests[i]));
    }
});

QUnit.test("Utilities: dry.isNumeric", function (assert) {
    var invalidTests = [{}, {
        a: 1
    },
    NaN, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, undefined, true, false, [], [1, 2, 3], "str",
    function () {
        return 1;
    }],
    i, len;
    assert.ok(dry.isNumeric(-25), "isNumeric: Negative integer number");
    assert.ok(dry.isNumeric(4), "isNumeric: Positive integer number");
    assert.ok(dry.isNumeric(0), "isNumeric: Zero");
    assert.ok(dry.isNumeric(-10.15), "isNumeric: Negative float number");
    assert.ok(dry.isNumeric(1.15), "isNumeric: Positive float number");
    assert.ok(dry.isNumeric(Number.MAX_VALUE), "isNumeric: Max number");
    assert.ok(dry.isNumeric(Number.MIN_VALUE), "isNumeric: Min number");
    for (i = 0, len = invalidTests.length; i < len; i++) {
        assert.ok(!dry.isNumeric(invalidTests[i]));
    }
});

QUnit.test("Utilities: dry.keys", function (assert) {
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
    assert.ok(dry.keys(obj1).length === 0, "keys: Empty object");
    assert.ok(function () {
        var result2 = dry.keys(obj2);
        return (
            result2[0] === 'prop1' &&
            result2[1] === 'prop2' &&
            result2[2] === 'prop3' &&
            result2[3] === 'prop4'
        );
    }, "keys: Several types of properties");
});

QUnit.test("Utilities: dry.each", function (assert) {
    var arr = [1, 2, 3, 4],
        sum1 = 0,
        sum2 = 0,
        obj = {
            a: 1,
            b: 2,
            c: 3,
        };
    dry.each(arr, function (val) {
        sum1 += val;
    });
    dry.each(obj, function (val) {
        sum2 += val;
    });
    assert.ok(sum1 === 10, "forEach: numeric array");
    assert.ok(sum2 === 6, "forEach: object properties");
});
