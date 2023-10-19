<div align="center">
  <a href="https://kingsora.github.io/OverlayScrollbars"><img src="https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/logo/logo.png" width="160" height="160" alt="OverlayScrollbars"></a>
  <a href="https://vuejs.org"><img src="https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/packages/overlayscrollbars-vue/logo.svg" width="160" height="160" alt="Vue"></a>
</div>
<br />
<div align="center">

  [![OverlayScrollbars](https://img.shields.io/badge/OverlayScrollbars-%5E2.0.0-338EFF?style=flat-square)](https://github.com/KingSora/OverlayScrollbars)
  [![Vue](https://img.shields.io/badge/Vue-%5E3.2.25-41B883?style=flat-square&logo=vue.js)](https://github.com/vuejs/vue)
  [![Downloads](https://img.shields.io/npm/dt/overlayscrollbars-vue.svg?style=flat-square)](https://www.npmjs.com/package/overlayscrollbars-vue)
  [![Version](https://img.shields.io/npm/v/overlayscrollbars-vue.svg?style=flat-square)](https://www.npmjs.com/package/overlayscrollbars-vue)
  [![License](https://img.shields.io/github/license/kingsora/overlayscrollbars.svg?style=flat-square)](#)

</div>
<h3 align="center">
  <a href="https://kingsora.github.io/OverlayScrollbars">Website</a>
  &nbsp;&nbsp;&bull;&nbsp;&nbsp;
  <a href="https://kingsora.github.io/OverlayScrollbars/examples">Examples</a>
</h3>


# OverlayScrollbars for Vue

This is the official OverlayScrollbars Vue wrapper.

## Installation

```sh
npm install overlayscrollbars-vue
```

## Peer Dependencies

OverlayScrollbars for Vue has the following **peer dependencies**:

- The vanilla JavaScript library: [overlayscrollbars](https://www.npmjs.com/package/overlayscrollbars)

```
npm install overlayscrollbars
```

- The Vue framework: [vue](https://www.npmjs.com/package/vue)

```
npm install vue
```

## Usage

The first step is to import the CSS file into your app:
```ts
import 'overlayscrollbars/overlayscrollbars.css';
```

> __Note__: If the path `'overlayscrollbars/overlayscrollbars.css'` is not working use `'overlayscrollbars/styles/overlayscrollbars.css'` as the import path for the CSS file.

## Component

The main entry point is the `OverlayScrollbarsComponent` which can be used in your application as a component:

```jsx
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";

// ...

<OverlayScrollbarsComponent defer>
  example content
</OverlayScrollbarsComponent>
```

### Properties

It has optional properties:

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

Additionally to the `events` property the `OverlayScrollbarsComponent` emits "native" Vue events. To prevent name collisions with DOM events the events have a `os` prefix. 

> __Note__: It doesn't matter whether you use the `events` property or the Vue events or both.

```jsx
// example usage
<template>
  <OverlayScrollbarsComponent
    @os-initialized="onInitialized"
    @os-updated="onUpdated"
    @os-destroyed="onDestroyed"
    @os-scroll="onScroll"
  />
</template>
```

### Ref

The `ref` of the `OverlayScrollbarsComponent` will give you an object with which you can access the OverlayScrollbars `instance` and the root `element` of the component.  
The ref object has two properties:

- `osInstance`: a function which returns the OverlayScrollbars instance.
- `getElement`: a function which returns the root element.

## Composable

In case the `OverlayScrollbarsComponent` is not enough, you can also use the `useOverlayScrollbars` composable:

```jsx
import { useOverlayScrollbars } from "overlayscrollbars-vue";

// example usage
const Component = {
  setup() {
    const div = ref(null);
    const reactiveParams = reactive({ options, events, defer });
    const [initialize, instance] = useOverlayScrollbars(reactiveParams);

    /** 
     * or:
     * 
     * const params = ref();
     * const [initialize, instance] = useOverlayScrollbars(params);
     * 
     * or:
     * 
     * const options = ref();
     * const events = ref();
     * const defer = ref();
     * const [initialize, instance] = useOverlayScrollbars({
     *   options,
     *   events,
     *   defer,
     * });
     * 
     */

    onMounted(() => {
      initialize({ target: div.value });
    });

    return () => <div ref={div} />
  },
}
```

The composable is for advanced usage and lets you control the whole initialization process. This is useful if you want to integrate it with other plugins.

The composable will destroy the instance automatically if the component unmounts.

### Parameters

Parameters are optional and similar to the `OverlayScrollbarsComponent`.
Its an `object` with optional properties:

- `options`: accepts an `object` which represents the OverlayScrollbars options.
- `events`: accepts an `object` which represents the OverlayScrollbars events.
- `defer`: accepts an `boolean` or `object`. Defers the initialization to a point in time when the browser is idle.

> __Note__: The object can be a normal, `reactive` or `ref` object. This also applies to all fields.

### Return

The `useOverlayScrollbars` composable returns a `tuple` with two values:

- The first value is the `initialization` function, it takes one argument which is the `InitializationTarget`.
- The second value is a function which returns the current OverlayScrollbars instance or `null` if not initialized.

## License

MIT
