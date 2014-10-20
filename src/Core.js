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
    isNumeric: function(num){
      return !isNaN(parseFloat(num)) && isFinite(num);
    },

};
