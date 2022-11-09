# Changelog

## 0.4.0

Depends on `OverlayScrollbars` version `^2.0.0` and `React` version `>=16.8.0`.  
The component was rewritten using `hooks`. ([#218](https://github.com/KingSora/OverlayScrollbars/pull/218))

### Features

- `OverlayScrollbarsComponent` has now the `events` property
- `OverlayScrollbarsComponent` has now the `element` property
- The `useOverlayScrollbars` hook was added for advanced usage 

### Breaking Changes

- The `extensions` property is removed from `OverlayScrollbarsComponent`
- The `osInstance()` function from the `OverlayScrollbarsComponent` `ref` is renamed to `instance()`
- The `osTarget()` function from the `OverlayScrollbarsComponent` `ref` is renamed to `element()`