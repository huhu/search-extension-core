// Run: jsonnet test_v3.jsonnet

local manifest = import 'manifest_v3.libsonnet';

manifest.new(
  name='Search Extension',
  version='0.1',
  keyword='se',
  description='search...',
  service_worker="service_worker.js",
)
.setOptionsUi("options/index.html")
.addIcons({ '16': 'aaa.png', '32': 'bbb.png' })
.addPermissions('activeTab')
.addPermissions(['storage', 'unlimitedStorage'])
.addHostPermissions('https://github.com/huhu/search-extension-core/*')
.addHostPermissions(['https://docs.rs/*', 'https://crates.io/*'])
.addWebAccessibleResources(resources = ['test.js'])
.addContentScript(
  matches=['google.com', 'github.com'],
  js=['a.js', 'b.js'],
  css=['a.css', 'b.css'],
  run_at='document_end',
)
.addAction("popup.html", "Search Extension Description")
