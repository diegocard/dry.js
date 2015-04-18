// DRY.JS
// ------

dry = {
    // jQuery-like function
    $: function(element) {
        return new dry.Dom(element);
    },

    // Apps container
    apps: {},

    // Returns an app or create it if it doesn't exist (Singleton)
    app: function(name, options) {
        return this.apps[name] || (this.apps[name] = new dry.App(name, options));
    },

    // Navigate to a certain url
    navigate: function(url) {
        window.location.href = url || '';
    },

    // Exexute a route without navigating
    run: function(route) {
        var app;
        for (app in dry.apps) {
            dry.apps[app].router.run(route);
        }
    },

    // Promises (from D.js)
    Promise: D,

    promise: function() {
        var deferred = D();
        deferred.constructor = dry.Promise;
        return deferred;
    }
};
