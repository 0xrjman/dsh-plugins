# dsh-plugins

Custom plugins for [DeepSeek Harness](https://github.com/deepseek-ai) (DSH), maintained by [@0xrjman](https://github.com/0xrjman). One plugin per directory; every directory is a self-contained bundle that `plugin_manager` can load.

## Plugins

| Plugin | What it does |
| --- | --- |
| [`dsh-theme`](./dsh-theme) | Personal theme: fixed wallpaper, translucent panels, warm dark palette, minimal status copy |

## Installation

Plugins are never published to npm. They are linked into a local DSH profile:

1. `plugin_manager` → `remove_bundle` (if an older copy is installed)
2. `plugin_manager` → `install_bundle`, pointing at the plugin directory
3. Restart DSH — client bundle paths are cached per process, so hot edits do not apply

After changing plugin sources, run **remove → install** again: the loader re-reads the bundle bytes only on install.

## Conventions

- One plugin per directory, each with its own `package.json` (`dsh.bundle.patch`, plus `dsh.client` for client plugins), `cordis.patch.yml`, and `README.md`
- Every step inside a client plugin's `apply` must degrade on its own: a throw marks the client fiber FAILED, which the web boot treats as fatal
- No credentials and no home-directory absolute paths in this repo; machine-specific paths live only in the profile `package.json`
- Commit generated client artifacts together with their source, so a fresh clone works as-is

## Third-party plugins

Third-party code is not vendored by default. It is pinned, not tracking.

- [`dsh-remote`](https://github.com/flymysql/dsh-remote) (MIT) — SSH and remote-workspace toolchain, pinned to the exact version `0.8.72` in the profile `package.json`. The profile lockfile records the tarball integrity hash, so nothing moves until the pin is bumped by hand.

Bumping a pinned plugin is a deliberate review step:

1. Read the upstream diff for the target version (`git log` / release notes between the two tags)
2. Rewrite the exact version in the profile `package.json` (no `^`, no `~`)
3. `pnpm install` so the lockfile re-resolves version and integrity hash
4. Restart DSH

If a third-party plugin ever has to be patched locally, it stops being a pinned dependency and becomes a git submodule at an exact commit instead.
