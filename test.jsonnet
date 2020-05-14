local manifest = import 'manifest.libsonnet';

manifest.new(
  name='Search Extension',
  version='0.1',
  keyword='se',
  description='search...',
)
.addIcons({ '16': 'aaa.png', '32': 'bbb.png' })
.addPermission('activeTab')
.addWebAccessibleResources('test.js')
.addBackgroundScripts(['main.js', 'app.js'])
.addContentScript(
  matches=['google.com', 'github.com'],
  js=['a.js', 'b.js'],
  css=['a.css', 'b.css'],
)
