local manifest_common = import 'manifest_common.libsonnet';

{
  new(
    name,
    keyword,
    description,
    version
  ):: (
    manifest_common.new(name, keyword, description, version)
  ) {
    local it = self,
    _background_scripts:: [
      'core/compat.js',
      'core/omnibox.js',
      'core/query-event.js',
      'core/storage.js',
      'core/command/base.js',
      'core/command/simple.js',
      'core/command/open.js',
      'core/command/history.js',
      'core/command/manager.js',
    ],
    _browser_action:: {},

    manifest_version: 2,
    browser_action: it._browser_action,
    content_security_policy: "script-src 'self'; object-src 'self';",
    background: {
      scripts: it._background_scripts,
    },
    web_accessible_resources: [],
    appendContentSecurityPolicy(policy):: self + {
      content_security_policy+: policy,
    },
    addWebAccessibleResources(resource):: self + {
      web_accessible_resources+: if std.isArray(resource) then resource else [resource],
    },
    addBackgroundScripts(script):: self + {
      _background_scripts+: if std.isArray(script) then script else [script],
    },
    addBrowserAction(popup, title):: self + {
      _browser_action+: {
        default_icon: it._icons,
        default_popup: popup,
        default_title: title,
      },
    },
  },
}
