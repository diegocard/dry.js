dry.js
======

Super lightweight SPA framework focused on conventions

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

Provides only the minimum set of components necessary for web application development, like Backbone.js
Follows an MVC, convention over configuration approach, like Ember.js (although much simpler)
Comes with all you need right out of the box like Angular.js (a.k.a batteries included), alghough these features can be easily replaced by other external components
Integrates an opinionated set of guidelines for the application's architecture and data flow, similar to what Facebook's Flux does

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

## Thanks To

- [chrisdavies](https://github.com/chrisdavies/) for his implementation of [rlite](https://github.com/chrisdavies/rlite) (used as default router behind the secenes)
- [John Resig](http://ejohn.org/blog/javascript-micro-templating/) for his micro templating engine
- [jQuery team](https://github.com/jquery/jquery) for their implementation of jQuery.param
