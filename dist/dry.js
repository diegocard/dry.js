// DRY.JS
// ------

dry = {
    // jQuery-like function
    $: function(element) {
        return new dry.Dom(element);
    },

    // Apps container
    apps: {},

    // Returns an app or create it if it doesn't exist (Singleton)
    app: function(name, options) {
        return this.apps[name] || (this.apps[name] = new dry.App(name, options));
    },

    // Navigate to a certain url
    navigate: function(url) {
        window.location.href = url || '';
    },

    // Exexute a route without navigating
    run: function(route) {
        var app;
        for (app in dry.apps) {
            dry.apps[app].router.run(route);
        }
    }
};

// Settings
// --------
dry.settings = {
    // When a route is left empty, the router will look for this controller
    DEFAULT_CONTROLLER_NAME: "default",
    // When a route doesn't target any specific method, it will look for this one
    DEFAULT_CONTROLLER_METHOD: "default",
    // Time in milliseconds after which apending AJAX request is considered unresponsive and is aborted.
    // Useful to deal with bad connectivity (e.g. on a mobile network).
    // A 0 value disables AJAX timeouts.
    AJAX_TIMEOUT: 10000,
    // Error returned on promises when XHR is not implemented in the current browser
    ENOXHR: 1,
    // Error returned on promises when an Ajax call is timed out
    ETIMEOUT: 2
};

// Utilities
// ---------

// Check if the given parameter is an array
dry.isArray = function(arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
};

// Check if the given parameter is an object
dry.isObject = function(obj) {
    return obj === Object(obj) && !dry.isFunction(obj);
};

// Check if the given parameter is strictly an object
dry.isStrictlyObject = function(obj) {
    return dry.isObject(obj) && !dry.isArray(obj);
};

// Check if the given parameter is boolean
dry.isBoolean = function(bool) {
    return bool === true || bool === false;
};

// Check if the given parameter is a string
dry.isString = function(str) {
    return Object.prototype.toString.call(str) === "[object String]";
};

// Check if the given parameter is a function
dry.isFunction = function(fun) {
    return Object.prototype.toString.call(fun) === "[object Function]";
};

// Check if the given parameter is undefined
dry.isUndefined = function(obj) {
    return typeof obj === "undefined";
};

// Check if the given parameter is numeric
dry.isNumeric = function(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
};

// Returns an array with the property names for the given object
dry.keys = function (obj) {
    var keys = [],
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    return keys;
};

// Concise and efficient forEach implementation
dry.each = function (obj, func, context) {
    var i, len, keys;
    if (dry.isStrictlyObject(obj)) {
        keys = dry.keys(obj);
        for (i=0, len=keys.length; i<len; i++) {
            func.call(context, obj[keys[i]], keys[i], obj);
        }
    } else {
        for (i=0, len=obj.length; i<len; i++) {
            func.call(context, obj[i], i, obj);
        }
    }
};

// JSONP requests
dry.jsonp = function(url, callback) {
    var callbackName = 'dry_jsonp_callback_' + Math.round(100000 * Math.random());
    window[callbackName] = function(data) {
        delete window[callbackName];
        document.body.removeChild(script);
        callback(data);
    };

    var script = document.createElement('script');
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
};

// Promises
dry.Promise = function() {
    this._callbacks = [];
};

dry.Promise.prototype.then = function(func, context) {
    var p, res;
    if (this._isdone) {
        p = func.apply(context, this.result);
    } else {
        p = new dry.Promise();
        this._callbacks.push(function () {
            res = func.apply(context, arguments);
            if (res && dry.isFunction(res.then))
                res.then(p.done, p);
        });
    }
    return p;
};

dry.Promise.prototype.done = function() {
    var i, len;
    this.result = arguments;
    this._isdone = true;
    for (i=0, len=this._callbacks.length; i<len; i++) {
        this._callbacks[i].apply(null, arguments);
    }
    this._callbacks = [];
};

dry.Promise.join = function(promises) {
    var p = new dry.Promise(),
        results = [],
        numdone = 0,
        total, i;

    if (!promises || !promises.length) {
        p.done(results);
        return p;
    }

    total = promises.length;

    function notifier(i) {
        return function() {
            numdone += 1;
            results[i] = Array.prototype.slice.call(arguments);
            if (numdone === total) {
                p.done(results);
            }
        };
    }

    for (i=0; i<total; i++) {
        promises[i].then(notifier(i));
    }

    return p;
};

dry.Promise.chain = function(funcs, args) {
    var p = new dry.Promise();
    if (funcs.length === 0) {
        p.done.apply(p, args);
    } else {
        funcs[0].apply(null, args).then(function() {
            funcs.splice(0, 1);
            dry.Promise.chain(funcs, arguments).then(function() {
                p.done.apply(p, arguments);
            });
        });
    }
    return p;
};

// Ajax methods
dry.ajax = function (method, url, data, headers) {
    data = data || {};
    headers = headers || {};

    var p = new dry.Promise(),
        xhr,
        newXhr = function() {
            var xhr;
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                try {
                    xhr = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (e) {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
            }
            return xhr;
        },
        encode = function(data) {
            var result = "";
            if (dry.isString(data)) {
                result = data;
            } else {
                var e = encodeURIComponent;
                for (var k in data) {
                    if (data.hasOwnProperty(k)) {
                        result += '&' + e(k) + '=' + e(data[k]);
                    }
                }
            }
            return result;
        },
        onTimeout = function() {
            xhr.abort();
            p.done(dry.settings.ETIMEOUT, "", xhr);
        },
        payload, h, timeout, tid;
    
    try {
        xhr = newXhr();
    } catch (e) {
        p.done(dry.settings.ENOXHR, "");
        return p;
    }

    payload = encode(data);
    if (method === 'GET' && payload) {
        url += '?' + payload;
        payload = null;
    }

    xhr.open(method, url);
    xhr.setRequestHeader('Content-type',
                         'application/x-www-form-urlencoded');
    for (h in headers) {
        if (headers.hasOwnProperty(h)) {
            xhr.setRequestHeader(h, headers[h]);
        }
    }

    timeout = dry.settings.AJAX_TIMEOUT;
    if (timeout) {
        tid = setTimeout(onTimeout, timeout);
    }

    xhr.onreadystatechange = function() {
        var err;
        if (timeout) {
            clearTimeout(tid);
        }
        if (xhr.readyState === 4) { 
            err = (!xhr.status ||
                    (xhr.status < 200 || xhr.status >= 300) &&
                    xhr.status !== 304);
            p.done(err, xhr.responseText, xhr);
        }
    };

    xhr.send(payload);
    return p;
};

// Utility ajax method shortcuts for POST, PUT and DELETE requests
dry.each(['GET', 'POST', 'PUT', 'DELETE'], function(method){
    dry[method.toLowerCase()] = function(url, data, headers) {
        return dry.ajax(method, url, data, headers);
    };
});
// DOM Management Utilities
// ------------------------

dry.Dom = function(name) {
    this.element = document.querySelector(name);
};

// jQuery-like html function
dry.Dom.prototype.html = function(content) {
    if (content) {
        this.element.innerHTML = content;
        return this;
    } else {
        return this.element.innerHTML;
    }
};

// jQuery-like event handlers
dry.Dom.prototype.on = function(eventName, eventHandler) {
    this.element.addEventListener(eventName, eventHandler);
};

dry.Dom.prototype.off = function(eventName, eventHandler) {
    this.element.removeEventListener(eventName, eventHandler);
};

dry.Dom.prototype.trigger = function(eventName, data) {
    var event;
    if (window.CustomEvent) {
        event = new CustomEvent(eventName, {
            detail: data
        });
    } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, true, true, data);
    }

    this.element.dispatchEvent(event);
};

// App
// ---
dry.App = function(name, options) {
    this.name = name;
    this.options = options || {};
    this.routes = this.options.routes || [];
    this.filters = this.options.filters || {};
    this.controllers = this.options.controllers || {};
    this.views = this.options.views || {};
    this.modelDefinitions = this.options.models || {};
};

dry.App.prototype.controller = function(name, methods) {
    var self = this,
        controller;
    if (dry.isUndefined(methods)) {
        controller = this.controllers[name];
    } else {
        controller = new dry.Controller(name, methods);
        this.controllers[name] = controller;
        /* Register routes for each controller method */
        dry.each(methods, function(method, methodName){
            if (methodName.toLowerCase() === dry.settings.DEFAULT_CONTROLLER_METHOD) {
                self.routes.push(name);
            } else {
                self.routes.push(name + '/' + methodName);
            }
        });
    }
    return controller;
};

dry.App.prototype.redirect = function(controller, method, params) {
    this.controllers[controller].invokeMethod(method, params);
};

dry.App.prototype.filter = function(name, condition, action) {
    if (dry.isUndefined(condition) && dry.isUndefined(action)) {
        return this.views[name];
    } else {
        this.filters[name] = new dry.Filter(name, condition, action);
    }
};

dry.App.prototype.view = function(name, templateData) {
    if (dry.isUndefined(templateData)) {
        return this.views[name];
    } else {
        this.views[name] = new dry.View(name, templateData);
    }
};

dry.App.prototype.init = function() {
    /* Create and initialize the app's router */
    this.router = new dry.Router(this.name, this.routes);
    this.router.init();
};

dry.App.prototype.model = function(name, params) {
    if (!params) {
        return new dry.Model(name, this.modelDefinitions[name]);
    } else {
        /* Store the model definition if needed */
        this.modelDefinitions[name] = params;
    }
};

// Router
// ------
dry.Router = function(appName, routes) {
    this.rules = {};
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

    /* Empty routes are handled through the default action in the default controller */
    if (routes.indexOf(dry.settings.DEFAULT_CONTROLLER_NAME) > -1) {
        routes.push('');
    }

    /* Register each route */
    for (i = 0, len = routes.length; i < len; i++) {
        route = routes[i];
        this.add(route, routeCallback);
    }
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

// Model
// -----
dry.Model = function(name, params) {
    params = params || {};
    this.name = name;
    this.attributes = params.attributes || {};
    this.validations = [];
    var self = this;

    /* Generate model methods for each given endpoint */
    dry.each(params, function(value, property){
        var split, httpMethod, url;
        if (dry.isString(value)){
            split = value.split(' ');
            httpMethod = split[0];
            url = split[1];
            self[property] = self.endpointMethod(httpMethod, url);
        }
    });
};

// Generate a model method which will perform an ajax request
// for a given endpoint
dry.Model.prototype.endpointMethod = function(httpMethod, url) {
    return function(params, success, error) {
        var urlAfterReplacement = url,
            attributes = this.attributes,
            attribute, param;
        /* Replace attributes in URL */
        for (attribute in attributes) {
            urlAfterReplacement = urlAfterReplacement.replace('{' + attribute + '}', attributes[attribute]);
        }
        /* Replace params in URL */
        for (param in params) {
            urlAfterReplacement = urlAfterReplacement.replace('{' + param + '}', params[param]);
        }
        return dry.ajax({
            url: urlAfterReplacement,
            type: httpMethod,
            data: params,
            success: success,
            error: error
        });
    };
};

// Set an attribute/s for the given model
dry.Model.prototype.set = function(name, value) {
    var attrs = dry.isStrictlyObject(name) ? name : {name: value},
        self = this;
    dry.each(attrs, function (val, attr) {
        self.attributes[attr] = val;
    });
};

// Get an attribute of the given model
// TODO: test, doc
dry.Model.prototype.get = function(name) {
    return this.attributes[name];
};

// Register a validation function for an attribute
// TODO: test, doc
dry.Model.prototype.validate = function(attr, func) {
    this.validations[attr].push(func);
};

// Check if the entire model or one of its attributes is valid
// TODO: test, doc
dry.Model.prototype.isValid = function(attr) {
    var attributesToCheck = [attr] || dry.keys(this.attributes),
        i = 0, /* Attribute iterator */
        j = 0, /* Attribute validation iterator */
        attributeCount = attributesToCheck.length,
        isValid = true,
        validationCount,
        currentAttrValidations;
    while (isValid && i<attributeCount) {
        j = 0;
        currentAttrValidations = this.validations[attributesToCheck[i]];
        validationCount = currentAttrValidations.length;
        while (isValid && j<validationCount) {
            isValid = currentAttrValidations[j].apply(this);
            j++;
        }
        i++;
    }
    /* If an invalid attribute is found, return which one */
    return isValid || i;
};




// Filter
// ------
dry.Filter = function(name, condition, action) {
    this.name = name;
    this.condition = condition;
    this.action = action;
};

// Evaluate the condition. If it is true, then run the action.
dry.Filter.prototype.runFilter = function() {
    var result = this.condition();
    if (result && this.action) {
        this.action();
    }
    return result;
};

// Controller
// ----------
dry.Controller = function(name, methods) {
    this.name = name;
    this.methods = methods || {};
};

dry.Controller.prototype.invokeMethod = function(methodName, params) {
    var method = this.methods[methodName],
        result, defaultView, defaultViewName;
    if (method) {
        /* Invoke the method with the given parameters */
        result = method.call(this, params);
    } else {
        /* Default behavior: check for a default template and render it.
         * The default template should be called controllerName/methodName or
         * simply controllerName if methodName is the default one.
         */
        defaultViewName = this.name;
        if (methodName && methodName != dry.settings.DEFAULT_CONTROLLER_METHOD) {
            defaultViewName += '/' + methodName;
        }
        result = new dry.View(defaultViewName, {templateData: params, controller: this});
    }
    /* If a view was returned, render it */
    if (result && result.constructor === dry.View) {
        /* If the controller's method execution resulted in the creation of a view,
         * store this information in the view itself.
         */
        result.controller = result.controller || this;
        result.render();
    }
};

dry.Controller.prototype.redirect = function(methodName, params) {
    this.invokeMethod(methodName, params);
};

// Template
// --------
dry.Template = function(name, tmpl) {
    this.name = name;
    if (dry.isFunction(tmpl)) {
        // Allow for pre-compiled funcions
        this.compile = tmpl;
    } else {
        this.templateId = tmpl || ('script[data-dry="' + name + '"]');
    }
};

dry.Template.prototype.cache = [];

dry.Template.prototype.compile = function compile(model) {
    /* Figure out if we're getting a template, or if we need to
     * load the template - and be sure to cache the result.
     */
    var str = this.cache[this.name] || dry.$(this.templateId).element.innerHTML,
        fn = new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +

            /* Introduce the data as local variables using with(){} */
            "with(obj){p.push('" +

            /* Convert the template into pure JavaScript */
            str
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'") + "');}return p.join('');");

    /* Provide some basic currying to the user */
    return fn(model.attributes);
};

// View
// ----
dry.View = function(name, options) {
    options = options || {};
    this.name = name;
    this.el = options.el || (':not(script)[data-dry="' + name + '"]');
    this.model = options.model || new dry.Model(name);
    this.template = new dry.Template(name, options.template);
    this.controller = options.controller;
    this.events = options.events || {};
};

dry.View.prototype.render = function() {
    var viewElement = dry.$(this.el),
        compiledTemplate = this.template.compile(this.model),
        events = this.events,
        self = this;
    viewElement.html(compiledTemplate);
    dry.each(events, function(action, key){
        self.addEvent(key, action);
    });
};

dry.View.prototype.addEvent = function(eventKey, eventAction) {
    var eventKeySplit, eventElement, eventTrigger;
    eventKeySplit = eventKey.split(' ');
    eventElement = eventKeySplit[1];
    eventTrigger = eventKeySplit[0];
    if (dry.isString(eventAction)) {
        // TODO: Finish, test
        eventAction = function(params) {
            this.controller.invokeMethod(eventAction, params);
        };
    }
    dry.$(eventElement).on(eventTrigger, eventAction);
};
