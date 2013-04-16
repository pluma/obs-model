var aug = require('aug'),
    obs = require('obs');

function model(name, attrs) {
    function Model(values) {
        values = values || {};

        for (var key in this.model.attrs) {
            if (values.hasOwnProperty(key)) {
                this[key] = obs.prop(values[key]);
            } else {
                this[key] = obs.prop();
            }
        }

        for (var i = 0; i < this.model.plugins.length; i++) {
            this.model.plugins[i].call(this);
        }
    }

    Model.prototype = {
        model: Model,
        _destructors: [],
        dismiss: function() {
            for (var i = 0; i < this._destructors.length; i++) {
                this._destructors[i]();
            }
        }
    };

    aug(Model, {
        name: name,
        attrs: attrs || {},
        plugins: [],
        attr: function(name, options) {
            this.attrs[name] = options;
            return this;
        },
        use: function(plugin) {
            this.plugins.push(plugin);
            return this;
        }
    });

    return Model;
}
exports.model = model;