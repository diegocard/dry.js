dry.js
======

Lightweight SPA framework based on Convention over Configuration

Build status: [![Build Status](https://travis-ci.org/diegocard/dry.js.svg?branch=master)](https://travis-ci.org/diegocard/dry.js)

## Philosophy

### Best practices
As its name implies, Dry.js is based around the idea of applying the [Don't Repeat Yourself](http://en.wikipedia.org/wiki/Don%27t_repeat_yourself) (DRY) principle to front end development as extensively as possible. It does so by following a [Convention Over Configuration](http://en.wikipedia.org/wiki/Convention_over_configuration) (CoC) approach.

### Lightweight
Initial page load is one of the main concerns of Dry.js. The library weights less than 8kb minified (3kb gzipped) which makes it viable for any sort of web application.

### Easily replaceable components
Dry.js is intended to be a standard way to join external components and libraries. All of its components are designed so that they can be easily replaced.

For example, you can swap Dry.js's templating engine with Handlebars, integrate React to improve rendering performance, or manage all DOM interactions with jQuery/Zepto, etc.

Please read [this](http://www.breck-mckye.com/blog/2014/12/the-state-of-javascript-in-2015) article to further understand why this approach is necessary.

### Easy to learn, easy to use and easy to change
No one likes learning a new front-end framework every week, so that's why Dry.js was specifically designed to be super easy to use. Getting started will only take you some minutes, and there's not that much more to it. Complexity is the first sign of bad architecture, and your developers will thank you for it.

Have you ever wanted to change a certain feature of a given framework? Well, this is super easy in Dry.js because its code is brief and understandable, so re-writting a component is not complex at all. In fact I encourage you to do this if you want to replace any of the framework's core components with external libraries, you'll only have to run the tests afterwards to make sure that everything still works as expected.

## Inspiration
Dry.js was inspired by what I consider to be the best features of the most well-known single page application frameworks:

- Provides only the minimum set of components necessary for web application development, like Backbone.js
- Follows an MVC, convention over configuration approach, like Ember.js (although much simpler)
- Comes with all you need right out of the box like Angular.js (a.k.a batteries included), alghough these features can be easily replaced by other external components
- Integrates an opinionated set of guidelines for the application's architecture and data flow, similar to what Facebook's Flux does

## Getting Started
Setting up Dry.js is extremely easy. You only need to include the script anywhere on the page, and you are all set.

```html
<html>
  <head>
    <title>Getting started</title>
  </head>
  <body>
    <h1>Hello world</h1>
  
    <!-- Include dry.min.js here -->
    <script src="scripts/dry.min.js"></script>
  </body>
</html>
```

You can download the minitied and development versions through any of these options.

- Through the links at the top of the page.
- Install with Bower: bower install dry-js
- Install with npm: npm install dry-js

## Components

###App
A website is divided in apps. Their goal is to provide structure to the code, and can be seen as modules. Each app contains its own controllers, views and models, and handles a specific set of routes.

```js
// Create new app
var app1 = dry.app('app1');
// Start the app
app1.init();
```

###Controller
A controller contains methods. Each method handles a specific route or event, returning a view instance if the result of the method's execution triggers UI changes. In this sense, Dry.js controllers are very similar to Rails or ASP.NET MVC.

```js
var app1 = dry.app('app1');

// Handles a list of products
app1.controller('products', {
    'list': function() { // Triggered when navigating to /products/list
        return new dry.View('ProductList')
    }
});
```

###Router
The router is responsible for directing page navigation actions to controllers. As the previous example hints, you do not need to specify routes anywhere. They are automatically generated from controller names and methods.

```js
var app1 = dry.app('app1');

// Home page
app1.controller('default', {
    // Triggered on base url (root)
    'default': function() {
        return new dry.View('HomePage')
    }
});

// Handles a list of products
app1.controller('products', {
    // Triggered when navigating to /products/:id
    'default': function(id) {
        return new dry.View('ProductDetails')
    }
    // Triggered when navigating to /products/list
    'list': function() {
        return new dry.View('ProductList')
    }
});
```

###Model
In a typical fashion, models concentrate the responsibility of handling data structure, storage and server communication. They are injected into views through controller actions, and come with a convenient API for handling Ajax communication. Expanding on the previous example:

```js
var app1 = dry.app('app1');

// Product model definition
app1.model('Product', {
    attributes: {
        id: 1 // default
    }
    getAll: 'GET https://someUrl/products'
    newProduct: 'POST https://someUrl/products/new',
    updateProduct: 'PUT https://someUrl/products/{id}',
    deleteProduct: 'DELETE https://someUrl/{id}'
});

// Handles a list of products
app1.controller('products', {
    'list': function() {
        // Creates a new model instance and calls the getAll method
        var allProducts = app1.model('Product').getAll();
        // Pass the model to the view
        return new dry.View('ProductList', allProducts);
    }
});
```

###View
Views contain presentation logic. Each view contains a model instance which stores the data that is rendered on the template. They are also responsible for handling events, and do so by calling methods from the controller that created the view.

```js
var app1 = dry.app('app1');

// Product model definition
app1.model('Product', {
    getAll: 'GET https://someUrl/products'
});

app1.view('ProductList', {
    events: {
        // When the button with class .btn-new' is pressed,
        // call the 'new' method in the controller
        'click .btn-new': 'new'
    }
});

// Handles a list of products
app1.controller('products', {
    'list': function() {
        // Creates a new model instance and calls the getAll method
        var allProducts = app1.model('Product').getAll();
        // Pass the model to the view
        return app1.view('ProductList', allProducts);
    },
    'new': function() {
        // ...
    }
});
```

###Template
Templates can be either strings or functinons which construct HTML code from the view data. Dry.js automatically finds template definitions in the dom looking for a script with a data-dry attribute, and then renders it to a DOM element with a data-dry attribute of the same value.

```js
var app1 = dry.app('app1');

// Home page
app1.controller('main', {
    'hello': function() {
        return new dry.View('main/hello');
    }
});
```

```html
<!-- Template -->
<script data-dry="main/hello" type="text/template">
    <% for(var i=0; i<10; i++) { %>
        Lorem ipsum
    <% } %>
</script>
<div data-dry="main/hello"><!-- Template will be rendered here --></div>
```

The convention here is very simple: by default, once a user navigates to a route (say www.someUrl.com/main/hello), then the main controller executes the hello method, which will create a new instance of the main/hello view.

Notice that the view instance is created on the fly, and since the only parameter specified when creating the view is its name, it will simply follow the default behavior for views. More specifically, it look for a script with a data-dry attribute equal to its name (the template) and render it into the first non-script DOM element with the same attribute value.

## Thanks To

- [chrisdavies](https://github.com/chrisdavies/) for his implementation of [rlite](https://github.com/chrisdavies/rlite) (used as default router behind the secenes)
- [John Resig](http://ejohn.org/blog/javascript-micro-templating/) for his micro templating engine
- [jQuery team](https://github.com/jquery/jquery) for their implementation of jQuery.param
