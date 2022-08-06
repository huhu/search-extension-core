local content_script = {
  // Using std.prune() function to remove all "empty" members
  new(matches, js, css, exclude_matches, run_at):: std.prune({
    matches: matches,
    js: js,
    css: css,
    run_at: run_at,
    exclude_matches: exclude_matches,
  }),
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
    name: name,
    description: description,
    version: version,
    icons: it._icons,
    browser_action: it._browser_action,
    content_security_policy: "script-src 'self'; object-src 'self';",
    omnibox: {
      keyword: keyword,
    },
    content_scripts: [],
    background: {
      scripts: it._background_scripts,
    },
    web_accessible_resources: [],
    permissions: [],
    addIcons(icons):: self + {
      _icons+: icons,
    },
    addPermissions(permission):: self + {
      permissions+: if std.isArray(permission) then permission else [permission],
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
    addContentScript(matches, js, css, exclude_matches = [], run_at = 'document_start'):: self + {
      content_scripts+: [content_script.new(matches, js, css, exclude_matches, run_at)],
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
