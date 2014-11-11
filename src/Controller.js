// Controller
// ----------
air.Controller = function(name, methods) {
    this.name = name;
    this.methods = methods || {};
};

air.Controller.prototype.invokeMethod = function(methodName, params) {
    var method = this.methods[methodName],
        result, defaultView, defaultViewName;
    if (method) {
        // Invoke the method with the given parameters
        result = method.call(this, params);
    } else {
        // Default behavior: check for a default template and render it.
        // The default template should be called controllerName/methodName or
        // simply controllerName if methodName is the default one.
        defaultViewName = this.name;
        if (methodName && methodName != air.settings.DEFAULT_CONTROLLER_METHOD) {
            defaultViewName += '/' + methodName;
        }
        result = new air.View(defaultViewName, {templateData: params, controller: this});
    }
    // If a view was returned, render it
    if (result && result.constructor === air.View) {
        // If the controller's method execution resulted in the creation of a view,
        // store this information in the view itself.
        result.controller = result.controller || this;
        result.render();
    }
};
