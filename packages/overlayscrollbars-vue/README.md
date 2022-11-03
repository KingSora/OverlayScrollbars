<div align="center">
  <a href="https://kingsora.github.io/OverlayScrollbars">
    <img src="https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/logo/logo.png" width="160" height="160" alt="OverlayScrollbars">
  </a>
  <a href="https://vuejs.org/">
    <img src="https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/packages/overlayscrollbars-vue/logo.svg" width="160" height="160" alt="Vue">
  </a>
</div>
<h6 align="center">
    <a href="https://github.com/KingSora/OverlayScrollbars">
      <img src="https://img.shields.io/badge/OverlayScrollbars-%5E2.0.0-338EFF?style=flat-square" alt="OverlayScrollbars">
    </a>
    <a href="https://github.com/vuejs/vue">
      <img src="https://img.shields.io/badge/Vue-%5E3.2.25-41B883?style=flat-square&logo=vue.js" alt="Vue">
    </a>
    <a href="https://www.npmjs.com/package/overlayscrollbars-vue">
      <img src="https://img.shields.io/npm/dt/overlayscrollbars-vue.svg?style=flat-square" alt="Downloads">
    </a>
    <a href="https://www.npmjs.com/package/overlayscrollbars-vue">
      <img src="https://img.shields.io/npm/v/overlayscrollbars-vue.svg?style=flat-square" alt="Version">
    </a>
    <a href="https://github.com/KingSora/OverlayScrollbars/blob/master/packages/overlayscrollbars-vue/LICENSE">
      <img src="https://img.shields.io/github/license/kingsora/overlayscrollbars.svg?style=flat-square" alt="License">
    </a>
</h6>

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

### Ref

The `ref` of the `OverlayScrollbarsComponent` will give you an object with which you can access the OverlayScrollbars `instance` and the root `element` of the component.  
The ref object has two properties:

- `instance`: a function which returns the OverlayScrollbars instance.
- `element`: a function which returns the root element.

## Composable

In case the `OverlayScrollbarsComponent` is not enough, you can also use the `useOverlayScrollbars` composable:

```jsx
import { useOverlayScrollbars } from "overlayscrollbars-vue";

// example usage
const Component = {
  setup() {
    const params = reactive({});
    const [initialize, instance] = useOverlayScrollbars(params);
    const div = ref(null);

    onMounted(() => {
      initialize({ target: div.value });
    });

    onBeforeUnmount(() => {
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
