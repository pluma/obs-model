/*! obs-model 0.4.0 Copyright (c) 2013 Alan Plum. MIT licensed. */
(function(root){var require=function(key){return root[key];},exports=(root.obs-model={});
var assimilate = require('assimilate'),
    obs = require('obs'),
    noop = function() {};

function model(name, attrs) {
    function Model(values) {
        values = values || {};

        this._destructors = [];

        var computedAttrs = {};
        var watch = {};
        var key, opts, i;

        for (key in this.model.attrs) {
            opts = this.model.attrs[key] || {};
            if (opts.write || opts.read) {
                this[key] = obs.computed({
                    lazy: opts.lazy,
                    write: opts.write,
                    read: opts.read ? noop : opts.read,
                    context: this
                });
                if (opts.read) {
                    computedAttrs[key] = opts.read;
                }
                if (opts.watch) {
                    watch[key] = [].concat(opts.watch);
                }
            } else if (values.hasOwnProperty(key)) {
                this[key] = obs.prop(values[key]);
            } else {
                this[key] = obs.prop();
            }
        }

        for (key in computedAttrs) {
            this[key].read = computedAttrs[key];
        }

        for (key in watch) {
            for (i = 0; i < watch[key].length; i++) {
                this[key].watch(this[watch[key][i]]);
            }
        }

        this._destructors.push(function() {
            for (var key in watch) {
                for (var i = 0; i < watch[key].length; i++) {
                    this[key].unwatch(this[watch[key][i]]);
                }
            }
        });

        for (i = 0; i < this.model.plugins.length; i++) {
            this.model.plugins[i](this);
        }
    }

    Model.prototype = {
        model: Model,
        dismiss: function() {
            for (var i = 0; i < this._destructors.length; i++) {
                this._destructors[i].call(this);
            }
        }
    };

    assimilate(Model, {
        modelName: name,
        attrs: attrs || {},
        plugins: [],
        attr: function(name, options) {
            this.attrs[name] = options;
            return this;
        },
        use: function(plugin) {
            for (var i = 0; i < this.plugins.length; i++) {
                if (this.plugins[i] === plugin) {
                    return this;
                }
            }
            if (typeof plugin.contributeToModel === 'function') {
                plugin.contributeToModel(this);
            }
            this.plugins.push(plugin);
            return this;
        }
    });

    return Model;
}
exports.model = model;}(this));
