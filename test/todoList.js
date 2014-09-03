// Create new app
var app1 = air.app('app1'),
    app2 = air.app('app2');

// Register a controller
app1.controller('main', {
    'default': function() {
        console.log('Method working on main');
    },
    'hello': null
});


// Register another controller
app2.controller('body', {
    'default': function() {
        console.log('Method working on body');
    },
    'hello': null
});

// Start the apps
app1.init();
app2.init();