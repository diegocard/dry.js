// Router
// ------
dry.Router = function(appName, routes) {
    this.rules = {};
    this.routes = [];
};

// Register a route, composed by controller and method
dry.Router.prototype.addRoute = function (controller, methodName) {
    var firstPart = (controller.name === dry.settings.DEFAULT_CONTROLLER_NAME ? '' : controller.name),
        secondPart = (methodName === dry.settings.DEFAULT_CONTROLLER_NAME ? '' : methodName),
        route = secondPart ? firstPart + '/' + secondPart : firstPart,
        // Callback to be executed on route navigation
        routeCallback = function(controller, methodName) {
            return function(route) {
                /* Call the appropriate controller method */
                controller.invokeMethod(methodName, route.params);
            };
        };

    this.routes.push(route);
    this.register(route, routeCallback(controller, methodName));
};

dry.Router.prototype.register = function(route, handler) {
    var pieces = route.split('/'),
        rules = this.rules;

    dry.each(pieces, function (piece) {
        var name = piece.length && piece.charAt(0) == ':' ? ':' : piece;

        if (!rules[name]) {
            rules = (rules[name] = {});

            if (name == ':') {
                rules['@name'] = piece.slice(1);
            }
        } else {
            rules = rules[name];
        }
    });

    rules['@'] = handler;
};

dry.Router.prototype.run = function(url) {
    if (url && url.length) {
        url = url.replace('/?', '?');
        url.charAt(0) == '/' && (url = url.slice(1));
        url.length && url.slice(-1) == '/' && (url = url.slice(0, -1));
    }

    var rules = this.rules,
        querySplit = url.split('?', 2),
        pieces = querySplit[0].split('/', 50),
        params = {};

    (function parseUrl() {
        dry.each(pieces, function (piece) {
            var rule = rules[piece.toLowerCase()];

            if (!rule && (rule = rules[':'])) {
                params[rule['@name']] = piece;
            }

            rules = rule;
        });
    })();

    (function parseQuery(q) {
        var query = q.split('&', 50);
        dry.each(query, function (component) {
            var nameValue = component.split('=', 2);
            nameValue.length == 2 && (params[nameValue[0]] = nameValue[1]);
        });
    })(querySplit.length == 2 ? querySplit[1] : '');

    if (rules && rules['@']) {
        rules['@']({
            url: url,
            params: params
        });
        return true;
    }

    return false;
};

dry.Router.prototype.init = function() {
    /* Hash-based routing */
    var self = this,
        processHash = function() {
            var hash = location.hash || '#';
            self.run(hash.substr(1));
        };

    window.addEventListener('hashchange', processHash);
    processHash();
};
