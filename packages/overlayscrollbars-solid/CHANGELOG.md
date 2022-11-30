# Changelog

## 0.5.0

### Bug Fixes

- Fixed SSR compatibility with `solid-start`.

### Features

Added the possibility to `defer` the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) 
- `OverlayScrollbarsComponent` accepts now the `defer` property
- `createOverlayScrollbars` params accept now the `defer` property
- `createOverlayScrollbars` will now always try to destroy the instance if the component unmounts.

### Breaking Changes

- Because initialization can be deferred now, the `initialize` function of the `createOverlayScrollbars` primitive isn't returning the instance anymore. Use the `instance` function of the `createOverlayScrollbars` primitive instead.

## 0.4.0

The component was created.  
Depends on `OverlayScrollbars` version `^2.0.0` and `Solid` version `^1.5.1`.
