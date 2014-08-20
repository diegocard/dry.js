air.Template = function(name, domId) {
    this.name = name;
    this.domId = domId || ('#' + name);
    this.raw = air.$(this.domId);
};

air.Template.prototype.compile = function(data) {
    // TODO: Finish, test
    var templateStr = this.ray,
        prop;
    for (prop in data) {
        templateStr = templateStr.replace(new RegExp('{{' + prop + '}}', 'g'), data[prop]);
    }
    return templateStr;
};
