<div align="center">
  <a href="https://kingsora.github.io/OverlayScrollbars"><img src="https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/logo/logo.png" width="160" height="160" alt="OverlayScrollbars"></a>
  <a href="https://svelte.dev/"><img src="https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/packages/overlayscrollbars-svelte/logo.svg" width="160" height="160" alt="Svelte"></a>
</div>
<br />
<div align="center">

  [![OverlayScrollbars](https://img.shields.io/badge/OverlayScrollbars-%5E2.0.0-338EFF?style=flat-square)](https://github.com/KingSora/OverlayScrollbars)
  [![Svelte](https://img.shields.io/badge/Svelte-%3E=3.54.0-FF3E00?style=flat-square&logo=svelte)](https://github.com/sveltejs/svelte)
  [![Downloads](https://img.shields.io/npm/dt/overlayscrollbars-svelte.svg?style=flat-square)](https://www.npmjs.com/package/overlayscrollbars-svelte)
  [![Version](https://img.shields.io/npm/v/overlayscrollbars-svelte.svg?style=flat-square)](https://www.npmjs.com/package/overlayscrollbars-svelte)
  [![License](https://img.shields.io/github/license/kingsora/overlayscrollbars.svg?style=flat-square)](#)

</div>
<h3 align="center">
  <a href="https://kingsora.github.io/OverlayScrollbars">Website</a>
  &nbsp;&nbsp;&bull;&nbsp;&nbsp;
  <a href="https://kingsora.github.io/OverlayScrollbars/examples">Examples</a>
</h3>

# OverlayScrollbars for Svelte

This is the official OverlayScrollbars Svelte wrapper.

## Example

- Online example on [StackBlitz](https://stackblitz.com/edit/overlayscrollbars-svelte)
- Example App in the [Repository](https://github.com/KingSora/OverlayScrollbars/tree/master/examples/svelte)

## Installation

```sh
npm install overlayscrollbars-svelte
```

## Peer Dependencies

OverlayScrollbars for Svelte has the following **peer dependencies**:

- The vanilla JavaScript library: [overlayscrollbars](https://www.npmjs.com/package/overlayscrollbars)

```
npm install overlayscrollbars
```

- The Svelte framework: [svelte](https://www.npmjs.com/package/svelte)

```
npm install svelte
```

## Usage

The first step is to import the CSS file into your app:
```ts
import 'overlayscrollbars/overlayscrollbars.css';
```

> __Note__: In older node versions use `'overlayscrollbars/styles/overlayscrollbars.css'` as the import path for the CSS file.

## Component

The main entry point is the `OverlayScrollbarsComponent` which can be used in your application as a component:

```jsx
import { OverlayScrollbarsComponent } from "overlayscrollbars-svelte";

// ...

<OverlayScrollbarsComponent defer>
  example content
</OverlayScrollbarsComponent>
```

### Properties

The component accepts all properties of regular elements such as `div` and `span`.  
Additionally it has custom optional properties:

- `element`: accepts a `string` which represents the tag of the root element.
- `options`: accepts an `object` which represents the OverlayScrollbars options.
- `events`: accepts an `object` which represents the OverlayScrollbars events.
- `defer`: accepts an `boolean` or `object`. Defers the initialization to a point in time when the browser is idle.

> __Note__: Its **highly recommended** to use the `defer` option whenever possible to defer the initialization to a browser's idle period.

```jsx
// example usage
<OverlayScrollbarsComponent
  element="span"
  options={{ scrollbars: { autoHide: 'scroll' } }}
  events={{ scroll: () => { /* ... */ } }}
  defer
/>
```

### Events

Additionally to the `events` property the `OverlayScrollbarsComponent` emits "native" Svelte events. To prevent name collisions with DOM events the events have a `os` prefix. 

> __Note__: It doesn't matter whether you use the `events` property or the Svelte events or both.

```jsx
// example usage
<OverlayScrollbarsComponent
  on:osInitialized={onInitialized}
  on:osUpdated={onUpdated}
  on:osDestroyed={onDestroyed}
  on:osScroll={onScroll}
/>
```

All events are typed, but you can use the `EventListenerArgs` type as utility in case its needed:

```ts
import type { EventListenerArgs } from 'overlayscrollbars';

// example listener
const onUpdated = (event) => {
  const [instance, onUpdatedArgs] = event.detail as EventListenerArgs['updated'];
}
```

### Ref

The `ref` of the `OverlayScrollbarsComponent` will give you an object with which you can access the OverlayScrollbars `instance` and the root `element` of the component.  
The ref object has two properties:

- `osInstance`: a function which returns the OverlayScrollbars instance.
- `getElement`: a function which returns the root element.

## License

MIT
