// App
// ---
air.App = function(name, options) {
    this.name = name;
    this.options = options || {};
    this.routes = this.options.routes || [];
    this.controllers = this.options.controllers || {};
    this.views = this.options.views || {};
};

air.App.prototype.controller = function(name, methods) {
    var self = this,
        controller;
    if (air.isUndefined(methods)) {
        controller = this.controllers[name];
    } else {
        controller = new air.Controller(name, methods);
        this.controllers[name] = controller;
        // Register routes for each controller method
        air.each(methods, function(method, methodName){
            if (methodName.toLowerCase() === air.settings.DEFAULT_CONTROLLER_METHOD) {
                self.routes.push(name);
            } else {
                self.routes.push(name + '/' + methodName);
            }
        });
    }
    return controller;
};

air.App.prototype.view = function(name, templateData) {
    if (air.isUndefined(templateData)) {
        return this.views[name];
    } else {
        this.views[name] = new air.View(name, templateData);
    }
};

air.App.prototype.init = function() {
    // Create and initialize the app's router
    this.router = new air.Router(this.name, this.routes);
    this.router.init();
};
