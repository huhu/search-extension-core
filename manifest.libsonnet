local content_script = {
  new(matches, js, css):: {
    matches: matches,
    js: js,
    css: css,
    run_at: 'document_start',
  },
};

{
  /**
  * @name manifest.new
  */
  new(
    name,
    keyword,
    description,
    version
  ):: {
    local it = self,
    _icons:: {},
    _background_scripts:: [
      'core/compat.js',
      'core/omnibox.js',
      'core/command/base.js',
      'core/command/simple.js',
      'core/command/stats.js',
      'core/command/history.js',
      'core/command/manager.js',
    ],
    _permissions:: [
          'tabs',
    ],

    manifest_version: 2,
    name: name,
    description: description,
    version: version,
    icons: it._icons,
    browser_action: {
      default_icon: it._icons,
      default_popup: 'popup/index.html',
      default_title: description,
    },
    content_security_policy: "script-src 'self'; object-src 'self';",
    omnibox: {
      keyword: keyword,
    },
    content_scripts: [],
    background: {
      scripts: it._background_scripts,
    },
    web_accessible_resources: [],
    permissions: it._permissions,
    addIcons(icons):: self + {
      _icons+: icons,
    },
    addPermissions(permission):: self + {
      _permissions+: if std.isArray(permission) then permission else [permission],
    },
    appendContentSecurityPolicy(policy):: self + {
      content_security_policy+: policy,
    },
    addWebAccessibleResources(resource):: self + {
      web_accessible_resources+: if std.isArray(resource) then resource else [resource],
    },
    addBackgroundScripts(script):: self + {
      _background_scripts+: if std.isArray(script) then script else [script],
    },
    addContentScript(matches, js, css):: self + {
      content_scripts+: [content_script.new(matches, js, css)],
    },
  },
}
