chrome: clean
	@jsonnet -J core manifest.jsonnet --ext-str browser=chrome -o extension/manifest.json

edge: clean
	@jsonnet -J core manifest.jsonnet --ext-str browser=edge -o extension/manifest.json

firefox: clean
	@jsonnet -J core manifest.jsonnet --ext-str browser=firefox -o extension/manifest.json

clean:
	@rm -rf extension/manifest.json
