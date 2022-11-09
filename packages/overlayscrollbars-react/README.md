<div align="center">
  <a href="https://kingsora.github.io/OverlayScrollbars">
    <img src="https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/logo/logo.png" width="160" height="160" alt="OverlayScrollbars">
  </a>
  <a href="https://reactjs.org">
    <img src="https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/packages/overlayscrollbars-react/logo.svg" width="160" height="160" alt="React">
  </a>
</div>
<h6 align="center">
    <a href="https://github.com/KingSora/OverlayScrollbars">
      <img src="https://img.shields.io/badge/OverlayScrollbars-%5E2.0.0-338EFF?style=flat-square" alt="OverlayScrollbars">
    </a>
    <a href="https://github.com/facebook/react/">
      <img src="https://img.shields.io/badge/React-%3E=16.8.0-61DAFB?style=flat-square&logo=React" alt="React">
    </a>
    <a href="https://www.npmjs.com/package/overlayscrollbars-react">
      <img src="https://img.shields.io/npm/dt/overlayscrollbars-react.svg?style=flat-square" alt="Downloads">
    </a>
    <a href="https://www.npmjs.com/package/overlayscrollbars-react">
      <img src="https://img.shields.io/npm/v/overlayscrollbars-react.svg?style=flat-square" alt="Version">
    </a>
    <a href="#">
      <img src="https://img.shields.io/github/license/kingsora/overlayscrollbars.svg?style=flat-square" alt="License">
    </a>
</h6>

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

> __Note__: In older node versions use `'overlayscrollbars/styles/overlayscrollbars.css'` as the import path for the CSS file.

## Component

The main entry point is the `OverlayScrollbarsComponent` which can be used in your application as a component:

```jsx
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

// ...

<OverlayScrollbarsComponent>
  example content
</OverlayScrollbarsComponent>
```

### Properties

The component accepts all properties of intrinsic JSX elements such as `div` and `span`.  
Additionally it has three optional properties: `element`, `options` and `events`.

- `element`: accepts a `string` which represents the tag of the root element.
- `options`: accepts an `object` which represents the OverlayScrollbars options.
- `events`: accepts an `object` which represents the OverlayScrollbars events.

> __Note__: None of the properties has to be memoized.

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

## Hook

In case the `OverlayScrollbarsComponent` is not enough, you can also use the `useOverlayScrollbars` hook:

```jsx
import { useOverlayScrollbars } from "overlayscrollbars-react";

// example usage
const Component = () => {
  const ref = useRef();
  const [initialize, instance] = useOverlayScrollbars({ options, events });
  
  useEffect(() => {
    const osInstance = initialize(ref.current);
    return () => osInstance.destroy();
  }, [initialize]);
  
  return <div ref={ref} />
}
```

The hook is for advanced usage and lets you control the whole initialization process. This is useful if you want to integrate it with other plugins such as `react-window` or `react-virtualized`.

### Parameters

Parameters are optional and similar to the `OverlayScrollbarsComponent`.
Its an `object` with two optional properties:

- `options`: accepts an `object` which represents the OverlayScrollbars options.
- `events`: accepts an `object` which represents the OverlayScrollbars events.

### Return

The `useOverlayScrollbars` hook returns a `tuple` with two values:

- The first value is the `initialization` function, it takes one argument which is the `InitializationTarget` and returns the OverlayScrollbars instance.
- The second value is a function which returns the current OverlayScrollbars instance or `null` if not initialized.

> __Note__: The identity of both functions is stable and won't change, thus they can safely be used in any dependency array.

## License

MIT
