// View
// ----
air.View = function(name, options) {
    options = options || {};
    this.name = name;
    this.el = options.el || (':not(script)[data-air="' + name + '"]');
    this.model = options.model || new air.Model(name);
    this.template = new air.Template(name, options.template);
};

air.View.prototype.render = function() {
    var viewElement = air.$(this.el),
        compiledTemplate = this.template.compile(this.model);
    viewElement.html(compiledTemplate);
};
