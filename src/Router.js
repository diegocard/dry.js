// Router
// ------
air.Router = function(appName, routes) {
    var self = this,
        routeCallback = function(route) {
            debugger;
            return self.navigate(route);
        },
        i, len, route;
    this.appName = appName;


    // Empty routes are handled through the default action in the default controller
    if (routes.indexOf(air.settings.DEFAULT_CONTROLLER_NAME) > -1){
        routes.push('');
    }

    // Register each route
    for (i=0, len=routes.length; i<len; i++) {
        route = routes[i];
        routie(route, routeCallback);
    }
};

// Find which controller should handle a given route
air.Router.prototype.getControllerName = function(route) {
    return route.split('/')[0] || air.settings.DEFAULT_CONTROLLER_NAME;
};

// Find which method should be invoked in the controller that handles the given route
air.Router.prototype.getControllerMethod = function(route) {
    var split = route.split('/');
    return split[1] ? split[1].split('?')[0] : air.settings.DEFAULT_CONTROLLER_METHOD;
};

air.Router.prototype.navigate = function(route) {
    // Todo: add route for default controllers
    var controllerName = this.getControllerName(route.url),
        controllerMethod = this.getControllerMethod(route.url),
        controller = air.apps[this.appName].controllers[controllerName];
    controller.invokeMethod(controllerMethod, route.params);
};