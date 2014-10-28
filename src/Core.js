// AIR.JS
// ------

air = {
    // jQuery-like function
    $: function(element) {
        return new air.Dom(element);
    },

    // Apps container
    apps: {},

    // Returns an app or create it if it doesn't exist (Singleton)
    app: function(name, options) {
        var app = this.apps[name];
        if (!app) {
            // TODO: Is using the app variable needed here?
            app = new air.App(name, options);
            this.apps[name] = app;
        }
        return app;
    },

    // Navigate to a certain url
    navigate: function(url) {
        url = url || '';
        window.location.href = url;
    },

    // Exexute a route without navigating
    run: function(route) {
        var app;
        for (app in air.apps) {
            air.apps[app].router.run(route);
        }
    },

    // Check if the given parameter is an array
    isArray: function(arr) {
        return Object.prototype.toString.call(arr) === "[object Array]";
    },

    // Check if the given parameter is an object
    isObject: function(obj) {
        return obj === Object(obj) && !air.isFunction(obj);
    },

    // Check if the given parameter is strictly an object
    isStrictlyObject: function(obj) {
        return air.isObject(obj) && !air.isArray(obj);
    },

    // Check if the given parameter is boolean
    isBoolean: function(bool) {
        return bool === true || bool === false;
    },

    // Check if the given parameter is a string
    isString: function(str) {
        return Object.prototype.toString.call(str) === "[object String]";
    },

    // Check if the given parameter is a function
    isFunction: function(fun) {
        return Object.prototype.toString.call(fun) === "[object Function]";
    },

    // Check if the given parameter is undefined
    isUndefined: function(obj) {
        return typeof obj === "undefined";
    },

    // Check if the given parameter is numeric
    isNumeric: function(num) {
        return !isNaN(parseFloat(num)) && isFinite(num);
    },

    // Simple jQuery-like ajax implementation
    ajax: function(options) {
        var type = options.type || 'GET',
            upperCaseType = type.toUpperCase() || 'GET',
            xhr = new XMLHttpRequest();
        xhr.open(upperCaseType, options.url, true);

        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status >= 200 && this.status < 400 && options.success) {
                    options.success(this.responseText);
                } else if (options.error) {
                    options.error(this);
                }
            }
        };

        if (upperCaseType === 'GET') {
            xhr.send();
        }
        if (upperCaseType === 'PUT' || upperCaseType === 'DELETE') {
            xhr.setRequestHeader('Content-Type', 'text/plain');
            xhr.send();
        } else if (upperCaseType === 'POST') {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.send(options.data);
        }
        xhr = null;
        return this;
    },

    // Send a GET request to retrieve JSON from a given URL
    getJSON: function(url, callback) {
        return air.ajax({
            type: 'GET',
            url: url,
            success: function(data) {
                callback(JSON.parse(data));
            }
        });
    },

    // Send a POST request to a given URL
    post: function(url, data, success, error) {
        return air.ajax({
            type: 'POST',
            url: url,
            data: data,
            success: success,
            error: error
        });
    },

    // Send a GET request to a given URL
    get: function(url, success, error) {
        return air.ajax({
            type: 'GET',
            url: url,
            success: success,
            error: error
        });
    }

};
