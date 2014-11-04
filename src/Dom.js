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

// jQuery-like event handlers
air.Dom.prototype.on = function(eventName, eventHandler) {
    this.element.addEventListener(eventName, eventHandler);
};

air.Dom.prototype.off = function(eventName, eventHandler) {
    this.element.removeEventListener(eventName, eventHandler);
};

air.Dom.prototype.trigger = function(eventName, data) {
    var event;
    if (window.CustomEvent) {
        event = new CustomEvent(eventName, {
            detail: data
        });
    } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, true, true, data);
    }

    el.dispatchEvent(event);
};
