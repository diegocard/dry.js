air.Controller = function(name, methods) {
    this.name = name;
    this.methods = methods || {};
};

air.Controller.prototype.invokeMethod = function(methodName, params) {
    var method = this.methods[methodName],
        result, defaultView;
    if (method) {
        // Invoke the method with the given parameters
        result = method(params);
        // If a view was returned, render it
        if (typeof result === air.View) {
            result.render();
        }
    } else {
        // Default behavior: check if a template exists with the same ID as the controller name.
        // If it does, create a view and then render it.
        // TODO: Finish and test
        new air.View(name, {templateData: params}).render();
    }
};