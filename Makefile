LICENSE_COMMENT="/*! obs-model 0.5.1 Original author Alan Plum <me@pluma.io>. Released into the Public Domain under the UNLICENSE. @preserve */"

test:
	@./node_modules/.bin/mocha \
		--growl \
		--reporter spec \
		spec/*.spec.js

clean:
	@rm -rf dist

dist/vendor: clean
	@mkdir -p dist

dist/obs-model.js: dist/vendor
	@echo $(LICENSE_COMMENT) > dist/obs-model.js
	@cat src/obs-model.js >> dist/obs-model.js

dist/obs-model.globals.js: dist/vendor
	@echo $(LICENSE_COMMENT) > dist/obs-model.globals.js
	@echo "(function(root){\
	var require=function(key){return root[key];},\
	module={};" >> dist/obs-model.globals.js
	@cat src/obs-model.js >> dist/obs-model.globals.js
	@echo "root.obsModel = module.exports;\
	}(this));" >> dist/obs-model.globals.js

dist/obs-model.amd.js: dist/vendor
	@echo $(LICENSE_COMMENT) > dist/obs-model.amd.js
	@echo "define(function(require, exports, module) {" >> dist/obs-model.amd.js
	@cat src/obs-model.js >> dist/obs-model.amd.js
	@echo "return module.exports;});" >> dist/obs-model.amd.js

dist/obs-model.min.js: dist/obs-model.js
	@./node_modules/.bin/uglifyjs dist/obs-model.js --comments -m > dist/obs-model.min.js

dist/obs-model.globals.min.js: dist/obs-model.globals.js
	@./node_modules/.bin/uglifyjs dist/obs-model.globals.js --comments -m > dist/obs-model.globals.min.js

dist/obs-model.amd.min.js: dist/obs-model.amd.js
	@./node_modules/.bin/uglifyjs dist/obs-model.amd.js --comments > dist/obs-model.amd.min.js

dist: dist/obs-model.min.js dist/obs-model.globals.min.js dist/obs-model.amd.min.js

lint:
	@./node_modules/.bin/jshint src/obs-model.js spec

.PHONY: lint test clean
