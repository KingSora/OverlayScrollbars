# Changelog

## 0.5.2

### Bug Fix

- Fix `ngOnDestroy` in case there is no active instance. [#670](https://github.com/KingSora/OverlayScrollbars/issues/670)

## 0.5.1

### Bug Fix

- Correctly resolve the entry file(s) in the `package.json`.

## 0.5.0

Added the possibility to `defer` the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) 

- `OverlayScrollbarsComponent` and `OverlayScrollbarsDirective` accept now the `defer` property
- Events are now run in the `NgZone` [#516](https://github.com/KingSora/OverlayScrollbars/pull/516)

### Breaking Changes

- Because initialization can be deferred now, the `osInitialize` function of the `OverlayScrollbarsDirective` isn't returning the instance anymore. Use the `osInstance` function of the `OverlayScrollbarsDirective` instead.
- Depends now on `Angular` version `>=13.0.0`.

## 0.4.0

Depends on `OverlayScrollbars` version `^2.0.0` and `Angular` version `>=12.0.0`.

### Features

- The selector for the `OverlayScrollbarsComponent` is now `overlay-scrollbars` or `[overlay-scrollbars]`
- `OverlayScrollbarsComponent` has now the `events` property
- `OverlayScrollbarsComponent` emits now all `OverlayScrollbars` events as "native" Angular events
- The `OverlayScrollbarsDirective` was added for advanced usage 

### Breaking Changes

- The `extensions` property is removed from `OverlayScrollbarsComponent`
- The `osTarget()` function from the `OverlayScrollbarsComponent` `ref` is renamed to `getElement()`