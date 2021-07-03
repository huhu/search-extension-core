// Run: jsonnet test.jsonnet

local manifest = import 'manifest.libsonnet';

manifest.new(
  name='Search Extension',
  version='0.1',
  keyword='se',
  description='search...',
)
.addIcons({ '16': 'aaa.png', '32': 'bbb.png' })
.addPermissions('activeTab')
.addPermissions(['storage', 'unlimitedStorage'])
.addWebAccessibleResources('test.js')
.addBackgroundScripts(['main.js', 'app.js'])
.addContentScript(
  matches=['google.com', 'github.com'],
  js=['a.js', 'b.js'],
  css=['a.css', 'b.css'],
)
.addBrowserAction("popup.html", "Search Extension Description")
