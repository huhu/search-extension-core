# https://stackoverflow.com/a/47008498/2220110
args = `arg="$(filter-out $@,$(MAKECMDGOALS))" && echo $${arg:-${1}}`

chrome: clean
	@jsonnet -J core manifest.jsonnet --ext-str browser=chrome -o extension/manifest.json

edge: clean
	@jsonnet -J core manifest.jsonnet --ext-str browser=edge -o extension/manifest.json

firefox: clean
	@jsonnet -J core manifest.jsonnet --ext-str browser=firefox -o extension/manifest.json

# Usage: make pack [browser] to build the target package for corresponding browser.
# Example:`make pack chrome`, `make pack firefox`, `make pack edge`.
pack: assert
	@make $(call args,chrome)
	@web-ext build -s extension -n $(call args,chrome)-$(notdir $(shell pwd))-{version}.zip -o

clean:
	@rm -rf extension/manifest.json

test:
	@echo $(call args,defaultstring)

# The default assert target
assert-default:
	@echo "No asserting, ignored..."

# Overrides target without warning.
#
# https://stackoverflow.com/a/49804748
%: %-default
	@ true

# This allows us to accept extra arguments (by doing nothing
# when we get a job that doesn't match, rather than throwing an error).
%:
	@: