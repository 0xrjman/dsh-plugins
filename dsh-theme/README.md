# dsh-theme

A personal DSH theme: fixed wallpaper, translucent panels, a warm dark palette, and a "minimal" locale pack.

## What it does

- **Wallpaper**: a fixed `body::before` layer (`center/cover no-repeat fixed`, `opacity: .85`) painted above the transparent boot canvas and below every panel.
- **Translucency**: shell and content surfaces switch to rgba (`.72` light / `.78` dark), so the wallpaper shows through the panels.
- **Accent**: magenta `#d6478a` (light) / `#ec6ba3` (dark), overriding DSH semantic tokens (`--dsw-alias-*`: primary, links, selection, hover).
- **Minimal copy**: registers a "Minimal Chinese" and an "English (Minimal)" locale. The only override collapses the deep-diving status line to `···`; everything else falls back to `zh` / `en`.

## Install

The plugin is `private: true` and linked, never published to npm:

```json
// ~/.dsh/profiles/<profile>/package.json
"dependencies": { "@local/dsh-theme": "link:/path/to/dsh-plugins/dsh-theme" },
"dsh": { "profile": { "bundles": [ "...", "@local/dsh-theme" ] } }
```

Then `pnpm install` and restart DSH. Through `plugin_manager` the flow is `remove_bundle` → `install_bundle` → restart.

## Change the wallpaper

```bash
node set-bg.mjs ~/Pictures/wallpaper.jpg
```

This rewrites the `WALLPAPER_CSS` constant in `client.js` with an inline base64 data URL (jpg, jpeg, png, webp, gif). Commit the regenerated `client.js`. `assets/bg.jpg` (1920×1080) is the source image kept for reference; the runtime uses the inlined copy.

## Change the palette

`ACCENT_TOKENS` in `client.js` is the only entry point. Keys are DSH alias tokens, values are `{ light, dark }` pairs, and any valid CSS color works. Swap that single table to restyle everything; the injection logic below it stays untouched.

## Compatibility and known limits

- **The wallpaper layer is macOS-only in practice**: the shell frame is transparent there and `body` owns the stacking context, so `z-index: -1` lands above the boot canvas instead of being covered. Other platforms are untested.
- **Stable selectors only**: element names, `#root`, and `data-*`. Hashed CSS-module class names are deliberately avoided so a DSH upgrade cannot silently break the theme.
- **Two-level degradation**: `locale` and `theme` are declared through `inject` and skipped when unavailable; every `ctx.effect` is wrapped individually, so the theme can never take the web boot down.

## Layout

```
dsh-theme/
├── index.js            # server-side stub, declares the plugin name
├── client.js           # wallpaper CSS (inline base64), token overrides, locale pack
├── cordis.patch.yml    # bundle entry point
├── set-bg.mjs          # regenerate WALLPAPER_CSS from an image
└── assets/bg.jpg       # default wallpaper source image
```
