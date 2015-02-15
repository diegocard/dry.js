// Filter
// ------
dry.Filter = function(name, condition, action) {
    this.name = name;
    this.condition = condition;
    this.action = action;
};

// Evaluate the condition. If it is true, then run the action.
dry.Filter.prototype.runFilter = function() {
    var result = this.condition();
    if (result && this.action) {
        this.action();
    }
    return result;
};
