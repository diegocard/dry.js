// Promise tests
// -------------

QUnit.test("Promise: simple synchronous test", function (assert) {
    assert.expect(1);

    function sync_return(value) {
        var p = dry.promise();
        p.done(null, value);
        return p;
    }

    sync_return(123).then(function(error, result) {
        assert.ok(result === 123, 'simple synchronous test');
    });
});

QUnit.test("Promise: simple asynchronous test", function (assert) {
    assert.expect(1);
    var done = assert.async();

    function async_return(value) {
        var p = dry.promise();
        setTimeout(function(){
            p.done(null, value);
        });
        return p;
    }

    async_return(123).then(function(error, result) {
        assert.ok(result === 123, 'simple asynchronous test');
        done();
    });
});


QUnit.test("Promise: multiple results", function (assert) {
    assert.expect(3);
    p = dry.promise();
    var done = assert.async();

    p.then(function (res, a, b, c) {
        assert.ok(a === 1, 'multiple results (1/3)');
    });

    setTimeout(function () {
        p.then(function (res, a, b, c) {
            assert.ok(b === 2, 'multiple results (2/3)');
        });

        p.done(null, 1, 2, 3);

        p.then(function (res, a, b, c) {
            assert.ok(c === 3, 'multiple results (3/3)');
            done();
        });
    });
});

QUnit.test("Promise: Promise join", function (assert) {
    function late(n) {
        var p = dry.promise();
        setTimeout(function() {
            p.done(null, n);
        }, n);
        return p;
    }

    assert.expect(2);
    var done = assert.async();
    var d = new Date();

    dry.Promise.join([late(400), late(800)]).then(
        function(results) {
            var delay = new Date() - d;
            assert.ok(results[0][1]===400 && results[1][1]===800, "join result");
            assert.ok(700 < delay && delay < 900, "joining functions");
            done();
        }
    );
});


QUnit.test("Promise: Empty join", function (assert) {
    assert.expect(1);
    var done = assert.async();
    var joined = false;

    dry.Promise.join([]).then(
        function() {
            joined = true;
        }
    );

    setTimeout(function() {
        assert.ok(joined, "empty promise join");
        done();
    }, 200);
});


QUnit.test("Promise: Several consecutive thens", function (assert) {
    assert.expect(2);
    var done = assert.async();

    function late(n) {
        var p = dry.promise();
        setTimeout(function() {
            p.done(null, n);
        }, n);
        return p;
    }

    var p = dry.promise();

    var toChain = {
        d: new Date(),
        f1: function() {
            return late(100);
        },
        f2 : function(err, n) {
            return late(n + 200);
        },
        f3: function(err, n) {
            return late(n + 300);
        },
        f4: function(err, n) {
            return late(n + 400);
        },
        check: function(err, n) {
            var delay = new Date() - toChain.d;
            assert.ok(n === 1000, "chain() result");
            assert.ok(1900 < delay && delay < 2400, "chaining functions()");
            done();
        }
    };

    toChain.f1().then(toChain.f2).then(toChain.f3).then(toChain.f4).then(toChain.check);
});

QUnit.test("Promise: Chain test", function (assert) {
    assert.expect(2);
    var done = assert.async();

    function late(n) {
        var p = dry.promise();
        setTimeout(function() {
            p.done(null, n);
        }, n);
        return p;
    }

    var toChain = {
        d: new Date(),
        f1: function() {
            return late(100);
        },
        f2 : function(err, n) {
            return late(n + 200);
        },
        f3: function(err, n) {
            return late(n + 300);
        },
        f4: function(err, n) {
            return late(n + 400);
        },
        check: function(err, n) {
            var delay = new Date() - toChain.d;
            assert.ok(n === 1000, "chain() result");
            assert.ok(1900 < delay && delay < 2400, "chaining functions()");
            done();
        }
    };

    dry.Promise.chain(
        [toChain.f1,
         toChain.f2,
         toChain.f3,
         toChain.f4]
    ).then(
        toChain.check
    );
});

QUnit.test("Promise: Test ajax timeout", function (assert) {
    assert.expect(3);
    var done = assert.async();

    var realXMLHttpRequest = window.XMLHttpRequest;
    var isAborted = false;
    var defaultTimeout = dry.settings.AJAX_TIMEOUT;
    dry.settings.AJAX_TIMEOUT = 2000;

    window.XMLHttpRequest = function () {
        this.readyState = 4;
        this.status = 200;
        this.responseText = 'a response text';
        this.open = function () {};
        this.setRequestHeader = function () {};
        this.abort = function () { isAborted = true; };
        this.onreadystatechange = function () {};
        var self = this;
        this.send = function () {
            setTimeout(function() {
                self.onreadystatechange();
            }, 3000);
        };
    };

    dry.get('/').then(
        function(err, text, xhr) {
            assert.ok(isAborted === true, 'Ajax timeout must abort xhr');
            assert.ok(err === dry.settings.ETIMEOUT, 'Ajax timeout must report error');
            assert.ok(text === '', 'Ajax timeout must return empty response');

            window.XMLHttpRequest = realXMLHttpRequest;
            dry.settings.AJAX_TIMEOUT = defaultTimeout;
            done();
        }
    );
});