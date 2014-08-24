air = {
    $: function(element) {
        return new air.Dom(element);
    },
    apps: {},
    app : function(name, options) {
      var app = this.apps[name];
      if (!app) {
        // TODO: Is using the app variable needed here?
        app = new air.App(name, options);
        this.apps[name] = app;
      }
      return app;
    }
};
