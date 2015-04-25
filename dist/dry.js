/* (c) Diego Cardozo - license: https://github.com/diegocard/dry.js/blob/master/LICENSE */
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

    // Execute a route without navigating
    run: function(route) {
        var app;
        for (app in dry.apps) {
            dry.apps[app].router.run(route);
        }
    },
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
    AJAX_TIMEOUT: 10000
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

// Ajax methods
dry.ajax = function (options) {
    var method = options.type || 'GET',
        data = options.data || {},
        headers = options.headers || {},
        url = options.url,
        timeout = options.timeout || dry.settings.AJAX_TIMEOUT,
        p = dry.deferred(),
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
        onTimeout = function() {
            xhr.abort();
            p.reject(xhr);
        },
        payload, h, tid;
    
    try {
        xhr = newXhr();
    } catch (e) {
        p.reject("XHR not supported on this browser");
        return p.promise;
    }

    payload = dry.param(data);
    if (method === 'GET' && payload) {
        url += '?' + payload;
        payload = null;
    }

    xhr.open(method, url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    dry.each(headers, function (h) {
        xhr.setRequestHeader(h, headers[h]);
    });

    if (timeout) {
        tid = setTimeout(onTimeout, timeout);
    }

    xhr.onreadystatechange = function() {
        var err, res;
        if (timeout) {
            clearTimeout(tid);
        }
        if (xhr.readyState === 4) { 
            err = (!xhr.status ||
                    (xhr.status < 200 || xhr.status >= 300) &&
                    xhr.status !== 304);
            if (err) {
                p.reject(xhr);
            } else {
                try {
                    /* Try to convert the output to JSON */
                    res = JSON.parse(this.responseText);
                } catch(e) {
                    /* If it fails, return the output as-is */
                    res = this.responseText;
                }
                p.resolve(res);
            }
        }
    };

    xhr.send(payload);
    return p.promise
        .success(options.success)
        .error(options.error);
};

// Utility ajax method shortcuts for POST, PUT and DELETE requests
dry.each(['GET', 'POST', 'PUT', 'DELETE'], function(method){
    dry[method.toLowerCase()] = function(url, data, success, error) {
        return dry.ajax({
            type: method,
            url: url,
            data: data,
            success: success,
            error: error
        });
    };
});

// Send a GET request to retrieve JSON from a given URL
dry.getJSON = function(url, success, error) {
    return dry.ajax({
        type: 'GET',
        url: url,
        success: success,
        error: error
    });
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
    this.routes = this.options.routes || {};
    this.router = new dry.Router(this.name);
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
        /* Register the controller's routes */
        dry.each(methods, function(method, methodName){
            self.router.addRoute(controller, methodName);
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
    /* Initialize the app's router */
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
    return this;
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
    return this;
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
    this.el = options.el || (':not(script)[data-dry*="' + name + '"]');
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

/* (c) Jonathan Gotti - licence: https://github.com/malko/d.js/LICENCE.txt @version 0.7.2*/
!function(a){"use strict";function b(a){l(function(){throw a})}function c(b){return this.then(b,a)}function d(b){return this.then(a,b)}function e(b,c){return this.then(function(a){return m(b)?b.apply(null,n(a)?a:[a]):v.onlyFuncs?a:b},c||a)}function f(a){function b(){a()}return this.then(b,b),this}function g(a){return this.then(function(b){return m(a)?a.apply(null,n(b)?b.splice(0,0,void 0)&&b:[void 0,b]):v.onlyFuncs?b:a},function(b){return a(b)})}function h(c){return this.then(a,c?function(a){throw c(a),a}:b)}function i(a,b){var c=q(a);if(1===c.length&&n(c[0])){if(!c[0].length)return v.fulfilled([]);c=c[0]}var d=[],e=v(),f=c.length;if(f)for(var g=function(a){c[a]=v.promisify(c[a]),c[a].then(function(g){d[a]=b?c[a]:g,--f||e.resolve(d)},function(g){b?(d[a]=c[a],--f||e.resolve(d)):e.reject(g)})},h=0,i=f;i>h;h++)g(h);else e.resolve(d);return e.promise}function j(a,b){return a.then(m(b)?b:function(){return b})}function k(a){var b=q(a);1===b.length&&n(b[0])&&(b=b[0]);for(var c=v(),d=0,e=b.length,f=v.resolved();e>d;d++)f=j(f,b[d]);return c.resolve(f),c.promise}var l,m=function(a){return"function"==typeof a},n=function(a){return Array.isArray?Array.isArray(a):a instanceof Array},o=function(a){return!(!a||!(typeof a).match(/function|object/))},p=function(b){return b===!1||b===a||null===b},q=function(a,b){return[].slice.call(a,b)},r="undefined",s=typeof TypeError===r?Error:TypeError;if(typeof process!==r&&process.nextTick)l=process.nextTick;else if(typeof MessageChannel!==r){var t=new MessageChannel,u=[];t.port1.onmessage=function(){u.length&&u.shift()()},l=function(a){u.push(a),t.port2.postMessage(0)}}else l=function(a){setTimeout(a,0)};var v=function(b){function i(){if(0!==r){var a,b=t,c=0,d=b.length,e=~r?0:1;for(t=[];d>c;c++)(a=b[c][e])&&a(n)}}function j(a){function b(a){return function(b){return c?void 0:(c=!0,a(b))}}var c=!1;if(r)return this;try{var d=o(a)&&a.then;if(m(d)){if(a===u)throw new s("Promise can't resolve itself");return d.call(a,b(j),b(k)),this}}catch(e){return b(k)(e),this}return q(function(){n=a,r=1,i()}),this}function k(a){return r||q(function(){try{throw a}catch(b){n=b}r=-1,i()}),this}var n,q=(a!==b?b:v.alwaysAsync)?l:function(a){a()},r=0,t=[],u={then:function(a,b){var c=v();return t.push([function(b){try{p(a)?c.resolve(b):c.resolve(m(a)?a(b):v.onlyFuncs?b:a)}catch(d){c.reject(d)}},function(a){if((p(b)||!m(b)&&v.onlyFuncs)&&c.reject(a),b)try{c.resolve(m(b)?b(a):b)}catch(d){c.reject(d)}}]),0!==r&&q(i),c.promise},success:c,error:d,otherwise:d,apply:e,spread:e,ensure:f,nodify:g,rethrow:h,isPending:function(){return 0===r},getStatus:function(){return r}};return u.toSource=u.toString=u.valueOf=function(){return n===a?this:n},{promise:u,resolve:j,fulfill:j,reject:k}};if(v.deferred=v.defer=v,v.nextTick=l,v.alwaysAsync=!0,v.onlyFuncs=!0,v.resolved=v.fulfilled=function(a){return v(!0).resolve(a).promise},v.rejected=function(a){return v(!0).reject(a).promise},v.wait=function(a){var b=v();return setTimeout(b.resolve,a||0),b.promise},v.delay=function(a,b){var c=v();return setTimeout(function(){try{c.resolve(m(a)?a.apply(null):a)}catch(b){c.reject(b)}},b||0),c.promise},v.promisify=function(a){return a&&m(a.then)?a:v.resolved(a)},v.all=function(){return i(arguments,!1)},v.resolveAll=function(){return i(arguments,!0)},v.sequence=function(){return k(arguments)},v.nodeCapsule=function(a,b){return b||(b=a,a=void 0),function(){var c=v(),d=q(arguments);d.push(function(a,b){a?c.reject(a):c.resolve(arguments.length>2?q(arguments,1):b)});try{b.apply(a,d)}catch(e){c.reject(e)}return c.promise}},"function"==typeof define&&define.amd)define("D.js",[],function(){return v});else if(typeof window!==r){var w=window.D;v.noConflict=function(){return window.D=w,v},window.D=v}else typeof module!==r&&module.exports&&(module.exports=v)}();
// Promises
// --------

// Constructor
dry.Promise = D;

// Deferred method (from promises)
dry.deferred = function() {
    return D();
};