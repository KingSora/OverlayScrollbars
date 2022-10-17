<div align="center">
  <a href="https://kingsora.github.io/OverlayScrollbars">
    <img src="https://raw.githubusercontent.com/KingSora/OverlayScrollbars/master/logo/logo.png" width="160" height="160" alt="OverlayScrollbars">
  </a>
</div>
<h6 align="center">
    <a href="https://www.npmjs.com/package/overlayscrollbars">
      <img src="https://img.shields.io/npm/dm/overlayscrollbars.svg?style=flat-square" alt="Downloads">
    </a>
    <a href="https://www.npmjs.com/package/overlayscrollbars">
      <img src="https://img.shields.io/npm/v/overlayscrollbars.svg?style=flat-square" alt="Version">
    </a>
    <a href="https://github.com/KingSora/OverlayScrollbars/blob/master/LICENSE">
      <img src="https://img.shields.io/github/license/kingsora/overlayscrollbars.svg?style=flat-square" alt="License">
    </a>
    <a href="https://app.codecov.io/gh/KingSora/OverlayScrollbars">
      <img src="https://img.shields.io/codecov/c/github/KingSora/OverlayScrollbars?style=flat-square" alt="Code Coverage">
    </a>
    <a href="https://bundlephobia.com/package/overlayscrollbars">
      <img src="https://img.shields.io/bundlephobia/minzip/overlayscrollbars?label=max.%20bundle%20size&style=flat-square" alt="Max. Bundle Size">
    </a>
</h6>

> OverlayScrollbars is a javascript scrollbar plugin that hides native scrollbars, provides custom styleable overlay scrollbars and keeps the native functionality and feeling.

> This is the documentation for version `2.x`. which is currently in beta. You can read the version `1.x` docs [here](https://github.com/KingSora/OverlayScrollbars/tree/v1.x) or on the [website](https://kingsora.github.io/OverlayScrollbars/#!overview).  

## Why

I created this plugin because I hate ugly and space consuming scrollbars. Similar plugins haven't met my requirements in terms of features, quality, simplicity, license or browser support.

## Goals & Features

 - Simple, powerful and good documented API
 - High browser compatibility - <b>Firefox</b>, <b>Chrome</b>, <b>Opera</b>, <b>Edge</b>, <b>Safari 10+</b> and <b>IE 11</b>
 - Can be run on the server - <b>SSR</b>, <b>SSG</b> and <b>ISR</b> support
 - Tested on various devices - <b>Mobile</b>, <b>Desktop</b> and <b>Tablet</b>
 - Tested with various (and mixed) inputs - <b>Mouse</b>, <b>touch</b> and <b>pen</b>
 - <b>Treeshaking</b> - bundle only what you really need 
 - Automatic update detection - <b>no polling</b>
 - Usage of latest browser features - best <b>performance</b> in new browsers
 - Bidirectional - LTR or RTL direction support
 - Simple and effective scrollbar styling
 - Highly customizable
 - TypeScript support - fully written in TypeScript
 - Dependency free - 100% self written to ensure small size and best functionality

## Getting started

### npm & Node
OverlayScrollbars can be downloaded from [npm](https://www.npmjs.com/package/overlayscrollbars) or the package manager of your choice:
```sh
npm install overlayscrollbars
```
After installation it can be imported:
```js
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars } from 'overlayscrollbars';
```

### Manual download & embedding

<details>
  <summary>
    These instructions are for old stacks. Click here to read them.
  </summary>
  <br />
  
You can use OverlayScrollbars without any bundler or package manager.  
Simply download it from the [Releases](https://github.com/KingSora/OverlayScrollbars/releases) or use a [CDN](https://cdnjs.com/libraries/overlayscrollbars).

- Use the javascript files with the `.browser` extension.
- If you target old browsers use the `.es5` javascript file, for new browsers `.es6`.
- For production use the javascript / stylesheet files with the `.min` extension. 

Embedd OverlayScrollbars manually in your HTML:
```html
<link type="text/css" href="path/to/overlayscrollbars.css" rel="stylesheet" />
<script type="text/javascript" src="path/to/overlayscrollbars.js" defer></script>
```
</details>


## Initialization

> __Note__: During initialization its expected that the <b>CSS file is loaded and parsed</b> by the browser.

You can initialize either directly with an `Element` or with an `Object` where you have more control over the initialization process. 

```js
// simple initialization with an element
const osInstance = OverlayScrollbars(document.querySelector('#myElement'), {});
```

### Bridging initialization flickering

If you initialize OverlayScrollbars it needs a few milliseconds to create and append all the elements to the DOM.
While this period the native scrollbars are still visible and are switched out after the initialization is finished. This is perceived as flickering. 

To fix this behavior apply the `data-overlayscrollbars=""` attribute to the target element (and `html` element if the target element is `body`).

### Initialization with an Object
<details>
  <summary>
    This is a in depth topic. Click here to read it.
  </summary>
  <br />
  
> __Note__: For now please refer to the <b>TypeScript definitions</b> for a more detailed description of all possibilities.

The only required field is the `target` field. This is the field to which the plugin is applied to.  
If you use the object initialization only with the `target` field, the outcome is equivalent to the element initialization:
```js
// Both initializations have the same outcome

OverlayScrollbars(document.querySelector('#myElement'), {});
OverlayScrollbars({ target: document.querySelector('#myElement') }, {});
```

In the initialization object you can specify how the library is handling generated elements.
For example you can appoint an existing element as the `viewport` element. Like this the library won't generate it but take the specified element instead:

 ```js
OverlayScrollbars({ 
  target: document.querySelector('#target'),
  elements: {
    viewport: document.querySelector('#viewport'),
  },
}, {});
```

This is very useful if you have a fixed DOM structure and don't want OverlayScrollbars to generate its own elements. Those cases arise very often when you want an other library to work together with OverlayScrollbars.

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

And last but not least you can decide when the initialization should be canceled:
 ```js
OverlayScrollbars({ 
  target: document.querySelector('#target'),
  cancel: {
    nativeScrollbarsOverlaid: true,
    body: null,
  }
}, {});
```

In the above example the initialization is canceled when the native scrollbars are overlaid or when your target is a `body` element and the plugin determined that a initialization to the `body` element would affect native functionality like `window.scrollTo`.

</details>

## Options

You can initialize OverlayScrollbars with an initial set of options, which can be changed at any time with the `options` method:
```js
OverlayScrollbars(document.querySelector('#myElement'), {
  overflow: {
    x: 'hidden',
  },
});
```

### Options in depth
<details>
  <summary>
    This is a in depth topic. Click here to read it.
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

Indicates whether the padding for the content shall be absolute.

### `showNativeOverlaidScrollbars`

| type  | default |
| :--- | :--- |
| `boolean` | `false` |

Indicates whether the native overlaid scrollbars shall be visible.

### `update.elementEvents`

| type  | default |
| :--- | :--- |
| `Array<[string, string]> \| null` | `[['img', 'load']]` |

An array of tuples. The first value in the tuple is an `selector` and the second value are `event names`. The plugin will update itself if any of the elements with the specified selector will emit any specified event. The default value can be interpreted as "The plugin will update itself if any `img` element emits an `load` event."

### `update.debounce`

| type  | default |
| :--- | :--- |
| `[number, number] \| number \| null` | `[0, 33]` |

> __Note__: If 0 is used for the timeout, `requestAnimationFrame` instead of `setTimeout` is used for the debounce.

Debounces the `MutationObserver` which tracks changes to the content. If a **tuple** is passed, the first value is the timeout and second is the max wait. If only a **number** is passed you specify only the timeout and there is no max wait. With **null** there is no debounce. **Usefull to fine-tune performance.**

### `update.attributes`

| type  | default |
| :--- | :--- |
| `string[] \| null` | `null` |

> __Note__: There is a base array of attributes that the `MutationObserver` always observes, even if this option is `null`.

An array of additional attributes that the `MutationObserver` should observe for the content. 

### `update.ignoreMutation`

| type  | default |
| :--- | :--- |
| `((mutation) => any) \| null` | `null` |

A function which receives a [`MutationRecord`](https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord) as an argument. If the function returns a truthy value the mutation will be ignored and the plugin won't update. **Usefull to fine-tune performance.**

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

The base visibility of the scrollbars.

### `scrollbars.autoHide`

| type  | default |
| :--- | :--- |
| `string` | `'never'` |

> __Note__: Valid values are: `'never'`, `'scroll'`, `'leave'` and `'move'`.

The possibility to hide visible scrollbars automatically after a certain user action.

### `scrollbars.autoHideDelay`

| type  | default |
| :--- | :--- |
| `number` | `1300` |

The delay in milliseconds before the scrollbars are hidden automatically.

### `scrollbars.dragScroll`

| type  | default |
| :--- | :--- |
| `boolean` | `true` |

Indicates whether you can drag the scrollbar handles for scrolling.

### `scrollbars.clickScroll`

| type  | default |
| :--- | :--- |
| `boolean` | `false` |

Indicates whether you can click on the scrollbar track for scrolling.

### `scrollbars.pointers`

| type  | default |
| :--- | :--- |
| `string[] \| null` | `['mouse', 'touch', 'pen']` |

The [`PointerTypes`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType) the plugin should react to.

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
    This is a in depth topic. Click here to read it.
  </summary>
  <br />

> __Note__: Every event receives the `instance` from which it was invoked as the first argument. Always.

### `initialized`

| arguments  | description |
| :--- | :--- |
| `instance` | The instance which invoked the event. |

Is invoked after all generated elements, observers and events were appended to the DOM.

### `updated`

| arguments  | description |
| :--- | :--- |
| `instance` | The instance which invoked the event. |
| `onUpdatedArgs` | An `object` which describes the update in detail. |

> __Note__: If an update was triggered but nothing changed, the event won't be invoked.

Is invoked after the instace was updated. 

### `destroyed`

| arguments  | description |
| :--- | :--- |
| `instance` | The instance which invoked the event. |
| `canceled` | An `boolean` which indicates whether the initialization was canceled and thus destroyed. |

Is invoked after all generated elements, observers and events were removed from the DOM.

</details>

## Instance Methods

> __Note__: For now please refer to the <b>TypeScript definitions</b> for a more detailed description.

```ts
interface OverlayScrollbars {
  options(): Options;
  options(newOptions: DeepPartial<Options>): Options;

  update(force?: boolean): OverlayScrollbars;

  destroy(): void;

  state(): State;

  elements(): Elements;

  on<N extends keyof EventListenerMap>(name: N, listener: EventListener<N>): () => void;
  on<N extends keyof EventListenerMap>(name: N, listener: EventListener<N>[]): () => void;

  off<N extends keyof EventListenerMap>(name: N, listener: EventListener<N>): void;
  off<N extends keyof EventListenerMap>(name: N, listener: EventListener<N>[]): void;
}
```

## Static Methods

> __Note__: For now please refer to the <b>TypeScript definitions</b> for a more detailed description.

```ts
interface OverlayScrollbarsStatic {
  (target: InitializationTarget): OverlayScrollbars | undefined;
  (
    target: InitializationTarget,
    options: DeepPartial<Options>,
    eventListeners?: InitialEventListeners
  ): OverlayScrollbars;

  plugin(plugin: Plugin | Plugin[]): void;
  valid(osInstance: any): boolean;
  env(): Environment;
}
```

## Plugins

Everything thats considered not core functionality or old browser compatibility is exposed via a plugin. This is done because all unused plugins are treeshaken and thus won't end up in your final bundle. OverlayScrollbars comes with the following plugins:

- **ScrollbarsHidingPlugin**: Is needed for old browsers which aren't supporting nativ scrollbar styling features. [You can find the list of browsers where you need this plugin here](https://caniuse.com/?search=scrollbar%20styling) (note that even though `iOS Safari >= 14` is marked as unsupported you only need this plugin for `iOS < 7.1`).
- **SizeObserverPlugin**: Is needed for old browsers which aren't supporting the `ResizeObserver` api. [You can find the list of browsers where you need this plugin here](https://caniuse.com/?search=ResizeObserver)
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

// single plugin
OverlayScrollbars.plugin(ScrollbarsHidingPlugin);

// multiple plugins
OverlayScrollbars.plugin([SizeObserverPlugin, ClickScrollPlugin]);
```

### Writing Plugins

> __Note__: For now please refer to the <b>TypeScript definitions</b> for a more detailed description.

You can write and publish your own Plugins. This section is a work in progress.

## Feature comparison to `v1`

- The `scroll` function is missing. Planned as a `plugin`. (WIP)
- Initialization to the `textarea` element isn't supported yet. Planned as a `plugin`. (WIP) 

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

## Future Plans

 - Provide plugin based support for missing features. (treeshakeable)
 - Frequent updates in terms of bug-fixes and enhancements. (always use latest browser features)
 - Improve tests. (unit & browser tests)

## License

MIT 
