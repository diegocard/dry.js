QUnit.test("Model: Generate GET, POST, PUT and DELETE methods", function (assert) {
    // This test will send a DELETE to a service which returns the same data sent
    assert.expect(4);
    var done = assert.async(),
        testModel = new dry.Model('TestModel', {
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

    // GET request
    testModel.getTest(
        data,
        function(data){ /* success callback */
            if (checkDataFormat(data)) {
                assert.ok(true, "get: correct request with all parameters");
            }
            done();
        },
        function() { /* error callback */
            assert.ok(false, "get: entered error callback function");
        }
    );

    // POST request
    testModel.postTest(
        data,
        function(data){ /* success callback */
            if (checkDataFormat(data)) {
                assert.ok(true, "post: correct request with all parameters");
            }
            done();
        },
        function() { /* error callback */
            assert.ok(false, "post: entered error callback function");
        }
    );

    // PUT request
    testModel.putTest(
        data,
        function(data){ /* success callback */
            if (checkDataFormat(data)) {
                assert.ok(true, "put: correct request with all parameters");
            }
            done();
        },
        function() { /* error callback */
            assert.ok(false, "put: entered error callback function");
        }
    );

    // DELETE request
    testModel.deleteTest(
        data,
        function(data){ /* success callback */
            if (checkDataFormat(data)) {
                assert.ok(true, "delete: correct request with all parameters");
            }
            done();
        },
        function() { /* error callback */
            assert.ok(false, "delete: entered error callback function");
        }
    );
});
