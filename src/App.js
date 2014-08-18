air.App = function(name, options) {
    this.name = name;
    this.options = options || {};
    this.routes = this.options.routes || {};
    this.controllers = this.options.controllers || {};
    this.views = this.options.views || {};
};

air.App.prototype.Controller = function(name) {
    this.controllers[name] = new air.Controller(name);
    //TODO: Register routes for each controller method
};

air.App.prototype.View = function(name, templateData) {
    this.views[name] = new air.View(name, templateData);
};

air.App.prototype.init = function() {
    this.router = new air.Router(this.routes);
};