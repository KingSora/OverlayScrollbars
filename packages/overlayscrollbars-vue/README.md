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

> __Note__: In older node versions use `'overlayscrollbars/styles/overlayscrollbars.css'` as the import path for the CSS file.

## Component

The main entry point is the `OverlayScrollbarsComponent` which can be used in your application as a component:

```jsx
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";

// ...

<OverlayScrollbarsComponent>
  example content
</OverlayScrollbarsComponent>
```

### Properties

It has three optional properties: `element`, `options` and `events`.

- `element`: accepts a `string` which represents the tag of the root element.
- `options`: accepts an `object` which represents the OverlayScrollbars options.
- `events`: accepts an `object` which represents the OverlayScrollbars events.

```jsx
// example usage
<OverlayScrollbarsComponent
  element="span"
  options={{ scrollbars: { autoHide: 'scroll' } }}
  events={{ scroll: () => { /* ... */ } }}
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
    const reactiveParams = reactive({ options, events });
    const [initialize, instance] = useOverlayScrollbars(reactiveParams);
    const div = ref(null);

    onMounted(() => {
      initialize({ target: div.value });
    });

    onUnmounted(() => {
      instance().destroy();
    });

    return () => <div ref={div} />
  },
}
```

The composable is for advanced usage and lets you control the whole initialization process. This is useful if you want to integrate it with other plugins.

### Parameters

Parameters are optional and similar to the `OverlayScrollbarsComponent`.
Its an `object` with two optional properties:

- `options`: accepts an `object` which represents the OverlayScrollbars options.
- `events`: accepts an `object` which represents the OverlayScrollbars events.

> __Note__: The object can be a normal, `reactive` or `ref` object. This also applies to the `options` and `events` fields.

### Return

The `useOverlayScrollbars` composable returns a `tuple` with two values:

- The first value is the `initialization` function, it takes one argument which is the `InitializationTarget` and returns the OverlayScrollbars instance.
- The second value is a function which returns the current OverlayScrollbars instance or `null` if not initialized.

## License

MIT
