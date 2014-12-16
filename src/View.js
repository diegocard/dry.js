// View
// ----
air.View = function(name, options) {
    options = options || {};
    this.name = name;
    this.el = options.el || (':not(script)[data-air="' + name + '"]');
    this.model = options.model || new air.Model(name);
    this.template = new air.Template(name, options.template);
    this.controller = options.controller;
    this.events = options.events || {};
};

air.View.prototype.render = function() {
    var viewElement = air.$(this.el),
        compiledTemplate = this.template.compile(this.model),
        events = this.events,
        self = this;
    viewElement.html(compiledTemplate);
    air.each(events, function(eventKey, event){
        self.addEvent(eventKey, event);
    });
};

air.View.prototype.addEvent = function(eventKey, eventAction) {
    var eventKeySplit, eventElement, eventTrigger;
    eventKeySplit = eventKey.split(' ');
    eventElement = eventKeySplit[1];
    eventTrigger = eventKeySplit[0];
    if (air.isString(eventAction)) {
        // TODO: Finish, test
        eventAction = function(params) {
            this.controller.invokeMethod(eventAction, params);
        };
    }
    air.$(eventElement).on(eventTrigger, eventAction);
};
