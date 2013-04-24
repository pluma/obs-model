# Synopsis

**obs-model** provides a minimal yet very extensible baseline for defining MVC or MVVM models with [observable attributes](https://github.com/pluma/obs).

For an example of extending models with plugins, see [the validation plugin](https://github.com/pluma/obs-model-validation).

[![browser support](https://ci.testling.com/pluma/obs-model.png)](https://ci.testling.com/pluma/obs-model)

[![Build Status](https://travis-ci.org/pluma/obs-model.png?branch=master)](https://travis-ci.org/pluma/obs-model)

# Install

## Node.js

### With NPM

```sh
npm install obs
```

### From source

```sh
git clone https://github.com/pluma/obs-model.git
cd obs-model
npm install
make && make dist
```

## Browser

### With component

```sh
component install pluma/obs-model
```

[Learn more about component](https://github.com/component/component).

### With a CommonJS module loader

Download the [latest minified CommonJS release](https://raw.github.com/pluma/obs-model/master/dist/obs-model.min.js) and add it to your project.

Make sure you also have a compatible copy of [assimilate](https://github.com/pluma/assimilate) and [obs](https://github.com/pluma/obs).

[Learn more about CommonJS modules](http://wiki.commonjs.org/wiki/Modules/1.1).

### With an AMD module loader

Download the [latest minified AMD release](https://raw.github.com/pluma/obs-model/master/dist/obs-model.amd.min.js) and add it to your project.

Make sure you also have a compatible copy of [assimilate](https://github.com/pluma/assimilate) and [obs](https://github.com/pluma/obs).

[Learn more about AMD modules](http://requirejs.org/docs/whyamd.html).

# Basic usage example

```javascript
var User = model('User')
    .attr('id')
    .attr('username')
    .attr('firstname')
    .attr('lastname')
    .attr('fullname', {
        read: function() {
            return this.firstname() + ' ' + this.lastname();
        },
        watch: ['firstname', 'lastname']
    });

var john = new User({id: 1, username: 'jdoe', firstname: 'John', lastname: 'Doe'});

console.log(john.fullname()); // "John Doe"
john.lastname('Smith');
console.log(john.fullname()); // "John Smith"

john.username.subscribe(function(value) {
    console.log("john's username is now: " + value);
});
john.username('admin');
// -> "john's username is now: admin"
```

# API

## model(name)

Create a `Model` with the given name.

## Model.modelName

The model's name as passed to `model()`.

## Model.attr(name, [options])

Defines a new attribute with the given name. The `options` can be an object containing configuration data for the attribute.

The attribute will appear as an observable property on new model instances.

### options.read and options.write

If either of these options is given, a computed observable with its context bound to the model will be created instead of a regular observable property.

### options.watch

If `options.read` is given, `options.watch` may optionally be an array of attribute names the computed observable will monitor for changes.

### options.lazy

If `options.read` is given, `options.lazy` may optionally be a boolean determining whether the computed observable will use lazy evaluation.

## Model.use(plugin:Function)

Adds the given plugin to the model. The function will later be called by the model's constructor with `this` set to the new model instance. If you add the same plugin multiple times, it will only be added once.

This method is the backbone of model extensibility.

### plugin.contributeToModel(Model)

If this function exists, it will be applied to the `Model` definition when the plugin is added.

This function can provide additional properties or behaviour to the `Model` type itself.

## new Model([values])

Creates a new model instance. `values` is optionally an object mapping attribute names to their initial values.

## Model#model

The `Model` this model is an instance of.

## Model#[attrName]

An observable property representing each attribute.

## Model#dismiss()

Runs the model's destructors. Plugins can use these to free event listeners, subscriptions and such.

# License

The MIT/Expat license.
