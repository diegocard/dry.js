// Router
// ------
dry.Router = function(appName, routes) {
    var self = this,
        /* Main logic behind the execution of a route */
        routeCallback = function(route) {
            var split = route.url.split('/'),
                /* Find which controller should handle a given route */
                controllerName = split[0] || dry.settings.DEFAULT_CONTROLLER_NAME,
                /* Find which method should be invoked in the controller that handles the given route */
                controllerMethod = split[1] ? split[1].split('?')[0] : dry.settings.DEFAULT_CONTROLLER_METHOD,
                controller = dry.apps[self.appName].controllers[controllerName];
            controller.invokeMethod(controllerMethod, route.params);
        },
        i, len, route;
    this.appName = appName;

    /* Initialize RLite (routing engine) */
    if (!this.r) {
        this.rlite = new Rlite();
    }

    /* Empty routes are handled through the default action in the default controller */
    if (routes.indexOf(dry.settings.DEFAULT_CONTROLLER_NAME) > -1){
        routes.push('');
    }

    /* Register each route */
    for (i=0, len=routes.length; i<len; i++) {
        route = routes[i];
        this.rlite.add(route, routeCallback);
    }
};

dry.Router.prototype.run = function(route) {
    this.rlite.run(route);
};

dry.Router.prototype.init = function() {
    /* Hash-based routing */
    var self = this,
        processHash = function() {
            var hash = location.hash || '#';
            self.rlite.run(hash.substr(1));
        };

    window.addEventListener('hashchange', processHash);
    processHash();
};
