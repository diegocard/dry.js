// Model
// -----
dry.Model = function(name, params) {
    params = params || {};
    this.name = name;
    this.attributes = params.attributes || {};
    this.validations = [];
    var self = this;

    /* Generate model methods for each given endpoint */
    dry.each(params, function(value, property){
        var split, httpMethod, url;
        if (dry.isString(value)){
            split = value.split(' ');
            httpMethod = split[0];
            url = split[1];
            self[property] = self.endpointMethod(httpMethod, url);
        }
    });
};

// Generate a model method which will perform an ajax request
// for a given endpoint
dry.Model.prototype.endpointMethod = function(httpMethod, url) {
    return function(params, success, error) {
        var urlAfterReplacement = url,
            attributes = this.attributes,
            attribute, param;
        /* Replace attributes in URL */
        for (attribute in attributes) {
            urlAfterReplacement = urlAfterReplacement.replace('{' + attribute + '}', attributes[attribute]);
        }
        /* Replace params in URL */
        for (param in params) {
            urlAfterReplacement = urlAfterReplacement.replace('{' + param + '}', params[param]);
        }
        return dry.ajax({
            url: urlAfterReplacement,
            type: httpMethod,
            data: params,
            success: success,
            error: error
        });
    };
};

// Set an attribute/s for the given model
dry.Model.prototype.set = function(name, value) {
    var attrs = dry.isStrictlyObject(name) ? name : {name: value},
        self = this;
    dry.each(attrs, function (val, attr) {
        self.attributes[attr] = val;
    });
    return this;
};

// Get an attribute of the given model
// TODO: test, doc
dry.Model.prototype.get = function(name) {
    return this.attributes[name];
};

// Register a validation function for an attribute
// TODO: test, doc
dry.Model.prototype.validate = function(attr, func) {
    this.validations[attr].push(func);
    return this;
};

// Check if the entire model or one of its attributes is valid
// TODO: test, doc
dry.Model.prototype.isValid = function(attr) {
    var attributesToCheck = [attr] || dry.keys(this.attributes),
        i = 0, /* Attribute iterator */
        j = 0, /* Attribute validation iterator */
        attributeCount = attributesToCheck.length,
        isValid = true,
        validationCount,
        currentAttrValidations;
    while (isValid && i<attributeCount) {
        j = 0;
        currentAttrValidations = this.validations[attributesToCheck[i]];
        validationCount = currentAttrValidations.length;
        while (isValid && j<validationCount) {
            isValid = currentAttrValidations[j].apply(this);
            j++;
        }
        i++;
    }
    /* If an invalid attribute is found, return which one */
    return isValid || i;
};



