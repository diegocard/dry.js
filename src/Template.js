air.Template = function(name, domId) {
    this.name = name;
    this.domId = domId || ('script[data-air="' + name + '"]');
    this.raw = air.$(this.domId).element.innerHTML.trim();
};

air.Template.prototype.compile = function(data) {
    // TODO: Finish, test
    var templateStr = this.raw,
        prop;
    for (prop in data) {
        templateStr = templateStr.replace(new RegExp('{{' + prop + '}}', 'g'), data[prop]);
    }
    return templateStr;
};
