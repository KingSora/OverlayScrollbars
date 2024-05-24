# Changelog

## 2.8.3

### Improvements

- Improvements to update performance.
- Added automated e2e performance metrics.

## 2.8.2

### Bug Fixes

- Fix a bug where children attribute mutations were not picked up if the new attribute value was an empty string.  

## 2.8.1

### Improvements

- Improve the `scrollCoordinates` logic introduced in `v2.8.0` to have better defaults in cases of ambiguity.
- The `scroll` event is not propagated if it is an result of `scrollCoordinates` detection during update.
- Focus management improvements.

## 2.8.0

### Breaking Changes

- Although not a major release, I've decided to remove the `rtlScrollBehavior` field from the `Environment` object. The reason for it is a switch of how the library now detects scroll coordinates for non default flow directions. The replacement for this field is the `scrollCoordinates` field of the `State` object for each instance.

### Features

- Support non default flow directions (block and inline) not only `direction: rtl`. [#625](https://github.com/KingSora/OverlayScrollbars/issues/625)
- A new field `scrollCoordinates` in the `State` object. It indicates the min. and max. scroll coordinates for the viewport. (useful for non default flow direction scrolling)
- A new field `scrollCoordinatesChanged` in the `updateHints` object. It indicates whether the scroll coordinates changed in an update.

### Improvements

- Fix a Firefox only behavior where releasing a scrollbar handle over an anchor would trigger the anchor and navigate to it.
- Change `zoom` detection: instead of the `window.resize` event, the `window.matchMedia` event is used.
- Greatly improve how dragging and releasing the scrollbar handle behaves for `scroll-snapped` viewports. 

### Bug Fixes

- Fix a bug here pointer capture was released too early for wacom pen devices. [#630](https://github.com/KingSora/OverlayScrollbars/issues/630)

## 2.7.3

### Improvements

- Use `{ preventScroll: true }` when focusing viewport to prevent unwanted scrolling. [#629](https://github.com/KingSora/OverlayScrollbars/issues/629)
- Make the scrollbars hidden when `@media print` applies. [#628](https://github.com/KingSora/OverlayScrollbars/issues/628)

## 2.7.2

### Bug Fixes

- Handle case where `document.defaultView` is `null`. [#627](https://github.com/KingSora/OverlayScrollbars/issues/627)

## 2.7.1

### Improvements

- When interacting with a scrollbar the `viewport` element gets focused under certain conditions. (Like e.g. the previously focused element is not and interactive element.)
- Move the environment styles from the stylesheet into javascript to remove the requirement of loaded styles for correct functionality.

## 2.7.0

### Improvements

- Improvements for running in `deno` and `bun`.
- Initialization as the `body` element is now detected as such when the tag name of the target element is `"body"`. Previously this detection was done with `target === target.ownerDocument.body` which would not work when creating a new body element in memory.
- If a non generated `elements.viewport` element is provided during initialization its scroll position will be taken as the initial scroll position instead of the scroll position of the `target` element.
- When interacting with the scrollbars itself the `scrollbars.autoHideDelay` will now apply when the scrollbars would be auto hidden when the interaction ends.

## 2.6.1

### Bug Fixes

- Fully remove lingering IE11 compatibility code which overwrote previously set `height` styles.

## 2.6.0

### Improvements

- Add `focusin` and `focusout` to the focus and blur event management when wrapping and unwrapping elements. [#605](https://github.com/KingSora/OverlayScrollbars/issues/605)
- The `scrollbars.visibility` option was unintuitive to use for adjusting visibility per axis. Its now only applied if the scrollbars scroll axis is able to have a scrollable overflow. [#611](https://github.com/KingSora/OverlayScrollbars/issues/611)

## 2.5.0

### Breaking Changes

- Although not a major release, I've decided to drop `IE11` support in this version. This change should be beneficial to the majority of users.
  - The size of the js bundle decreased by `~6%`.
  - The size of the css bundle decreased by `~18%`.
  - The fields `flexboxGlue` and `cssCustomProperties` are removed from the `Environment`. (returning object from `OverlayScrollbars.env()`)

### Improvements

- Streamlining of scroll related calculations, including RTL direction.
- Focus and Blur event management when wrapping and unwrapping elements during initialization and destroy. [#605](https://github.com/KingSora/OverlayScrollbars/issues/605)

## 2.4.7

### Improvements

- Adapt the `exports` field in the `package.json` for correct `commonjs` and `module` handling.
- Additional types exports: `Elements`, `State`, `CloneableScrollbarElements`, `ScrollbarElements`, `StaticInitialization` and `DynamicInitialization`.
- Remove obsolete styles when initializing `OverlayScrollbars` on the `body` element and the browser supports native scrollbar hiding. [#601](https://github.com/KingSora/OverlayScrollbars/issues/601)
- Move code to the `ScrollbarsHidingPlugin` for better treeshaking. 

## 2.4.6

### Bug Fixes

- If the pointer (mouse, pen etc.) is interacting with the scrollbar, the `autoHide` option will wait until the interaction is finished. [#597](https://github.com/KingSora/OverlayScrollbars/issues/597)
- `ScrollTimeline` animations are not canceled anymore when they are updated. Instead the animations keyframe effect is switched out preventing flickering. [#598](https://github.com/KingSora/OverlayScrollbars/issues/598)

## 2.4.5

### Improvements

- Its now possible to have a height / width transition on the scrollbar-handle. [#587](https://github.com/KingSora/OverlayScrollbars/issues/587)

## 2.4.4

### Bug Fixes

- Fix a bug where ScrollTimeline animation keyframe could contain `NaN` or `Infinity` values triggering a warning. [#581](https://github.com/KingSora/OverlayScrollbars/issues/581)
- Treat explicitly assigned `undefined` values for options as if they would be left out. [#586](https://github.com/KingSora/OverlayScrollbars/issues/586)

## 2.4.3

### Bug Fixes

- Bug where the instance wasn't updated when the `window` resized. [#578](https://github.com/KingSora/OverlayScrollbars/issues/578)

### Improvements

- Further improvements to the update strategy to make finer grained updates.

## 2.4.2

### Improvements

- Makes custom instance plugins compatible with "pure" environments such as `react` and all other component frameworks / libraries.

## 2.4.1

### Improvements

- Add compatibility `exports` field to `package.json` so the `'overlayscrollbars/styles/overlayscrollbars.css'` import works in all node versions. [#570](https://github.com/KingSora/OverlayScrollbars/issues/570)

## 2.4.0

### Features

- Finalize and document the plugin system which makes it possible to create "static" and / or "instance" plugins.
- The static `OverlayScrollbars.plugin` function returns a "static" plugins instance(s) for the registered plugins.
- A new `instance.plugin` function which returns a "instance" plugins instance.
- window `resize` events will now update instances only if it is needed and only what is needed.  

### Improvements

- Small internal rewrite to improve stability, performance and bundle size.
- Improvements the documentation and README.

## 2.3.2

### Bug Fixes

- The [`element.animate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate) api is only called when the browser supports the [ScrollTimeline API](https://developer.mozilla.org/en-US/docs/Web/API/ScrollTimeline). [#562](https://github.com/KingSora/OverlayScrollbars/issues/562)

## 2.3.1

### Bug Fixes

- Fix direction `rtl` visual scrollbar handle behavior in browser which support the [ScrollTimeline API](https://developer.mozilla.org/en-US/docs/Web/API/ScrollTimeline).
- Fix double tap behavior for interactive elements on `iOS` devices if `autoHide` is `leave` or `move`. [#560](https://github.com/KingSora/OverlayScrollbars/discussions/560) [#285](https://github.com/KingSora/OverlayScrollbars/discussions/285)
- Fix incorrect scrollbar handle calculation when overscroll on safari occurred. [#559](https://github.com/KingSora/OverlayScrollbars/discussions/559)

## 2.3.0

### Features

- Make use of the new [ScrollTimeline API](https://developer.mozilla.org/en-US/docs/Web/API/ScrollTimeline) in supported browsers.
- Add the option `scrollbars.autoHideSuspend` to make it possible to suspend the autoHide functionality until the first scroll interaction was performed. The default value for this option is `false` for backwards compatibility reasons but is recommended to be `true` for better accessibility.
- Add a CSS selector to bridge deferred initializations visually.

### Bug Fixes
- Fix a bug where a change wasn't detected properly when the target element was hidden initially. [#546](https://github.com/KingSora/OverlayScrollbars/discussions/546)
- Fixed a bug where the scroll offset was reset to `0` sometimes after initialization when the target was the `body` element.

### Improvements

- Add online examples to README.

## 2.2.1

### Bug Fixes
- Fix an issue where the `viewport` element could be wider than the `host` element. [#538](https://github.com/KingSora/OverlayScrollbars/issues/538)

### Improvements

- Instead of `offsetWidth` & `offsetHeight` use the corresponding properties from the `getBoundingClientRect` object to increase accuracy of scrollbar calculations. [#542](https://github.com/KingSora/OverlayScrollbars/issues/542)

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