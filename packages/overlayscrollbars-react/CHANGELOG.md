# Changelog

## 0.5.6

### Improvements

- The `OverlayScrollbarsComponent` now properly supports `'body'` as its element tag.

## 0.5.5

### Improvements

- Improve the type definitions with the usage of the `ElementType` type instead of the `JSX` namespace of the `@types/react` package in order to improve compatibility to older react versions. 

## 0.5.4

### Improvements

- Adapt the `exports` field in the `package.json` for correct `commonjs` and `module` handling. 

## 0.5.3

### Bug Fixes

- Make sure component is stateless and children won't update more often than needed. ([#565](https://github.com/KingSora/OverlayScrollbars/issues/565))

## 0.5.2

- Improve `Server Side Rendering` behavior by creating additional markup only on the client with the hydration phase.
- Improve `deferred initialization` where the time between created markup and actual initialization is masked with CSS.

## 0.5.1

- The `package.json` has now an appropriate `exports` field to optimize builds in modern bundlers.

## 0.5.0

### Features

Added the possibility to `defer` the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) 
- `OverlayScrollbarsComponent` accepts now the `defer` property
- `useOverlayScrollbars` params accept now the `defer` property
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