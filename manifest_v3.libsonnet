local content_script = {
  // Using std.prune() function to remove all "empty" members
  new(matches, js, css, exclude_matches):: std.prune({
    matches: matches,
    js: js,
    css: css,
    run_at: 'document_start',
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
    version,
    service_worker,
  ):: {
    local it = self,
    _icons:: {},
    _permissions:: [
          'tabs',
    ],
    _action:: {},
    _resources:: [],

    manifest_version: 3,
    name: name,
    description: description,
    version: version,
    icons: it._icons,
    action: it._action,
    content_security_policy: {
        extension_pages: "script-src 'self'; object-src 'self';"
    },
    omnibox: {
      keyword: keyword,
    },
    content_scripts: [],
    background: {
      service_worker: service_worker,
    },
    web_accessible_resources: {
        resources: it._resources,
    },
    permissions: it._permissions,
    addIcons(icons):: self + {
      _icons+: icons,
    },
    addPermissions(permission):: self + {
      _permissions+: if std.isArray(permission) then permission else [permission],
    },
    addWebAccessibleResources(resource):: self + {
      _resources+: if std.isArray(resource) then resource else [resource],
    },
    addContentScript(matches, js, css, exclude_matches = []):: self + {
      content_scripts+: [content_script.new(matches, js, css, exclude_matches)],
    },
    addAction(popup, title):: self + {
      _action+: {
        default_icon: it._icons,
        default_popup: popup,
        default_title: title,
      },
    },
  },
}
