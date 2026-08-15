/**
 * dsh-mobile-layout, node half. Pure client-side UI plugin: the empty apply
 * exists so the plugin appears in the host cordis.yml / Loader as an enabled
 * row (the client-modules registry only scans enabled loader entries for
 * `dsh.client` packages). The browser half ships via exports["./client"],
 * discovered through the package.json dsh.client declaration.
 *
 * Zero @deepseek-ai dependencies on purpose (profile plugin iron rule:
 * depending on any package that is also a composition row shadows the
 * registry copies and crashes tool resolution).
 */
/** Host plugin body — no host-side behavior for this surface plugin. */
function apply() {}

export { apply };
