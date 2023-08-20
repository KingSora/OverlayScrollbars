# Changelog

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
