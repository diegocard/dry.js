// AIR.JS
// ------

air = {
    // jQuery-like function
    $: function(element) {
        return new air.Dom(element);
    },

    // Apps container
    apps: {},

    // Returns an app or create it if it doesn't exist (Singleton)
    app: function(name, options) {
        var app = this.apps[name];
        if (!app) {
            // TODO: Is using the app variable needed here?
            app = new air.App(name, options);
            this.apps[name] = app;
        }
        return app;
    },

    // Navigate to a certain url
    navigate: function(url) {
        url = url || '';
        window.location.href = url;
    },

    // Check if the given parameter is an array
    isArray: function(arr) {
      return Object.prototype.toString.call(arr) === "[object Array]";
    },

    // Check if the given parameter is an object
    isObject: function(obj) {
      return obj === Object(obj) && !air.isFunction(obj);
    },

    // Check if the given parameter is strictly an object
    isStrictlyObject: function(obj) {
      return air.isObject(obj) && !air.isArray(obj);
    },

    // Check if the given parameter is boolean
    isBoolean: function(bool) {
      return bool === true || bool === false;
    },

    // Check if the given parameter is a string
    isString: function(str) {
      return Object.prototype.toString.call(str) === "[object String]";
    },

    // Check if the given parameter is a function
    isFunction: function(fun) {
      return Object.prototype.toString.call(fun) === "[object Function]";
    },

    // Check if the given parameter is undefined
    isUndefined: function(obj) {
      return typeof obj === "undefined";
    },

    // Check if the given parameter is numeric
    isNumeric: function(num){
      return !isNaN(parseFloat(num)) && isFinite(num);
    },

};

// Settings
// --------
air.settings = {
    // When a route is left empty, the router will look for this controller
    DEFAULT_CONTROLLER_NAME: "default",
    // When a route doesn't target any specific method, it will look for this one
    DEFAULT_CONTROLLER_METHOD: "default"
};

// DOM Management Utilities
// ------------------------

air.Dom = function(name) {
    this.element = document.querySelector(name);
};

// jQuery-like html function
air.Dom.prototype.html = function(content) {
    if (content) {
        this.element.innerHTML = content;
        return this;
    } else {
        return this.element.innerHTML;
    }
};

air.App = function(name, options) {
    this.name = name;
    this.options = options || {};
    this.routes = this.options.routes || [];
    this.controllers = this.options.controllers || {};
    this.views = this.options.views || {};
};

air.App.prototype.controller = function(name, methods) {
    var controller, methodName, method;
    controller = new air.Controller(name, methods);
    this.controllers[name] = controller;
    // Register routes for each controller method
    // TODO: Test, finish
    for (methodName in methods) {
        if (methods.hasOwnProperty(methodName)) {
            if (methodName.toLowerCase() === air.settings.DEFAULT_CONTROLLER_METHOD) {
                this.routes.push(name);
            } else {
                this.routes.push(name + '/' + methodName);
            }
        }
    }
    // TODO: Add default route
    return controller;
};

air.App.prototype.view = function(name, templateData) {
    this.views[name] = new air.View(name, templateData);
};

air.App.prototype.init = function() {
    // Create and initialize the app's router
    this.router = new air.Router(this.name, this.routes);
};

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
// Controller
// ----------
air.Controller = function(name, methods) {
    this.name = name;
    this.methods = methods || {};
};

air.Controller.prototype.invokeMethod = function(methodName, params) {
    var method = this.methods[methodName],
        result, defaultView, defaultViewName;
    if (method) {
        // Invoke the method with the given parameters
        result = method.apply(this,params);
        // If a view was returned, render it
        if (typeof result === air.View) {
            result.render();
        }
    } else {
        // Default behavior: check if a template exists with the same ID as the controller name.
        // If it does, create a view and then render it.
        // TODO: Finish and test
        defaultViewName = this.name;
        if (methodName && methodName != air.settings.DEFAULT_CONTROLLER_METHOD) {
            defaultViewName += '/' + methodName;
        }
        new air.View(defaultViewName, {templateData: params}).render();
    }
};

air.Template = function(name, tmpl) {
    this.name = name;
    if (air.isFunction(tmpl)){
        // Allow for pre-compiled funcions
        this.compile = tmpl;
    } else {
        this.domId = tmpl || ('script[data-air="' + name + '"]');
        this.element = air.$(this.domId).element;
    }
};

air.Template.prototype.cache = [];

air.Template.prototype.compile = function tmpl(data) {
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    data = data || {};
    var str = this.elment.innerHTML.trim(),
        cache = air.Template.prototype.cache,
        fn = !/\W/.test(str) ?
        cache[this.name] = cache[this.name] ||
        tmpl(document.getElementById(str).innerHTML) :

        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +

            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +

            // Convert the template into pure JavaScript
            str
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'") + "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn(data) : fn;
};

air.View = function(name, options) {
    options = options || {};
    this.name = name;
    this.el = options.el || (':not(script)[data-air="' + name + '"]');   
    this.model = options.model || new air.Model(name);
    this.template = new air.Template(name);
};

air.View.prototype.render = function() {
    var viewElement = air.$(this.el),
        compiledTemplate = this.template.compile(this.model);
    viewElement.html(compiledTemplate);
};
/*!
 * routie - a tiny hash router
 * v0.3.2
 * http://projects.jga.me/routie
 * copyright Greg Allen 2013
 * MIT License
*/
(function(n){var e=[],t={},r="routie",o=n[r],i=function(n,e){this.name=e,this.path=n,this.keys=[],this.fns=[],this.params={},this.regex=a(this.path,this.keys,!1,!1)};i.prototype.addHandler=function(n){this.fns.push(n)},i.prototype.removeHandler=function(n){for(var e=0,t=this.fns.length;t>e;e++){var r=this.fns[e];if(n==r)return this.fns.splice(e,1),void 0}},i.prototype.run=function(n){for(var e=0,t=this.fns.length;t>e;e++)this.fns[e].apply(this,n)},i.prototype.match=function(n,e){var t=this.regex.exec(n);if(!t)return!1;for(var r=1,o=t.length;o>r;++r){var i=this.keys[r-1],a="string"==typeof t[r]?decodeURIComponent(t[r]):t[r];i&&(this.params[i.name]=a),e.push(a)}return!0},i.prototype.toURL=function(n){var e=this.path;for(var t in n)e=e.replace("/:"+t,"/"+n[t]);if(e=e.replace(/\/:.*\?/g,"/").replace(/\?/g,""),-1!=e.indexOf(":"))throw Error("missing parameters for url: "+e);return e};var a=function(n,e,t,r){return n instanceof RegExp?n:(n instanceof Array&&(n="("+n.join("|")+")"),n=n.concat(r?"":"/?").replace(/\/\(/g,"(?:/").replace(/\+/g,"__plus__").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,function(n,t,r,o,i,a){return e.push({name:o,optional:!!a}),t=t||"",""+(a?"":t)+"(?:"+(a?t:"")+(r||"")+(i||r&&"([^/.]+?)"||"([^/]+?)")+")"+(a||"")}).replace(/([\/.])/g,"\\$1").replace(/__plus__/g,"(.+)").replace(/\*/g,"(.*)"),RegExp("^"+n+"$",t?"":"i"))},s=function(n,r){var o=n.split(" "),a=2==o.length?o[0]:null;n=2==o.length?o[1]:o[0],t[n]||(t[n]=new i(n,a),e.push(t[n])),t[n].addHandler(r)},h=function(n,e){if("function"==typeof e)s(n,e),h.reload();else if("object"==typeof n){for(var t in n)s(t,n[t]);h.reload()}else e===void 0&&h.navigate(n)};h.lookup=function(n,t){for(var r=0,o=e.length;o>r;r++){var i=e[r];if(i.name==n)return i.toURL(t)}},h.remove=function(n,e){var r=t[n];r&&r.removeHandler(e)},h.removeAll=function(){t={},e=[]},h.navigate=function(n,e){e=e||{};var t=e.silent||!1;t&&l(),setTimeout(function(){window.location.hash=n,t&&setTimeout(function(){p()},1)},1)},h.noConflict=function(){return n[r]=o,h};var f=function(){return window.location.hash.substring(1)},c=function(n,e){var t=[];return e.match(n,t)?(e.run(t),!0):!1},u=h.reload=function(){for(var n=f(),t=0,r=e.length;r>t;t++){var o=e[t];if(c(n,o))return}},p=function(){n.addEventListener?n.addEventListener("hashchange",u,!1):n.attachEvent("onhashchange",u)},l=function(){n.removeEventListener?n.removeEventListener("hashchange",u):n.detachEvent("onhashchange",u)};p(),n[r]=h})(window);