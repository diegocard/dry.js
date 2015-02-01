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
