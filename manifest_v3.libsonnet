local manifest_common = import 'manifest_common.libsonnet';

local resource = {
  new(resources, matches, extension_ids):: {
    resources: resources,
    matches: matches,
    extension_ids: extension_ids,
  },
};

{
  new(
    name,
    keyword,
    description,
    version,
    service_worker=null,
    background_page=null,
  ):: (
    manifest_common.new(name, keyword, description, version)
  ) {
    local it = self,
    _action:: {},

    manifest_version: 3,
    action: it._action,
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self';",
    },
    background: {
      [if service_worker != null then 'service_worker']: service_worker,
      [if service_worker != null then 'type']: 'module',
      [if background_page != null then 'page']: background_page,
    },
    web_accessible_resources: [],
    addWebAccessibleResources(resources, matches=[], extension_ids=[]):: self + {
      web_accessible_resources+: [resource.new(resources, matches, extension_ids)],
    },
    addHostPermissions(permission):: self + {
      host_permissions+: if std.isArray(permission) then permission else [permission],
    },
    addOptionalHostPermissions(permission):: self + {
      optional_host_permissions+: if std.isArray(permission) then permission else [permission],
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
