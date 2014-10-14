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
    }
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
    this.router.init();
};

// Router
// ------
air.Router = function(appName, routes) {
    var self = this,
        routeCallback = function(route) {
            self.navigate(route);
        },
        i, len, route;
    this.appName = appName;

    // Initialize RLite (routing engine)
    if (!this.r) {
        this.rlite = new Rlite();
    }

    // Empty routes are handled through the default action in the default controller
    if (routes.indexOf(air.settings.DEFAULT_CONTROLLER_NAME) > -1){
        routes.push('');
    }

    // Register each route
    for (i=0, len=routes.length; i<len; i++) {
        route = routes[i];
        this.rlite.add(route, routeCallback);
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

air.Template = function(name, domId) {
    this.name = name;
    this.domId = domId || ('script[data-air="' + name + '"]');
    this.raw = air.$(this.domId).element.innerHTML.trim();
};

air.Template.prototype.cache = [];

air.Template.prototype.compile = function tmpl(data) {
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    data = data || {};
    var str = this.raw,
        cache = air.Template.prototype.cache,
        fn = !/\W/.test(str) ?
        cache[str] = cache[str] ||
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
function Rlite(){this.rules={}}Rlite.prototype={add:function(n,t){for(var r,u,e=n.split("/"),i=this.rules,f=0;f<e.length;++f)r=e[f],u=r.length&&r.charAt(0)==":"?":":r,i[u]?i=i[u]:(i=i[u]={},u==":"&&(i["@name"]=r.substr(1,r.length-1)));i["@"]=t},run:function(n){n&&n.length&&(n=n.replace("/?","?"),n.charAt(0)=="/"&&(n=n.substr(1,n.length)),n.length&&n.charAt(n.length-1)=="/"&&(n=n.substr(0,n.length-1)));var t=this.rules,i=n.split("?",2),u=i[0].split("/",50),r={};return(function(){for(var n=0;n<u.length&&t;++n){var f=u[n],e=f.toLowerCase(),i=t[e];!i&&(i=t[":"])&&(r[i["@name"]]=f);t=i}}(),function(n){for(var t,u=n.split("&",50),i=0;i<u.length;++i)t=u[i].split("=",2),t.length==2&&(r[t[0]]=t[1])}(i.length==2?i[1]:""),t&&t["@"])?(t["@"]({url:n,params:r}),!0):!1}};
/*
//# sourceMappingURL=rlite.min.js.map
*/