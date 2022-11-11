# Changelog

## 0.4.0

Depends on `OverlayScrollbars` version `^2.0.0` and `Vue` version `^3.2.25`.  
The component was rewritten using `script setup`.

### Features

- `OverlayScrollbarsComponent` has now the `events` property
- `OverlayScrollbarsComponent` has now the `element` property
- `OverlayScrollbarsComponent` emits now all `OverlayScrollbars` events as "native" Vue events
- The `useOverlayScrollbars` composable was added for advanced usage 

### Breaking Changes

- The `extensions` property is removed from `OverlayScrollbarsComponent`
- The `osTarget()` function from the `OverlayScrollbarsComponent` `ref` is renamed to `getElement()`