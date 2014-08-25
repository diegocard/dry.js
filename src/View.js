air.View = function(name, options) {
    options = options || {};
    this.name = name;
    this.el = options.el || (':not(script)[data-air="' + name + '"]');   
    this.templateData = options.templateData || {};
    this.template = new air.Template(name);
};

air.View.prototype.render = function() {
    var viewElement = air.$(this.el),
        compiledTemplate = this.template.compile(this.templateData);
    viewElement.html(compiledTemplate);
};