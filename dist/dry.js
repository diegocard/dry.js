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
    DEFAULT_CONTROLLER_METHOD: "default"
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

// Simple jQuery-like ajax implementation
dry.ajax = function(options) {
    var type = options.type || 'GET',
        upperCaseType = type.toUpperCase() || 'GET',
        xhr = new XMLHttpRequest(),
        jsonResponse, encodedRequestData;
    xhr.open(upperCaseType, options.url, true);

    xhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 400 && options.success) {
                try {
                    /* Try to convert the output to JSON */
                    jsonResponse = JSON.parse(this.responseText);
                    options.success(jsonResponse);
                } catch(e) {
                    /* If it fails, return the output as-is */
                    options.success(this.responseText);
                }
            } else if (options.error) {
                options.error(this);
            }
        }
    };

    // Timeout
    xhr.timeout = options.timeout || 10000;
    xhr.ontimeout = options.ontimeout || function(){
        console.error('dry.ajax timeout for url', options.url);
    };

    if (upperCaseType === 'GET') {
        xhr.send();
    } else if (upperCaseType) { /* POST, PUT, DELETE */
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.send(dry.param(options.data));
    }
    xhr = null;
    return this;
};

// Send a GET request to retrieve JSON from a given URL
dry.getJSON = function(url, callback, error) {
    return dry.ajax({
        type: 'GET',
        url: url,
        success: function(data) {
            if (callback) {
                callback(JSON.parse(data));
            }
        },
        error: error
    });
};

// Utility ajax method shortcut for GET requests
dry.get = function(url, success, error) {
    return dry.ajax({
        type: 'GET',
        url: url,
        success: success,
        error: error
    });
};

// Utility ajax method shortcuts for POST, PUT and DELETE requests
dry.each(['post', 'put', 'delete'], function(method){
    dry[method] = function(url, data, success, error) {
        return dry.ajax({
            type: method,
            url: url,
            data: data,
            success: success,
            error: error
        });
    };
});

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

// Serialize an array of form elements or a set of
// key/values into a query string
dry.param = function(obj) {
    var r20 = /%20/g,
        rbracket = /\[\]$/,
        rCRLF = /\r?\n/g,
        rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
        rsubmittable = /^(?:input|select|textarea|keygen)/i,
        arr = [],
        prefix,
        add = function(key, value) {
            /* If value is a function, invoke it and return its value */
            value = dry.isFunction(value) ? value() : (value == null ? "" : value);
            arr[arr.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
        },
        buildParams = function (prefix, obj, add) {
            var name;

            if (dry.isArray(obj)) {
                /* Serialize array item */
                dry.each(obj, function(value, index) {
                    if (rbracket.test(prefix)) {
                        /* Treat each array item as a scalar */
                        add(prefix, value);
                    } else {
                        /* Item is non-scalar (array or object), encode its numeric index */
                        buildParams(prefix + "[" + (typeof value === "object" ? index : "") + "]", value, add);
                    }
                });

            } else if (dry.isObject(obj)) {
                /* Serialize object item */
                for (name in obj) {
                    buildParams(prefix + "[" + name + "]", obj[name], add);
                }
            } else {
                /* Serialize scalar item */
                add(prefix, obj);
            }
        };

    /* If an array was passed in, assume that it is an array of form elements */
    if (dry.isArray(obj) || (!dry.isStrictlyObject(obj))) {
        /* Serialize the form elements */
        dry.each(obj, function() {
            add(this.name, this.value);
        });
    } else {
        /* Encode params recursively */
        for (prefix in obj) {
            buildParams(prefix, obj[prefix], add);
        }
    }

    /* Return the resulting serialization */
    return arr.join("&").replace(r20, "+");
};

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

// Model
// -----
dry.Model = function(name, params) {
    params = params || {};
    this.name = name;
    this.attributes = params.attributes || {};
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

function Rlite(){this.rules={}}Rlite.prototype={add:function(n,t){for(var r,u,e=n.split("/"),i=this.rules,f=0;f<e.length;++f)r=e[f],u=r.length&&r.charAt(0)==":"?":":r,i[u]?i=i[u]:(i=i[u]={},u==":"&&(i["@name"]=r.substr(1,r.length-1)));i["@"]=t},run:function(n){n&&n.length&&(n=n.replace("/?","?"),n.charAt(0)=="/"&&(n=n.substr(1,n.length)),n.length&&n.charAt(n.length-1)=="/"&&(n=n.substr(0,n.length-1)));var t=this.rules,i=n.split("?",2),u=i[0].split("/",50),r={};return(function(){for(var n=0;n<u.length&&t;++n){var f=u[n],e=f.toLowerCase(),i=t[e];!i&&(i=t[":"])&&(r[i["@name"]]=f);t=i}}(),function(n){for(var t,u=n.split("&",50),i=0;i<u.length;++i)t=u[i].split("=",2),t.length==2&&(r[t[0]]=t[1])}(i.length==2?i[1]:""),t&&t["@"])?(t["@"]({url:n,params:r}),!0):!1}};
