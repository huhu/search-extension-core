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
  * @name Extension name
  * @keyword Omnibox keyword
  * @description Extension description
  * @version Extension version
  */
  new(
    name,
    keyword,
    description,
    version,
  ):: {
    _icons:: {},

    name: name,
    description: description,
    version: version,
    omnibox: {
      keyword: keyword,
    },
    icons: self._icons,
    permissions: [],
    content_scripts: [],
    addIcons(icons):: self + {
      _icons+: icons,
    },
    setOptionsPage(page):: self + {
      [if std.length(page) > 0 then 'options_page' else null]: page,
    },
    addPermissions(permission):: self + {
      permissions+: if std.isArray(permission) then permission else [permission],
    },
    addContentScript(matches, js, css, exclude_matches=[], run_at='document_start'):: self + {
      content_scripts+: [content_script.new(matches, js, css, exclude_matches, run_at)],
    },
  },
}
