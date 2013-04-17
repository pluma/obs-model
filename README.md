# Synopsis

**obs-model** provides a minimal baseline for defining MVC or MVVM models with [observable attributes](https://github.com/pluma/obs.js).

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

Make sure you also have a compatible copy of [aug](https://github.com/jgallen23/aug) and [obs](https://github.com/pluma/obs.js).

[Learn more about CommonJS modules](http://wiki.commonjs.org/wiki/Modules/1.1).

### With an AMD module loader

Download the [latest minified AMD release](https://raw.github.com/pluma/obs-model/master/dist/obs-model.amd.min.js) and add it to your project.

Make sure you also have a compatible copy of [aug](https://github.com/jgallen23/aug) and [obs](https://github.com/pluma/obs.js).

[Learn more about AMD modules](http://requirejs.org/docs/whyamd.html).

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

## Model.modelName

The model's name as passed to `model()`.

## Model.attr(name, [options])

Defines a new attribute with the given name. The `options` can be an object containing configuration data for model plugins.

The attribute will appear as an observable property on new model instances.

## Model.use(plugin:Function)

Adds the given plugin to the model. The function will later be called by the model's constructor with `this` set to the new model instance.

This method is the backbone of model extensibility.

If you add the same plugin multiple times, it will only be added once.

## Model#model

The `Model` this model is an instance of.

## Model#dismiss()

Runs the model's destructors. Plugins can use these to free event listeners, subscriptions and such.

# License

The MIT/Expat license.