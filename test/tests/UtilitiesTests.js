QUnit.test("Utilities: air.isArray", function (assert) {
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

QUnit.test("Utilities: air.isObject", function (assert) {
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

QUnit.test("Utilities: air.isStrictlyObject", function (assert) {
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

QUnit.test("Utilities: air.isBoolean", function (assert) {
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

QUnit.test("Utilities: air.isString", function (assert) {
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

QUnit.test("Utilities: air.isFunction", function (assert) {
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

QUnit.test("Utilities: air.isUndefined", function (assert) {
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

QUnit.test("Utilities: air.isNumeric", function (assert) {
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

QUnit.test("Utilities: air.keys", function (assert) {
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

QUnit.test("Utilities: air.each", function (assert) {
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
