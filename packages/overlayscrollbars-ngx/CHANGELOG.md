# Changelog

## 0.4.0

Depends on `OverlayScrollbars` version `^2.0.0` and `Angular` version `>=12.0.0`.

### Features

- The selector for the `OverlayScrollbarsComponent` is now `overlay-scrollbars` or `[overlay-scrollbars]`
- `OverlayScrollbarsComponent` has now the `events` property
- `OverlayScrollbarsComponent` emits now all `OverlayScrollbars` events as "native" Angular events
- The `OverlayScrollbarsDirective` was added for advanced usage 

### Breaking Changes

- The `extensions` property is removed from `OverlayScrollbarsComponent`
- The `osInstance()` function from the `OverlayScrollbarsComponent` `ref` is renamed to `instance()`
- The `osTarget()` function from the `OverlayScrollbarsComponent` `ref` is renamed to `element()`