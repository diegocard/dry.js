// Create new app
var mainApp = air.app('app');

// Register a controller
mainApp.controller('main', {
    'default': function() {
        console.log('Method working');
    },
    'hello': null
});

// Start the app
mainApp.init();
