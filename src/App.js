air.App = function(name, options) {
    this.name = name;
    this.options = options || {};
    this.routes = this.options.routes || [];
    this.controllers = this.options.controllers || {};
    this.views = this.options.views || {};
};

air.App.prototype.controller = function(name, methods) {
    var controller, methodName, method;
    controller = new air.Controller(name, methods);
    this.controllers[name] = controller;
    // Register routes for each controller method
    // TODO: Test, finish
    for (methodName in methods) {
        if (methods.hasOwnProperty(methodName)) {
            if (methodName.toLowerCase() === air.settings.DEFAULT_CONTROLLER_METHOD) {
                this.routes.push(name);
            } else {
                this.routes.push(name + '/' + methodName);
            }
        }
    }
    // TODO: Add default route
    return controller;
};

air.App.prototype.view = function(name, templateData) {
    this.views[name] = new air.View(name, templateData);
};

air.App.prototype.init = function() {
    // Create and initialize the app's router
    this.router = new air.Router(this.name, this.routes);
};
