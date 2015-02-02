// Global test data for the tests included in this file
var testModel = new dry.Model('TestModel', {
        getTest: 'GET https://api.github.com/users/diegocard',
        postTest: 'POST http://httpbin.org/post',
        putTest: 'PUT http://httpbin.org/put',
        deleteTest: 'DELETE http://httpbin.org/delete',
    }),
    data = {
        name: "John",
        time: "2pm",
        nested:{
            a:1, b:2, c: {d:4}
        }
    },
    validateHttpbinResponse = function(data) {
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


QUnit.test("Model: generated GET endpoint method", function (assert) {
    assert.expect(1);
    var done = assert.async(),
        gitHubUserId = 4444386;
        validateGitHubResponseFormat = function(data) {
            return data && (typeof data === "object") && data.id === gitHubUserId;
        };

    // GET request
    testModel.getTest(
        data,
        function(data){ /* success callback */
            if (validateGitHubResponseFormat(data)) {
                assert.ok(true, "get: correct request with all parameters");
            }
            done();
        },
        function() { /* error callback */
            assert.ok(false, "get: entered error callback function");
        }
    );
});

QUnit.test("Model: generated POST endpoint method", function (assert) {
    assert.expect(1);
    var done = assert.async();
    // POST request
    testModel.postTest(
        data,
        function(data){ /* success callback */
            if (validateHttpbinResponse(data)) {
                assert.ok(true, "post: correct request with all parameters");
            }
            done();
        },
        function() { /* error callback */
            assert.ok(false, "post: entered error callback function");
        }
    );
});

QUnit.test("Model: generated PUT endpoint method", function (assert) {
    assert.expect(1);
    var done = assert.async();

    // PUT request
    testModel.putTest(
        data,
        function(data){ /* success callback */
            if (validateHttpbinResponse(data)) {
                assert.ok(true, "put: correct request with all parameters");
            }
            done();
        },
        function() { /* error callback */
            assert.ok(false, "put: entered error callback function");
        }
    );
});

QUnit.test("Model: generated DELETE endpoint method", function (assert) {
    assert.expect(1);
    var done = assert.async();

    // DELETE request
    testModel.deleteTest(
        data,
        function(data){ /* success callback */
            if (validateHttpbinResponse(data)) {
                assert.ok(true, "delete: correct request with all parameters");
            }
            done();
        },
        function() { /* error callback */
            assert.ok(false, "delete: entered error callback function");
        }
    );
});
