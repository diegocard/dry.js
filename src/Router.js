air.Router = function(controllers, routes) {
    // Implemented using vendor component (Routie)
    // TODO: Test
    var i, len, route, controllerName, controllerMethod;
    for (i=0, len=routes.length; i<len; i++) {
        route = routes[i];
        controllerName = this.getControllerName(route);
        controllerMethod = this.getControllerMethod(route);
        controller = controllers[controllerName];
        if (controller) {
            routie(route, function(params) {
                // TODO: Convert params to object?
                controller.invokeMethod(controllerMethod, params);
            });
        }
    }
};

air.Router.prototype.getControllerName = function(route) {
    return route.split('/')[0];
};

air.Router.prototype.getControllerMethod = function(route) {
    var split = route.split('/');
    return split[1] ? split[1].split('?')[0] : 'default';
};