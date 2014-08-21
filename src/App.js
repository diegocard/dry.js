air.App = function(name, options) {
    this.name = name;
    this.options = options || {};
    this.routes = this.options.routes || [];
    this.controllers = this.options.controllers || {};
    this.views = this.options.views || {};
};

air.App.prototype.controller = function(name, methods) {
	var methodName, method;
    this.controllers[name] = new air.Controller(name, methods);
    // Register routes for each controller method
    // TODO: Test, finish
    if (methods && methods.length) {
	    for (methodName in methods) {
	    	if (methods.hasOwnProperty(methodName)) {
    			this.routes.push(methodName);
	    	}
	    }
    }
};

air.App.prototype.view = function(name, templateData) {
    this.views[name] = new air.View(name, templateData);
};

air.App.prototype.init = function() {
    this.router = new air.Router(this.controllers, this.routes);
};