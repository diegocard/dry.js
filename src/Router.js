// Router
// ------
dry.Router = function(appName, routes) {
    this.rules = {};
    this.routes = [];
};

dry.Router.prototype.routeCallback = function(controller, methodName) {
    return function(route) {
        controller.invokeMethod(methodName, route.params);
    };
};

// Register a route, composed by controller and method
dry.Router.prototype.addRoute = function (controller, methodName, method) {
    var firstPart = (controller.name === dry.settings.DEFAULT_CONTROLLER_NAME ? '' : controller.name),
        secondPart = (methodName === dry.settings.DEFAULT_CONTROLLER_NAME ? '' : methodName),
        route = secondPart ? firstPart + '/' + secondPart : firstPart;

    this.routes.push(route);
    this.add(route, this.routeCallback(controller, methodName));
};

dry.Router.prototype.add = function(route, handler) {
    var pieces = route.split('/'),
        rules = this.rules;

    for (var i = 0; i < pieces.length; ++i) {
        var piece = pieces[i],
            name = piece.length && piece.charAt(0) == ':' ? ':' : piece;

        if (!rules[name]) {
            rules = (rules[name] = {});

            if (name == ':') {
                rules['@name'] = piece.slice(1);
            }
        } else {
            rules = rules[name];
        }
    }

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
        for (var i = 0; i < pieces.length && rules; ++i) {
            var piece = pieces[i],
                rule = rules[piece.toLowerCase()];

            if (!rule && (rule = rules[':'])) {
                params[rule['@name']] = piece;
            }

            rules = rule;
        }
    })();

    (function parseQuery(q) {
        var query = q.split('&', 50);

        for (var i = 0; i < query.length; ++i) {
            var nameValue = query[i].split('=', 2);

            nameValue.length == 2 && (params[nameValue[0]] = nameValue[1]);
        }
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
