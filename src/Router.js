air.Router = function(controllers, routes) {
    // Implemented using vendor component (Routie)
    // TODO: Test
    var i, len, route, controllerName, controllerMethod;
    for (i=0, len=routes.length; i<len; i++) {
        route = routie[i];
        controllerName = this.getControllerName(route);
        controllerMethod = this.getControllerName(route);
        if (controller) {
            routie(route, function(params) {
                // TODO: Convert params to object?
                controllers[controllerName].invokeMethod(controllerMethod, params);
            });
        }
    }
};

air.Router.prototype.getControllerName = function(route) {

};

air.Router.prototype.getControllerMethod = function(route) {

};