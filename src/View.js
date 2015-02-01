// View
// ----
dry.View = function(name, options) {
    options = options || {};
    this.name = name;
    this.el = options.el || (':not(script)[data-dry="' + name + '"]');
    this.model = options.model || new dry.Model(name);
    this.template = new dry.Template(name, options.template);
    this.controller = options.controller;
    this.events = options.events || {};
};

dry.View.prototype.render = function() {
    var viewElement = dry.$(this.el),
        compiledTemplate = this.template.compile(this.model),
        events = this.events,
        self = this;
    viewElement.html(compiledTemplate);
    dry.each(events, function(action, key){
        self.addEvent(key, action);
    });
};

dry.View.prototype.addEvent = function(eventKey, eventAction) {
    var eventKeySplit, eventElement, eventTrigger;
    eventKeySplit = eventKey.split(' ');
    eventElement = eventKeySplit[1];
    eventTrigger = eventKeySplit[0];
    if (dry.isString(eventAction)) {
        // TODO: Finish, test
        eventAction = function(params) {
            this.controller.invokeMethod(eventAction, params);
        };
    }
    dry.$(eventElement).on(eventTrigger, eventAction);
};
