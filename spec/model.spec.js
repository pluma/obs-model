/*global describe, it, beforeEach */
var expect = require('expect.js'),
    aug = require('aug'),
    obs_model = require('../');

describe('model', function() {
    it('creates a model with a modelName', function() {
        var name = 'MyModel';
        var MyModel = obs_model.model(name);
        expect(MyModel.modelName).to.equal(name);
    });
});
describe('Model.attr()', function() {
    var MyModel;
    beforeEach(function() {
        MyModel = obs_model.model('MyModel');
    });
    it('adds a named attribute to the model', function() {
        var name = 'someAttrName';
        expect(MyModel.attrs).to.be.empty();
        MyModel.attr(name);
        expect(MyModel.attrs).to.only.have.key(name);
    });
    it('adds an attribute definition to the model', function() {
        var name1 = 'someAttrName';
        var dfn1 = {crazy: 'stuff'};
        var name2 = 'someOtherAttrName';
        var dfn2 = {more: 'things'};
        expect(MyModel.attrs).to.be.empty();
        MyModel.attr(name1, dfn1);
        MyModel.attr(name2, dfn2);
        expect(MyModel.attrs).to.have.property(name1, dfn1);
        expect(MyModel.attrs).to.have.property(name2, dfn2);
    });
});
describe('Model.use()', function() {
    var MyModel;
    beforeEach(function() {
        MyModel = obs_model.model('MyModel');
    });
    it('adds a plugin to the model', function() {
        var plugin = function() {};
        expect(MyModel.plugins).to.be.empty();
        MyModel.use(plugin);
        expect(MyModel.plugins).to.only.contain(plugin);
    });
    it('cannot add the same plugin twice', function() {
        var plugin1 = function() {},
            plugin2 = function() {};
        expect(MyModel.plugins).to.be.empty();
        MyModel.use(plugin1);
        MyModel.use(plugin2);
        MyModel.use(plugin1);
        expect(MyModel.plugins).to.eql([plugin1, plugin2]);
    });
});
describe('new Model()', function() {
    var MyModel;
    beforeEach(function() {
        MyModel = obs_model.model('MyModel');
    });
    it('calls plugins with the new instance as context', function() {
        var plugin = function() {
            plugin.timesCalled += 1;
            plugin.context = this;
        };
        plugin.timesCalled = 0;
        MyModel.use(plugin);
        expect(plugin.timesCalled).to.be(0);
        var m = new MyModel();
        expect(plugin.timesCalled).to.be(1);
        expect(plugin.context).to.be(m);
    });
    describe('for each attribute', function() {
        var value = 'the loneliest number';
        var m;
        beforeEach(function() {
            MyModel = obs_model.model('MyModel');
            MyModel.attr('one');
            MyModel.attr('two');
            m = new MyModel({
                one: value
            });
        });
        it('defines an instance property', function() {
            expect(m).to.have.property('one');
            expect(m).to.have.property('two');
        });
        it('creates an observable property', function() {
            expect(m.one).to.be.a('function');
            expect(m.one.__is_obs__).to.be(true);
        });
        it('initializes it with the passed value', function() {
            expect(m.one()).to.be(value);
        });
        it('initializes it with `undefined` if no value was passed', function() {
            expect(m.two()).to.be(undefined);
        }); 
    });
});
describe('Model#model', function() {
    var MyModel;
    beforeEach(function() {
        MyModel = obs_model.model('MyModel');
    });
    it('is a reference to the model constructor', function() {
        var m = new MyModel();
        expect(m.model).to.equal(MyModel);
    });
});
describe('Model#dismiss()', function() {
    var MyModel;
    beforeEach(function() {
        MyModel = obs_model.model('MyModel');
    });
    it('calls every destructor', function() {
        var fn1 = function() {fn1.timesCalled += 1;};
        var fn2 = function() {fn2.timesCalled += 1;};
        var plugin = function() {
            this._destructors.push(fn1);
            this._destructors.push(fn2);
        };
        fn1.timesCalled = 0;
        fn2.timesCalled = 0;
        MyModel.use(plugin);
        var m = new MyModel();
        expect(m._destructors).to.only.contain(fn1, fn2);
        expect(fn1.timesCalled).to.be(0);
        expect(fn2.timesCalled).to.be(0);
        m.dismiss();
        expect(fn1.timesCalled).to.be(1);
        expect(fn2.timesCalled).to.be(1);
    });
});