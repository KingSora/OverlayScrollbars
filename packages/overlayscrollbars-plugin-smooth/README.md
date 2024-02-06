<div align="center">
  <a href="https://kingsora.github.io/OverlayScrollbars"><img src="https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/logo/logo.png" width="160" height="160" alt="OverlayScrollbars"></a>
  <a href="https://reactjs.org"><img src="https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/packages/overlayscrollbars-react/logo.svg" width="160" height="160" alt="React"></a>
</div>
<br />
<div align="center">

  [![OverlayScrollbars](https://img.shields.io/badge/OverlayScrollbars-%5E2.0.0-338EFF?style=flat-square)](https://github.com/KingSora/OverlayScrollbars)
  [![React](https://img.shields.io/badge/React-%3E=16.8.0-61DAFB?style=flat-square&logo=React)](https://github.com/facebook/react/)
  [![Downloads](https://img.shields.io/npm/dt/overlayscrollbars-react.svg?style=flat-square)](https://www.npmjs.com/package/overlayscrollbars-react)
  [![Version](https://img.shields.io/npm/v/overlayscrollbars-react.svg?style=flat-square)](https://www.npmjs.com/package/overlayscrollbars-react)
  [![License](https://img.shields.io/github/license/kingsora/overlayscrollbars.svg?style=flat-square)](#)

</div>
<h3 align="center">
  <a href="https://kingsora.github.io/OverlayScrollbars">Website</a>
  &nbsp;&nbsp;&bull;&nbsp;&nbsp;
  <a href="https://kingsora.github.io/OverlayScrollbars/examples">Examples</a>
</h3>

# OverlayScrollbars for React

This is the official OverlayScrollbars React wrapper.

## Installation

```sh
npm install overlayscrollbars-react
```

## Peer Dependencies

OverlayScrollbars for React has the following **peer dependencies**:

- The vanilla JavaScript library: [overlayscrollbars](https://www.npmjs.com/package/overlayscrollbars)

```
npm install overlayscrollbars
```

- The React framework: [react](https://www.npmjs.com/package/react)

```
npm install react
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
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

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

> __Note__: None of the properties has to be memoized.

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

### Ref

The `ref` of the `OverlayScrollbarsComponent` will give you an object with which you can access the OverlayScrollbars `instance` and the root `element` of the component.  
The ref object has two properties:

- `osInstance`: a function which returns the OverlayScrollbars instance.
- `getElement`: a function which returns the root element.

## Hook

In case the `OverlayScrollbarsComponent` is not enough, you can also use the `useOverlayScrollbars` hook:

```jsx
import { useOverlayScrollbars } from "overlayscrollbars-react";

// example usage
const Component = () => {
  const ref = useRef();
  const [initialize, instance] = useOverlayScrollbars({ options, events, defer });
  
  useEffect(() => {
    initialize(ref.current);
  }, [initialize]);
  
  return <div ref={ref} />
}
```

The hook is for advanced usage and lets you control the whole initialization process. This is useful if you want to integrate it with other plugins such as `react-window` or `react-virtualized`.

The hook will destroy the instance automatically if the component unmounts.

### Parameters

Parameters are optional and similar to the `OverlayScrollbarsComponent`.
Its an `object` with optional properties:

- `options`: accepts an `object` which represents the OverlayScrollbars options.
- `events`: accepts an `object` which represents the OverlayScrollbars events.
- `defer`: accepts an `boolean` or `object`. Defers the initialization to a point in time when the browser is idle.

### Return

The `useOverlayScrollbars` hook returns a `tuple` with two values:

- The first value is the `initialization` function, it takes one argument which is the `InitializationTarget`.
- The second value is a function which returns the current OverlayScrollbars instance or `null` if not initialized.

> __Note__: The identity of both functions is stable and won't change, thus they can safely be used in any dependency array.

## License

MIT
