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
    if (methods) {
        for (methodName in methods) {
            if (methods.hasOwnProperty(methodName)) {
                this.routes.push(name + '/' + methodName);
            }
        }
    }
    return controller;
};

air.App.prototype.view = function(name, templateData) {
    this.views[name] = new air.View(name, templateData);
};

air.App.prototype.init = function() {
    this.router = new air.Router(this.controllers, this.routes);
};
