air.Router = function(appName, routes) {
    // TODO: Test
    var self = this,
        routeCallback = function(route) {
            self.navigate(route);
        },
        i, len, route;
    this.appName = appName;
    if (!this.r) {
        this.rlite = new Rlite();
    }
    for (i=0, len=routes.length; i<len; i++) {
        route = routes[i];
        this.rlite.add(route, routeCallback);
    }
};

air.Router.prototype.getControllerName = function(route) {
    return route.split('/')[0];
};

air.Router.prototype.getControllerMethod = function(route) {
    var split = route.split('/');
    return split[1] ? split[1].split('?')[0] : 'default';
};

air.Router.prototype.navigate = function(route) {
    // Todo: add route for default controllers
    var controllerName = this.getControllerName(route.url),
        controllerMethod = this.getControllerMethod(route.url),
        controller = air.apps[this.appName].controllers[controllerName];
    controller.invokeMethod(controllerMethod, route.params);
};

air.Router.prototype.init = function() {
    // Hash-based routing
    var self = this,
        processHash = function() {
            var hash = location.hash || '#';
            self.rlite.run(hash.substr(1));
        };

    window.addEventListener('hashchange', processHash);
    processHash();
};