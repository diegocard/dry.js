air.Dom = function(name) {
    this.element = document.querySelector(name);
};

air.Dom.prototype.html = function(content) {
    if (content) {
        this.element.innerHTML = content;
        return this;
    } else {
        return this.element.innerHTML;
    }
};