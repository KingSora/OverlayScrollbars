# Changelog

## 0.5.0

### Features

Added the possibility to `defer` the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) 
- `OverlayScrollbarsComponent` accepts now the `defer` property
- `useOverlayScrollbars` params accept now the `defer` key
- `useOverlayScrollbars` will now always try to destroy the instance if the component unmounts.

### Breaking Changes

- Because initialization can be deferred now, the `initialize` function of the `useOverlayScrollbars` hook isn't returning the instance anymore. Use the `instance` function of the `useOverlayScrollbars` hook instead.

## 0.4.0

Depends on `OverlayScrollbars` version `^2.0.0` and `React` version `>=16.8.0`.  
The component was rewritten using `hooks`. ([#218](https://github.com/KingSora/OverlayScrollbars/pull/218))

### Features

- `OverlayScrollbarsComponent` accepts now the `events` property
- `OverlayScrollbarsComponent` accepts now the `element` property
- The `useOverlayScrollbars` hook was added for advanced usage 

### Breaking Changes

- The `extensions` property is removed from `OverlayScrollbarsComponent`
- The `osTarget()` function from the `OverlayScrollbarsComponent` `ref` is renamed to `getElement()`