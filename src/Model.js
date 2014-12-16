// Model
// -----
air.Model = function(name, params) {
    params = params || {};
    this.name = name;
    this.attributes = params.attributes || {};

    // Generate model methods for each given endpoint
    air.each(params, function(value, property){
        var split, httpMethod, url;
        if (air.isString(value)){
            split = value.split(' ');
            httpMethod = split[0];
            url = split[1];
            this[property] = this.endpointMethod(method, url);
        }
    });
};

// Generate a model method which will perform an ajax request
// for a given endpoint
air.Model.prototype.endpointMethod = function(httpMethod, url) {
    return function(params, success, error) {
        var urlAfterReplacement = url,
            attributes = this.attributes,
            attribute, param;
        // Replace attributes in URL
        for (attribute in attributes) {
            urlAfterReplacement = urlAfterReplacement.replace('{' + attribute + '}', attributes[attribute]);
        }
        // Replace params in URL
        for (param in params) {
            urlAfterReplacement = urlAfterReplacement.replace('{' + param + '}', params[param]);
        }
        return air.ajax({
            url: urlAfterReplacement,
            type: httpMethod,
            data: params,
            success: success,
            error: error
        });
    };
};
