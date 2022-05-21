// Run: jsonnet test.jsonnet

local manifest = import 'manifest_v3.libsonnet';

manifest.new(
  name='Search Extension',
  version='0.1',
  keyword='se',
  description='search...',
  service_worker="service_worker.js",
)
.addIcons({ '16': 'aaa.png', '32': 'bbb.png' })
.addPermissions('activeTab')
.addPermissions(['storage', 'unlimitedStorage'])
.addWebAccessibleResources('test.js')
.addContentScript(
  matches=['google.com', 'github.com'],
  js=['a.js', 'b.js'],
  css=['a.css', 'b.css'],
)
.addAction("popup.html", "Search Extension Description")
