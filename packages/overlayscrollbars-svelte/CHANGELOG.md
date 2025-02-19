# Changelog

## 0.5.5

The whole package was rewritten to support `Svelte 5`.

### Breaking Changes

- `Svelte 5` is now the only supported svelte version. Support for `Svelte 4` and `Svelte 3` was dropped.

### Features

- The `OverlayScrollbarsComponent` properties are now generic depending on its element type.
- The `OverlayScrollbarsComponent` now accepts a custom Svelte Component as element.
- The `OverlayScrollbarsComponent` still supports events even though they are [deprecated](https://svelte.dev/docs/svelte/v5-migration-guide#Event-changes). This was done to ease migration and will be removed in a future release.
- A new primitive called `useOverlayScrollbars` which allows for more flexibility in case the `OverlayScrollbarsComponent` is not enough.

## 0.5.4

### Improvements

- The `OverlayScrollbarsComponent` now properly supports `'body'` as its element tag.

## 0.5.3

### Improvements

- Adapt the `exports` field in the `package.json` for correct `commonjs` and `module` handling. 

## 0.5.2

### Bug Fixes

- Make sure component is stateless and children won't update more often than needed.

## 0.5.1

- Improve `Server Side Rendering` behavior by creating additional markup only on the client with the hydration phase.
- Improve `deferred initialization` where the time between created markup and actual initialization is masked with CSS.

## 0.5.0

Added the possibility to `defer` the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) 

- support for `svelte v4`
- `OverlayScrollbarsComponent` accepts now the `defer` property

## 0.4.0

The component was created.  
Depends on `OverlayScrollbars` version `^2.0.0` and `Svelte` version `^3.44.0`.
