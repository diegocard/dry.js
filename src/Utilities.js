// Utilities
// ---------

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

// Returns an array with the property names for the given object
air.keys = function (obj) {
    var keys = [],
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    return keys;
};

// Concise and efficient forEach implementation
air.each = function (obj, func, context) {
    var i, len, keys;
    if (air.isStrictlyObject(obj)) {
        keys = air.keys(obj);
        for (i=0, len=keys.length; i<len; i++) {
            func.call(context, obj[keys[i]], keys[i], obj);
        }
    } else {
        for (i=0, len=obj.length; i<len; i++) {
            func.call(context, obj[i], i, obj);
        }
    }
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
                    /* Try to convert the output to JSON */
                    jsonResponse = JSON.parse(this.responseText);
                    options.success(jsonResponse);
                } catch(e) {
                    /* If it fails, return the output as-is */
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
    } else if (upperCaseType) { /* POST, PUT, DELETE */
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.send(air.param(options.data));
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

// Utility ajax method shortcut for GET requests
air.get = function(url, success, error) {
    return air.ajax({
        type: 'GET',
        url: url,
        success: success,
        error: error
    });
};

// Utility ajax method shortcuts for POST, PUT and DELETE requests
air.each(['post', 'put', 'delete'], function(method){
    air[method] = function(url, data, success, error) {
        return air.ajax({
            type: method,
            url: url,
            data: data,
            success: success,
            error: error
        });
    };
});

// JSONP requests
air.jsonp = function(url, callback) {
    var callbackName = 'air_jsonp_callback_' + Math.round(100000 * Math.random());
    window[callbackName] = function(data) {
        delete window[callbackName];
        document.body.removeChild(script);
        callback(data);
    };

    var script = document.createElement('script');
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
};

// Serialize an array of form elements or a set of
// key/values into a query string
air.param = function(obj) {
    var r20 = /%20/g,
        rbracket = /\[\]$/,
        rCRLF = /\r?\n/g,
        rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
        rsubmittable = /^(?:input|select|textarea|keygen)/i,
        arr = [],
        prefix,
        add = function(key, value) {
            /* If value is a function, invoke it and return its value */
            value = air.isFunction(value) ? value() : (value == null ? "" : value);
            arr[arr.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
        },
        buildParams = function (prefix, obj, add) {
            var name;

            if (air.isArray(obj)) {
                /* Serialize array item */
                air.each(obj, function(value, index) {
                    if (rbracket.test(prefix)) {
                        /* Treat each array item as a scalar */
                        add(prefix, value);
                    } else {
                        /* Item is non-scalar (array or object), encode its numeric index */
                        buildParams(prefix + "[" + (typeof value === "object" ? index : "") + "]", value, add);
                    }
                });

            } else if (air.isObject(obj)) {
                /* Serialize object item */
                for (name in obj) {
                    buildParams(prefix + "[" + name + "]", obj[name], add);
                }
            } else {
                /* Serialize scalar item */
                add(prefix, obj);
            }
        };

    /* If an array was passed in, assume that it is an array of form elements */
    if (air.isArray(obj) || (!air.isStrictlyObject(obj))) {
        /* Serialize the form elements */
        air.each(obj, function() {
            add(this.name, this.value);
        });
    } else {
        /* Encode params recursively */
        for (prefix in obj) {
            buildParams(prefix, obj[prefix], add);
        }
    }

    /* Return the resulting serialization */
    return arr.join("&").replace(r20, "+");
};
