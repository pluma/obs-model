LICENSE_COMMENT="/*! obs-model 0.4.0 Copyright (c) 2013 Alan Plum. MIT licensed. */"

test:
	@./node_modules/.bin/mocha \
		--growl \
		--reporter spec \
		spec/*.js

clean:
	@rm -rf dist

dist/vendor: clean
	@mkdir -p dist/vendor

dist/obs-model.js: dist/vendor
	@echo $(LICENSE_COMMENT) > dist/obs-model.js
	@cat src/obs-model.js >> dist/obs-model.js

dist/obs-model.globals.js: dist/vendor
	@echo $(LICENSE_COMMENT) > dist/obs-model.globals.js
	@echo "(function(root){\
	var require=function(key){return root[key];},\
	exports=(root.obs-model={});" >> dist/obs-model.globals.js
	@cat src/obs-model.js >> dist/obs-model.globals.js
	@echo "}(this));" >> dist/obs-model.globals.js

dist/obs-model.amd.js: dist/vendor
	@echo $(LICENSE_COMMENT) > dist/obs-model.amd.js
	@echo "define(function(require, exports) {" >> dist/obs-model.amd.js
	@cat src/obs-model.js >> dist/obs-model.amd.js
	@echo "});" >> dist/obs-model.amd.js

dist/obs-model.min.js: dist/obs-model.js
	@./node_modules/.bin/uglifyjs dist/obs-model.js > dist/obs-model.min.js

dist/obs-model.globals.min.js: dist/obs-model.globals.js
	@./node_modules/.bin/uglifyjs dist/obs-model.globals.js > dist/obs-model.globals.min.js

dist/obs-model.amd.min.js: dist/obs-model.amd.js
	@./node_modules/.bin/uglifyjs dist/obs-model.amd.js > dist/obs-model.amd.min.js

dist: dist/obs-model.min.js dist/obs-model.globals.min.js dist/obs-model.amd.min.js

lint:
	@./node_modules/.bin/jshint src/obs-model.js spec

.PHONY: lint test clean
