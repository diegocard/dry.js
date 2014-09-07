air.Controller = function(name, methods) {
    this.name = name;
    this.methods = methods || {};
};

air.Controller.prototype.invokeMethod = function(methodName, params) {
    var method = this.methods[methodName],
        result, defaultView, defaultViewName;
    if (method) {
        // Invoke the method with the given parameters
        result = method.apply(this,params);
        // If a view was returned, render it
        if (typeof result === air.View) {
            result.render();
        }
    } else {
        // Default behavior: check if a template exists with the same ID as the controller name.
        // If it does, create a view and then render it.
        // TODO: Finish and test
        defaultViewName = this.name;
        if (methodName && methodName != air.settings.DEFAULT_CONTROLLER_METHOD) {
            defaultViewName += '/' + methodName;
        }
        new air.View(defaultViewName, {templateData: params}).render();
    }
};
