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
};
