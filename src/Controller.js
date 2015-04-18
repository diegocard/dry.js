// Controller
// ----------
dry.Controller = function(name, methods) {
    this.name = name;
    this.methods = methods || {};
};

dry.Controller.prototype.invokeMethod = function(methodName, params) {
    var self = this,
        method = this.methods[methodName],
        result, defaultView, defaultViewName;
    if (method) {
        /* Invoke the method with the given parameters */
        result = method.call(this, params);
    } else {
        /* Default behavior: check for a default template and render it.
         * The default template should be called controllerName/methodName or
         * simply controllerName if methodName is the default one.
         */
        defaultViewName = this.name + '/' + methodName;
        result = new dry.View(defaultViewName, {templateData: params, controller: this});
    }
    if (result) {
        /* Treat all returned values as promises */
        dry.Promise.promisify(result).then(function (res) {

            /* If a view was returned, render it */
            if (res.constructor === dry.View) {
                /* If the controller's method execution resulted in the creation of a view,
                 * store this information in the view itself.
                 */
                res.controller = res.controller || self;
                res.render();
            }

        });
    }
};

dry.Controller.prototype.redirect = function(methodName, params) {
    this.invokeMethod(methodName, params);
};
