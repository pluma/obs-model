# Synopsis

**obs-model** provides a minimal baseline for defining MVC or MVVM models with [observable attributes](https://github.com/pluma/obs.js).

# Basic usage example

```javascript
var User = model('User')
    .attr('id')
    .attr('username');

var bob = new User({id: 1, username: 'bob'});

bob.username.subscribe(function(value) {
    console.log("Bob's username is now: " + value);
});

bob.username('admin');
// -> "Bob's username is now: admin"
```

# API

## model(name)

Create a `Model` with the given name.

## Model.name

The model's name as passed to `model()`.

## Model.attr(name, [options])

Defines a new attribute with the given name. The `options` can be an object containing configuration data for model plugins.

The attribute will appear as an observable property on new model instances.

## Model.use(plugin:Function)

Adds the given plugin to the model. The function will later be called by the model's constructor with `this` set to the new model instance.

This method is the backbone of model extensibility.

## Model#model

The `Model` this model is an instance of.

## Model#dismiss()

Runs the model's destructors. Plugins can use these to free event listeners, subscriptions and such.

# License

The MIT/Expat license.
