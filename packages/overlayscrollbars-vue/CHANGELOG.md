# Changelog

## 0.5.9

### Improvements

- The `OverlayScrollbarsComponent` now properly supports `'body'` as its element tag.

## 0.5.8

### Improvements

- Improve the type definitions with the usage of the `Component` type.

## 0.5.7

### Improvements

- Adapt the `exports` field in the `package.json` for correct `commonjs` and `module` handling. 

## 0.5.6

### Bug Fixes

- Make sure component is stateless and children won't update more often than needed.

## 0.5.5

### Bug Fixes

- Revert to `runtime declaration` for props to prevent types warning. [#551](https://github.com/KingSora/OverlayScrollbars/issues/551)

## 0.5.4

### Bug Fixes

- Fixed TypeScript definitions for optional properties.

## 0.5.3

- Improve `Server Side Rendering` behavior by creating additional markup only on the client with the hydration phase.
- Improve `deferred initialization` where the time between created markup and actual initialization is masked with CSS.

## 0.5.2

- The `package.json` has now an appropriate `exports` field to optimize builds in modern bundlers.

## 0.5.1

The TypeScript interfaces `OverlayScrollbarsProps` and `OverlayScrollbarsRef` are exported from the package.

## 0.5.0

### Features

Added the possibility to `defer` the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) 
- `OverlayScrollbarsComponent` accepts now the `defer` property
- `useOverlayScrollbars` params accept now the `defer` property
- `useOverlayScrollbars` will now always try to destroy the instance if the component unmounts.

### Breaking Changes

- Because initialization can be deferred now, the `initialize` function of the `useOverlayScrollbars` composable isn't returning the instance anymore. Use the `instance` function of the `useOverlayScrollbars` composable instead.

## 0.4.0

Depends on `OverlayScrollbars` version `^2.0.0` and `Vue` version `^3.2.25`.  
The component was rewritten using `script setup`.

### Features

- `OverlayScrollbarsComponent` accepts now the `events` property
- `OverlayScrollbarsComponent` accepts now the `element` property
- `OverlayScrollbarsComponent` emits now all `OverlayScrollbars` events as "native" Vue events
- The `useOverlayScrollbars` composable was added for advanced usage 

### Breaking Changes

- The `extensions` property is removed from `OverlayScrollbarsComponent`
- The `osTarget()` function from the `OverlayScrollbarsComponent` `ref` is renamed to `getElement()`