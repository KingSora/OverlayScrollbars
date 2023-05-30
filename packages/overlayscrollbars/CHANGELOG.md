# Changelog

## 2.2.0

### Improvements

- Force the `scroll-behavior` css property to be `auto` when the user interacts with a scrollbar to prevent smooth scrolling to apply where it shouldn't. [#515](https://github.com/KingSora/OverlayScrollbars/issues/515)
- The `viewort`, `padding` and `content` elements don't use the `class` attribute anymore for their styling. Instead each of them uses its own `data-overlayscrollbars-*` attribute. This has been done so that 3rd party libraries aren't conflicting with classnames from overlayscrollbars or vice versa. Selectors like `.os-viewport`, `.os-padding` or `.os-content` won't work anymore. [#526](https://github.com/KingSora/OverlayScrollbars/issues/526) [#530](https://github.com/KingSora/OverlayScrollbars/issues/530)

## 2.1.1

### Bug Fixes

- Fixed a bug where pointer events weren't released properly after drag or click scrolling. [#512](https://github.com/KingSora/OverlayScrollbars/issues/512)

### Improvements

- The `os-theme-dark` and `os-theme-light` themes now use `border-box` box-sizing as their default.
- Improve the `README.md` documentation for initialization, styling and and the browser global version. [#509](https://github.com/KingSora/OverlayScrollbars/issues/509)

## 2.1.0

### Bug Fixes

- Fix a bug where initial `RTL` direction wasn't detected properly.

### Features

- Introduce `CSS Custom Properties` to improve theming and styling of scrollbars. [#478](https://github.com/KingSora/OverlayScrollbars/issues/478)

### Improvements

- Improve pointer event handling on scrollbar handle and track.
- Improve the README documentation with a styling section.

## 2.0.3

### Bug Fixes

- Revert the `viewport` and `padding` style `position: relative` change introduced in `v2.0.2` due to breaking behavior. [#489](https://github.com/KingSora/OverlayScrollbars/issues/489) is considered a design limitation.

## 2.0.2

### Bug Fixes

- The `viewport` and `padding` elements won't have the style `position: relative` anymore if its not needed. The style is only needed for older browsers. ([#489](https://github.com/KingSora/OverlayScrollbars/issues/489))

## 2.0.1

### Bug Fixes

- The custom scrollbars are now always hidden if the `showNativeOverlaidScrollbars` option is `true`.

### Improvements

- The initialization to the `body` element respects now `overflow: hidden` style overrides of the `html` and `body` element. ([#477](https://github.com/KingSora/OverlayScrollbars/issues/477))
- `data-overlayscrollbars-initialize` is now automatically removed if the instance is destroyed or canceled.
- `data-overlayscrollbars-initialize` now always sets `overflow: auto` to prevent elements to be suddenly cropped after initialization.
- removed obsolete `!important` styles

## 2.0.0

OverlayScrollbars was rewritten from the ground up in `TypeScript` in a functional manner.
The rewrite comes with multiple benefits:

- The library is **much** smaller now (about **50% smaller** fully treeshaken)
- Modern browsers benefit greatly because compat code is inside `plugins` which are treeshaken if unused
- Multiple performance optimizations were made due to the new structure
- Framework Components benefit of the `pure` parameter for `options` and `events` (same input produces same output)
- TypeScript definitions are always up to date (`@types/overlayscrollbars` is obsolete now)

### New Features:

- If applied to `body` all the native functionality in modern browsers (e.g. swipe down to refresh on mobile, scroll restoration etc.) is preserved ([#376](https://github.com/KingSora/OverlayScrollbars/issues/376), [#425](https://github.com/KingSora/OverlayScrollbars/issues/425), [#273](https://github.com/KingSora/OverlayScrollbars/issues/273), [#320](https://github.com/KingSora/OverlayScrollbars/issues/320)) 
- If you scroll while the cursor hovers a scrollbar element the viewport is now scrolled ([#128](https://github.com/KingSora/OverlayScrollbars/issues/128), [#322](https://github.com/KingSora/OverlayScrollbars/issues/322))
- The initialization process can be fully customized now. This makes it possible to itegrate with other plugins / libraries ([#432](https://github.com/KingSora/OverlayScrollbars/issues/432), [#304](https://github.com/KingSora/OverlayScrollbars/issues/304), [#149](https://github.com/KingSora/OverlayScrollbars/issues/149), [#148](https://github.com/KingSora/OverlayScrollbars/issues/148), [#139](https://github.com/KingSora/OverlayScrollbars/issues/139), [#49](https://github.com/KingSora/OverlayScrollbars/issues/49))
- Scrollbars can be cloned and positioned anywhere in the DOM tree. ([#404](https://github.com/KingSora/OverlayScrollbars/issues/404), [#323](https://github.com/KingSora/OverlayScrollbars/issues/323), [#158](https://github.com/KingSora/OverlayScrollbars/issues/158), [#17](https://github.com/KingSora/OverlayScrollbars/issues/17))
- The update behavior of the `MutationObserver` for the content can be customized with the `update` options. ([#307](https://github.com/KingSora/OverlayScrollbars/issues/307), [#183](https://github.com/KingSora/OverlayScrollbars/issues/183), [#23](https://github.com/KingSora/OverlayScrollbars/issues/23))
- Works now without adjustments with CSS-Grid, CSS-Flexbox etc.
- Supports all kind of input devices additionally to `mouse` and `touch`. (Uses native pointer-events now)
- Exports a `esm` version which can be treeshaken

### Breaking changes:

- Browser support changed. The minimal version is now IE11.
- There is no default export anymore. The main entry point is now the `OverlayScrollbars` named export.
- The `styles` are now exported under a different path. Read the docs for more info.
- The `scroll` function is missing. (WIP will be added as a plugin)
- Initialization to `textarea` element is not suppored. (WIP will be added as a plugin)
- `extensions` are replaced with `plugins`. Plugins are more powerful but work nothing like `extensions`.
- Any helper functions for `extensions` are removed.
- `TypesScript` definitions changed completely.
- `CSS` styles changed completely.
- There is no `jQuery` version anymore and no `jQuery` compat functionality
- The following changed for the `initialization`:
  - Arrays of elements are not supported anymore. If you want to initialize the plugin to multiple elements, you have to loop over them.
  - Since the initialization is now fully customizable, the plugin won't have special behavior anymore if it has children with `os-` classnames
  - The third parameter are `events` now instead of `eventsions` since `extensions` are removed
- The following **options** were removed / replaced / renamed:
  - `resize` is removed
  - `sizeAutoCapable` is removed (works always now)
  - `clipAlways` is removed (works automatically now)
  - `normalizeRTL` is removed since the `scroll` function isn't implemented yet there is nothing to normalize
  - `autoUpdate` is removed since all browser support the `MutationObserver` api there is no need for customizing a update loop
  - `autoUpdateInterval` is removed
  - `className` is replaced with `scrollbars.theme`
  - `updateOnLoad` is replaced with `update.elementEvents`
  - `nativeScrollbarsOverlaid.initialize` is replaced with the `Initialization` concept. You can pass a object as target now where you can specify when to cancel the initialization of the plugin.
  - `nativeScrollbarsOverlaid.showNativeScrollbars`: is renamed to `showNativeOverlaidScrollbars`
  - `scrollbars.dragScrolling` is renamed to `scrollbars.dragScroll`
  - `scrollbars.clickScrolling` is renamed to `scrollbars.clickScroll` and animates the scroll change only with the `ClickScrollPlugin` otherwise its instant
  - `scrollbars.touchSupport` is replaced with `scrollbars.pointers`
  - `scrollbars.snapHandle` is removed
  - `textarea` is removed since `textarea` initialization isn't possible yet
  - `callbacks` is removed / replaced with the `events` concept. You can pass listeners / callback separately to the options. The `this` context is now `undefined` as a replacement each event recieves the `instance` as its first argument.
    - `onScrollStart` is removed
    - `onScrollStop` is removed
    - `onInitialized` is replaced with the `initialized` event
    - `onUpdated` is replaced with the `updated` the
    - `onDestroyed` is replaced with the `destroyed` event
    - `onScroll` is replaced with the `scroll` event
    - `onInitializationWithdrawn` is replaced with the `destroyed` event (if the second argument `canceled` is `true`)
    - `onOverflowChanged` is replaced with the `updated` event (its second argument holds the information whether the overflow changed)
    - `onOverflowAmountChanged` is replaced with the`updated` event (its second argument holds the information whether the overflow amount changed and how much)
    - `onDirectionChanged` is replaced with the `updated` event (its second argument holds the information whether the direction changed)
    - `onContentSizeChanged` is replaced with the `updated` event (its second argument holds the information whether the content got mutated)
    - `onHostSizeChanged` is replaced with the `updated` event (its second argument holds the information whether the host got mutated / its size changed)

- The following **instance methods** were removed / replaced / renamed:
  - `sleep()` is removed since it doesn't fit into the new structure and shouldn't be needed anymore
  - `ext()` is removed
  - `addExt()` is removed
  - `removeExt()` is removed
  - `scroll()` is removed (WIP)
  - `scrollStop()` is removed (WIP)
  - `getElements()` is renamed to `elements()` and doesn't support any argumens anymore.
  - `getState()` is renamed to `state()` and doesn't support any argumens anymore.
- The following **static methods** were removed / replaced / renamed:
  - `extension()` is removed
  - `defaultOptions()` is replaced with `env().getDefaultOptions()` and `env().setDefaultOptions()`
  - `globals()` is replaced with `env()`
- If you used any fields from the `globals()` result, please refer to the TypeScript definitions for the correct replacement in `env()`

### Theming changes:

- Because scrollbars can be cloned and positioned anywhere in the DOM, themes which worked in `v1` have to be adapted slightly:
  - `.os-scrollbar` elements now don't rely on its parent element. Selectors like `.os-theme-dark > .os-scrollbar-vertical` are now `.os-theme-dark.os-scrollbar-vertical`
  - the `.os-host-rtl` class is replaced with `.os-scrollbar-rtl`. Selectors like `.os-theme-dark.os-host-rtl > .os-scrollbar-horizontal` are now `.os-theme-dark.os-scrollbar-rtl.os-scrollbar-horizontal`