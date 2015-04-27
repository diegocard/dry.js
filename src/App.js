// App
// ---
dry.App = function(name, options) {
    this.name = name;
    this.options = options || {};
    this.router = new dry.Router(this.name);
    this.filters = this.options.filters || {};
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
        /* Register the controller's routes */
        dry.each(methods, function(method, methodName){
            self.router.addRoute(controller, methodName);
        });
    }
    return controller;
};

dry.App.prototype.redirect = function(controller, method, params) {
    this.controllers[controller].invokeMethod(method, params);
};

dry.App.prototype.filter = function(name, condition, action) {
    if (dry.isUndefined(condition) && dry.isUndefined(action)) {
        return this.views[name];
    } else {
        this.filters[name] = new dry.Filter(name, condition, action);
    }
};

dry.App.prototype.view = function(name, templateData) {
    if (dry.isUndefined(templateData)) {
        return this.views[name];
    } else {
        this.views[name] = new dry.View(name, templateData);
    }
};

dry.App.prototype.init = function() {
    /* Initialize the app's router */
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
