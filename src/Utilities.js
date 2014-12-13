// Check if the given parameter is an array
air.isArray = function(arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
};

// Check if the given parameter is an object
air.isObject = function(obj) {
    return obj === Object(obj) && !air.isFunction(obj);
};

// Check if the given parameter is strictly an object
air.isStrictlyObject = function(obj) {
    return air.isObject(obj) && !air.isArray(obj);
};

// Check if the given parameter is boolean
air.isBoolean = function(bool) {
    return bool === true || bool === false;
};

// Check if the given parameter is a string
air.isString = function(str) {
    return Object.prototype.toString.call(str) === "[object String]";
};

// Check if the given parameter is a function
air.isFunction = function(fun) {
    return Object.prototype.toString.call(fun) === "[object Function]";
};

// Check if the given parameter is undefined
air.isUndefined = function(obj) {
    return typeof obj === "undefined";
};

// Check if the given parameter is numeric
air.isNumeric = function(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
};

// Simple jQuery-like ajax implementation
air.ajax = function(options) {
    var type = options.type || 'GET',
        upperCaseType = type.toUpperCase() || 'GET',
        xhr = new XMLHttpRequest(),
        jsonResponse, encodedRequestData;
    xhr.open(upperCaseType, options.url, true);

    xhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 400 && options.success) {
                try {
                    // Try to convert the output to JSON
                    jsonResponse = JSON.parse(this.responseText);
                    options.success(jsonResponse);
                } catch(e) {
                    // If it fails, return the output as-is
                    options.success(this.responseText);
                }
            } else if (options.error) {
                options.error(this);
            }
        }
    };

    // Timeout
    xhr.timeout = options.timeout || 10000;
    xhr.ontimeout = options.ontimeout || function(){
        console.error('air.ajax timeout for url', options.url);
    };

    if (upperCaseType === 'GET') {
        xhr.send();
    }
    if (upperCaseType === 'PUT' || upperCaseType === 'DELETE') {
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.send();
    } else if (upperCaseType === 'POST') {
        if (air.isString(options.data)) {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.send(options.data);
        } else {
            // TODO
            // function serializeData(data) {
            //
            //     // If this is not an object, defer to native stringification.
            //     if (!air.isObject(data)) {
            //         return ((data === null) ? "" : data.toString());
            //     }
            //
            //     var buffer = [];
            //
            //     // Serialize each key in the object.
            //     for (var name in data) {
            //         if (data.hasOwnProperty(name)) {
            //             var value = data[name];
            //
            //             buffer.push(
            //                 encodeURIComponent(name) +
            //                 "=" +
            //                 encodeURIComponent((value === null) ? "" : value)
            //             );
            //         }
            //     }
            //
            //     // Serialize the buffer and clean it up for transportation.
            //     var source = buffer
            //     .join("&")
            //     .replace(/%20/g, "+");
            //     return (source);
            // }
            xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            xhr.send(options.data);
        }
    }
    xhr = null;
    return this;
};

// Send a GET request to retrieve JSON from a given URL
air.getJSON = function(url, callback, error) {
    return air.ajax({
        type: 'GET',
        url: url,
        success: function(data) {
            if (callback) {
                callback(JSON.parse(data));
            }
        },
        error: error
    });
};

// Send a POST request to a given URL
air.post = function(url, data, success, error) {
    return air.ajax({
        type: 'POST',
        url: url,
        data: data,
        success: success,
        error: error
    });
};

// Send a GET request to a given URL
air.get = function(url, success, error) {
    return air.ajax({
        type: 'GET',
        url: url,
        success: success,
        error: error
    });
};
