// Settings
// --------
dry.settings = {
    // When a route is left empty, the router will look for this controller
    DEFAULT_CONTROLLER_NAME: "default",
    // When a route doesn't target any specific method, it will look for this one
    DEFAULT_CONTROLLER_METHOD: "default",
    // Time in milliseconds after which apending AJAX request is considered unresponsive and is aborted.
    // Useful to deal with bad connectivity (e.g. on a mobile network).
    // A 0 value disables AJAX timeouts.
    AJAX_TIMEOUT: 10000
};
