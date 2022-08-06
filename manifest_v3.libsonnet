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
local resource = {
    new(resources, matches, extension_ids):: {
      resources: resources,
      matches: matches,
      extension_ids: extension_ids,
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
    version,
    service_worker,
  ):: {
    local it = self,
    _icons:: {},
    _action:: {},

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
    web_accessible_resources: [],
    permissions: [],
    addIcons(icons):: self + {
      _icons+: icons,
    },
    addPermissions(permission):: self + {
      permissions+: if std.isArray(permission) then permission else [permission],
    },
    addWebAccessibleResources(resources, matches = [], extension_ids = []):: self + {
      web_accessible_resources+: [resource.new(resources, matches, extension_ids)],
    },
    addContentScript(matches, js, css, exclude_matches = [], run_at = 'document_start'):: self + {
      content_scripts+: [content_script.new(matches, js, css, exclude_matches, run_at)],
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
