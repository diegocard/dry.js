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
        return this.apps[name] || (this.apps[name] = new air.App(name, options));
    },

    // Navigate to a certain url
    navigate: function(url) {
        window.location.href = url || '';
    },

    // Exexute a route without navigating
    run: function(route) {
        var app;
        for (app in air.apps) {
            air.apps[app].router.run(route);
        }
    }
};
