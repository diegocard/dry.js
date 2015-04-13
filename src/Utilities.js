// Utilities
// ---------

// Check if the given parameter is an array
dry.isArray = function(arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
};

// Check if the given parameter is an object
dry.isObject = function(obj) {
    return obj === Object(obj) && !dry.isFunction(obj);
};

// Check if the given parameter is strictly an object
dry.isStrictlyObject = function(obj) {
    return dry.isObject(obj) && !dry.isArray(obj);
};

// Check if the given parameter is boolean
dry.isBoolean = function(bool) {
    return bool === true || bool === false;
};

// Check if the given parameter is a string
dry.isString = function(str) {
    return Object.prototype.toString.call(str) === "[object String]";
};

// Check if the given parameter is a function
dry.isFunction = function(fun) {
    return Object.prototype.toString.call(fun) === "[object Function]";
};

// Check if the given parameter is undefined
dry.isUndefined = function(obj) {
    return typeof obj === "undefined";
};

// Check if the given parameter is numeric
dry.isNumeric = function(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
};

// Returns an array with the property names for the given object
dry.keys = function (obj) {
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
dry.each = function (obj, func, context) {
    var i, len, keys;
    if (dry.isStrictlyObject(obj)) {
        keys = dry.keys(obj);
        for (i=0, len=keys.length; i<len; i++) {
            func.call(context, obj[keys[i]], keys[i], obj);
        }
    } else {
        for (i=0, len=obj.length; i<len; i++) {
            func.call(context, obj[i], i, obj);
        }
    }
};

// JSONP requests
dry.jsonp = function(url, callback) {
    var callbackName = 'dry_jsonp_callback_' + Math.round(100000 * Math.random());
    window[callbackName] = function(data) {
        delete window[callbackName];
        document.body.removeChild(script);
        callback(data);
    };

    var script = document.createElement('script');
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
};

// Promises
dry.Promise = function() {
    this._callbacks = [];
};

dry.promise = function() {
    return new dry.Promise();
};

dry.Promise.prototype.then = function(func, context) {
    var p;
    if (this._isdone) {
        p = func.apply(context, this.result);
    } else {
        p = new dry.Promise();
        this._callbacks.push(function () {
            var res = func.apply(context, arguments);
            if (res && dry.isFunction(res.then)) {
                res.then(p.done, p);
            }
        });
    }
    return p;
};

dry.Promise.prototype.done = function() {
    var i, len;
    this.result = arguments;
    this._isdone = true;
    for (i=0, len=this._callbacks.length; i<len; i++) {
        this._callbacks[i].apply(null, arguments);
    }
    this._callbacks = [];
};

dry.Promise.join = function(promises) {
    var p = new dry.Promise(),
        results = [],
        numdone = 0,
        total, i;

    if (!promises || !promises.length) {
        p.done(results);
        return p;
    }

    total = promises.length;

    function notifier(i) {
        return function() {
            numdone += 1;
            results[i] = Array.prototype.slice.call(arguments);
            if (numdone === total) {
                p.done(results);
            }
        };
    }

    for (i=0; i<total; i++) {
        promises[i].then(notifier(i));
    }

    return p;
};

dry.Promise.chain = function(funcs, args) {
    var p = new dry.Promise();
    if (funcs.length === 0) {
        p.done.apply(p, args);
    } else {
        funcs[0].apply(null, args).then(function() {
            funcs.splice(0, 1);
            dry.Promise.chain(funcs, arguments).then(function() {
                p.done.apply(p, arguments);
            });
        });
    }
    return p;
};

// Ajax methods
dry.ajax = function (options) {
    var method = options.method || 'GET',
        data = options.data || {},
        headers = options.headers || {},
        url = options.url;

    var p = new dry.Promise(),
        xhr,
        newXhr = function() {
            var xhr;
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                try {
                    xhr = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (e) {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
            }
            return xhr;
        },
        encode = function(data) {
            var result = "";
            if (dry.isString(data)) {
                result = data;
            } else {
                var e = encodeURIComponent;
                for (var k in data) {
                    if (data.hasOwnProperty(k)) {
                        result += '&' + e(k) + '=' + e(data[k]);
                    }
                }
            }
            return result;
        },
        onTimeout = function() {
            xhr.abort();
            p.done(dry.settings.ETIMEOUT, "", xhr);
        },
        payload, h, timeout, tid;
    
    try {
        xhr = newXhr();
    } catch (e) {
        p.done(dry.settings.ENOXHR, "");
        return p;
    }

    payload = encode(data);
    if (method === 'GET' && payload) {
        url += '?' + payload;
        payload = null;
    }

    xhr.open(method, url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    for (h in headers) {
        if (headers.hasOwnProperty(h)) {
            xhr.setRequestHeader(h, headers[h]);
        }
    }

    timeout = dry.settings.AJAX_TIMEOUT;
    if (timeout) {
        tid = setTimeout(onTimeout, timeout);
    }

    xhr.onreadystatechange = function() {
        var err, res;
        if (timeout) {
            clearTimeout(tid);
        }
        if (xhr.readyState === 4) { 
            err = (!xhr.status ||
                    (xhr.status < 200 || xhr.status >= 300) &&
                    xhr.status !== 304);
            try {
                /* Try to convert the output to JSON */
                res = JSON.parse(this.responseText);
            } catch(e) {
                /* If it fails, return the output as-is */
                res = this.responseText;
            }
            p.done(err, res, xhr);
        }
    };

    xhr.send(payload);
    return p;
};

// Utility ajax method shortcuts for POST, PUT and DELETE requests
dry.each(['GET', 'POST', 'PUT', 'DELETE'], function(method){
    dry[method.toLowerCase()] = function(url, data, headers) {
        return dry.ajax({
            method: method,
            url: url,
            data: data,
            headers: headers
        });
    };
});