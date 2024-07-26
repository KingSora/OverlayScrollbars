<div align="center">
  <a href="https://kingsora.github.io/OverlayScrollbars">
    <img src="https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/logo/logo.png" width="160" height="160" alt="OverlayScrollbars">
  </a>
</div>
<br />
<div align="center">

  [![Downloads](https://img.shields.io/npm/dm/overlayscrollbars.svg?style=flat-square)](https://www.npmjs.com/package/overlayscrollbars)
  [![Version](https://img.shields.io/npm/v/overlayscrollbars.svg?style=flat-square)](https://www.npmjs.com/package/overlayscrollbars)
  [![License](https://img.shields.io/github/license/kingsora/overlayscrollbars.svg?style=flat-square)](https://github.com/KingSora/OverlayScrollbars/blob/master/LICENSE)
  [![Code Coverage](https://img.shields.io/codecov/c/github/KingSora/OverlayScrollbars?style=flat-square)](https://app.codecov.io/gh/KingSora/OverlayScrollbars)
  [![Max. Bundle Size](https://img.shields.io/bundlephobia/minzip/overlayscrollbars?label=max.%20bundle%20size&style=flat-square)](https://bundlephobia.com/package/overlayscrollbars)
  
</div>
<h3 align="center">
  <a href="https://kingsora.github.io/OverlayScrollbars">Website</a>
  &nbsp;&nbsp;&bull;&nbsp;&nbsp;
  <a href="https://kingsora.github.io/OverlayScrollbars/examples">Examples</a>
</h3>

# OverlayScrollbars

> A javascript scrollbar plugin that hides the native scrollbars, provides custom styleable overlay scrollbars, and preserves the native functionality and feel.

## Why?

I created this plugin because I hate ugly and space-consuming scrollbars. Similar plugins didn't meet my requirements in terms of features, quality, simplicity, license or browser support.

## Goals & Features

 - Simple, powerful and well-documented API.
 - High browser compatibility - **Firefox 59+**, **Chrome 55+**, **Opera 42+**, **Edge 15+** and **Safari 10+**.
 - **Fully Accessible** - Native scrolling behavior is fully preserved.
 - Can run on the server (`Node`, `Deno` and `Bun`) - **SSR**, **SSG** and **ISR** support.
 - Tested on various devices - **Mobile**, **Desktop** and **Tablet**.
 - Tested with various (and mixed) inputs - **Mouse**, **Touch** and **Pen**.
 - **Treeshaking** - bundle only what you really need.
 - Automatic update detection - **no polling required**.
 - Leverage latest browser features - best performance in new browsers.
 - Flow independent - supports all values for `direction`, `flex-direction` and `writing-mode`.
 - Supports scroll snapping.
 - Supports all **virtual scrolling** libraries.
 - Supports the `body' element.
 - Easy and effective scrollbar styling.
 - Highly customizable.
 - TypeScript support - completely written in TypeScript.
 - Dependency-free - 100% self-written to ensure small size and best functionality.
 - High quality and fully typed framework versions for [`react`](https://github.com/KingSora/OverlayScrollbars/tree/master/packages/overlayscrollbars-react), [`vue`](https://github.com/KingSora/OverlayScrollbars/tree/master/packages/overlayscrollbars-vue), [`angular`](https://github.com/KingSora/OverlayScrollbars/tree/master/packages/overlayscrollbars-ngx), [`svelte`](https://github.com/KingSora/OverlayScrollbars/tree/master/packages/overlayscrollbars-svelte) and [`solid`](https://github.com/KingSora/OverlayScrollbars/tree/master/packages/overlayscrollbars-solid).

## Choose your framework

In addition to the vanilla JavaScript version, you can use the official framework components & utilities:

<a href="https://github.com/KingSora/OverlayScrollbars/tree/master/packages/overlayscrollbars-react"><img src="https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/packages/overlayscrollbars-react/logo.svg" width="80" height="80" alt="React"></a>
<a href="https://github.com/KingSora/OverlayScrollbars/tree/master/packages/overlayscrollbars-vue"><img src="https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/packages/overlayscrollbars-vue/logo.svg" width="80" height="80" alt="Vue"></a>
<a href="https://github.com/KingSora/OverlayScrollbars/tree/master/packages/overlayscrollbars-ngx"><img src="https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/packages/overlayscrollbars-ngx/logo.svg" width="80" height="80" alt="Angular"></a>
<a href="https://github.com/KingSora/OverlayScrollbars/tree/master/packages/overlayscrollbars-svelte"><img src="https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/packages/overlayscrollbars-svelte/logo.svg" width="80" height="80" alt="Svelte"></a>
<a href="https://github.com/KingSora/OverlayScrollbars/tree/master/packages/overlayscrollbars-solid"><img src="https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/packages/overlayscrollbars-solid/logo.svg" width="80" height="80" alt="Solid"></a>

## Getting started

### npm & nodejs

OverlayScrollbars can be downloaded from [npm](https://www.npmjs.com/package/overlayscrollbars) or the package manager of your choice:
```sh
npm install overlayscrollbars
```
Once installed, it can be imported:
```js
import 'overlayscrollbars/overlayscrollbars.css';
import { 
  OverlayScrollbars, 
  ScrollbarsHidingPlugin, 
  SizeObserverPlugin, 
  ClickScrollPlugin 
} from 'overlayscrollbars';
```

> __Note__: If the path `'overlayscrollbars/overlayscrollbars.css'` is not working use `'overlayscrollbars/styles/overlayscrollbars.css'` as the import path for the CSS file.

You can use this [Node Example](https://github.com/KingSora/OverlayScrollbars/tree/master/examples/node) as an reference / starting point.

### Manual Download & Embedding

You can use OverlayScrollbars without any bundler or package manager.  
Simply download one of the [Releases](https://github.com/KingSora/OverlayScrollbars/releases) or use a [CDN](https://cdnjs.com/libraries/overlayscrollbars).

- Use the javascript files with the `.browser` extension.
- Use the javascript files with the `.es5` extension if you need to support older browsers, otherwise use the `.es6` files.
- For production use the javascript / stylesheet files with the `.min` extension. 

Embed OverlayScrollbars manually in your HTML:
```html
<link type="text/css" href="path/to/overlayscrollbars.css" rel="stylesheet" />
<script type="text/javascript" src="path/to/overlayscrollbars.browser.es.js" defer></script>
```

Use the global variable `OverlayScrollbarsGlobal` to access the api similar to how you can do it in nodejs / modules:
```js
var { 
  OverlayScrollbars, 
  ScrollbarsHidingPlugin, 
  SizeObserverPlugin, 
  ClickScrollPlugin  
} = OverlayScrollbarsGlobal;
```

You can use this [Browser Example](https://github.com/KingSora/OverlayScrollbars/tree/master/examples/browser) as an reference or a starting point.

The examples in this documentation use the `import` syntax instead of the `OverlayScrollbarsGlobal` object. However, both versions are equivalent.

## Initialization

The initialization of `OverlayScrollbars` is explicit _per element_. Only the scrollbars of the element on which the plugin is initialized will be changed. Scrollbars of child elements will remain unchanged unless the plugin is initialized on them as well.

You can either initialize a new instance directly with an `Element` or with an `Object` where you have more control over the initialization process. 

```js
// Simple initialization with an element
const osInstance = OverlayScrollbars(document.querySelector('#myElement'), {});
```

### Bridging initialization flickering

When you initialize OverlayScrollbars, it takes a few milliseconds to create and append all the elements to the DOM. During this time, the native scrollbars are still visible and will be switched out after the initialization is finished. This is seen as flickering. 

To fix this behavior apply the `data-overlayscrollbars-initialize` attribute to the target element (and the `html` element as well when initializing a scrollbar for the `body` element).

```html
<!-- for the body element -->
<html data-overlayscrollbars-initialize>
  <head></head>
  <body data-overlayscrollbars-initialize></body>
</html>

<!-- for all other elements -->
<div data-overlayscrollbars-initialize>
  OverlayScrollbars is applied to this div
</div>
```

### Initialization with an Object
<details>
  <summary>
    This is an in depth topic. Click here to read it.
  </summary>
  <br />
  
The only required field is the `target` field. This is the field to which the plugin will be applied.  
If you use the object initialization with only the `target` field, the result is equivalent to the element initialization:
```js
// Both initializations have the same outcome

OverlayScrollbars(document.querySelector('#myElement'), {});
OverlayScrollbars({ target: document.querySelector('#myElement') }, {});
```

When initializing with an object you can specify how the library handles generated elements.
For example, you can specify an existing element as the `viewport' element. Then the library won't generate it, but use the specified element instead:

 ```js
OverlayScrollbars({ 
  target: document.querySelector('#target'),
  elements: {
    viewport: document.querySelector('#viewport'),
  },
}, {});
```

This is very useful if you have a fixed DOM structure and don't want OverlayScrollbars to create its own elements. These cases are very common when you want another library to work with OverlayScrollbars.

---

You can also decide to which element the scrollbars should be applied to:

 ```js
OverlayScrollbars({ 
  target: document.querySelector('#target'),
  scrollbars: {
    slot: document.querySelector('#target').parentElement,
  },
}, {});
```

---

Last but not least, you can decide when to cancel the initialization:

 ```js
OverlayScrollbars({ 
  target: document.querySelector('#target'),
  cancel: {
    nativeScrollbarsOverlaid: true,
    body: null,
  }
}, {});
```

In the above example, the initialization will be aborted if the native scrollbars are overlaid, or if your target is a `body` element and the plugin has determined that initializing to the `body` element would interfere with native functionality such as `window.scrollTo`.

</details>

## Options

You can initialize OverlayScrollbars with an initial set of options, which can be changed at any time with the `options` method:
```js
const instance = OverlayScrollbars(document.querySelector('#myElement'), {
  overflow: {
    x: 'hidden',
  },
});
```

### Options in depth
<details>
  <summary>
    This is an in depth topic. Click here to read it.
  </summary>
  <br />

The default options are:
```js
const defaultOptions = {
  paddingAbsolute: false,
  showNativeOverlaidScrollbars: false,
  update: {
    elementEvents: [['img', 'load']],
    debounce: [0, 33],
    attributes: null,
    ignoreMutation: null,
  },
  overflow: {
    x: 'scroll',
    y: 'scroll',
  },
  scrollbars: {
    theme: 'os-theme-dark',
    visibility: 'auto',
    autoHide: 'never',
    autoHideDelay: 1300,
    autoHideSuspend: false,
    dragScroll: true,
    clickScroll: false,
    pointers: ['mouse', 'touch', 'pen'],
  },
};
```

### `paddingAbsolute`

| type  | default |
| :--- | :--- |
| `boolean` | `false` |

Indicates whether the padding for the content should be absolute.

### `showNativeOverlaidScrollbars`

| type  | default |
| :--- | :--- |
| `boolean` | `false` |

Indicates whether the native overlaid scrollbars should be visible.

### `update.elementEvents`

| type  | default |
| :--- | :--- |
| `Array<[string, string]> \| null` | `[['img', 'load']]` |

An array of tuples. The first value in the tuple is an `selector` and the second value are `event names`. The plugin will update itself if any of the elements with the specified selector emits any of the specified events. The default value can be interpreted as "The plugin will update itself if any `img` element emits a `load` event."

### `update.debounce`

| type  | default |
| :--- | :--- |
| `[number, number] \| number \| null` | `[0, 33]` |

> __Note__: If 0 is used for the timeout, `requestAnimationFrame` will be used instead of `setTimeout` for the debounce.

Debounces the `MutationObserver` which tracks changes to the content. If a **tuple** is passed, the first value is the timeout and second is the max wait. If only a **number** it is treated as the timeout and there is no max wait. With **null** there is no debounce. **Useful to fine-tune performance.**

### `update.attributes`

| type  | default |
| :--- | :--- |
| `string[] \| null` | `null` |

> __Note__: There is a base array of attributes that the `MutationObserver` always observes, even if this option is `null`.

An array of additional attributes that the `MutationObserver` should observe the content for. 

### `update.ignoreMutation`

| type  | default |
| :--- | :--- |
| `((mutation) => any) \| null` | `null` |

A function which receives a [`MutationRecord`](https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord) as an argument. If the function returns a truthy value the mutation will be ignored and the plugin won't update. **Useful to fine-tune performance.**

### `overflow.x`

| type  | default |
| :--- | :--- |
| `string` | `'scroll'` |

> __Note__: Valid values are: `'hidden'`, `'scroll'`, `'visible'`, `'visible-hidden'` and `'visible-scroll'`.

The overflow behavior for the horizontal (x) axis.

### `overflow.y`

| type  | default |
| :--- | :--- |
| `string` | `'scroll'` |

> __Note__: Valid values are: `'hidden'`, `'scroll'`, `'visible'`, `'visible-hidden'` and `'visible-scroll'`.

The overflow behavior for the vertical (y) axis.

### `scrollbars.theme`

| type  | default |
| :--- | :--- |
| `string \| null` | `'os-theme-dark'` |

Applies the specified theme (classname) to the scrollbars.

### `scrollbars.visibility`

| type  | default |
| :--- | :--- |
| `string` | `'auto'` |

> __Note__: Valid values are: `'visible'`, `'hidden'`, and `'auto'`.

The visibility of a scrollbar if its scroll axis is able to have a scrollable overflow. (Scrollable overflow for an axis is only possible with the overflow behavior set to `'scroll'` or `'visible-scroll'`).

### `scrollbars.autoHide`

| type  | default |
| :--- | :--- |
| `string` | `'never'` |

> __Note__: Valid values are: `'never'`, `'scroll'`, `'leave'` and `'move'`.

Dictates whether to hide visible scrollbars automatically after a certain user action.

### `scrollbars.autoHideDelay`

| type  | default |
| :--- | :--- |
| `number` | `1300` |

The delay in milliseconds before the scrollbars are automatically hidden.

### `scrollbars.autoHideSuspend`

| type  | default | 
| :--- | :--- |
| `boolean` | `false` |

Suspend the autoHide functionality until the first scroll interaction is performed.  
The default value for this option is `false` for backwards compatibility reasons but is recommended to be `true` for better accessibility.

### `scrollbars.dragScroll`

| type  | default |
| :--- | :--- |
| `boolean` | `true` |

Indicates whether you can drag the scrollbar handles for scrolling.

### `scrollbars.clickScroll`

| type  | default |
| :--- | :--- |
| `boolean` | `false` |

> __Note__: This options requires the **ClickScrollPlugin** to work.

Indicates whether you can click on the scrollbar track for scrolling.

### `scrollbars.pointers`

| type  | default |
| :--- | :--- |
| `string[] \| null` | `['mouse', 'touch', 'pen']` |

The [`PointerTypes`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType) the plugin should react to.

#### TypeScript 

```ts
// The options of a OverlayScrollbars instance.
type Options = {
  // Whether the padding should be absolute.
  paddingAbsolute: boolean;
  // Whether to show the native scrollbars. Has effect only if the native scrollbars are overlaid.
  showNativeOverlaidScrollbars: boolean;
  // Customizes the automatic update behavior.
  update: {
    /**
     * The given Event(s) from the elements with the given selector(s) will trigger an update.
     * Useful for everything the MutationObserver and ResizeObserver can't detect
     * e.g.: An image's `load` event or the `transitionend` / `animationend` events.
     */
    elementEvents: Array<[elementSelector: string, eventNames: string]> | null;
    /**
     * The debounce which is used to detect content changes.
     * If a tuple is provided you can customize the `timeout` and the `maxWait` in milliseconds.
     * If a single number customizes only the `timeout`.
     *
     * If the `timeout` is `0`, a debounce still exists (and is done via `requestAnimationFrame` instead of `setTimeout`).
     */
    debounce: [timeout: number, maxWait: number] | number | null;
    /**
     * HTML attributes which will trigger an update if they're changed.
     * Basic attributes like `id`, `class`, `style` etc. are always observed and don't have to be added explicitly.
     */
    attributes: string[] | null;
    // A function which makes it possible to ignore a content mutation or null if nothing should be ignored.
    ignoreMutation: ((mutation: MutationRecord) => any) | null;
  };
  // Customizes the overflow behavior per axis.
  overflow: {
    // The overflow behavior of the horizontal (x) axis.
    x: OverflowBehavior;
    // The overflow behavior of the vertical (y) axis.
    y: OverflowBehavior;
  };
  // Customizes appearance of the scrollbars.
  scrollbars: {
    // The scrollbar's theme. The theme value will be added as `class` to all `scrollbar` elements of the instance.
    theme: string | null;
    // The scrollbar's visibility behavior.
    visibility: ScrollbarsVisibilityBehavior;
    // The scrollbar's auto hide behavior.
    autoHide: ScrollbarsAutoHideBehavior;
    // The scrollbar's auto hide delay in milliseconds.
    autoHideDelay: number;
    // Whether the scrollbar's auto hide behavior is suspended until a scroll happened.
    autoHideSuspend: boolean;
    // Whether its possible to drag the handle of a scrollbar to scroll the viewport.
    dragScroll: boolean;
    // Whether its possible to click the track of a scrollbar to scroll the viewport.
    clickScroll: boolean;
    // An array of pointer types that shall be supported.
    pointers: string[] | null;
  };
};
```

</details>

## Events

You can initialize OverlayScrollbars with an initial set of events, which can be managed at any time with the `on` and `off` methods:
```js
OverlayScrollbars(document.querySelector('#myElement'), {}, {
  updated(osInstance, onUpdatedArgs) {
    // ...
  }
});
```

### Events in depth

<details>
  <summary>
    This is an in depth topic. Click here to read it.
  </summary>
  <br />

> __Note__: Every event receives the `instance` from which it was dispatched as the first argument. Always.

### `initialized`

| arguments  | description |
| :--- | :--- |
| `instance` | The instance which dispatched the event. |

Dispatched after all generated elements, observers and events were appended to the DOM.

### `updated`

| arguments  | description |
| :--- | :--- |
| `instance` | The instance which dispatched the event. |
| `onUpdatedArgs` | An `object` which describes the update in detail. |

> __Note__: If an update was triggered but nothing changed, the event won't be dispatched.

Dispatched after the instance was updated. 

### `destroyed`

| arguments  | description |
| :--- | :--- |
| `instance` | The instance which dispatched the event. |
| `canceled` | A `boolean` which indicates whether the initialization was canceled and thus destroyed. |

Dispatched after all generated elements, observers and events were removed from the DOM.

### `scroll`

| arguments  | description |
| :--- | :--- |
| `instance` | The instance which dispatched the event. |
| `event` | The original `event` argument of the DOM event. |

Dispatched by scrolling the viewport.

#### TypeScript 

```ts
// A mapping between event names and their listener arguments.
type EventListenerArgs = {
  // Dispatched after all elements are initialized and appended.
  initialized: [instance: OverlayScrollbars];
  // Dispatched after an update.
  updated: [instance: OverlayScrollbars, onUpdatedArgs: OnUpdatedEventListenerArgs];
  // Dispatched after all elements, observers and events are destroyed.
  destroyed: [instance: OverlayScrollbars, canceled: boolean];
  // Dispatched on scroll.
  scroll: [instance: OverlayScrollbars, event: Event];
};

interface OnUpdatedEventListenerArgs {
  // Hints which describe what changed in the DOM.
  updateHints: {
    // Whether the size of the host element changed.
    sizeChanged: boolean;
    // Whether the direction of the host element changed.
    directionChanged: boolean;
    // Whether the intrinsic height behavior changed.
    heightIntrinsicChanged: boolean;
    // Whether the overflow edge (clientWidth / clientHeight) of the viewport element changed.
    overflowEdgeChanged: boolean;
    // Whether the overflow amount changed.
    overflowAmountChanged: boolean;
    // Whether the overflow style changed.
    overflowStyleChanged: boolean;
    // Whether the scroll coordinates changed.
    scrollCoordinatesChanged: boolean;
    // Whether an host mutation took place.
    hostMutation: boolean;
    // Whether an content mutation took place.
    contentMutation: boolean;
  };
  // The changed options.
  changedOptions: PartialOptions;
  // Whether the update happened with force-invalidated cache.
  force: boolean;
}
```

</details>

## Instance

The OverlayScrollbars instance can be created by calling the `OverlayScrollbars` function with an element and options object.

```js
const osInstance = OverlayScrollbars(document.body, {});
```

### Instance Methods

<details>
  <summary>
    This is an in depth topic. Click here to read it.
  </summary>

  ### `options(): Options`

  Get the current options of the instance.

  | returns | description |
  | :--- | :--- |
  | `Options` | The current options. |

  ### `options(newOptions, pure?): Options`

  Sets the current options of the instance.

  | parameter | type | description |
  | :--- | :--- | :--- |
  | newOptions | `PartialOptions` | The new (partial) options which should be applied. |
  | pure | `boolean / undefined` | Whether the options should be reset before the new options are added. |

  | returns | description |
  | :--- | :--- |
  | `Options` | The complete new options. |

  ### `on(eventListeners, pure?): Function`

  Adds event listeners to the instance.

  | parameter | type | description |
  | :--- | :--- | :--- |
  | eventListeners | `EventListeners` | An object which contains the added listeners. The fields are the event names and the listeners. |
  | pure | `boolean / undefined` | Whether all already added event listeners should be removed before the new listeners are added. |

  | returns | description |
  | :--- | :--- |
  | `Function` | A function which removes all added event listeners. |

  ### `on(name, listener): Function`

  Adds a single event listener to the instance.

  | parameter | type | description |
  | :--- | :--- | :--- |
  | name | `string` | The event name. |
  | listener | `Function` | The function invoked when the event is dispatched. |

  | returns | description |
  | :--- | :--- |
  | `Function` | A function which removes the added event listener. |
  
  ### `on(name, listeners): Function`

  Adds multiple event listeners to the instance.

  | parameter | type | description |
  | :--- | :--- | :--- |
  | name | `string` | The event name. |
  | listeners | `Function[]` | The functions invoked when the event is dispatched. |

  | returns | description |
  | :--- | :--- |
  | `Function` | A function which removes the added event listeners. |

  ### `off(name, listener): void`

  Removes a single event listener from the instance.

  | parameter | type | description |
  | :--- | :--- | :--- |
  | name | `string` | The event name. |
  | listener | `Function` | The function to be removed. |

  ### `off(name, listeners): void`

  Removes multiple event listeners from the instance.

  | parameter | type | description |
  | :--- | :--- | :--- |
  | name | `string` | The event name. |
  | listeners | `Function[]` | The functions to be removed. |

  ### `update(force?): boolean`

  Updates the instance.

  | parameter | type | description |
  | :--- | :--- | :--- |
  | force | `boolean / undefined` |  Whether the update should force the cache to be invalidated. |

  | returns | description |
  | :--- | :--- |
  | `Function` | A boolean which indicates whether the `update` event was triggered through this update. |

  ### `state(): State`

  Gets the instance's state.

  | returns | description |
  | :--- | :--- |
  | `State` | An object describing the state of the instance. |

  ### `elements(): Elements`

  Gets the instances elements.

  | returns | description |
  | :--- | :--- |
  | `Elements` | An object describing the elements of the instance. |

  ### `destroy(): void`

  Destroys the instance and removes all added elements.

  ### `plugin(plugin: object): object | undefined`

  Gets the instance modules instance of the passed plugin.

  | returns | description |
  | :--- | :--- |
  | `object / undefined` | An object which describes the plugins instance modules instance or `undefined` if no instance was found. |

  #### TypeScript 

  ```ts
  // A simplified version of the OverlayScrollbars TypeScript interface.
  interface OverlayScrollbars {
    // Get the current options of the instance.
    options(): Options;
    // Sets the current options of the instance.
    options(newOptions: PartialOptions, pure?: boolean): Options;

    // Adds event listeners to the instance.
    on(eventListeners: EventListeners, pure?: boolean): () => void;
    // Adds a single event listener to the instance.
    on<N extends keyof EventListenerArgs>(name: N, listener: EventListener<N>): () => void;
    // Adds multiple event listeners to the instance.
    on<N extends keyof EventListenerArgs>(name: N, listener: EventListener<N>[]): () => void;

    // Removes a single event listener from the instance.
    off<N extends keyof EventListenerArgs>(name: N, listener: EventListener<N>): void;
    // Removes multiple event listeners from the instance.
    off<N extends keyof EventListenerArgs>(name: N, listener: EventListener<N>[]): void;

    // Updates the instance.
    update(force?: boolean): boolean;

    // Gets the instance's state.
    state(): State;

    // Gets the instance's elements.
    elements(): Elements;

    // Destroys the instance and removes all added elements.
    destroy(): void;

    // Gets the instance modules instance of the passed plugin.
    plugin<P extends InstancePlugin>(osPlugin: P): InferInstancePluginModuleInstance<P> | undefined;
  }

  // Describes a OverlayScrollbars instances state.
  interface State {
    // Describes the current padding in pixels.
    padding: TRBL;
    // Whether the current padding is absolute.
    paddingAbsolute: boolean;
    // The client width (x) & height (y) of the viewport in pixels.
    overflowEdge: XY<number>;
    // The overflow amount in pixels.
    overflowAmount: XY<number>;
    // The css overflow style of the viewport.
    overflowStyle: XY<OverflowStyle>;
    // Whether the viewport has an overflow.
    hasOverflow: XY<boolean>;
    // The scroll coordinates of the viewport.
    scrollCoordinates: {
      // The start (origin) scroll coordinates for each axis.
      start: XY<number>;
      // The end scroll coordinates for each axis.
      end: XY<number>;
    };
    // Whether the direction is considered rtl.
    directionRTL: boolean;
    // Whether the instance is considered destroyed.
    destroyed: boolean;
  }

  // Describes the elements of a OverlayScrollbars instance.
  interface Elements {
    // The element the instance was applied to.
    target: HTMLElement;
    // The host element. It's the root of all other elements.
    host: HTMLElement;
    /**
     * The element responsible for the correct padding.
     * Depending on initialization it can be the same as the viewport element.
     */
    padding: HTMLElement;
    // The element responsible of the scrolling.
    viewport: HTMLElement;
    /**
     * The element responsible for holding the actual content.
     * Depending on initialization it can be the same as the viewport element.
     */
    content: HTMLElement;
    /**
     * The element through which you can get the current `scrollLeft` or `scrollTop` offset.
     * Depending on the target element it can be the same as the viewport element.
     */
    scrollOffsetElement: HTMLElement;
    /**
     * The element through which you can add `scroll` events.
     * Depending on the target element it can be the same as the viewport element.
     */
    scrollEventElement: HTMLElement | Document;
    // The horizontal scrollbar's elements.
    scrollbarHorizontal: CloneableScrollbarElements;
    // The vertical scrollbar's elements.
    scrollbarVertical: CloneableScrollbarElements;
  }
  ```
</details>


## Static Object

The static `OverlayScrollbars` object.

```js
OverlayScrollbars.plugin(SomePlugin);
```

### Static Object Methods

<details>
  <summary>
    This is an in depth topic. Click here to read it.
  </summary>

  ### `valid(osInstance): boolean`

  Checks whether the passed value is a valid and not destroyed overlayscrollbars instance

  | parameter | type | description |
  | :--- | :--- | :--- |
  | osInstance | `any` | The value to be checked. |

  | returns | description |
  | :--- | :--- |
  | `boolean` | Whether the passed value is a valid and not destroyed overlayscrollbars instance. |

  ### `env(): Environment`

  Gets the environment.

  | returns | description |
  | :--- | :--- |
  | `Environment` | An object describing the environment. |

  ### `nonce(newNonce): void`

  Sets the nonce attribute for inline styles.

  | parameter | type | description |
  | :--- | :--- | :--- |
  | newNonce | `string / undefined` | The nonce attribute for inline styles. |

  ### `plugin(plugin): object | undefined`

  Adds a single plugin.

  | parameter | type | description |
  | :--- | :--- | :--- |
  | plugin | `object` | The plugin to be added. |

  | returns | description |
  | :--- | :--- |
  | `object / void` | An object describing the plugin's static module instance or `void` if no instance was found. |

  ### `plugin(plugins): (object | void)[]`

  Adds multiple plugins.

  | parameter | type | description |
  | :--- | :--- | :--- |
  | plugins | `object[]` | The plugins to be added. |

  | returns | description |
  | :--- | :--- |
  | `(object / void)[]` | An array describing the plugins static modules instances or `undefined` if no instance was found. |

  #### TypeScript

  ```ts
  // The OverlayScrollbars static object.
  interface OverlayScrollbarsStatic {
    // Gets the instance of the passed target or `undefined` the target has no instance.
    (target: InitializationTarget): OverlayScrollbars | undefined;
    // Initializes OverlayScrollbars to the passed target with passed options and event listeners.
    (target: InitializationTarget, options: PartialOptions, eventListeners?: EventListeners): OverlayScrollbars;

    // Checks whether the passed value is a valid and not destroyed overlayscrollbars instance.
    valid(osInstance: any): osInstance is OverlayScrollbars;

    // Gets the environment.
    env(): Environment;

    // Sets the nonce attribute for inline styles.
    nonce(newNonce: string | undefined): void;

    // Adds a single plugin.
    plugin(plugin: Plugin): InferStaticPluginModuleInstance<Plugin>
    // Adds multiple plugins.
    plugin(plugins: Plugin[]): InferStaticPluginModuleInstance<Plugin>[];
  }

  // Describes the OverlayScrollbars environment.
  interface Environment {
    // The native scrollbars size of the browser / system.
    scrollbarsSize: XY<number>;
    // Whether the native scrollbars are overlaid.
    scrollbarsOverlaid: XY<boolean>;
    // Whether the browser supports native scrollbar hiding.
    scrollbarsHiding: boolean;
    // Whether the browser supports the ScrollTimeline API.
    scrollTimeline: boolean;
    // The default Initialization to use if nothing else is specified.
    staticDefaultInitialization: Initialization;
    // The default Options to use if nothing else is specified.
    staticDefaultOptions: Options;

    // Returns the current default Initialization.
    getDefaultInitialization(): Initialization;
    // Returns the current default Options.
    getDefaultOptions(): Options;

    /**
     * Sets a new default Initialization.
     * If the new default Initialization is partially filled, its deeply merged with the current default Initialization.
     * @param newDefaultInitialization The new default Initialization.
     * @returns The current default Initialization.
     */
    setDefaultInitialization(newDefaultInitialization: PartialInitialization): Initialization;
    /**
     * Sets new default Options.
     * If the new default Options are partially filled, they're deeply merged with the current default Options.
     * @param newDefaultOptions The new default Options.
     * @returns The current default options.
     */
    setDefaultOptions(newDefaultOptions: PartialOptions): Options;
  }
  ```
</details>

## Styling

OverlayScrollbars comes with two themes called `os-theme-dark` and `os-theme-light`. You can use the `scrollbars.theme` option to change the theme.

Custom themes can be done in several ways. The easiest and fastest way is to use the predefined set of `CSS Custom Properties` aka CSS variables. If that's not enough, you can add custom class names or add custom styling to the existing class names.  

### Styling in depth

<details>
  <summary>
    This is an in depth topic. Click here to read it.
  </summary>

  ### CSS Custom properties

  OverlayScrollbars provides a set of `CSS Custom Properties` which makes scrollbar styling easy and fast:
  ```scss
  .os-scrollbar {
    // The size of the scrollbar
    --os-size: 0;
    // The axis-perpendicular padding of the scrollbar (horizontal: padding-y, vertical: padding-x)
    --os-padding-perpendicular: 0;
    // The axis padding of the scrollbar (horizontal: padding-x, vertical: padding-y)
    --os-padding-axis: 0;
    // The border radius of the scrollbar track
    --os-track-border-radius: 0;
    // The background of the scrollbar track
    --os-track-bg: none;
    // The :hover background of the scrollbar track
    --os-track-bg-hover: none;
    // The :active background of the scrollbar track
    --os-track-bg-active: none;
    // The border of the scrollbar track
    --os-track-border: none;
    // The :hover background of the scrollbar track
    --os-track-border-hover: none;
    // The :active background of the scrollbar track
    --os-track-border-active: none;
    // The border radius of the scrollbar handle
    --os-handle-border-radius: 0;
    // The background of the scrollbar handle
    --os-handle-bg: none;
    // The :hover background of the scrollbar handle
    --os-handle-bg-hover: none;
    // The :active background of the scrollbar handle
    --os-handle-bg-active: none;
    // The border of the scrollbar handle
    --os-handle-border: none;
    // The :hover border of the scrollbar handle
    --os-handle-border-hover: none;
    // The :active border of the scrollbar handle
    --os-handle-border-active: none;
    // The min size of the scrollbar handle
    --os-handle-min-size: 33px;
    // The max size of the scrollbar handle
    --os-handle-max-size: none;
    // The axis-perpendicular size of the scrollbar handle (horizontal: height, vertical: width)
    --os-handle-perpendicular-size: 100%;
    // The :hover axis-perpendicular size of the scrollbar handle (horizontal: height, vertical: width)
    --os-handle-perpendicular-size-hover: 100%;
    // The :active axis-perpendicular size of the scrollbar handle (horizontal: height, vertical: width)
    --os-handle-perpendicular-size-active: 100%;
    // Increases the interactive area of the scrollbar handle.
    --os-handle-interactive-area-offset: 0;
  }
  ```

  You can change the properties for both scrollbars at once, or for each scrollbar axis. In the example below, I've chosen `os-theme-custom` as the theme name:

  ```scss
  // Horizontal and vertical scrollbar are 10px 
  .os-theme-custom {
    --os-size: 10px;
  }

  // Horizontal scrollbar is 10px
  .os-theme-custom.os-scrollbar-horizontal {
    --os-size: 10px;
  }
  // Vertical scrollbar is 20px
  .os-theme-custom.os-scrollbar-vertical {
    --os-size: 20px;
  }
  ```

  You can then use your theme by assigning it via the `scrollbars.theme` option:

  ```js
  OverlayScrollbars(document.body, {
    scrollbars: {
      theme: 'os-theme-custom'
    }
  });
  ```

  Since scrollbar styles are usually simple, this set of options should be enough to get the styling you want.
  If you need more freedom, you can create your own styles by adding styling to the base class names described in the next section.

  ### Scrollbars structure and CSS class names

  The scrollbars HTML markup looks like:

  ```html
  <div class="os-scrollbar os-scrollbar-horizontal">
      <div class="os-scrollbar-track">
          <div class="os-scrollbar-handle">
          </div>
      </div>
  </div>
  <div class="os-scrollbar os-scrollbar-vertical">
      <div class="os-scrollbar-track">
          <div class="os-scrollbar-handle">
          </div>
      </div>
  </div>
  ```

  The class names are simplified, in a real application the `.os-scrollbar` element can have additional class names which modify the appearance (mostly visibility and alignment).  

  Below is a list of the most important class names you will encounter:

  | CSS class name | description |
| :--- | :--- |
| `.os-scrollbar` | The root element of a scrollbar. |
| `.os-scrollbar-rtl` | Indicates a `RTL` direction of the host element the scrollbar belongs to. |
| `.os-scrollbar-horizontal` | The root element of a horizontal scrollbar. |
| `.os-scrollbar-vertical` | The root element of a vertical scrollbar. |
| `.os-scrollbar-handle-interactive` | Indicates that the handle inside the scrollbar is interactive (`scrollbars.dragScroll` is `true`). |
| `.os-scrollbar-track-interactive` | Indicates that the track inside the scrollbar is interactive (`scrollbars.clickScroll` is `true`). |
| `.os-scrollbar-track` | The track element. This is the track of the nested handle element. If `scrollbars.clickScroll` is `true` this is the element users can click to change the scroll offset. |
| `.os-scrollbar-handle` | The handle element. If `scrollbars.dragScroll` is `true` this is the handle users can drag to change the scroll offset. |

  If you create your own theme, please only use the classes listed above. All other classes are modifier classes used to change visibility, alignment and pointer-events of the scrollbars.

  ### Gotchas

  It is important that the chosen theme class name in your CSS file matches the assigned theme name in the options. If the CSS class name is `.my-theme`, the `scrollbars.theme` must be `'my-theme'`.  
    
    
  Please be aware of your stack. For example, `css-modules` will change your class names to avoid naming collisions. Always check that your CSS is what you expect it to be.

</details>

## Plugins

Anything that is not considered core functionality or old browser compatibility is exposed via a plugin. This is done because all unused plugins are omitted during treeshaking and won't end up in your final bundle. OverlayScrollbars ships with the following plugins:

- **ScrollbarsHidingPlugin**: Needed for old browsers that don't support native scrollbar styling. [You can find the list of browsers where you need this plugin here](https://caniuse.com/?search=scrollbar%20styling) (note that even though `iOS Safari >= 14` is marked as unsupported, you only need this plugin for `iOS < 7.1`).
- **SizeObserverPlugin**: Needed for old browsers that don't support the `ResizeObserver` api. [You can find the list of browsers that need this plugin here](https://caniuse.com/?search=ResizeObserver)
- **ClickScrollPlugin**: If you want to use the option `scrollbars: { clickScroll: true }`.

### Consuming Plugins

Plugins are consumed like:
```ts
import { 
  OverlayScrollbars, 
  ScrollbarsHidingPlugin, 
  SizeObserverPlugin, 
  ClickScrollPlugin 
} from 'overlayscrollbars';

// Single plugin
OverlayScrollbars.plugin(ScrollbarsHidingPlugin);

// Multiple plugins
OverlayScrollbars.plugin([SizeObserverPlugin, ClickScrollPlugin]);
```

### Plugins in depth

<details>
  <summary>
    This is an in depth topic. Click here to read it.
  </summary>
  <br />

Plugins are plain objects with a **single field**, the name of the field is the name of the plugin. This name is the plugin's identifier and _must_ be unique across all plugins. In case multiple plugins have the same name, the last added plugin overwrites the plugin added previously under the same name.

### Plugin Modules

A Plugin module is the constructor of a plugin module's instance. There are two kinds of plugin modules: `static` and `instance`. A single plugin must have one or more modules. A plugin module can return an instance, but doesn't have to.

#### Static Plugin Module

The `static` plugin module is invoked when the plugin is added with the `OverlayScrollbars.plugin` function.

Example plugin with a `static` module:
```js
const staticPlugin = {
  // Plugin has the name `examplePlugin`.
  examplePlugin: {
    // The `static` function describes a static module and returns the module instance or void / undefined if no instance is needed.
    // The `osStatic` parameter is the global `OverlayScrollbars` object.
    static: (osStatic) => {
      let count = 0;
      const staticPluginModuleInstance = {
        getCount: () => count,
        increment: () => { count++ },
      }
      return staticPluginModuleInstance;
    }
  }
}
```

When the plugin is added with the `OverlayScrollbars.plugin` function, the static module instance is returned:
```js
const staticModuleInstance = OverlayScrollbars.plugin(staticPlugin); // Plugins static module is invoked
staticModuleInstance.count; // 0
staticModuleInstance.increment();
staticModuleInstance.count; // 1
```

#### Instance Plugin Module

The `instance` plugin module is invoked when a new `OverlayScrollbars` instance is created but before the `initialized` event is dispatched.

Example plugin with a `instance` module:
```js
const instancePlugin = {
  // Plugin has the name `examplePlugin`.
  examplePlugin: {
    // Instance function describes na instance module and returns the module instance or void / undefined if no instance is needed.
    // The `osInstance` parameter is the OverlayScrollbar instance the plugin is bound to.
    // The `event` parameter is a function which adds events to the instance which can't be removed from outside the plugin.
    // The `osStatic` parameter is the global OverlayScrollbar object.
    instance: (osInstance, event, osStatic) => {
      let count = 0;

      const instancePluginModuleInstance = {
        getCount: () => count,
        increment: () => { count++ },
      }

      // Event which fires when the instance was initialized.
      event('initialized', () => {
        console.log("instance initialized");
      });

      // Event which fires when the viewport was scrolled.
      const removeScrollEvent = event('scroll', () => {
        console.log("viewport scrolled");
        removeScrollEvent(); // Removes the event after the first scroll.
      });
      
      return instancePluginModuleInstance;
    }
  }
}
```

When the plugin is added with the `OverlayScrollbars.plugin` function, all OverlayScrollbar instances will automatically add the plugin from that point on. Previously created instances will not have the plugin. The instance module instance is returned with the `osInstance.plugin` function:
```js
OverlayScrollbars.plugin(instancePlugin); // Plugin is added

const osInstance = OverlayScrollbars(document.body, {}); // Plugin's instance module is invoked
const instancePluginInstance = osInstance.plugin(instancePlugin);

instancePluginInstance.count; // 0
instancePluginInstance.increment();
instancePluginInstance.count; // 1
```

#### TypeScript

```ts
// Describes a OverlayScrollbar plugin.
type Plugin<
  // The name of the plugin.
  Name extends string = string,
  // The module instance type of the static module.
  S extends PluginModuleInstance | void = PluginModuleInstance | void, 
  // The module instance type of the instance module.
  I extends PluginModuleInstance | void = PluginModuleInstance | void 
> = {
  [pluginName in Name]: PluginModule<S, I>;
};

// Describes a OverlayScrollbar plugin which has only a static module.
type StaticPlugin<
  Name extends string = string,
  T extends PluginModuleInstance = PluginModuleInstance
> = Plugin<Name, T, void>;

// Describes a OverlayScrollbar plugin which has only a instance module.
type InstancePlugin<
  Name extends string = string,
  T extends PluginModuleInstance = PluginModuleInstance
> = Plugin<Name, void, T>;

// Infers the type of the static module's instance of the passed plugin.
type InferStaticPluginModuleInstance<T extends StaticPlugin>;

// Infers the type of the instance modules instance of the passed plugin.
type InferInstancePluginModuleInstance<T extends InstancePlugin>;
```

</details>


## FAQ

<details>
  <summary>
    How do I <code>get / set</code> the <code>scroll position</code> of an element I applied OverlayScrollbars to?
  </summary>
  <br />

 If you applied `OverlayScrollbars` to the `body` element you can use [`window.scrollX`](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollX), [`window.scrollY`](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY), [`window.scroll`](https://developer.mozilla.org/en-US/docs/Web/API/Window/scroll), [`window.scrollTo`](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo), [`window.scrollBy`](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollBy) or any other native api. 

If the plugin was applied to any other element you have to get the `viewport` element with the `instance.elements()` function first. With this element you can use [`element.scrollTop`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop), [`element.scrollLeft`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft), [`element.scroll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll), [`element.scrollTo`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo), [`element.scrollBy`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollBy) or any other native api.

```js
const { viewport } = osInstance.elements();
const { scrollLeft, scrollTop } = viewport; // Get scroll offset
viewport.scrollTo({ top: 0 }); // Set scroll offset
```
</details>

<details>
  <summary>
    Is it possible to <code>limit / adjust the scrollbar handle length</code>? 
  </summary>
  <br />

 You can adjust a scrollbar's handle length by setting a `min-width / min-height` and `max-width / max-height` style:

```css
/* horizontal boundaries */
.os-scrollbar-horizontal .os-scrollbar-handle {
  min-width: 50px;
  max-width: 200px;
}
/* vertical boundaries */
.os-scrollbar-vertical .os-scrollbar-handle {
  min-height: 40px;
  max-height: 40px;
}
```

  You can assign the same value to both properties to force the scrollbar to be always the same size.  
  Setting the `width` and `height` properties won't work since those are set by the plugin automatically. 

</details>

## Feature comparison to `v1`

- The `scroll` function is missing. Planned as a `plugin`. (WIP)
- Initialization to the `textarea` element isn't supported yet. Planned as a `plugin`. (WIP) 

## Future Plans

 - Provide plugin based support for missing features. (treeshakeable)
 - Frequent updates in terms of bug-fixes and enhancements. (always use latest browser features)
 - Improve tests. (unit & browser tests)

## Used by

- [Spotify](https://github.com/KingSora/OverlayScrollbars/issues/150#issuecomment-658658186)
- [IntelliJ IDEA](https://github.com/JetBrains/intellij-community/blob/ee35416f381ed33f976d7b9322a5ee6156e7fa2f/platform/platform-api/src/com/intellij/ui/jcef/JBCefScrollbarsHelper.java#L41-L50)
- [Storybook](https://github.com/storybookjs/storybook/blob/32d2fafa8d1d2e197e885349f2c01f5422bde5b4/code/ui/components/package.json#L66-L67)
- [Admin LTE](https://github.com/ColorlibHQ/AdminLTE/blob/3113ac5efed25971ccd0972f5eeff3c364f218dc/src/html/components/_scripts.astro#L6-L7)
- and many more...

## Sponsors
<table>
  <tbody>
    <tr>
        <td>
            <a href="https://www.browserstack.com" target="_blank">
              <img align="center" src="https://kingsora.github.io/OverlayScrollbars/img/browserstack.png" width="250">
            </a>
        </td>
        <td>
          Thanks to <a href="https://www.browserstack.com" target="_blank">BrowserStack</a> for sponsoring open source projects and letting me test OverlayScrollbars for free.
        </td>
    </tr>
  </tbody>
</table>

## License

MIT 
