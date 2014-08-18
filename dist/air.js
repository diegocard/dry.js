function Rlite(){this.rules={}}Rlite.prototype={add:function(n,t){for(var r,u,e=n.split("/"),i=this.rules,f=0;f<e.length;++f)r=e[f],u=r.length&&r.charAt(0)==":"?":":r,i[u]?i=i[u]:(i=i[u]={},u==":"&&(i["@name"]=r.substr(1,r.length-1)));i["@"]=t},run:function(n){n&&n.length&&(n=n.replace("/?","?"),n.charAt(0)=="/"&&(n=n.substr(1,n.length)),n.length&&n.charAt(n.length-1)=="/"&&(n=n.substr(0,n.length-1)));var t=this.rules,i=n.split("?",2),u=i[0].split("/",50),r={};return(function(){for(var n=0;n<u.length&&t;++n){var f=u[n],e=f.toLowerCase(),i=t[e];!i&&(i=t[":"])&&(r[i["@name"]]=f);t=i}}(),function(n){for(var t,u=n.split("&",50),i=0;i<u.length;++i)t=u[i].split("=",2),t.length==2&&(r[t[0]]=t[1])}(i.length==2?i[1]:""),t&&t["@"])?(t["@"]({url:n,params:r}),!0):!1}};
air = air  || {
    $: function(element) {
        return new air.Dom(element);
    }
};
air.App = function(name, options) {
    this.name = name;
    this.options = options || {};
    this.routes = this.options.routes || {};
    this.controllers = this.options.controllers || {};
    this.views = this.options.views || {};
};

air.App.prototype.Controller = function(name) {
    this.controllers[name] = new air.Controller(name);
    //TODO: Register routes for each controller method
};

air.App.prototype.View = function(name, templateData) {
    this.views[name] = new air.View(name, templateData);
};

air.App.prototype.init = function() {
    this.router = new air.Router(this.routes);
};
air.Router = function(name) {
    // TODO: Implement
};
air.Controller = function(name, methods) {
    this.name = name;
    this.methods = methods || {};
};
air.Template = function(name, domId) {
    this.name = name;
    this.domId = domId || ('#' + name);
    this.raw = air.$(this.domId);
};

air.Template.prototype.compile = function(data) {
    // TODO: Implement, test
    var templateStr, prop;
    for (prop in data) {
        str = str.replace(new RegExp('{{' + prop + '}}', 'g'), data[prop]);
    }
    return templateStr;
};

air.View = function(name, options) {
    options = options || {};
    this.name = name;
    this.el = options.el || name;   
    this.templateData = options.templateData || {};
    this.template = new air.Template(name);
};

air.View.prototype.render = function() {
    var viewElement = air.$(this.el),
        compiledTemplate = this.template.compile(this.templateData);
    viewElement.html(compiledTemplate);
};