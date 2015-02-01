// App
// ---
dry.App = function(name, options) {
    this.name = name;
    this.options = options || {};
    this.routes = this.options.routes || [];
    this.controllers = this.options.controllers || {};
    this.views = this.options.views || {};
    this.modelDefinitions = this.options.models || {};
};

dry.App.prototype.controller = function(name, methods) {
    var self = this,
        controller;
    if (dry.isUndefined(methods)) {
        controller = this.controllers[name];
    } else {
        controller = new dry.Controller(name, methods);
        this.controllers[name] = controller;
        /* Register routes for each controller method */
        dry.each(methods, function(method, methodName){
            if (methodName.toLowerCase() === dry.settings.DEFAULT_CONTROLLER_METHOD) {
                self.routes.push(name);
            } else {
                self.routes.push(name + '/' + methodName);
            }
        });
    }
    return controller;
};

dry.App.prototype.view = function(name, templateData) {
    if (dry.isUndefined(templateData)) {
        return this.views[name];
    } else {
        this.views[name] = new dry.View(name, templateData);
    }
};

dry.App.prototype.init = function() {
    /* Create and initialize the app's router */
    this.router = new dry.Router(this.name, this.routes);
    this.router.init();
};

dry.App.prototype.model = function(name, params) {
    if (!params) {
        return new dry.Model(name, this.modelDefinitions[name]);
    } else {
        /* Store the model definition if needed */
        this.modelDefinitions[name] = params;
    }
};
