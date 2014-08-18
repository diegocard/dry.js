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
