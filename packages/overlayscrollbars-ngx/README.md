<div align="center">
  <a href="https://kingsora.github.io/OverlayScrollbars"><img src="https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/logo/logo.png" width="160" height="160" alt="OverlayScrollbars"></a>
  <a href="https://github.com/angular/angular"><img src="https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/packages/overlayscrollbars-ngx/logo.svg" width="160" height="160" alt="Angular"></a>
</div>
<br />
<div align="center">

  [![OverlayScrollbars](https://img.shields.io/badge/OverlayScrollbars-%5E2.0.0-338EFF?style=flat-square)](https://github.com/KingSora/OverlayScrollbars)
  [![Angular](https://img.shields.io/badge/Angular-%3E=13.0.0-DD0031?style=flat-square&logo=Angular)](https://github.com/angular/angular)
  [![Downloads](https://img.shields.io/npm/dt/overlayscrollbars-ngx.svg?style=flat-square)](https://www.npmjs.com/package/overlayscrollbars-ngx)
  [![Version](https://img.shields.io/npm/v/overlayscrollbars-ngx.svg?style=flat-square)](https://www.npmjs.com/package/overlayscrollbars-ngx)
  [![License](https://img.shields.io/github/license/kingsora/overlayscrollbars.svg?style=flat-square)](#)

</div>
<h3 align="center">
  <a href="https://kingsora.github.io/OverlayScrollbars">Website</a>
  &nbsp;&nbsp;&bull;&nbsp;&nbsp;
  <a href="https://kingsora.github.io/OverlayScrollbars/examples">Examples</a>
</h3>

# OverlayScrollbars for Angular

This is the official OverlayScrollbars Angular wrapper.

## Installation

```sh
npm install overlayscrollbars-ngx
```

## Peer Dependencies

OverlayScrollbars for Angular has the following **peer dependencies**:

- The vanilla JavaScript library: [overlayscrollbars](https://www.npmjs.com/package/overlayscrollbars)

```
npm install overlayscrollbars
```

- The Angular framework: [@angular/core](https://www.npmjs.com/package/@angular/core) & [@angular/common](https://www.npmjs.com/package/@angular/common)

```
npm install @angular/core @angular/common
```

## Usage

The first step is to import the CSS file into your app:
```ts
import 'overlayscrollbars/overlayscrollbars.css';
```

> __Note__: If the path `'overlayscrollbars/overlayscrollbars.css'` is not working use `'overlayscrollbars/styles/overlayscrollbars.css'` as the import path for the CSS file.

The module can be imported like:

```js
import { NgModule } from "@angular/core";
import { OverlayscrollbarsModule } from "overlayscrollbars-ngx";

@NgModule({
  imports: [OverlayscrollbarsModule],
})
export class AppModule {}
```


## Component

The main entry point is the `OverlayScrollbarsComponent` which can be used in your application as a component:

```js
import { OverlayScrollbarsComponent } from "overlayscrollbars-ngx";
```

The component can be used with two different selectors:

```html
<overlay-scrollbars [defer]="true">
  The tag isn't important
</overlay-scrollbars>

<section overlay-scrollbars [defer]="true">
  Choose the tag
</section>
```

### Properties

The component accepts all properties of regular elements such as `div` and `span`.
Additionally it has custom optional properties:

- `options`: accepts an `object` which represents the OverlayScrollbars options.
- `events`: accepts an `object` which represents the OverlayScrollbars events.
- `defer`: accepts an `boolean` or `object`. Defers the initialization to a point in time when the browser is idle.

> __Note__: Its **highly recommended** to use the `defer` option whenever possible to defer the initialization to a browser's idle period.

```html
<!-- example usage -->
<overlay-scrollbars
  [options]="{ scrollbars: { autoHide: 'scroll' } }"
  [events]="{ scroll: () => { /* ... */ } }"
  [defer]="true"
></overlay-scrollbars>
```

### Events

Additionally to the `events` property the `OverlayScrollbarsComponent` emits "native" Angular events. To prevent name collisions with DOM events the events have a `os` prefix. 

> __Note__: It doesn't matter whether you use the `events` property or the Angular events or both.

```html
<!-- example usage -->
<div
  overlay-scrollbars
  (osInitialized)="onInitialized"
  (osUpdated)="onUpdated"
  (osDestroyed)="onDestroyed"
  (osScroll)="onScroll"
></div>
```

All events are typed, but you can use the `EventListenerArgs` type as utility in case its needed:

```ts
import type { EventListenerArgs } from 'overlayscrollbars';

// example listener
const onUpdated = ([instance, onUpdatedArgs]: EventListenerArgs['updated']) => {}
```

### Ref

The `ref` of the `OverlayScrollbarsComponent` will give you an object with which you can access the OverlayScrollbars `instance` and the root `element` of the component.  
The ref object has two properties:

- `osInstance`: a function which returns the OverlayScrollbars instance.
- `getElement`: a function which returns the root element.

## Directive

In case the `OverlayScrollbarsComponent` is not enough, you can also use the `OverlayScrollbarsDirective` directive:

```js
import { OverlayScrollbarsDirective } from "overlayscrollbars-ngx";
```

```html
<!-- example usage -->
<div overlayScrollbars></div>
```

The directive is for advanced usage and lets you control the whole initialization process. This is useful if you want to integrate it with other plugins.

> __Note__: The directive won't initialize OverlayScrollbars on its own. You have to call the `initialize` function.

### Properties

Properties are optional and similar to the `OverlayScrollbarsComponent`.

- `options`: accepts an `object` which represents the OverlayScrollbars options.
- `events`: accepts an `object` which represents the OverlayScrollbars events.
- `defer`: accepts an `boolean` or `object`. Defers the initialization to a point in time when the browser is idle.

### Instance

The `OverlayScrollbarsDirective` exposes two functions:

- `osInitialize` takes one argument which is the `InitializationTarget`.
- `osInstance` returns the current OverlayScrollbars instance or `null` if not initialized.

## License

MIT
